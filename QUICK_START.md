# ⚡ QUICK START - Time Machine

## Test These EXACT Examples (Copy-Paste)

### Example 1: Lodash (WORKS 100%)
```
Repository: https://github.com/lodash/lodash
File Path: isArray.js
```

### Example 2: Express (WORKS 100%)
```
Repository: https://github.com/expressjs/express
File Path: index.js
```

### Example 3: Axios (WORKS 100%)
```
Repository: https://github.com/axios/axios
File Path: index.js
```

## Common Mistakes

### ❌ WRONG:
```
File Path: /src/index.js  (has leading slash)
File Path: src/index.js   (might not exist)
File Path: Index.js       (wrong case)
```

### ✅ RIGHT:
```
File Path: index.js       (exact path from repo root)
File Path: lib/axios.js   (with folder, no leading slash)
```

## How to Find Correct Path

1. Go to GitHub repo in browser
2. Click on the file you want
3. Look at URL: `github.com/owner/repo/blob/main/PATH/TO/FILE.js`
4. Copy everything after `/blob/main/`
5. Paste that as File Path

## Example:

**GitHub URL:**
```
https://github.com/lodash/lodash/blob/main/isArray.js
```

**File Path to use:**
```
isArray.js
```

**Another example:**
```
https://github.com/expressjs/express/blob/master/lib/application.js
```

**File Path to use:**
```
lib/application.js
```

## If You Get "0 commits" or Error

The file path is wrong. The error message will now show suggestions:

```
File not found: src/index.js

💡 Try one of these files:
index.js
lib/axios.js
lib/core/Axios.js
```

Just copy one of the suggestions and try again!

## Quick Test (30 seconds)

1. Start servers:
```bash
cd backend && npm start
cd frontend && npm run dev
```

2. Open http://localhost:5173

3. Click "⏰ Time Machine" tab

4. Copy-paste this EXACTLY:
```
Repository: https://github.com/lodash/lodash
File Path: isArray.js
```

5. Click "Analyze History"

6. Wait 20 seconds

7. You should see a graph with quality scores!

## Still Not Working?

Check backend console. You should see:
```
ANALYZING FILE HISTORY: https://github.com/lodash/lodash isArray.js
Fetching commits for lodash/lodash/isArray.js
Found 10 commits
Analyzing commit 1/10: abc1234
...
```

If you see "Found 0 commits" → File path is wrong, try the suggestions shown in the error message.
