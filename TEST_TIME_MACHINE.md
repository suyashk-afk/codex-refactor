# Test Time Machine

## Quick Test

Try these EXACT inputs:

### Test 1: Lodash (Small file)
- Repo: `https://github.com/lodash/lodash`
- File: `isArray.js`

### Test 2: Express (Known file)
- Repo: `https://github.com/expressjs/express`
- File: `index.js`

### Test 3: Simple repo
- Repo: `https://github.com/sindresorhus/is`
- File: `index.js`

## Debug Steps

1. Open browser console (F12)
2. Click "Time Machine" tab
3. Enter repo and file
4. Click "Analyze History"
5. Check:
   - Network tab - see the request
   - Console tab - see any errors
   - Backend terminal - see what's happening

## Common Issues

### "0 commits" shown
**Cause:** File path is wrong or file doesn't exist

**Fix:** 
- File paths are case-sensitive
- Don't include leading slash
- Check the file exists in the repo on GitHub

### Backend shows error
**Check backend console for:**
- "File not found in repository" → Wrong file path
- "GitHub API rate limit" → Wait 1 hour
- "Failed to fetch commit history" → Check repo URL

## Manual Test (Backend)

Test the endpoint directly:

```bash
curl -X POST http://localhost:4000/analyze-history \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/lodash/lodash",
    "filePath": "isArray.js",
    "maxCommits": 5
  }'
```

Should return JSON with timeline data.

## What to Look For

**Success looks like:**
```json
{
  "ok": true,
  "owner": "lodash",
  "repo": "lodash",
  "filePath": "isArray.js",
  "timeline": [
    {
      "sha": "abc1234",
      "date": "2024-01-01",
      "score": 85,
      ...
    }
  ],
  "insights": {
    "overallTrend": "improving",
    ...
  }
}
```

**Failure looks like:**
```json
{
  "ok": false,
  "error": "File not found in repository"
}
```

## Quick Fix

If it's not working, the file path is probably wrong.

**Try these known-good paths:**

1. **Lodash:**
   - `isArray.js` ✅
   - `isObject.js` ✅
   - `chunk.js` ✅

2. **Express:**
   - `index.js` ✅
   - `lib/application.js` ✅
   - `lib/router/index.js` ✅

3. **Your own repo:**
   - Go to GitHub
   - Navigate to the file
   - Copy the path from the URL
   - Paste exactly as shown

## Still Not Working?

Check backend console output. It should show:
```
ANALYZING FILE HISTORY: https://github.com/... path/to/file.js
Analyzing commit history for owner/repo/path/to/file.js
Found X commits
Analyzing commit 1/X: abc1234
...
```

If you see "Found 0 commits" → File path is wrong
