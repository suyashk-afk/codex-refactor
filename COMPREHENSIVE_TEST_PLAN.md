# 🧪 Comprehensive Test Plan

## Pre-Test Setup

### 1. Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm start
# Wait for: "Server listening on port 4000"

# Terminal 2 - Frontend
cd frontend
npm run dev
# Wait for: "Local: http://localhost:5173"
```

### 2. Open Browser
- Go to: http://localhost:5173
- Open DevTools (F12) to check for errors

---

## Test Suite 1: Code Snippet Analysis

### Test 1.1: JavaScript - Simple Function
**Code:**
```javascript
function add(a, b) {
  return a + b;
}
```

**Expected Results:**
- ✅ Quality Score: 100/100
- ✅ Status: Healthy
- ✅ 0 code smells
- ✅ 1 function detected

**Pass/Fail:** ___

---

### Test 1.2: JavaScript - Bad Code
**Code:**
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

**Expected Results:**
- ✅ Quality Score: 30-50/100
- ✅ Status: Critical or Needs Improvement
- ✅ Smells detected:
  - deep_nesting (HIGH)
  - too_many_parameters (MEDIUM)
  - magic_numbers (MEDIUM)
- ✅ AI Assistant button appears
- ✅ Clicking AI gives context-aware explanation

**Pass/Fail:** ___

---

### Test 1.3: Python - Simple Function
**Code:**
```python
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total
```

**Expected Results:**
- ✅ Quality Score: 90-100/100
- ✅ Language badge shows "🐍 Python"
- ✅ 0-1 code smells
- ✅ 1 function detected

**Pass/Fail:** ___

---

### Test 1.4: Python - Bad Code
**Code:**
```python
def process_data(user, data, options, callback, error_handler):
    if user:
        if data:
            if options:
                if callback:
                    for i in range(len(data)):
                        if data[i]['value'] > 100:
                            if data[i]['status'] == 'active':
                                callback(data[i])
```

**Expected Results:**
- ✅ Quality Score: 30-50/100
- ✅ Smells detected:
  - deep_nesting
  - too_many_parameters
  - magic_numbers
- ✅ AI Assistant works for Python too

**Pass/Fail:** ___

---

## Test Suite 2: Refactoring Suggestions

### Test 2.1: Get Suggestions
**Using the bad JavaScript code from Test 1.2:**

**Steps:**
1. Paste bad code
2. Click "Suggest Refactors"
3. Wait for suggestions

**Expected Results:**
- ✅ Shows 1+ refactoring suggestions
- ✅ Each suggestion has:
  - Description
  - Extracted function name
  - Parameters
  - Risk level
  - Before/After code
- ✅ "View Changes" button works
- ✅ "Apply Refactoring" button works

**Pass/Fail:** ___

---

### Test 2.2: View Diff
**Steps:**
1. Click "View Changes" on a suggestion
2. Check side-by-side diff

**Expected Results:**
- ✅ Shows before/after comparison
- ✅ Red highlighting for removed code
- ✅ Green highlighting for added code
- ✅ Syntax highlighting works

**Pass/Fail:** ___

---

## Test Suite 3: Repository Scanner

### Test 3.1: Small Repository
**Input:** `https://github.com/lodash/lodash`

**Steps:**
1. Click "Repository" tab
2. Paste URL
3. Click "Analyze Repository"
4. Wait 15-30 seconds

**Expected Results:**
- ✅ Shows progress/loading state
- ✅ Displays results:
  - Average quality score (60-85)
  - Files analyzed (up to 30)
  - Total code smells
  - Technical debt hours
- ✅ Shows "Worst Files" list
- ✅ Each file shows:
  - Path
  - Language
  - Quality score
  - Number of smells
- ✅ Download button works

**Pass/Fail:** ___

---

### Test 3.2: Download Report
**Steps:**
1. After repository analysis
2. Click "Download Report (JSON)"

**Expected Results:**
- ✅ File downloads
- ✅ Filename: `owner-repo-analysis.json`
- ✅ File contains valid JSON
- ✅ Has all analysis data

**Pass/Fail:** ___

---

## Test Suite 4: Time Machine

### Test 4.1: Analyze History
**Input:**
- Repository: `https://github.com/lodash/lodash`
- File: `src/array.js`

**Steps:**
1. Click "Time Machine" tab
2. Enter repository URL
3. Enter file path
4. Click "Analyze History"
5. Wait 20-40 seconds

**Expected Results:**
- ✅ Shows loading state
- ✅ Displays results:
  - Overall trend (improving/declining/stable)
  - Average quality score
  - Best/worst scores
  - Best commit (biggest improvement)
  - Worst commit (biggest regression)
- ✅ Shows quality graph over time
- ✅ Shows commit-by-commit breakdown
- ✅ Each commit shows:
  - SHA
  - Message
  - Author
  - Date
  - Quality score
  - Change from previous
- ✅ Download button works

**Pass/Fail:** ___

---

### Test 4.2: Invalid File Path
**Input:**
- Repository: `https://github.com/lodash/lodash`
- File: `nonexistent/file.js`

**Expected Results:**
- ✅ Shows error message
- ✅ Suggests available files
- ✅ Doesn't crash

**Pass/Fail:** ___

---

## Test Suite 5: AI Assistant

### Test 5.1: AI Explanation Quality
**Using bad code from Test 1.2:**

**Steps:**
1. Analyze code
2. Find "deep_nesting" smell
3. Click "🤖 Ask AI Assistant"
4. Wait 2-5 seconds

