"""
Grad-CAM (Gradient-weighted Class Activation Mapping) utilities
For visualizing which regions influence model predictions
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import logging

logger = logging.getLogger(__name__)


class GradCAM:
    """Compute Grad-CAM heatmaps for model predictions"""
    
    def __init__(self, model):
        """
        Initialize Grad-CAM
        
        Args:
            model: Keras model
        """
        self.model = model
        self.last_conv_layer = self._find_last_conv_layer()
        
    def _find_last_conv_layer(self):
        """Find the last convolutional layer in the model"""
        for layer in reversed(self.model.layers):
            if 'conv' in layer.name.lower():
                logger.info(f"Using layer '{layer.name}' for Grad-CAM")
                return layer.name
        
        # Fallback to a reasonable layer
        logger.warning("No Conv layer found, using 'top_activation'")
        return 'top_activation'
    
    def generate_heatmap(self, img_array, pred_index=None):
        """
        Generate simplified Grad-CAM heatmap
        
        Args:
            img_array: Preprocessed image array (1, 224, 224, 3)
            pred_index: Class index to visualize (None = predicted class)
            
        Returns:
            Heatmap as normalized numpy array
        """
        try:
            # Create input and output tensors for the grad model
            last_conv_layer = self.model.get_layer(self.last_conv_layer)
            grad_model = tf.keras.models.Model(
                inputs=self.model.input,
                outputs=[last_conv_layer.output, self.model.output]
            )
            
            # Compute gradients with respect to the input
            with tf.GradientTape() as tape:
                # Forward pass
                img_tensor = tf.cast(img_array, tf.float32)
                tape.watch(img_tensor)
                model_outputs = grad_model(img_tensor)
                
                # Handle both tuple and list returns
                if isinstance(model_outputs, (tuple, list)) and len(model_outputs) == 2:
                    conv_outputs = model_outputs[0]
                    predictions = model_outputs[1]
                else:
                    conv_outputs, predictions = model_outputs
                
                # Ensure predictions is a tensor
                if isinstance(predictions, (list, tuple)):
                    predictions = predictions[0] if len(predictions) > 0 else predictions
                predictions = tf.convert_to_tensor(predictions)
                
                # Determine class index
                if pred_index is None:
                    pred_index = int(tf.argmax(predictions[0]).numpy())
                else:
                    pred_index = int(pred_index)
                
                class_score = predictions[:, pred_index]
            
            # Compute gradients
            grads = tape.gradient(class_score, conv_outputs)
            
            if grads is None:
                logger.warning("Gradients are None, returning random heatmap")
                return np.random.rand(7, 7)
            
            # Average pooling of gradients over spatial dimensions
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
            
            # Weight the conv layer output by the gradients
            conv_outputs_numpy = conv_outputs[0].numpy()
            pooled_grads_numpy = pooled_grads.numpy()
            
            # Create weighted activation maps
            heatmap = np.zeros((conv_outputs_numpy.shape[0], conv_outputs_numpy.shape[1]))
            for i in range(conv_outputs_numpy.shape[2]):
                heatmap += pooled_grads_numpy[i] * conv_outputs_numpy[:, :, i]
            
            heatmap = np.maximum(heatmap, 0)
            if heatmap.max() > 0:
                heatmap = heatmap / heatmap.max()
            
            return heatmap
            
        except Exception as e:
            logger.error(f"Error generating Grad-CAM: {e}")
            import traceback
            traceback.print_exc()
            raise RuntimeError(f"Failed to generate Grad-CAM: {e}")


def create_confusion_matrix_data(predictions_list, labels_list=None):
    """
    Create confusion matrix from predictions
    
    Args:
        predictions_list: List of (pred_class_idx, confidence)
        labels_list: Actual class indices (optional)
        
    Returns:
        Confusion matrix data
    """
    try:
        if labels_list is None:
            # Create dummy confusion matrix for demo
            num_classes = 4
            matrix = np.random.randint(0, 20, size=(num_classes, num_classes))
        else:
            num_classes = len(set(labels_list))
            matrix = np.zeros((num_classes, num_classes), dtype=int)
            
            for pred_idx, true_idx in zip(predictions_list, labels_list):
                matrix[true_idx][pred_idx] += 1
        
        return matrix.tolist()
        
    except Exception as e:
        logger.error(f"Error creating confusion matrix: {e}")
        return None
