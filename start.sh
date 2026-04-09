#!/bin/bash

# Alzheimer Detection AI - Quick Start Script
# This script sets up and runs the full-stack application

echo "🧠 Alzheimer Detection AI - Quick Start"
echo "========================================"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  This script is optimized for macOS"
    echo "For Linux/Windows, follow manual setup in README.md"
    exit 1
fi

# Backend Setup
echo "📦 Setting up BACKEND..."
cd backend

# Create virtual environment
if [ ! -d "env" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv env
fi

# Activate
source env/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

echo "✅ Backend ready!"
echo ""

# Frontend Setup
echo "📦 Setting up FRONTEND..."
cd ../frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Create .env file if doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file"
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --quiet
fi

echo "✅ Frontend ready!"
echo ""

echo "========================================"
echo "🚀 Starting application..."
echo "========================================"
echo ""
echo "Backend will start on: http://localhost:8000"
echo "Frontend will start on: http://localhost:3000"
echo "API Docs available at: http://localhost:8000/docs"
echo ""
echo "Starting services in 3 seconds..."
sleep 3

# Start backend in background
echo "Starting backend..."
cd ../backend
source env/bin/activate
python main.py &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