**Expected Results:**
- ✅ Shows loading state ("AI thinking...")
- ✅ Response appears with:
  - "Powered by Gemini" badge
  - Context-aware explanation
  - Specific to YOUR code
  - Mentions function name
  - Gives concrete example
  - Proper formatting (line breaks, code blocks)
- ✅ Response is different from generic suggestion
- ✅ Response is helpful and actionable

**Pass/Fail:** ___

---

### Test 5.2: AI for Different Smells
**Test AI on each smell type:**

**Smells to test:**
- [ ] deep_nesting
- [ ] long_function
- [ ] too_many_parameters
- [ ] magic_numbers
- [ ] high_complexity
- [ ] missing_error_handling

**For each:**
- ✅ AI gives specific explanation
- ✅ Response is contextual
- ✅ Formatting is good

**Pass/Fail:** ___

---

### Test 5.3: AI Fallback
**Steps:**
1. Stop backend
2. Try to use AI Assistant

**Expected Results:**
- ✅ Shows original suggestion (fallback)
- ✅ Doesn't crash
- ✅ No "Powered by Gemini" badge

**Pass/Fail:** ___

---

## Test Suite 6: Download Features

### Test 6.1: Download Code Analysis
**Steps:**
1. Analyze any code
2. Click "Download Analysis (JSON)"

**Expected Results:**
- ✅ File downloads
- ✅ Contains analysis data
- ✅ Valid JSON format

**Pass/Fail:** ___

---

### Test 6.2: Download Repository Report
**Steps:**
1. Analyze repository
2. Click "Download Report (JSON)"

**Expected Results:**
- ✅ File downloads
- ✅ Filename includes repo name
- ✅ Contains all files data

**Pass/Fail:** ___

---

### Test 6.3: Download Timeline
**Steps:**
1. Analyze history
2. Click "Download Timeline (JSON)"

**Expected Results:**
- ✅ File downloads
- ✅ Contains commit history
- ✅ Has insights data

**Pass/Fail:** ___

---

## Test Suite 7: UI/UX

### Test 7.1: Tab Switching
**Steps:**
1. Switch between all 3 tabs
2. Enter data in each
3. Switch back

**Expected Results:**
- ✅ Tabs switch smoothly
- ✅ Data persists when switching
- ✅ No visual glitches
- ✅ Active tab is highlighted

**Pass/Fail:** ___

---

### Test 7.2: Loading States
**Check all loading states:**
- [ ] Code analysis loading
- [ ] Repository scanning loading
- [ ] Time Machine loading
- [ ] AI Assistant loading

**Expected:**
- ✅ Spinner shows
- ✅ Button is disabled
- ✅ Clear loading message

**Pass/Fail:** ___

---

### Test 7.3: Error Handling
**Test error scenarios:**
- [ ] Empty code input
- [ ] Invalid repository URL
- [ ] Network error
- [ ] API rate limit

**Expected:**
- ✅ Clear error messages
- ✅ Doesn't crash
- ✅ User can recover

**Pass/Fail:** ___

---

## Test Suite 8: Performance

### Test 8.1: Large Code
**Code:** 500+ lines of JavaScript

**Expected:**
- ✅ Analyzes in < 5 seconds
- ✅ UI remains responsive
- ✅ Results display correctly

**Pass/Fail:** ___

---

### Test 8.2: Multiple Requests
**Steps:**
1. Analyze code
2. Immediately analyze again
3. Click AI multiple times

**Expected:**
- ✅ Handles concurrent requests
- ✅ No crashes
- ✅ Results are correct

**Pass/Fail:** ___

---

## Test Suite 9: Browser Compatibility

### Test 9.1: Different Browsers
**Test in:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge

**Expected:**
- ✅ Works in all browsers
- ✅ UI looks correct
- ✅ All features work

**Pass/Fail:** ___

---

## Test Suite 10: Edge Cases

### Test 10.1: Empty File
**Code:** (empty)

**Expected:**
- ✅ Shows error or 100 score
- ✅ Doesn't crash

**Pass/Fail:** ___

---

### Test 10.2: Only Comments
**Code:**
```javascript
// This is a comment
/* Another comment */
```

**Expected:**
- ✅ Score: 100/100
- ✅ 0 functions
- ✅ No smells

**Pass/Fail:** ___

---

### Test 10.3: Syntax Error
**Code:**
```javascript
function broken( {
  return "missing brace"
}
```

**Expected:**
- ✅ Shows parse error
- ✅ Helpful error message
- ✅ Doesn't crash

**Pass/Fail:** ___

---

## Final Checklist

### Critical Features
- [ ] Code analysis works (JS/TS/Python)
- [ ] Repository scanner works
- [ ] Time Machine works
- [ ] AI Assistant works
- [ ] All downloads work
- [ ] No console errors
- [ ] UI looks good
- [ ] Loading states work
- [ ] Error handling works

### Nice to Have
- [ ] Animations smooth
- [ ] Responsive design
- [ ] Fast performance
- [ ] Good error messages

---

## Test Results Summary

**Total Tests:** 30+
**Passed:** ___
**Failed:** ___
**Pass Rate:** ___%

**Critical Issues Found:**
1. ___
2. ___
3. ___

**Minor Issues Found:**
1. ___
2. ___
3. ___

---

## Sign Off

**Tested By:** ___
**Date:** ___
**Ready for Demo:** YES / NO
**Ready for Submission:** YES / NO

---

**If Pass Rate > 90%: YOU'RE READY TO WIN! 🏆**
**If Pass Rate < 90%: Fix critical issues first**
