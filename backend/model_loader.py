"""
Model loading and management
"""

import json
import logging
from pathlib import Path
import numpy as np
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing import image
from config import CONFIG_PATH, WEIGHTS_PATH, IMAGE_SIZE, CLASS_NAMES

logger = logging.getLogger(__name__)


class AlzheimerModel:
    """
    Manages Alzheimer Detection Model
    Loads model architecture and weights
    Handles predictions
    """
    
    def __init__(self):
        """Initialize and load model"""
        self.model = None
        self.class_names = CLASS_NAMES
        self.image_size = IMAGE_SIZE
        self._load_model()
    
    def _load_model(self):
        """Load model architecture and weights"""
        try:
            logger.info("Loading model architecture from config.json...")
            with open(CONFIG_PATH, 'r') as f:
                config = json.load(f)
            
            # Create model from config
            self.model = model_from_json(json.dumps(config))
            logger.info("✅ Model architecture loaded")
            
            # Load weights
            logger.info("Loading model weights from model.weights.h5...")
            self.model.load_weights(WEIGHTS_PATH)
            logger.info("✅ Model weights loaded")
            
            # Print model info
            logger.info(f"Model Input Shape: {self.model.input_shape}")
            logger.info(f"Model Output Shape: {self.model.output_shape}")
            logger.info(f"Total Parameters: {self.model.count_params():,}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise RuntimeError(f"Failed to load model: {e}")
    
    def preprocess_image(self, image_path):
        """
        Preprocess image for model input
        
        Args:
            image_path: Path to image file
            
        Returns:
            Preprocessed image array (1, 224, 224, 3)
        """
        try:
            # Load image
            img = image.load_img(image_path, target_size=self.image_size)
            
            # Convert to array
            img_array = image.img_to_array(img)
            
            # Normalize to [0, 1]
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise ValueError(f"Failed to preprocess image: {e}")
    
    def predict(self, image_path):
        """
        Make prediction on image
        
        Args:
            image_path: Path to image file
            
        Returns:
            Dict with prediction, confidence, and all scores
        """
        try:
            # Preprocess image
            img_array = self.preprocess_image(image_path)
            
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            
            # Get top prediction
            pred_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][pred_class_idx])
            
            # Prepare response
            result = {
                "predicted_class": self.class_names[pred_class_idx],
                "class_index": int(pred_class_idx),
                "confidence": round(confidence, 4),
                "confidence_percentage": round(confidence * 100, 2),
                "all_predictions": {
                    self.class_names[i]: round(float(predictions[0][i]), 4)
                    for i in range(len(self.class_names))
                }
            }
            
            logger.info(f"Prediction: {result['predicted_class']} ({result['confidence_percentage']}%)")
            return result
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise RuntimeError(f"Failed to make prediction: {e}")
    
    def get_model_info(self):
        """Get model information"""
        if self.model is None:
            return {"status": "Model not loaded"}
        
        return {
            "status": "loaded",
            "input_shape": str(self.model.input_shape),
            "output_shape": str(self.model.output_shape),
            "total_parameters": self.model.count_params(),
            "classes": self.class_names,
            "num_classes": len(self.class_names)
        }


# Global model instance (loaded once at startup)
_model_instance = None


def get_model():
    """Get or create model instance"""
    global _model_instance
    if _model_instance is None:
        _model_instance = AlzheimerModel()
    return _model_instance


def load_model():
    """Load model at startup"""
    logger.info("Initializing model...")
    get_model()
    logger.info("✅ Model initialized and ready")
