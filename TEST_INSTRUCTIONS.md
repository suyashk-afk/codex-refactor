# 🧪 Testing Your Refactor Codex

## Step 1: Start Backend

```bash
cd backend
npm start
```

**Expected output:**
```
Server listening on port 4000 - Supporting JavaScript/TypeScript and Python refactoring! 🚀🐍
```

**If it fails:**
- Run `npm install` first
- Check if port 4000 is already in use
- Kill other processes: `npx kill-port 4000`

## Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
```

**If it fails:**
- Run `npm install` first
- Check if port 5173 is already in use

## Step 3: Test in Browser

1. Open `http://localhost:5173`
2. You should see:
   - ⚗️ "The Refactor Codex" title with gradient
   - Copper pipes in corners
   - Dark laboratory theme
   - Code input textarea
   - Two buttons: "Analyze Code" and "Suggest Refactors"

## Step 4: Test Analysis

Paste this code:

```javascript
function badCode(data) {
  if (data) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].active) {
          if (data[i].score > 100) {
            console.log(data[i].name);
          }
        }
      }
    }
  }
}
```

Click "Analyze Code"

**Expected result:**
- Quality score appears (probably 30-40/100)
- Circular progress animation
- Code smells detected:
  - Deep nesting (5 levels)
  - Long function
  - Magic number (100)
- Function details shown

## Step 5: Test Refactoring

Click "Suggest Refactors"

**Expected result:**
- Refactoring suggestions appear
- Shows extracted function code
- "Apply Refactoring" button
- "View Changes" button

## Step 6: Test Python Support

Paste this Python code:

```python
def process_data(items):
    if items:
        if len(items) > 0:
            for item in items:
                if item['active']:
                    if item['score'] > 100:
                        print(item['name'])
```

Click "Analyze Code"

**Expected result:**
- Language badge shows "🐍 Python"
- Analysis works
- Quality score shown

## Troubleshooting

### CSS Not Loading
**Problem:** Page looks plain, no styling

**Solution:**
1. Check browser console (F12) for errors
2. Verify `codex.css` exists in `frontend/src/`
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Backend Connection Error
**Problem:** "Failed to analyze code" error

**Solution:**
1. Verify backend is running on port 4000
2. Check CORS settings in `backend/server.js`
3. Open `http://localhost:4000` - should show "Backend is working!"

### Python Analysis Fails
**Problem:** JavaScript works but Python doesn't

**Solution:**
1. Verify Python is installed: `python --version`
2. Check Python path in backend spawn command
3. Try `python3` instead of `python` in `server.js`

### No Suggestions Generated
**Problem:** Analysis works but no refactoring suggestions

**Solution:**
- This is normal for very short functions (<10 lines)
- Try longer, more complex code
- Check backend console for errors

## Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads with Frankenstein theme
- [ ] Can paste code into textarea
- [ ] "Analyze Code" returns quality score
- [ ] Code smells are detected and displayed
- [ ] "Suggest Refactors" generates suggestions
- [ ] Can view before/after diff
- [ ] Python code analysis works
- [ ] Language badge shows correct language

## If Everything Works

**Congratulations!** Your app is ready. Next steps:

1. Deploy to production (see DEPLOYMENT.md)
2. Record demo video
3. Update README with live URLs
4. Submit to hackathon

## If Nothing Works

**Don't panic.** Common issues:

1. **Node modules not installed**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Ports already in use**
   ```bash
   npx kill-port 4000
   npx kill-port 5173
   ```

3. **Python not found**
   - Install Python from python.org
   - Or disable Python support temporarily

4. **CORS errors**
   - Check `backend/server.js` CORS configuration
   - Ensure origin includes `http://localhost:5173`

## Need More Help?

Check these files:
- `backend/server.js` - Backend API
- `frontend/src/App.jsx` - Frontend React app
- `frontend/src/codex.css` - Styling
- `backend/refactor-engine/` - Analysis engine

Look for console errors in:
- Browser DevTools (F12)
- Backend terminal
- Frontend terminal
