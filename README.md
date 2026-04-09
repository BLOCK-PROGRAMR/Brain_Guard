# BrainGuard — Alzheimer's Detection AI

An AI-powered web application that detects Alzheimer's disease stages from brain MRI scans.  
Built with **React** (frontend) + **FastAPI** (backend) + **EfficientNetB0** (deep learning model).

---

## Quick Start — Run Locally After Cloning

### Prerequisites
Make sure you have these installed:
- Python 3.8 or higher → `python3 --version`
- Node.js 16 or higher → `node --version`
- npm → `npm --version`

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/BLOCK-PROGRAMR/Brain_Guard.git
cd Brain_Guard
```

---

### Step 2 — Start the Backend

Open **Terminal 1** and run:

```bash
cd backend

# Create virtual environment
python3 -m venv env

# Activate virtual environment
source env/bin/activate          # Mac / Linux
# env\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

Backend will be running at: **http://localhost:8000**  
API docs available at: **http://localhost:8000/docs**

---

### Step 3 — Start the Frontend

Open **Terminal 2** and run:

```bash
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

Frontend will be running at: **http://localhost:3000**

---

### Step 4 — Open in Browser

```
http://localhost:3000
```

---

## Project Structure

```
Brain_Guard/
├── backend/
│   ├── model/
│   │   ├── model.weights.h5     # Trained model weights (30MB)
│   │   ├── config.json          # Model architecture
│   │   └── metadata.json        # Model metadata
│   ├── main.py                  # FastAPI application & endpoints
│   ├── model_loader.py          # Model loading & inference
│   ├── gradcam_utils.py         # Grad-CAM heatmap generation
│   ├── config.py                # Configuration settings
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app with navigation
│   │   ├── App.css              # Global styles
│   │   └── components/
│   │       ├── ImageUpload.jsx      # MRI upload component
│   │       ├── PredictionResult.jsx # Results & confidence bars
│   │       ├── GradCAMViewer.jsx    # Heatmap visualization
│   │       ├── ModelMetrics.jsx     # Performance metrics
│   │       └── ConfusionMatrix.jsx  # Confusion matrix
│   ├── public/index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── docker-compose.yml
└── README.md
```

---

## Features

- **MRI Upload** — Drag & drop or click to upload brain MRI images
- **AI Diagnosis** — Classifies into 4 Alzheimer's stages with confidence scores
- **Grad-CAM** — Visual heatmap showing which brain regions influenced the prediction
- **Model Metrics** — Precision, Recall, F1-score per class
- **Confusion Matrix** — Interactive validation heatmap
- **Responsive UI** — Works on desktop and mobile

### Disease Stages Detected

| Stage | Description |
|-------|-------------|
| Non Demented | Normal — no signs of dementia |
| Very Mild Dementia | Early stage memory changes |
| Mild Dementia | Notable cognitive decline |
| Moderate Dementia | Significant impairment |

---

## Model Specifications

- **Architecture**: EfficientNetB0 (Transfer Learning)
- **Input**: 224 × 224 RGB brain MRI images
- **Output**: 4-class softmax probabilities
- **Parameters**: 5.3M
- **Training Accuracy**: 84%
- **Validation Accuracy**: 82%
- **Training Data**: ~120,000 images (Kaggle + OASIS datasets)
- **Framework**: TensorFlow 2.16 / Keras

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check if API and model are running |
| GET | `/model/info` | Model architecture details |
| GET | `/model/classes` | List of disease classes |
| POST | `/predict` | Predict from uploaded MRI image |
| POST | `/predict/gradcam` | Predict + generate Grad-CAM heatmap |
| GET | `/analytics/model-metrics` | Precision, Recall, F1-score |
| GET | `/analytics/confusion-matrix` | Confusion matrix data |

---

## Troubleshooting

**Backend won't start**
```bash
# Check Python version (needs 3.8+)
python3 --version

# Make sure virtual environment is activated
source env/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Frontend won't load**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

**CORS error in browser**
- Make sure backend is running on port **8000**
- Make sure frontend is running on port **3000**
- Restart both servers

**Port already in use**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Axios |
| Backend | FastAPI, Uvicorn, Python 3.8+ |
| AI Model | TensorFlow 2.16, Keras, EfficientNetB0 |
| Explainability | Grad-CAM |
| Deployment | Docker, Docker Compose |

---

## Disclaimer

> This tool is for **research and educational purposes only**.  
> It is **not** a substitute for professional medical diagnosis.  
> Always consult a qualified neurologist for clinical decisions.

---

**Version**: 1.0.0 · **Status**: Production Ready
