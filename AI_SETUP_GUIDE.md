# 🤖 AI Assistant Setup Guide

## ✅ DONE - Code is Ready!

I've added Google Gemini AI integration to your project. Here's how to activate it:

---

## Step 1: Get Your FREE API Key (2 minutes)

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

---

## Step 2: Install Package (1 minute)

```bash
cd backend
npm install @google/generative-ai
```

---

## Step 3: Add Your API Key

### Option A: Environment Variable (Recommended)
```bash
# Windows CMD
set GEMINI_API_KEY=YOUR_API_KEY_HERE

# Windows PowerShell
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Then start backend
npm start
```

### Option B: Direct in Code (Quick Test)
Open `backend/server.js` and replace:
```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");
```

With your actual key:
```javascript
const genAI = new GoogleGenerativeAI("AIzaSyC...your-key-here");
```

---

## Step 4: Test It! (2 minutes)

1. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the AI:**
   - Open http://localhost:5173
   - Paste some code with issues
   - Click "Analyze Code"
   - Find a code smell
   - Click **"🤖 Ask AI Assistant"**
   - Wait 2-3 seconds
   - See AI explanation!

---

## What You Get

### Before (Without AI):
```
💡 Suggestion: Extract logical blocks into separate functions
```

### After (With AI):
```
🤖 AI Assistant (Powered by Gemini)

This function is 45 lines long, making it difficult to understand and maintain. 
Break it into smaller, focused functions - for example, extract the validation 
logic into a validateInput() function and the data processing into processData(). 
This improves readability and makes testing easier.
```

---

## Features

✅ **Smart Explanations** - AI explains WHY the smell matters
✅ **Actionable Fixes** - Specific steps to fix the issue
✅ **Context-Aware** - Uses your actual code for better suggestions
✅ **Graceful Fallback** - If AI fails, shows original suggestion
✅ **Free Tier** - 15 requests/minute, 1500/day (plenty for demo!)

---

## How It Works

1. User clicks "Ask AI Assistant" on any code smell
2. Frontend sends smell + code to backend
3. Backend calls Gemini API with smart prompt
4. AI generates explanation in 2-3 seconds
5. Frontend displays with nice animation
6. If API fails, shows original suggestion (no crash!)

---

## Demo Tips

### Show This in Your Video:

**Before AI:**
> "Here's a code smell. The tool suggests extracting functions."

**After AI:**
> "But what if you want more detail? Click 'Ask AI Assistant'..."
> *Click button*
> "In 2 seconds, Gemini AI explains exactly WHY this is a problem and HOW to fix it."
> *Show AI explanation*
> "This is the difference between a tool and an intelligent assistant."

---

## Troubleshooting

### "API key not valid"
- Check you copied the full key (starts with `AIza`)
- Make sure no extra spaces
- Try creating a new key

### "Rate limit exceeded"
- Free tier: 15 requests/minute
- Wait 1 minute and try again
- For demo, this is plenty

### "AI button doesn't appear"
- Make sure backend is running
- Check browser console for errors
- Verify npm install worked

### "Shows fallback message"
- API might be down (rare)
- Check your internet connection
- Fallback ensures app still works!

---

## Cost

**FREE TIER:**
- 15 requests per minute
- 1,500 requests per day
- No credit card required
- Perfect for hackathon demo

**For your demo:**
- ~10-20 AI requests total
- Well within free limits
- Zero cost ✅

---

## Why This Wins

### Before (Without AI):
- Static suggestions
- Generic advice
- Same as everyone else

### After (With AI):
- Dynamic explanations
- Context-aware advice
- **Unique feature**
- Shows innovation
- Impresses judges

---

## Security Note

**For submission:**
- Don't commit API key to GitHub
- Use environment variable
- Or add to `.env` file (and `.gitignore` it)

**For demo:**
- Hardcoded key is fine (just for testing)
- Remove before pushing to GitHub

---

## Next Steps

1. ✅ Get API key (2 min)
2. ✅ Install package (1 min)
3. ✅ Add key to code (1 min)
4. ✅ Test it works (2 min)
5. ✅ Record demo showing AI (5 min)

**Total time: 11 minutes to add AI to your project!**

---

## The Pitch

> "Refactor Codex doesn't just detect code smells - it explains them. Using Google's Gemini AI, we provide context-aware explanations that help developers understand WHY something is a problem and HOW to fix it. This transforms static analysis into an intelligent coding assistant."

---

**You now have AI-powered code analysis. Test it and add it to your demo!** 🤖✨
