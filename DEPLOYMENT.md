# 🚀 Deployment Guide

## Quick Deploy Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct API URL
- [ ] MCP server configured (for local Kiro usage)
- [ ] Demo video recorded and uploaded
- [ ] README updated with live URLs

---

## Option 1: Deploy to Render (Recommended - Free Tier)

### Backend Deployment

1. **Create `render.yaml` in root:**
```yaml
services:
  - type: web
    name: refactor-codex-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 4000
```

2. **Push to GitHub**
3. **Connect to Render:**
   - Go to https://render.com
   - New > Web Service
   - Connect your GitHub repo
   - Render will auto-detect `render.yaml`

4. **Note your backend URL:** `https://refactor-codex-backend.onrender.com`

### Frontend Deployment

1. **Update API URL in `frontend/src/App.jsx`:**
```javascript
// Change from:
const res = await axios.post("http://localhost:4000/analyze", ...);

// To:
const API_URL = import.meta.env.VITE_API_URL || "https://refactor-codex-backend.onrender.com";
const res = await axios.post(`${API_URL}/analyze`, ...);
```

2. **Create `frontend/.env.production`:**
```
VITE_API_URL=https://refactor-codex-backend.onrender.com
```

3. **Deploy to Render:**
   - New > Static Site
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

4. **Note your frontend URL:** `https://refactor-codex.onrender.com`

---

## Option 2: Deploy to Vercel + Railway

### Backend (Railway)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Deploy:**
```bash
cd backend
railway login
railway init
railway up
```

3. **Note your backend URL**

### Frontend (Vercel)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Update API URL** (same as Option 1)

3. **Deploy:**
```bash
cd frontend
vercel --prod
```

---

## Option 3: Deploy to Heroku

### Backend

1. **Create `Procfile` in backend:**
```
web: node server.js
```

2. **Deploy:**
```bash
cd backend
heroku create refactor-codex-backend
git subtree push --prefix backend heroku main
```

### Frontend

1. **Update API URL** (same as Option 1)

2. **Deploy:**
```bash
cd frontend
heroku create refactor-codex-frontend
heroku buildpacks:set heroku/nodejs
git subtree push --prefix frontend heroku main
```

---

## Environment Variables

### Backend
```
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

---

## Testing Deployment

1. **Test backend:**
```bash
curl https://your-backend-url.com/
# Should return: "Backend is working! Supports JavaScript/TypeScript and Python 🐍"
```

2. **Test analysis endpoint:**
```bash
curl -X POST https://your-backend-url.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "function test() { console.log(\"hello\"); }"}'
```

3. **Test frontend:**
   - Open frontend URL
   - Paste code
   - Click "Analyze Code"
   - Should see results

---

## Common Issues

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:** Update backend CORS configuration:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-url.com"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
```

### Python Not Found

**Problem:** Backend can't spawn Python processes

**Solution:** 
- Render/Railway: Add Python buildpack
- Heroku: Add `heroku/python` buildpack
- Or disable Python support temporarily

### Build Failures

**Problem:** npm install fails

**Solution:**
- Check Node version (use 18+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

---

## Update README with Live URLs

After deployment, update `README.md`:

```markdown
**[🎥 Demo Video](https://youtube.com/watch?v=YOUR_VIDEO) | [🚀 Live Demo](https://your-frontend-url.com) | [📖 Documentation](#)**
```

---

## MCP Server (Local Only)

**Note:** MCP server runs locally with Kiro, not deployed.

**Configuration:** `.kiro/settings/mcp.json`
```json
{
  "mcpServers": {
    "codex-refactor": {
      "command": "python",
      "args": ["codex_mcp/mcp_server.py"],
      "disabled": false
    }
  }
}
```

**To test:**
1. Start backend: `cd backend && npm start`
2. In Kiro, ask: "Analyze this code for quality issues"
3. Kiro should call your MCP tools

---

## Submission Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with live demo
- [ ] Both URLs added to README
- [ ] Demo video recorded (3 minutes max)
- [ ] Video uploaded to YouTube/Vimeo
- [ ] Video URL added to README
- [ ] `.kiro/` directory committed to repo
- [ ] KIRO_USAGE.md explains how you used Kiro
- [ ] LICENSE file included (MIT)
- [ ] Repository is public
- [ ] All code pushed to GitHub

---

## Need Help?

**Deployment Issues:**
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app

**Kiro Issues:**
- Check `.kiro/settings/mcp.json` configuration
- Ensure backend is running on localhost:4000
- Test MCP tools manually first

---

*Good luck with your submission! 🎃*
