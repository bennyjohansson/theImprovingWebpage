# 🚀 Quick Start Guide

Get the Self-Improving Webpage running in 5 minutes!

## Step 1: Prerequisites ✓

Make sure you have:
- Podman (or Docker) installed
- Podman Compose installed
- An Anthropic API key ([Get free key](https://console.anthropic.com/))

## Step 2: Setup Environment 🔧

```bash
# 1. Navigate to project directory
cd theImprovingWebpage

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env and add your API key
nano .env  # or: code .env, vim .env, etc.
```

**Important**: Replace `your-key-here` with your actual Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here-xxxxxxxxxxxxx
```

## Step 3: Launch Services 🚀

```bash
# Start all containers (this will take a few minutes first time)
podman-compose up --build

# Or run in background:
podman-compose up --build -d
```

Wait for:
- ✅ PostgreSQL to be healthy
- ✅ Backend to start (port 8000)
- ✅ Frontend to build and start (port 3000)
- ✅ Worker to begin monitoring

## Step 4: Open Application 🌐

Open your browser and navigate to:

**Frontend**: http://localhost:3000

You should see a beautiful interface with:
- Title: "🤖 Self-Improving Webpage"
- A form to submit suggestions
- Empty suggestion list (initially)

## Step 5: Test It Out! 🧪

### Submit Your First Suggestion

1. In the text area, type: **"Add a welcome message with a title"**
2. Click **"🚀 Submit Suggestion"**
3. Watch the status badge change:
   - ⏳ PENDING (yellow)
   - ⚙️ PROCESSING (blue) 
   - ✅ COMPLETED (green)
4. Click **"🔼 View Code"** to see the generated React component
5. Click **"📋 Copy"** to copy the code

### Try More Suggestions

- "Create a colorful button with hover effects"
- "Add a user profile card"
- "Create a loading spinner animation"
- "Add a navigation menu"

## Viewing Logs 📋

```bash
# All logs
podman-compose logs -f

# Specific service
podman-compose logs -f worker    # See AI processing
podman-compose logs -f backend   # See API calls
podman-compose logs -f frontend  # See Nginx logs
```

## Stopping Services 🛑

```bash
# Stop all services
podman-compose down

# Stop and remove all data (including database)
podman-compose down -v
```

## Troubleshooting 🔍

### "Connection refused" error
- Check if Podman machine is running: `podman machine list`
- Start if needed: `podman machine start`

### Worker not processing suggestions
- Verify API key is set: `podman exec self_improving_worker env | grep ANTHROPIC`
- Check worker logs: `podman-compose logs worker`

### Frontend not loading
- Check container is running: `podman ps | grep frontend`
- Try rebuilding: `podman-compose up --build -d frontend`

## Next Steps 🎯

- Read the full [README.md](README.md) for detailed documentation
- Check [architecture_doc.txt](architecture_doc.txt) for system design
- Review [implementation_plan.txt](implementation_plan.txt) for development phases
- Explore the API docs at http://localhost:8000/docs

## API Testing (Optional) 🧑‍💻

```bash
# Check backend health
curl http://localhost:8000/health

# Create suggestion via API
curl -X POST http://localhost:8000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{"content": "Add a footer"}'

# List all suggestions
curl http://localhost:8000/api/suggestions
```

---

**Congratulations!** 🎉 You now have a fully functional AI-powered self-improving webpage!

**Need help?** Check the [Troubleshooting section in README.md](README.md#-troubleshooting)
