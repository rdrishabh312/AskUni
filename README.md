# AskUni - AI-Powered University Assistant

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Ollama-AI-FF6B6B?style=for-the-badge" alt="Ollama" />
</div>

## 🎓 About

AskUni is an AI-powered smart assistant designed to help students navigate their university journey. Get instant answers about courses, admissions, deadlines, and campus events.

**Developer:** rdrishabh312

## ✨ Features

- 🤖 AI-powered chat with local LLM (Ollama)
- 🔐 Secure authentication (Google OAuth + Email)
- ⚡ Real-time streaming responses
- 📱 Beautiful responsive UI
- 👨‍💼 Admin panel for AI configuration
- 🆓 Free trial (5 messages) + Unlimited for logged-in users

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Ollama (with gemma3:latest model)
- Supabase account (free tier works)

### 1. Clone Repository

```bash
git clone https://github.com/rdrishabh312/AskUni.git
cd AskUni
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project named "AskUni"
3. Go to **Settings → API** and copy:
   - Project URL
   - anon/public key
4. Enable Google OAuth (optional):
   - Go to **Authentication → Providers → Google**
   - Follow the setup instructions

### 3. Configure Environment

```bash
# Frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Install & Run

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 5. Access the App

- **App:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (developer only)
- **API Docs:** http://localhost:8000/docs

## 🔐 Admin Access

The admin panel is restricted to the developer email: `rdrishabh312@gmail.com`

To access:
1. Sign up/login with this email
2. Navigate to `/admin`
3. Configure AI instructions, view users, test AI

## 📁 Project Structure

```
AskUni/
├── backend/           # FastAPI Python backend
│   ├── main.py       # Entry point
│   ├── routes/       # API endpoints
│   └── services/     # Ollama & web scraper
├── frontend/          # Next.js 14 frontend
│   ├── app/          # Pages & routes
│   └── lib/          # Auth & utilities
└── docker-compose.yml # Docker deployment
```

## 🛠️ Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3:latest
```

## 📄 License

MIT License - Created by rdrishabh312

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/rdrishabh312">rdrishabh312</a>
</div>
