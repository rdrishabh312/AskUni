# AskUni - AI-Powered University Assistant

AskUni is an intelligent AI assistant designed to help students navigate university life. It answers questions about courses, admissions, events, and more instantly using a local AI model.

## 🚀 Quick Start

### Prerequisites
1. **Docker & Docker Compose** installed
2. **Ollama** installed on your host machine
3. **Node.js 18+** (for local development only)
4. **Python 3.10+** (for local development only)

### 1. Start Ollama (AI Engine)
AskUni uses a local Ollama instance. Run this on your host machine:

```bash
# Start Ollama server
ollama serve

# In a new terminal, pull the model
ollama pull llama3.2
```

### 2. Run with Docker (Recommended)
This starts both Frontend and Backend automatically.

```bash
# Build and start services
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Admin**: http://localhost:3000/admin

### 3. Run Locally (Development)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Configuration

Create a `.env` file in the root directory if needed, or modify `docker-compose.yml`.

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_HOST` | URL of Ollama server | `http://host.docker.internal:11434` |
| `OLLAMA_MODEL` | AI Model to use | `llama3.2` |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend | `http://localhost:8000` |

## 📱 Features

- **24/7 Instant Answers**: Powered by Llama 3.2
- **Web Browsing**: Scrapes verified university data
- **Premium UI**: Glassmorphism design, mobile-first
- **Voice Capabilities**: (Coming soon)
- **Admin Dashboard**: Monitor AI performance
