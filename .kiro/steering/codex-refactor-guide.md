# Refactor Codex: Complete Development Guide

## Project Overview

**Refactor Codex** is a multi-language code quality analysis platform with unique time-machine capabilities. It combines JavaScript/TypeScript and Python analysis engines, provides AI-powered refactoring suggestions, and tracks code quality evolution across Git commit history.

### Core Architecture

```
┌─────────────────────────────────────────────┐
│  React Frontend (Vite + React 19)          │
│  ↓ HTTP/REST                                │
│  Express Backend (Node.js)                  │
│  ├─ JavaScript/TypeScript Analyzer (Babel) │
│  ├─ Python Analyzer (subprocess)            │
│  ├─ GitHub API Integration                  │
│  └─ Gemini AI Integration                   │
│  ↓ stdio                                    │
│  MCP Server (Python)                        │
│  ↓ MCP Protocol                             │
│  Kiro IDE (AI Agent)                        │
└─────────────────────────────────────────────┘
```

### Key Features

1. **Multi-Language Support** - JavaScript, TypeScript, AND Python
2. **Time Machine Analysis** ⭐ UNIQUE - Track code quality across commit history
3. **GitHub Repository Scanner** - Analyze entire repositories (up to 30 files)
4. **AI-Powered Refactoring** - Extract function suggestions with Gemini AI
5. **Scientific Metrics** - McCabe complexity, toxicity scoring, maintainability index
6. **MCP Integration** - 5 custom tools for Kiro IDE

---

## MCP Tools Reference

### 1. `analyze_code`
**Purpose:** Comprehensive AST analysis with quality scores

**When to use:**
- User asks "Analyze this code"
- Need full metrics (quality, complexity, smells)
- Want detailed function-level breakdown

**Input:**
```json
{
  "code": "function example() { ... }",
  "filename": "file.js" // optional
}
```

**Output:** Quality score (0-100), complexity metrics, code smells by type, function details

### 2. `suggest_refactors`
**Purpose:** Extract function refactoring suggestions

**When to use:**
- User asks "How can I refactor this?"
- Code has functions >10 lines
- Want actionable improvement suggestions

**Input:**
```json
{
  "code": "function longFunction() { ... }",
  "filename": "file.js" // optional
}
```

**Output:** Refactoring suggestions with before/after code, risk assessment, benefits

### 3. `detect_code_smells`
**Purpose:** Focused smell detection

**When to use:**
- User asks "What's wrong with this code?"
- Quick issue identification
- Want categorized problems

**Input:**
```json
{
  "code": "function example() { ... }"
}
```

**Output:** Code smells by severity (high/medium/low) with suggestions

### 4. `get_quality_score`
**Purpose:** Quick health check

**When to use:**
- User asks "Is this code good?"
- Need fast assessment
- Want simple score

**Input:**
```json
{
  "code": "function example() { ... }"
}
```

**Output:** Quality score (0-100) with health status (healthy/needs_improvement/critical)

### 5. `analyze_repository_history` ⭐ UNIQUE
**Purpose:** Time machine for code quality evolution

**When to use:**
- User asks "How has this code evolved?"
- Want to see quality trends over time
- Need to identify regressions
- Track developer improvement

**Input:**
```json
{
  "repo_url": "https://github.com/lodash/lodash",
  "file_path": "src/array.js",
  "max_commits": 10 // optional, max 20
}
```

**Output:** Timeline with quality scores, regressions, improvements, best/worst commits

**This is the WINNING FEATURE** - No other tool shows historical code quality like this!

---

## Workflow Guidelines

### For Code Quality Questions

**User asks: "Is this code good?"**
1. Use `get_quality_score` for quick answer
2. If score <70, follow up with `detect_code_smells`
3. Explain findings in plain language
4. Prioritize by severity

**User asks: "What's wrong with this?"**
1. Use `detect_code_smells` for focused detection
2. Explain WHY each smell matters
3. Provide actionable next steps
4. Cite specific line numbers

**User asks: "Analyze this code"**
1. Use `analyze_code` for comprehensive analysis
2. Present quality score first
3. Break down by function
4. Highlight top 3 priority issues

### For Refactoring Requests

**User asks: "How do I fix this?" or "Suggest refactorings"**
1. First call `analyze_code` to establish baseline
2. Then call `suggest_refactors` for concrete suggestions
3. Present multiple options when available
4. Explain trade-offs (risk vs benefit)
5. Mark risky refactorings clearly

**Never suggest refactorings without analyzing first!**

### For Repository Analysis

**User asks: "Analyze this GitHub repo"**
1. Explain that we can analyze up to 30 files
2. Ask for repository URL
3. Use backend `/analyze-repo` endpoint (not MCP tool)
4. Present aggregate metrics first
5. Show worst files for prioritization

### For Time Machine Analysis ⭐

