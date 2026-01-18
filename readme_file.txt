# Self-Improving Webpage

An experimental web application that improves itself based on user suggestions using AI-powered code generation.

## What It Does

1. **Users submit improvement suggestions** through a simple web interface
2. **AI validates and processes** each suggestion using Claude API
3. **Code is automatically generated** for approved suggestions
4. **Generated code is displayed** in the UI (manual deployment in MVP)

## Example Flow

```
User submits: "Add a welcome title to the page"
    ↓
AI validates the suggestion
    ↓
AI generates React component code
    ↓
Code is saved and displayed to user
```

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API
- **Infrastructure**: Docker Compose

## Architecture

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

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Anthropic API Key

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd self-improving-webpage

# Create environment file
cp .env.example .env

# Add your API key to .env
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env

# Start all services
docker-compose up --build

# Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Using the Application

1. Open http://localhost:3000
2. Type a suggestion like "add a welcome message"
3. Click Submit
4. Watch the status change from "pending" → "processing" → "completed"
5. Click "View Code" to see the generated component

## Project Structure

```
self-improving-webpage/
├── frontend/           # React app
├── backend/            # FastAPI + Worker
├── docker-compose.yml  # Orchestration
└── .env               # Environment variables
```

## Development

```bash
# View logs
docker-compose logs -f worker
docker-compose logs -f backend

# Rebuild a service
docker-compose up --build -d frontend

# Access database
docker exec -it <postgres_container> psql -U myuser -d suggestions

# Stop everything
docker-compose down

# Clean everything (including data)
docker-compose down -v
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/suggestions` - Create suggestion
- `GET /api/suggestions` - List all suggestions
- `GET /api/suggestions/{id}` - Get specific suggestion

## Roadmap

**MVP (Current)**
- ✅ Submit and view suggestions
- ✅ AI validation and code generation
- ✅ Display generated code

**Future Features**
- Auto-deployment of generated code
- GitHub integration (commit & push)
- Automated testing
- User authentication
- Suggestion voting

## Learning Project

This is a hobby project designed for learning:
- Agentic AI workflows
- Docker containerization
- FastAPI backend development
- React frontend development
- LLM integration

## Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - Detailed system architecture
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) - Step-by-step build guide
- [`CODING_PROMPTS.md`](CODING_PROMPTS.md) - Prompts for AI coding assistants

## License

MIT
