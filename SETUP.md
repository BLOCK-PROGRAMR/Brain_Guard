# 🚀 Setup Instructions

Complete step-by-step guide to set up and run the Alzheimer Detection AI application.

## Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16 or higher  
- **npm** or **yarn**
- **Git** (optional)

## Option 1: Quick Start (Recommended for macOS)

### One Command Setup

```bash
chmod +x start.sh
./start.sh
```

This will:
1. ✅ Create Python virtual environment
2. ✅ Install backend dependencies
3. ✅ Install frontend dependencies
4. ✅ Start both servers

Then open: **http://localhost:3000**

---

## Option 2: Manual Setup (Detailed)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv env

# Activate environment
source env/bin/activate  # macOS/Linux
# OR
env\Scripts\activate  # Windows

# Install Python dependencies
pip install -r requirements.txt

# Verify model files path in config.py
cat config.py | grep MODEL_DIR
# Update if needed: nano config.py
```

### Step 2: Start Backend

```bash
# Make sure you're in backend directory and env is activated
cd backend
source env/bin/activate

# Start backend server
python main.py
```

**Expected output:**
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test backend:**
```bash
# In another terminal
curl http://localhost:8000/health
```

**Access API docs:**
- Go to: http://localhost:8000/docs
- Try POST /predict endpoint from here

---

### Step 3: Frontend Setup

```bash
# In a NEW terminal, navigate to frontend directory
cd frontend

# Check Node.js version
node --version  # Should be v16+
npm --version   # Should be v8+

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Verify .env configuration
cat .env
# Should have: REACT_APP_API_URL=http://localhost:8000
```

### Step 4: Start Frontend

```bash
# Make sure you're in frontend directory
cd frontend

# Start development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view alzheimer-detection-app in the browser.

Local:            http://localhost:3000
```

Browser will open automatically. If not, go to: **http://localhost:3000**

---

## Step 5: Test the Application

### Via Web UI

1. Open http://localhost:3000
2. Upload a brain MRI image
3. Click "Analyze Image"
4. Get results in seconds

### Via API (curl)

```bash
# Upload and predict
curl -X POST \
  -F "file=@your_image.jpg" \
  http://localhost:8000/predict

# Expected response
{
  "status": "success",
  "predicted_class": "Non Demented",
  "confidence": 0.9249,
  "all_predictions": {...}
}
```

### Via Python

```python
import requests

# Prepare file
files = {'file': open('image.jpg', 'rb')}

# Make request
response = requests.post('http://localhost:8000/predict', files=files)

# Get results
result = response.json()
print(f"Prediction: {result['predicted_class']}")
print(f"Confidence: {result['confidence_percentage']}%")
```

---

## Troubleshooting

### Backend Issues

**Error: "Model file not found"**
```bash
# Check model path
ls -la /Users/nithinkumar/Desktop/Alz/final_model\ \(1\)/

# Update config.py with correct path
nano backend/config.py
# Change: MODEL_DIR = Path("/path/to/your/model")
```

**Error: "ModuleNotFoundError"**
```bash
# Ensure virtual env is activated
source env/bin/activate

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# OR use different port
# Edit config.py or use: uvicorn main:app --port 8001
```

---

### Frontend Issues

**Error: "npm: command not found"**
```bash
# Install Node.js
# macOS:
brew install node

# OR download from nodejs.org
```

**Error: "Cannot find module 'react'"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Error: "API connection refused"**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Verify .env file
cat frontend/.env
# Should have correct API_URL
```

**Error: "CORS error"**
```bash
# Backend CORS might be restricted
# Edit backend/config.py
# Add your frontend URL to CORS_ORIGINS:
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## Environment Variables

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000
```

Change for production:
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### Backend (backend/config.py)

Key settings to configure:
```python
# Model paths
MODEL_DIR = Path("/Users/nithinkumar/Desktop/Alz/final_model (1)")

# CORS origins
CORS_ORIGINS = ["http://localhost:3000"]

# Upload limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
```

---

## Stopping the Application

### Backend
```bash
# Press: Ctrl+C in backend terminal
```

### Frontend
```bash
# Press: Ctrl+C in frontend terminal
```

### Both
```bash
# If using start.sh, just press: Ctrl+C
```

---

## Running in Production

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t alzheimer-backend ./backend
docker build -t alzheimer-frontend ./frontend

docker run -p 8000:8000 alzheimer-backend
docker run -p 3000:3000 alzheimer-frontend
```

### Cloud Deployment

**AWS:**
```bash
# Deploy backend to AWS Lambda with SAM
sam build
sam deploy

# Deploy frontend to S3 + CloudFront
npm run build
aws s3 sync build/ s3://your-bucket/
```

**Heroku:**
```bash
# Backend
heroku create alzheimer-api
git push heroku main

# Frontend
npm run build
# Deploy to Netlify or Vercel
```

---

## Performance Optimization

### Backend
- Model is cached in memory (loaded once)
- ~2-5 seconds per prediction
- Supports multiple concurrent requests

### Frontend
- Modern React with optimizations
- Lazy loading components
- CSS minification

### Production Settings

```python
# In backend/main.py
uvicorn.run(
    "main:app",
    host="0.0.0.0",
    port=8000,
    workers=4,        # Multiple workers
    reload=False,      # Disable auto-reload
    log_level="info"   # Reduce logging
)
```

---

## Next Steps

1. ✅ Test with sample images
2. ✅ Review API documentation at /docs
3. ✅ Customize styling in frontend/src/App.css
4. ✅ Add database for image history
5. ✅ Deploy to production server

---

## Getting Help

1. Check error messages carefully
2. Review logs in terminal
3. Check API docs: http://localhost:8000/docs
4. Test API endpoints with curl
5. Review React console (F12 → Console tab)

---

**All set! 🎉 Your application is ready to predict!**