**User asks: "Show me code quality history" or "How has this evolved?"**
1. Use `analyze_repository_history` MCP tool
2. Ask for repo URL and file path if not provided
3. Present overall trend first (improving/declining/stable)
4. Highlight biggest improvement and regression
5. Show timeline visualization
6. Provide actionable recommendations

**Example queries:**
- "Show me how lodash's array.js evolved over 10 commits"
- "Track quality changes in react's useState.js"
- "Find regressions in my project's main.js"

---

## Multi-Language Support

### Language Detection
- **Auto-detect** from file extension (.js/.jsx/.ts/.tsx = JavaScript, .py = Python)
- **Fallback** to code pattern analysis (def/import = Python, function/const = JavaScript)
- **Always mention** detected language to user

### JavaScript/TypeScript
- Full analysis + refactoring support
- Babel parser with TypeScript preset
- Detects: callback hell, promise chains, magic numbers
- Suggest ES6+ improvements (async/await, destructuring)

### Python
- Full analysis + refactoring support
- Python AST module via subprocess
- Detects: complex list comprehensions, long functions, deep nesting
- Emphasize Pythonic best practices

### Language-Specific Patterns

**JavaScript:**
- Callback hell → Suggest async/await
- Long promise chains → Suggest async/await
- var usage → Suggest const/let
- == usage → Suggest ===

**Python:**
- Complex list comprehensions → Suggest breaking into loops
- Missing type hints → Suggest adding them
- Long functions → Suggest extraction
- Deep nesting → Suggest guard clauses

---

## Response Guidelines

### Be Specific
- Always cite exact line numbers
- Use concrete examples from user's code
- Avoid generic advice
- Tie everything to their specific code

### Explain Impact
- Don't just say "high complexity" - explain why it matters
- Connect smells to real-world maintenance problems
- Quantify improvements: "reduces nesting from 5 to 2 levels"
- Use analogies when helpful

### Prioritize Actionability
- Give 1-3 top priority fixes, not overwhelming lists
- Suggest incremental improvements
- Acknowledge when code is already good
- Provide step-by-step guidance

### Safety First
- Mark risky refactorings clearly
- Explain what could break
- Suggest testing strategies after changes
- Recommend starting with low-risk changes

---

## Scientific Metrics Explained

### Quality Score (0-100)
- **80-100:** Excellent - Well-structured, maintainable
- **50-79:** Moderate - Some issues to address
- **0-49:** Critical - Needs significant refactoring

**Formula:** Weighted combination of complexity, toxicity, and code smells

### McCabe Cyclomatic Complexity
- **1-4:** Simple - Easy to test
- **5-7:** Moderate - Acceptable
- **8-10:** Complex - Consider refactoring
- **11-20:** Very Complex - Refactor soon
- **>20:** Untestable - Refactor immediately

**Formula:** M = decision_points + 1

### Toxicity Score (0-100)
- Severity-weighted measure of code smells
- **Weights:** Critical=10, High=5, Medium=2, Low=1
- **Multipliers:** Complexity=1.5x, Nesting=1.3x, Length=1.2x, Magic=1.0x
- **Normalized** to 0-100 scale

### Maintainability Index (0-100)
- **>70:** Maintainable
- **50-70:** Needs Improvement
- **<50:** Difficult to Maintain

**Formula:** MI = 0.5 × Q + 0.3 × (100 - T) + 0.2 × (100 - 5C)
- Q = Quality Score
- T = Toxicity
- C = Average Complexity

### Technical Debt
- **15 minutes per code smell** (industry standard)
- Expressed in hours when >60 minutes
- Includes breakdown by smell type

---

## Code Smell Catalog

### High Severity
- **Long Functions** (>50 lines) - Hard to understand and test
- **Deep Nesting** (>4 levels) - Cognitive overload
- **High Complexity** (>10) - Difficult to maintain
- **Callback Hell** - Error-prone async code

### Medium Severity
- **Moderate Functions** (20-50 lines) - Could be split
- **Moderate Nesting** (3-4 levels) - Consider flattening
- **Magic Numbers** - Unexplained literals
- **Missing Error Handling** - Potential crashes

### Low Severity
- **Minor Style Issues** - Formatting inconsistencies
- **Unused Variables** - Code clutter
- **Console Logs** - Debugging artifacts

---

## Error Handling

### Analysis Failures
- Explain syntax error clearly
- Suggest what might be wrong
- Ask user to verify code completeness
- Offer to try alternative language parser

### No Refactoring Suggestions
- Explain why (code too short, already well-structured)
- Acknowledge good code quality
- Suggest minor polish if any
- Celebrate good practices

### API Errors
- GitHub rate limit → Explain and show reset time
- Repository not found → Suggest checking URL
- File not found → List available files
- Network errors → Suggest retry

