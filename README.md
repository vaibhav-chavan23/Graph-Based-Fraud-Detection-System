# Fraud Detection Platform

A full-stack placement-portfolio-grade project featuring a React frontend, Node.js/Express backend, and a high-performance C++ DSA engine for detecting financial fraud.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017
- CMake (3.14+)
- C++17 compliant compiler (GCC/Clang/MSVC)

## 1. Build the Fraud Engine (C++)

Navigate to the `fraud-engine` directory and build the binary using CMake:

```bash
cd fraud-engine
mkdir build
cd build
cmake ..
cmake --build .
```

The compiled binary will be located at `fraud-engine/build/fraud-engine` (or `fraud-engine.exe` on Windows).

## 2. Start the Backend (Node.js)

Navigate to the `backend` directory, install dependencies, and setup the environment:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fraud-platform
# UPDATE THIS PATH to the absolute path of the built binary
ENGINE_PATH=/home/vaibhav-chavan/Downloads/fraud-new-csv-upload/fraud-engine/build/fraud-engine
```

Start the backend server (this will automatically seed default transactions if the database is empty):

```bash
npm start
```

## 3. Start the Frontend (React + Vite)

Navigate to the `frontend` directory, install dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to the URL provided by Vite (usually `http://localhost:5173`).
# Graph-Based-Fraud-Detection-System
