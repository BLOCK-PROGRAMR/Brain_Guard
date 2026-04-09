"""
Configuration settings for Alzheimer Detection API
"""

import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = Path(__file__).resolve().parent / "model"
CONFIG_PATH = MODEL_DIR / "config.json"
WEIGHTS_PATH = MODEL_DIR / "model.weights.h5"

# API Settings
API_TITLE = "Alzheimer Detection API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "Deep Learning API for Alzheimer's Disease Detection from MRI Images"

# CORS Settings
CORS_ORIGINS = [
    "http://localhost:3000",      # React dev server
    "http://localhost:8000",      # FastAPI docs
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

# Model Settings
IMAGE_SIZE = (224, 224)
CLASS_NAMES = [
    "Mild Dementia",
    "Moderate Dementia",
    "Non Demented",
    "Very Mild Dementia"
]

# Upload Settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}

# Logging
LOG_LEVEL = "INFO"

# Check if model files exist
def check_model_files():
    """Verify model files exist"""
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"Config file not found: {CONFIG_PATH}")
    if not WEIGHTS_PATH.exists():
        raise FileNotFoundError(f"Weights file not found: {WEIGHTS_PATH}")
    print("✅ Model files found and valid")

if __name__ == "__main__":
    check_model_files()