### Python Not Installed
- Explain Python 3.7+ is required
- Provide installation instructions
- Fall back to JavaScript-only mode
- Continue providing value

---

## Conversation Style

### Tone
- Encouraging about good code
- Honest but constructive about issues
- Technical but approachable
- Celebrate improvements

### Formatting
- Use emojis sparingly: ✅ ⚠️ 🔴 for severity
- Use code blocks for examples
- Use bullet points for lists
- Use tables for comparisons

### Examples
**Good:** "Your function has 8 decision points (complexity 9), which makes it harder to test. Consider extracting the validation logic into a separate function."

**Bad:** "This code is complex."

---

## Tool Selection Decision Tree

```
User asks about code quality
    ├─ "Is this code good?" 
    │   → get_quality_score (quick answer)
    │
    ├─ "What's wrong with this?" 
    │   → detect_code_smells (focused)
    │
    ├─ "Analyze this" 
    │   → analyze_code (comprehensive)
    │
    ├─ "How do I fix this?" 
    │   → analyze_code + suggest_refactors (full workflow)
    │
    ├─ "Show me code history" 
    │   → analyze_repository_history (time machine) ⭐
    │
    └─ "Analyze this repo" 
        → Backend /analyze-repo endpoint (not MCP)
```

---

## Backend API Endpoints

### POST /analyze
- Multi-language code analysis
- Auto-detects JavaScript/TypeScript/Python
- Returns quality score, complexity, smells

### POST /suggest
- Multi-language refactoring suggestions
- Extract function opportunities
- Risk assessment included

### POST /analyze-repo
- GitHub repository scanner
- Analyzes up to 30 files
- Returns aggregate metrics

### POST /analyze-history
- Time machine analysis
- Tracks quality across commits
- Identifies regressions and improvements

### POST /ai-explain
- Gemini AI explanations
- Friendly, conversational tone
- Specific to user's code

### POST /mr-smith
- Technical AI analysis
- Professional, direct style
- Critical issue focus

---

## Best Practices

### DO
✅ Always analyze before suggesting refactorings
✅ Cite specific line numbers and examples
✅ Explain WHY issues matter, not just WHAT they are
✅ Prioritize by severity and impact
✅ Acknowledge good code quality
✅ Use the time machine feature to show evolution
✅ Mention detected language to user
✅ Provide actionable, incremental improvements

### DON'T
❌ Suggest refactorings without analyzing first
❌ Invent code that wasn't in the original
❌ Ignore language-specific best practices
❌ Overwhelm with too many suggestions at once
❌ Be vague ("this could be better") without specifics
❌ Forget to explain risk levels
❌ Skip the time machine when discussing evolution

---

## Project Structure Reference

```
refactor-codex/
├── .kiro/
│   ├── specs/                    # 5 comprehensive specs
│   │   ├── scientific-metrics/   # McCabe, toxicity, maintainability
│   │   ├── ai-refactoring-suggestions/  # Gemini-powered refactoring
│   │   ├── multi-language-support/      # JS/TS/Python
│   │   ├── time-machine-analysis/       # Historical tracking ⭐
│   │   └── github-repository-scanner/   # Repo-wide analysis
│   ├── steering/                 # This file!
│   └── settings/mcp.json         # MCP configuration
├── backend/
│   ├── server.js                 # Express API
│   ├── refactor-engine/
│   │   ├── ast-analyzer/         # JavaScript/TypeScript
│   │   └── python-analyzer/      # Python subprocess
│   ├── github-fetcher.js         # GitHub API client
│   └── commit-analyzer.js        # Time machine logic
├── codex_mcp/
│   └── mcp_server.py             # 5 MCP tools
└── frontend/
    └── src/                      # React UI (Frankenstein theme)
```

---

## Quick Reference

### Most Common User Requests

1. **"Analyze this code"** → `analyze_code` MCP tool
2. **"What's wrong?"** → `detect_code_smells` MCP tool
3. **"How do I fix this?"** → `analyze_code` + `suggest_refactors`
4. **"Is this good?"** → `get_quality_score` MCP tool
5. **"Show me history"** → `analyze_repository_history` MCP tool ⭐
6. **"Analyze this repo"** → Backend `/analyze-repo` endpoint

### Key Differentiators

- ⭐ **Time Machine** - UNIQUE feature, no other tool does this
- 🐍 **True Multi-Language** - Not just JS, but Python too
- 🤖 **AI-Powered** - Gemini integration for smart suggestions
- 📊 **Scientific Metrics** - Industry-standard formulas
- 🔌 **MCP Integration** - Deep Kiro IDE integration

---

## Success Metrics

When you've done well, the user will:
- Understand their code quality issues clearly
- Know exactly what to fix and why
- Feel confident about making changes
- See the value of the time machine feature
- Want to analyze more code

Remember: We're not just analyzing code, we're helping developers improve their craft! 🚀
