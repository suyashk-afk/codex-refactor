# 🔧 AI Button Not Showing - Troubleshooting

## Quick Fixes (Try These First)

### 1. Hard Refresh Browser
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 2. Clear Cache and Reload
```
Windows: Ctrl + F5
Mac: Cmd + Shift + Delete (then reload)
```

### 3. Check You Have Code Smells
**The AI button only appears when there are code smells!**

Try this test code (guaranteed to have smells):
```javascript
function processUserData(user, data, options, callback, errorHandler) {
  if (user) {
    if (data) {
      if (options) {
        if (callback) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].value > 100) {
              if (data[i].status === 'active') {
                callback(data[i]);
              }
            }
          }
        }
      }
    }
  }
}
```

This code has:
- ✅ Long function
- ✅ Deep nesting (5+ levels)
- ✅ Too many parameters
- ✅ Magic number (100)

### 4. Restart Frontend
```bash
# Stop frontend (Ctrl+C)
cd frontend
npm run dev
```

### 5. Check Browser Console
Press F12, look for errors in Console tab

---

## Step-by-Step Test

### Step 1: Verify Backend is Running
```bash
cd backend
npm start
```

Should see: `Server listening on port 4000`

### Step 2: Verify Frontend is Running
```bash
cd frontend
npm run dev
```

Should see: `Local: http://localhost:5173`

### Step 3: Open Browser
Go to: http://localhost:5173

### Step 4: Paste Bad Code
Use the test code above (the one with deep nesting)

### Step 5: Click "Analyze Code"
Wait for results

### Step 6: Scroll Down to "Function Analysis"
You should see the function with issues

### Step 7: Look for Issues
Under each function, you'll see code smells

### Step 8: Find the AI Button
**Below each smell**, you should see:
```
💡 Suggestion: [original suggestion]

[🤖 Ask AI Assistant] <- THIS BUTTON
```

---

## If Still Not Showing

### Check 1: Is the CSS loaded?
Open browser DevTools (F12) → Elements tab
Search for "ai-explain-btn"
If not found, CSS might not be loaded

**Fix:** Hard refresh (Ctrl+Shift+R)

### Check 2: Are there actually smells?
If code is too simple, there might be no smells!

**Fix:** Use the test code above (guaranteed smells)

### Check 3: JavaScript errors?
Open Console (F12)
Look for red errors

**Common error:** "getAIExplanation is not defined"
**Fix:** Restart frontend

### Check 4: Is App.jsx saved?
Make sure all changes are saved

**Fix:** 
1. Close frontend/src/App.jsx
2. Reopen it
3. Verify line 250 has `const getAIExplanation`
4. Restart frontend

---

## Visual Guide

**What you should see:**

```
Function Analysis
├─ processUserData (15 lines)
│  ├─ 📏 15L  🌀 5N  🔀 8C
│  │
│  ├─ 🔴 deep_nesting
│  │  Function has nesting depth of 5. This makes code hard to read.
│  │  💡 Use early returns or extract nested logic
│  │  
│  │  [🤖 Ask AI Assistant] <- CLICK HERE
│  │
│  └─ 🟡 too_many_parameters
│     Function has 5 parameters.
│     💡 Consider using an options object
│     
│     [🤖 Ask AI Assistant] <- CLICK HERE
```

---

## Still Not Working?

### Nuclear Option (Reset Everything)

```bash
# Stop everything (Ctrl+C in both terminals)

# Backend
cd backend
rm -rf node_modules
npm install
npm start

# Frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev

# Browser
Clear all cache
Hard refresh (Ctrl+Shift+R)
```

---

## Alternative: Check the Code Manually

Open `frontend/src/App.jsx` and search for:
- Line ~250: `const getAIExplanation`
- Line ~933: `onClick={() => getAIExplanation`
- Line ~944: `Ask AI Assistant`

If any are missing, the file didn't save properly.

---

## Quick Test Command

Run this in browser console (F12):
```javascript
console.log(document.querySelector('.ai-explain-btn'));
```

**If null:** Button not rendered (no smells or code issue)
**If element:** Button exists but might be hidden

---

## Contact Points

If nothing works:
1. Check that you analyzed code with smells
2. Hard refresh browser
3. Restart both servers
4. Use the test code I provided

**The button ONLY shows when there are code smells to explain!**
