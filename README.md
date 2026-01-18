# 🤖 Self-Improving Webpage

An experimental web application that improves itself based on user suggestions using AI-powered code generation with OpenAI GPT-4.

![Status](https://img.shields.io/badge/status-MVP-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 What It Does

This project demonstrates an AI-powered development workflow where:

1. **Users submit improvement suggestions** through a web interface
2. **AI validates** each suggestion for safety and feasibility
3. **AI generates React component code** automatically using Claude API
4. **Generated code is displayed** in the UI (ready for review and deployment)

### Example Flow

```
User: "Add a welcome title to the page"
    ↓
AI validates the suggestion ✅
    ↓
AI generates React/TypeScript component
    ↓
Code displayed in UI 📝
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Frontend │  │ Backend  │  │Postgres││
│  │  :3000   │  │  :8000   │  │ :5432  ││
│  └──────────┘  └────┬─────┘  └────────┘│
│                     │                   │
│                ┌────┴─────┐             │
│                │  Worker  │             │
│                └──────────┘             │
└─────────────────────────────────────────┘
```

### Components

- **Frontend** (React + TypeScript + Tailwind): Clean UI for submitting and viewing suggestions
- **Backend** (FastAPI + SQLAlchemy): REST API with CRUD operations
- **Database** (PostgreSQL): Stores suggestions and generated code
- **Worker** (Python + Anthropic SDK): Background processor for AI operations

## 🚀 Quick Start

### Prerequisites

- **Podman** (or Docker) & Podman Compose
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd theImprovingWebpage

# Copy environment file
cp .env.example .env

# Add your OpenAI API key to .env
# Edit .env and replace 'your-key-here' with your actual API key
nano .env  # or use your preferred editor

# Start all services
podman-compose up --build

# Open your browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Using the Application

1. **Open** http://localhost:3000 in your browser
2. **Submit** a suggestion like:
   - "Add a welcome message"
   - "Create a colorful button"
   - "Add a user profile card"
3. **Watch** the status change: `pending` → `processing` → `completed`
4. **Click** "View Code" to see the generated React component
5. **Copy** the code for review or integration

## 📁 Project Structure

```
theImprovingWebpage/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx          # Main app component
│   │   ├── components/
│   │   │   ├── SuggestionForm.tsx
│   │   │   └── SuggestionList.tsx
│   │   └── main.tsx
│   ├── Dockerfile           # Multi-stage build
│   └── nginx.conf           # Reverse proxy config
│
├── backend/                  # FastAPI backend
│   ├── main.py              # API endpoints
│   ├── models.py            # Database models
│   ├── database.py          # DB connection
│   ├── ai_agent.py          # Claude API integration
│   ├── worker.py            # Background processor
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml        # Container orchestration
├── .env                      # Environment variables (not in git)
├── .env.example             # Template for .env
└── README.md                # This file
```

## 🔧 Development

### View Logs

```bash
# View all logs
podman-compose logs -f

# View specific service
podman-compose logs -f worker
podman-compose logs -f backend
```

### Rebuild a Service

```bash
# Rebuild and restart frontend
podman-compose up --build -d frontend

# Rebuild and restart backend
podman-compose up --build -d backend
```

### Access Database

```bash
# Connect to PostgreSQL
podman exec -it self_improving_postgres psql -U myuser -d suggestions

# View suggestions table
\dt
SELECT * FROM suggestions;
\q
```

### Stop Services

```bash
# Stop all services
podman-compose down

# Stop and remove all data (including database)
podman-compose down -v
```

## 🌐 API Endpoints

### Backend API (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/suggestions` | Create new suggestion |
| `GET` | `/api/suggestions` | List all suggestions |
| `GET` | `/api/suggestions/{id}` | Get specific suggestion |

### Example Request

```bash
# Create a suggestion
curl -X POST http://localhost:8000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{"content": "Add a welcome title"}'

# Get all suggestions
curl http://localhost:8000/api/suggestions
```

## 🎯 Features

### ✅ Current (MVP)
- Submit improvement suggestions via web form
- AI validation of suggestions (safety & feasibility)
- Automatic React component code generation
- Real-time status updates (auto-refresh every 5s)
- View and copy generated code
- Full database persistence

### 🚧 Future Enhancements
- [ ] Auto-deployment of generated components
- [ ] GitHub integration (commit & PR creation)
- [ ] Automated testing of generated code
- [ ] User authentication & authorization
- [ ] Suggestion voting system
- [ ] Code review/approval workflow
- [ ] Version history for generated code
- [ ] WebSocket for real-time updates

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| AI | OpenAI GPT-4 |
| Infrastructure | Podman/Docker, Podman Compose |
| Web Server | Nginx (for frontend) |

## 📚 Learning Outcomes

This project covers:
- **AI Integration**: Working with LLM APIs for code generation
- **Full-Stack Development**: React frontend + FastAPI backend
- **Containerization**: Multi-container setup with Docker/Podman
- **Async Processing**: Background workers and task queues
- **Database Design**: PostgreSQL with SQLAlchemy ORM
- **API Development**: RESTful API design and implementation
- **Modern Frontend**: React hooks, TypeScript, Tailwind CSS

## ⚙️ Configuration

### Environment Variables

Edit `.env` file:

```bash
# Database
DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/suggestions
POSTGRES_DB=suggestions
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword

# API Keys
OPENAI_API_KEY=sk-your-actual-key-here
```

### Worker Settings

The worker polls for new suggestions every **10 seconds**. To change this, edit `backend/worker.py`:

```python
time.sleep(10)  # Change to desired interval
```

## 🐛 Troubleshooting

### Frontend not loading
```bash
# Check if container is running
podman ps | grep frontend

# View logs
podman-compose logs frontend

# Rebuild
podman-compose up --build -d frontend
```

### Worker not processing suggestions
```bash
# Check worker logs
podman-compose logs -f worker

# Verify API key is set
podman exec self_improving_worker env | grep ANTHROPIC

# Check database connection
podman exec self_improving_worker python -c "from database import engine; print(engine)"
```

### Database connection errors
```bash
# Check PostgreSQL is healthy
podman ps

# Restart database
podman-compose restart postgres

# Reset database (CAUTION: deletes all data)
podman-compose down -v
podman-compose up -d
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [GPT-4](https://openai.com/) by OpenAI
- Inspired by AI-assisted development workflows
- Created as a learning project for exploring agentic AI

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Happy coding!** 🚀✨
