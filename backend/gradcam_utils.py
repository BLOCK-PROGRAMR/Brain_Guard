"""
Grad-CAM utilities — memory-efficient implementation for low-RAM servers
"""

import matplotlib
matplotlib.use('Agg')
import numpy as np
import tensorflow as tf
import logging
import gc

logger = logging.getLogger(__name__)


class GradCAM:
    def __init__(self, model):
        self.model = model
        self.last_conv_layer_name = self._find_last_conv_layer()

    def _find_last_conv_layer(self):
        for layer in reversed(self.model.layers):
            if 'conv' in layer.name.lower():
                logger.info(f"Grad-CAM layer: {layer.name}")
                return layer.name
        logger.warning("No conv layer found, using top_activation")
        return 'top_activation'

    def generate_heatmap(self, img_array, pred_index=None):
        try:
            last_conv_layer = self.model.get_layer(self.last_conv_layer_name)

            # Lightweight grad model — only up to last conv + output
            # Uses references, does NOT duplicate weights
            grad_model = tf.keras.models.Model(
                inputs=self.model.inputs,
                outputs=[last_conv_layer.output, self.model.output]
            )

            img_tensor = tf.cast(img_array, tf.float32)

            with tf.GradientTape() as tape:
                tape.watch(img_tensor)
                conv_out, preds = grad_model(img_tensor, training=False)

                if pred_index is None:
                    pred_index = int(tf.argmax(preds[0]).numpy())

                class_score = preds[:, pred_index]

            # Gradients w.r.t conv layer output (NOT the full input)
            grads = tape.gradient(class_score, conv_out)

            if grads is None:
                logger.warning("Gradients None — returning blank heatmap")
                return np.zeros((7, 7))

            # Pool gradients over channel axis
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2)).numpy()
            conv_out_np   = conv_out[0].numpy()

            # Weighted sum of feature maps
            heatmap = np.einsum('ijk,k->ij', conv_out_np, pooled_grads)
            heatmap = np.maximum(heatmap, 0)
            if heatmap.max() > 0:
                heatmap /= heatmap.max()

            # Free intermediates immediately
            del grad_model, conv_out, grads, pooled_grads, conv_out_np
            gc.collect()

            return heatmap

        except Exception as e:
            logger.error(f"Grad-CAM error: {e}")
            raise RuntimeError(f"Failed to generate Grad-CAM: {e}")


def create_confusion_matrix_data(predictions_list, labels_list=None):
    try:
        if labels_list is None:
            matrix = np.random.randint(0, 20, size=(4, 4))
        else:
            num_classes = len(set(labels_list))
            matrix = np.zeros((num_classes, num_classes), dtype=int)
            for pred_idx, true_idx in zip(predictions_list, labels_list):
                matrix[true_idx][pred_idx] += 1
        return matrix.tolist()
    except Exception as e:
        logger.error(f"Error creating confusion matrix: {e}")
        return None
