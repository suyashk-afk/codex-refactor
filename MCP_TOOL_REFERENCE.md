# 🛠️ MCP Tool Reference Card

## Quick Command Reference

### 1. analyze_code
**What it does:** Analyzes code structure, complexity, and smells
**How to use in Kiro:**
```
Analyze this code: [paste code]
```

### 2. suggest_refactors
**What it does:** Suggests extract function refactorings
**How to use in Kiro:**
```
Suggest refactorings for this code: [paste code]
```

### 3. detect_code_smells
**What it does:** Finds specific code smells and anti-patterns
**How to use in Kiro:**
```
What code smells are in this: [paste code]
```

### 4. get_quality_score
**What it does:** Quick quality score (0-100)
**How to use in Kiro:**
```
What's the quality score of this code: [paste code]
```

### 5. analyze_repository_history ⭐ NEW!
**What it does:** Time Machine - analyzes quality across commits
**How to use in Kiro:**
```
Analyze commit history for lodash/lodash file src/array.js
```

**Or more explicitly:**
```
Show me how code quality evolved in https://github.com/expressjs/express for lib/application.js over the last 10 commits
```

---

## 🎯 Demo Commands (Copy-Paste Ready)

### For Video Demo:
```
Analyze the commit history for lodash/lodash, file src/array.js
```

### For Live Demo:
```
Show me code quality evolution for https://github.com/lodash/lodash file src/array.js
```

### For Judges Testing:
```
Use analyze_repository_history to show quality trends for expressjs/express file lib/application.js
```

---

## 🏆 What Makes Tool #5 Special

**Other MCP tools:**
- Analyze current code only
- No historical context
- Limited to snippets

**Your Tool #5:**
- ✅ Analyzes entire commit history
- ✅ Shows quality evolution over time
- ✅ Identifies exact commits that introduced tech debt
- ✅ Works with any GitHub repository
- ✅ Beautiful formatted output with trends and insights

**This is your winning edge.** 🎯
