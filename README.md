# 🧠 Alzheimer Detection AI - Full Stack Application

A complete web application for AI-powered Alzheimer's disease detection using brain MRI images. Built with **React** (frontend) + **FastAPI** (backend).

## 📋 Project Structure

```
alzheimer-app/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── model_loader.py         # Model loading & inference
│   ├── config.py               # Configuration settings
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx     # File upload component
│   │   │   └── PredictionResult.jsx # Results display
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Tailwind styles
│   │   └── index.js            # React entry point
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── package.json            # React dependencies
│   ├── tailwind.config.js       # Tailwind config
│   └── .env.example            # Environment variables
│
└── README.md                    # This file
```

## 🚀 Features

✅ **Image Upload** - Drag & drop or click to upload brain MRI images  
✅ **Real-time Predictions** - Get instant AI analysis with confidence scores  
✅ **Disease Classification** - Detects 4 disease stages:
  - Non Demented (Normal)
  - Very Mild Dementia
  - Mild Dementia
  - Moderate Dementia

✅ **Beautiful UI** - Built with React & Tailwind CSS  
✅ **Fast API** - RESTful endpoints with FastAPI  
✅ **CORS Enabled** - Cross-origin requests supported  
✅ **Error Handling** - Comprehensive validation & error messages  
✅ **Production Ready** - Optimized, scalable, and documented  

## 📊 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Deep learning model
- **Uvicorn** - ASGI web server
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Node.js** - Runtime

## 🔧 Installation & Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update model path in config.py if needed
# Edit: MODEL_DIR = Path("/path/to/your/model")
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (requires Node.js 16+)
npm install

# Create .env file
cp .env.example .env

# Update API URL if backend is on different host
# Edit: REACT_APP_API_URL=http://localhost:8000
```

## 🎯 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
source env/bin/activate  # Activate virtual environment
python main.py
```

Backend will be running at: `http://localhost:8000`

API Documentation available at: `http://localhost:8000/docs`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Frontend will be running at: `http://localhost:3000`

### Access the Application

Open your browser and go to: **http://localhost:3000**

## 📡 API Endpoints

### Health Check
```
GET /health
Response: {
  "status": "healthy",
  "model_loaded": true,
  "message": "API is running and model is loaded"
}
```

### Get Model Info
```
GET /model/info
Response: {
  "status": "loaded",
  "input_shape": "(None, 224, 224, 3)",
  "output_shape": "(None, 4)",
  "total_parameters": 4383655,
  "classes": ["Mild Dementia", "Moderate Dementia", "Non Demented", "Very Mild Dementia"],
  "num_classes": 4
}
```

### Make Prediction
```
POST /predict
Content-Type: multipart/form-data
Body: file (image file)

Response: {
  "status": "success",
  "predicted_class": "Non Demented",
  "class_index": 2,
  "confidence": 0.9249,
  "confidence_percentage": 92.49,
  "all_predictions": {
    "Mild Dementia": 0.0014,
    "Moderate Dementia": 0.0007,
    "Non Demented": 0.9249,
    "Very Mild Dementia": 0.073
  }
}
```

## 🖼️ Supported Image Formats

- JPG / JPEG
- PNG
- GIF
- BMP
- Maximum size: 10 MB

## ⚙️ Configuration

### Backend Config (backend/config.py)

```python
# Model paths
MODEL_DIR = Path("/Users/nithinkumar/Desktop/Alz/final_model (1)")
CONFIG_PATH = MODEL_DIR / "config.json"
WEIGHTS_PATH = MODEL_DIR / "model.weights.h5"

# CORS origins
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]

# Upload limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
```

### Frontend Config (frontend/.env)

```
REACT_APP_API_URL=http://localhost:8000
```

## 📝 Model Specifications

- **Architecture**: EfficientNetB0 (Transfer Learning)
- **Input Size**: 224 × 224 RGB images
- **Output Classes**: 4
- **Total Parameters**: 4,383,655
- **Training Accuracy**: 84%
- **Validation Accuracy**: 82%
- **Framework**: TensorFlow/Keras

## ✅ Testing the Model

### Test Backend API

```bash
# Using curl
curl -X POST -F "file=@image.jpg" http://localhost:8000/predict

# Using Python
import requests
files = {'file': open('image.jpg', 'rb')}
response = requests.post('http://localhost:8000/predict', files=files)
print(response.json())
```

### Test Frontend

1. Open http://localhost:3000
2. Upload a brain MRI image
3. Click "Analyze Image"
4. View results in real-time

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Verify model files exist
ls -la /path/to/model/config.json
ls -la /path/to/model/model.weights.h5

# Check all dependencies installed
pip list | grep -i "tensorflow\|fastapi"
```

### Frontend won't load
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Check API connection
curl http://localhost:8000/health
```

### CORS errors
- Ensure backend is running on correct port (8000)
- Check CORS_ORIGINS in backend/config.py includes frontend URL
- Restart both servers after config changes

## 📚 Project Documentation

### Backend Structure
- `main.py` - FastAPI app with endpoints
- `model_loader.py` - Model inference logic
- `config.py` - Settings and constants

### Frontend Structure
- `App.jsx` - Main component with layout
- `components/ImageUpload.jsx` - File upload logic
- `components/PredictionResult.jsx` - Results display

## 🔐 Security Notes

- Images are processed locally and not stored
- No data is sent to external servers
- File type validation on both frontend and backend
- File size limits enforced
- CORS restricted to configured origins

## 📈 Performance

- Backend: ~2-5 seconds per prediction (CPU)
- Frontend: Responsive UI with loading states
- Supports batch processing via API
- Model loaded once at startup (cached in memory)

## ⚠️ Important Disclaimer

**This is an AI screening tool for educational and research purposes only.**

- ❌ NOT for direct medical diagnosis
- ✅ Should be used WITH medical professional consultation
- ✅ Always verify results with clinical evaluation
- ✅ Consider multiple diagnostic tests
- ✅ Consult qualified healthcare providers

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t alzheimer-app .

# Run container
docker run -p 8000:8000 -p 3000:3000 alzheimer-app
```

### Cloud Deployment

Suitable for deployment on:
- AWS (EC2, ECS, Lambda)
- Google Cloud (App Engine, Cloud Run)
- Azure (App Service, Container Instances)
- Heroku
- DigitalOcean

## 📧 Support & Contribution

For issues, questions, or contributions:
1. Check existing issues
2. Create detailed bug reports
3. Submit pull requests
4. Follow code style guidelines

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- TensorFlow/Keras community
- FastAPI framework
- React ecosystem
- Tailwind CSS

---

**Version**: 1.0.0  
**Last Updated**: April 10, 2026  
**Status**: ✅ Production Ready
# Brain_Guard
