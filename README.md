# 🛡️ Sentinel | AI Smart Revision Assistant

Sentinel is a premium, AI-powered revision platform designed to help students maximize focus and efficiency. It features real-time focus monitoring via computer vision, AI-driven notes summarization, and an intelligent study chatbot.

## ✨ Key Features
- **AI Study Assistant**: Powered by Gemini 1.5 Flash for deep academic insights.
- **Focus Monitoring**: Real-time drowsiness and blink detection using MediaPipe.
- **Notes OCR**: Upload images of handwritten notes to get instant AI summaries.
- **Smart Task Management**: Integrated syllabus analysis and task tracking.
- **Educational Video Search**: Directly find relevant YouTube content within the workspace.

## 🚀 Hosting Instructions

### 1. Prerequisites
- A **Google Gemini API Key** (Free from Google AI Studio).
- A host that supports Node.js (Render, Railway, Fly.io, etc.).

### 2. Environment Variables
On your hosting platform, set the following environment variable:
- `GEMINI_API_KEY`: Your actual Google Gemini key.
- `PORT`: (Usually handled automatically by the host).

### 3. Deployment Steps
1. **Build Command**: `npm run build`
2. **Install Command**: `npm install` (The included `postinstall` script will automatically handle the backend).
3. **Start Command**: `npm start`

### 4. Database Persistence (Crucial)
This app uses **SQLite**. To ensure your data isn't lost when the server restarts:
- **Render**: Add a "Disk" and mount it to `/backend`.
- **Railway**: Add a Volume and mount it to `/backend`.

## prototype
prototype :https://sen-tinal-nine.vercel.app/

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend**: Node.js, Express, SQLite (better-sqlite3).
- **AI/Vision**: Google Gemini SDK, MediaPipe, Tesseract.js.
