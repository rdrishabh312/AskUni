# 🎓 AskUni - AI-Powered University Assistant

> **A Simple Explanation:** AskUni is like having a super-smart friend who knows EVERYTHING about your university and is available 24/7 to answer your questions instantly!

---

## 📋 Table of Contents
1. [What is AskUni?](#what-is-askuni)
2. [The Problem We Solve](#the-problem-we-solve)
3. [Technologies Used](#technologies-used)
4. [Key Features](#key-features)
5. [How It Works (Simple Explanation)](#how-it-works)
6. [Project Structure](#project-structure)
7. [Roadmap](#roadmap)
8. [5-Minute Presentation Guide](#5-minute-presentation-guide)

---

## 🤔 What is AskUni?

**AskUni** is an **AI-powered chatbot** designed specifically for university students. Think of it like ChatGPT, but trained to help with university-related questions like:
- "What are the admission requirements?"
- "When is the last date for fee payment?"
- "What courses are offered in Computer Science?"
- "What events are happening on campus this week?"

Instead of waiting in long queues or searching through confusing university websites, students can simply **ask AskUni** and get instant answers!

---

## 😫 The Problem We Solve

### Current Problems Students Face:
| Problem | Traditional Way | With AskUni |
|---------|-----------------|-------------|
| Finding information | Navigate 100+ web pages | Just ask a question |
| Waiting time | Hours in queues | **0 seconds** - instant reply |
| Availability | Only during office hours | **24/7 Available** |
| Getting wrong info | Depends on who you ask | **Consistent & accurate** |
| Language barrier | Formal university language | Simple, friendly language |

### Real-Life Scenario:
> **Without AskUni**: Student wants to know admission dates → Goes to university website → Opens 5 different pages → Still confused → Goes to office → Waits 2 hours in queue → Finally gets answer

> **With AskUni**: Student asks "What are the admission dates?" → Gets instant, accurate answer in 2 seconds! ✨

---

## 💻 Technologies Used

### Backend (Server-Side) - The Brain 🧠
| Technology | What It Does | Simple Explanation |
|------------|--------------|-------------------|
| **Python** | Programming Language | The language used to write the backend code |
| **FastAPI** | Web Framework | Helps create the APIs (the connection between frontend and AI) |
| **Ollama** | AI Engine | Runs the AI brain (Llama 3.2 model) locally on the computer |
| **Llama 3.2** | AI Model | The actual AI brain that understands and answers questions |
| **DuckDuckGo Search** | Web Search | Searches the internet for latest information |
| **BeautifulSoup** | Web Scraping | Reads and extracts information from websites |

### Frontend (User Interface) - The Face 😊
| Technology | What It Does | Simple Explanation |
|------------|--------------|-------------------|
| **Next.js 14** | React Framework | The framework for building the website |
| **React** | UI Library | Makes the website interactive and dynamic |
| **TypeScript** | Programming Language | JavaScript with extra safety features |
| **TailwindCSS** | Styling | Makes the website look beautiful |
| **Framer Motion** | Animations | Creates smooth, beautiful animations |
| **Lucide React** | Icons | Beautiful icons throughout the app |

### Database & Authentication 🔐
| Technology | What It Does | Simple Explanation |
|------------|--------------|-------------------|
| **Supabase** | Database + Auth | Stores user data and handles login/signup |

### Deployment Tools 🚀
| Technology | What It Does | Simple Explanation |
|------------|--------------|-------------------|
| **Docker** | Containerization | Packages the app so it can run anywhere |
| **Docker Compose** | Multi-container | Runs both frontend and backend together |

---

## ⭐ Key Features

### 1. 💬 AI Chat Interface
- Natural conversation with the AI
- **Typewriter effect** - responses appear like someone is typing
- **Streaming responses** - see the answer as it's being generated
- Beautiful, modern chat design

### 2. 🌐 Web Search Integration
- The AI can search the internet for latest information
- Scrapes university websites for accurate data
- Shows source links so you know where info came from

### 3. 👤 User Authentication
- Sign up and login with email
- Secure user sessions
- Free trial available for new users

### 4. 🛠️ Admin Dashboard
- Monitor AI health and status
- Switch between different AI models
- Test prompts and customize AI behavior
- View system statistics

### 5. 📱 Mobile-Friendly Design
- Works perfectly on phones, tablets, and computers
- Glassmorphism design (modern, glassy look)
- Smooth animations and transitions

### 6. ⚡ Real-Time Responses
- Instant answers, no waiting
- Server-Sent Events (SSE) for live streaming
- Fast and responsive

---

## 🔄 How It Works (Simple Explanation)

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOW ASKUNI WORKS                        │
└─────────────────────────────────────────────────────────────────┘

     👤 STUDENT                    🖥️ FRONTEND                    
         │                              │                          
         │  "What are admission        │                          
         │   requirements?"            │                          
         │ ──────────────────────────► │                          
         │                              │                          
         │                              │    📡 BACKEND (FastAPI)  
         │                              │ ─────────────────────►  │
         │                              │                          │
         │                              │         ┌────────────────┤
         │                              │         │                │
         │                              │         ▼                │
         │                              │    🌐 Web Search        │
         │                              │    (DuckDuckGo)         │
         │                              │         │                │
         │                              │         ▼                │
         │                              │    🤖 AI (Llama 3.2)    │
         │                              │    via Ollama           │
         │                              │         │                │
         │                              │ ◄───────┴────────────────┤
         │                              │                          
         │  📝 "The admission          │                          
         │   requirements are..."      │                          
         │ ◄────────────────────────── │                          
         │                              │                          
     👤 STUDENT                    🖥️ FRONTEND                    
```

### Step-by-Step:
1. **Student types a question** in the chat box
2. **Frontend sends the question** to the Backend server
3. **Backend checks if web search is needed** and searches for info
4. **AI (Llama 3.2) processes the question** with the context
5. **AI generates an answer** in a friendly, helpful way
6. **Answer streams back** to the student in real-time
7. **Student gets their answer** instantly! 🎉

---

## 📁 Project Structure

```
AskUni_projt/
│
├── 📂 backend/                 # Python Backend (The Brain)
│   ├── main.py                 # Main server file
│   ├── config.py               # Settings and configuration
│   ├── requirements.txt        # Python libraries needed
│   ├── 📂 routes/              # API endpoints
│   │   ├── chat.py            # Chat-related APIs
│   │   └── admin.py           # Admin panel APIs
│   └── 📂 services/            # Core services
│       ├── ollama_service.py  # AI integration
│       └── web_scraper.py     # Web searching & scraping
│
├── 📂 frontend/                # Next.js Frontend (The Face)
│   ├── 📂 app/                 # Pages of the website
│   │   ├── page.tsx           # Home page
│   │   ├── 📂 chat/           # Chat page
│   │   ├── 📂 login/          # Login page
│   │   ├── 📂 admin/          # Admin dashboard
│   │   ├── 📂 about/          # About page
│   │   └── 📂 contact/        # Contact page
│   ├── 📂 lib/                 # Helper functions
│   │   └── auth-context.tsx   # User authentication
│   ├── package.json           # JavaScript libraries needed
│   └── tailwind.config.ts     # Styling configuration
│
├── docker-compose.yml          # Run everything together
├── README.md                   # Basic documentation
└── PRESENTATION_README.md      # This file! 📖
```

---

## 🗺️ Roadmap

### ✅ Completed Features
- [x] AI Chat interface with streaming responses
- [x] Web search integration for latest information
- [x] User authentication (login/signup)
- [x] Admin dashboard for monitoring
- [x] Modern, mobile-friendly UI design
- [x] Docker containerization

### 🔄 In Progress
- [ ] Voice input/output capabilities
- [ ] Multi-language support

### 🔮 Future Plans
- [ ] Mobile app (Android & iOS)
- [ ] Integration with specific university databases
- [ ] Personalized recommendations based on user's course
- [ ] Chatbot widget for university websites
- [ ] Analytics dashboard for universities
- [ ] Multi-university support

---

## 🎤 5-Minute Presentation Guide

### Introduction (30 seconds)
> "Hello everyone! Today I'm going to present **AskUni** - an AI-powered assistant that helps university students get instant answers to their questions. Imagine having a friend who knows everything about your university and is available 24/7!"

### The Problem (1 minute)
> "We all know the frustration of:
> - Waiting in long queues at the admin office
> - Navigating through 50 different web pages to find one piece of information
> - Getting different answers from different people
> 
> Students waste hours just trying to find basic information about admissions, courses, or deadlines."

### Our Solution (1 minute)
> "AskUni solves this by providing an AI chatbot that:
> - Answers questions **instantly** - no waiting
> - Is available **24 hours a day, 7 days a week**
> - Gives **consistent and accurate** information
> - Can even **search the web** for the latest updates"

### How We Built It (1.5 minutes)
> "The project has two main parts:
> 
> **1. The Backend (Server)** - Built with Python and FastAPI
> - Uses **Llama 3.2** AI model running through Ollama
> - Has web scraping to get fresh information from websites
> 
> **2. The Frontend (Website)** - Built with Next.js and React
> - Beautiful, modern design with TailwindCSS
> - Works on phones, tablets, and computers
> - Has smooth animations using Framer Motion
> 
> We also used **Supabase** for user authentication and **Docker** for easy deployment."

### Demo Highlights (30 seconds)
> "Key features include:
> - Real-time chat with typewriter effect
> - Web search integration with source links
> - Admin dashboard to monitor and configure the AI
> - User authentication for personalized experience"

### Conclusion (30 seconds)
> "In summary, AskUni makes university life simpler by providing instant, accurate answers to any question. It saves time, reduces frustration, and is available whenever students need it.
> 
> Thank you! I'm happy to answer any questions."

---

## 🙋 Possible Questions You Might Be Asked

### Q1: "What AI model does it use?"
> "We use **Llama 3.2**, which is an open-source AI model by Meta. It runs locally on the server using a tool called **Ollama**, so we don't need to pay for external AI APIs."

### Q2: "How is web search integrated?"
> "When a user enables web search, the backend uses **DuckDuckGo** to search the internet and **BeautifulSoup** to extract content from webpages. This information is then given to the AI as context to generate more accurate answers."

### Q3: "What makes this different from just using ChatGPT?"
> "AskUni is:
> - **Specialized** for university-related questions
> - **Integrated** with web search for latest info
> - **Customizable** - universities can adjust the AI's personality
> - **Privacy-focused** - runs locally, no data sent to external companies"

### Q4: "What technologies did you learn from this project?"
> "I learned:
> - Building APIs with **FastAPI** in Python
> - Creating modern UIs with **Next.js** and **React**
> - Integrating AI using **Ollama** and **Llama 3.2**
> - Web scraping with **BeautifulSoup**
> - Containerization with **Docker**"

### Q5: "How can this be used by actual universities?"
> "Universities can:
> - Deploy it on their servers
> - Customize the AI to know their specific information
> - Embed it on their website as a chat widget
> - Use the admin panel to monitor and improve responses"

---

## 📊 Quick Stats Summary

| Metric | Value |
|--------|-------|
| **Frontend Framework** | Next.js 14 |
| **Backend Framework** | FastAPI |
| **AI Model** | Llama 3.2 |
| **Programming Languages** | Python, TypeScript |
| **Database** | Supabase |
| **Deployment** | Docker |
| **Response Time** | Near-instant (streaming) |
| **Availability** | 24/7 |

---

## 👨‍💻 Developer

**Developed by:** rdrishabh312

---

> 💡 **Remember:** The goal is to explain things simply. If asked technical questions you don't know, it's okay to say "That's a great question, I'll look into that!" 

**Good luck with your presentation! 🎉**
