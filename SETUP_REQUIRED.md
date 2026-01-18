# ⚠️ IMPORTANT: Before First Use

## 🔑 Required: OpenAI API Key

**The application will NOT work without setting your API key!**

### Step 1: Get Your API Key
1. Visit: https://platform.openai.com/api-keys
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-proj-`)

### Step 2: Configure Environment
```bash
# Edit the .env file
nano .env

# Or
code .env

# Replace this line:
OPENAI_API_KEY=your-key-here

# With your actual key:
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Start/Restart Worker
```bash
# If worker is not running
podman-compose up -d worker

# If worker is already running, restart it
podman-compose restart worker

# Verify it's working
podman-compose logs -f worker
```

You should see:
```
🤖 Worker started - monitoring for pending suggestions...
Database initialized
```

## ✅ Verification Checklist

Before submitting your first suggestion, verify:

- [ ] All 4 containers are running: `podman ps`
- [ ] Frontend accessible: http://localhost:3000
- [ ] Backend accessible: http://localhost:8000/health
- [ ] API key is set in .env file
- [ ] Worker is running and not showing errors
- [ ] Database is healthy

## 🧪 Test the System

1. Open http://localhost:3000
2. Submit: "Add a hello world message"
3. Watch logs: `podman-compose logs -f worker`
4. Wait 10-30 seconds
5. See status change to "completed"
6. Click "View Code"

## 🚨 Common Issues

### Worker shows "API key not found"
→ You forgot to set OPENAI_API_KEY in .env

### Suggestions stay in "pending" forever
→ Worker is not running or has errors. Check: `podman-compose logs worker`

### "Rate limit exceeded"
→ Using free tier with limits. Wait a bit or upgrade plan.

### Frontend shows connection error
→ Backend might not be running. Check: `podman ps`

## 📞 Getting Help

1. Check [README.md](README.md#-troubleshooting)
2. Review [QUICKSTART.md](QUICKSTART.md)
3. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
4. Check container logs: `podman-compose logs`

---

**Ready to start?** Follow the 3 steps above, then open http://localhost:3000! 🚀
