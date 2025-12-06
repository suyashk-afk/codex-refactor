# 🔌 How to Show MCP Implementation in Video

## 🎯 The Goal
Show that you built **5 custom MCP tools** that let Kiro analyze code directly from the IDE - no copy-paste needed.

---

## 📹 OPTION 1: Quick Visual (Recommended - 10 seconds)

### What to Show:
1. **MCP Config File** (3 seconds)
2. **MCP Tools List** (3 seconds)  
3. **Kiro Chat Using Tool** (4 seconds)

### How to Record:

**Shot 1: MCP Config (3 sec)**
```
1. Open `.kiro/settings/mcp.json` in your editor
2. Show this section clearly:
```
```json
{
  "mcpServers": {
    "refactor-codex": {
      "command": "python",
      "args": ["-m", "codex_mcp.mcp_server"],
      "cwd": "${workspaceFolder}/codex_mcp"
    }
  }
}
```

**Voiceover:** "I created 5 custom MCP tools..."

---

**Shot 2: MCP Server Code (3 sec)**
```
1. Open `codex_mcp/mcp_server.py`
2. Scroll to show the 5 tool definitions (lines 20-90)
3. Highlight these tool names:
   - analyze_code
   - suggest_refactors
   - detect_code_smells
   - get_quality_score
   - analyze_repository_history ⭐
```

**Voiceover:** "...that connect directly to Kiro IDE..."

---

**Shot 3: Kiro Using the Tool (4 sec)**
```
1. Open Kiro chat
2. Type: "Analyze this code for quality issues"
3. Paste a small code snippet
4. Show Kiro's response with formatted analysis
```

**Voiceover:** "...so Kiro can analyze code without leaving the IDE."

---

## 📹 OPTION 2: Live Demo (Better - 15 seconds)

### What to Show:
Actually use Kiro to analyze code via MCP

### How to Record:

**Step 1: Open Kiro Chat (2 sec)**
- Show Kiro IDE with your project open
- Click on Kiro chat panel

**Step 2: Ask Kiro to Analyze (3 sec)**
- Type in chat: "Analyze this code and tell me the quality score"
- Paste this simple code:
```javascript
function test(a, b, c, d, e) {
  if (a) {
    if (b) {
      if (c) {
        return a + b + c;
      }
    }
  }
}
```

**Step 3: Show MCP Tool Being Called (5 sec)**
- Kiro responds with formatted analysis
- Show it detected: Quality 45, Complexity 5, Deep nesting
- Highlight that this came from YOUR MCP tool

**Step 4: Show Another Tool (5 sec)**
- Type: "Show me the time machine analysis for lodash chunk.js"
- Show Kiro calling your `analyze_repository_history` tool
- Show formatted results

**Voiceover:**
"Watch this. I ask Kiro to analyze code. It calls my custom MCP tool. Gets the results. No copy-paste. All integrated."

---

## 📹 OPTION 3: Split Screen (Most Impressive - 20 seconds)

### What to Show:
Side-by-side: Kiro chat + MCP server logs

### How to Record:

**Left Side: Kiro Chat**
- Show the conversation with Kiro
- User asks for analysis
- Kiro responds with results

**Right Side: Terminal/Logs**
- Show MCP server running
- Show logs of tool being called
- Show JSON-RPC communication

**Voiceover:**
"On the left, Kiro chat. On the right, my MCP server. Watch as Kiro calls my custom tools in real-time. This is the Model Context Protocol in action."

---

## 🎬 RECOMMENDED APPROACH FOR YOUR VIDEO

### Use Option 1 (Quick Visual) - Here's Why:
- **Fast** - Only 10 seconds
- **Clear** - Shows the 3 key parts (config, tools, usage)
- **Professional** - Looks polished
- **Fits your 3-minute limit**

### Exact Recording Steps:

**1. Record MCP Config (3 sec)**
```bash
# Open in VS Code or your editor
code .kiro/settings/mcp.json
```
- Zoom in so text is readable
- Highlight the "refactor-codex" section
- Hold for 3 seconds

**2. Record MCP Tools List (3 sec)**
```bash
# Open the MCP server file
code codex_mcp/mcp_server.py
```
- Scroll to the `@server.list_tools()` function (around line 20)
- Show the 5 tool names clearly
- Hold for 3 seconds

**3. Record Kiro Chat (4 sec)**
- Open Kiro
- Have a pre-typed message ready: "Analyze this code"
- Paste the test code (from VIDEO_DEMO_DATA.md Example 1)
- Show Kiro's formatted response
- Hold for 4 seconds

---

## 📝 EXACT VOICEOVER FOR MCP SECTION (10 seconds)

**Option A (Technical):**
"I built this WITH Kiro using spec-driven development. And I created 5 custom MCP tools so Kiro can analyze code directly from the IDE. No copy-paste needed."

**Option B (Simple):**
"I created 5 custom tools that connect Kiro to my analysis engine. Now Kiro can analyze code without leaving the IDE."

**Option C (Impressive):**
"Five custom MCP tools. Kiro calls them directly. Analyze code, suggest refactors, track history - all from the IDE. This is deep integration."

---

## 🎯 WHAT TO HIGHLIGHT

### The 5 Tools (Show on Screen as Text Overlay):
```
1. analyze_code - Full quality analysis
2. suggest_refactors - AI-powered suggestions
3. detect_code_smells - Issue detection
4. get_quality_score - Quick health check
5. analyze_repository_history ⭐ - Time machine!
```

### Key Points to Emphasize:
- ✅ "5 custom tools"
- ✅ "Direct integration with Kiro"
- ✅ "No copy-paste needed"
- ✅ "Built using MCP protocol"

---

## 📸 SCREENSHOTS TO TAKE

### Screenshot 1: MCP Config
**File:** `.kiro/settings/mcp.json`
**What to show:**
```json
{
  "mcpServers": {
    "refactor-codex": {
      "command": "python",
      "args": ["-m", "codex_mcp.mcp_server"],
      "cwd": "${workspaceFolder}/codex_mcp",
      "env": {
        "PYTHONPATH": "${workspaceFolder}"
      }
    }
  }
}
```
**Annotation:** Add arrow pointing to "refactor-codex" with text "Custom MCP Server"

---

### Screenshot 2: MCP Tools Code
**File:** `codex_mcp/mcp_server.py`
**What to show:** Lines 20-90 (the tool definitions)
**Annotation:** Highlight the 5 tool names with colored boxes

---

### Screenshot 3: Kiro Chat
**What to show:** Kiro analyzing code via MCP
**Example conversation:**
```
You: Analyze this code for quality issues

[code snippet]

Kiro: ## Code Analysis Results

**Quality Score:** 42/100
**Status:** critical

### Summary
- Functions: 1
- Average Length: 15 lines
- Total Code Smells: 8

[... rest of formatted output ...]
```
**Annotation:** Add text "Powered by Custom MCP Tool"

---

## 🎬 ALTERNATIVE: Show MCP in Action (If You Have Time)

### Record a 30-second "bonus" clip showing:

1. **Open Kiro** (2 sec)
2. **Type:** "What's the quality score of this code?" (3 sec)
3. **Paste code** (2 sec)
4. **Kiro responds** with score (5 sec)
5. **Type:** "Now suggest refactorings" (3 sec)
6. **Kiro responds** with suggestions (5 sec)
7. **Type:** "Show me the time machine for lodash chunk.js" (5 sec)
8. **Kiro responds** with commit history (5 sec)

**Voiceover:**
"Three questions. Three MCP tools. All integrated. This is how Kiro and Refactor Codex work together."

---

## 💡 PRO TIP: The "Proof" Shot

### Show This to Prove MCP Integration:

**Split Screen:**
- **Left:** Kiro chat asking for analysis
- **Right:** Terminal showing MCP server logs

**Terminal shows:**
```
Codex MCP server running...
[INFO] Tool called: analyze_code
[INFO] Analyzing JavaScript code...
[INFO] Quality score: 42/100
[INFO] Returning results...
```

**This proves:**
- Your MCP server is actually running
- Kiro is actually calling your tools
- It's real integration, not fake

---

## 🎯 FINAL RECOMMENDATION

### For Your 3-Minute Video:

**Use Option 1 (Quick Visual) - 10 seconds:**
1. Show MCP config (3 sec)
2. Show 5 tool names (3 sec)
3. Show Kiro using one tool (4 sec)

**Voiceover:**
"I created 5 custom MCP tools so Kiro can analyze code directly from the IDE. No copy-paste needed."

**Why this works:**
- ✅ Fast (fits in 3 minutes)
- ✅ Clear (shows the integration)
- ✅ Impressive (5 custom tools!)
- ✅ Easy to record (just screenshots)

---

## 📋 RECORDING CHECKLIST

Before recording MCP section:

- [ ] `.kiro/settings/mcp.json` file is clean and formatted
- [ ] `codex_mcp/mcp_server.py` is open and scrolled to tools section
- [ ] Kiro IDE is open with your project
- [ ] Test code is ready to paste
- [ ] MCP server is running (if showing live demo)
- [ ] Terminal is visible (if showing logs)
- [ ] Text is large enough to read in video

---

## 🎬 EXACT TIMING IN YOUR VIDEO

**2:00 - 2:10 (10 seconds):**

**[Screen: Show MCP config file]**
"I created 5 custom MCP tools..."

**[Screen: Show tool names list]**
"...that connect directly to Kiro..."

**[Screen: Show Kiro chat using tool]**
"...so it can analyze code without leaving the IDE."

**[Quick cut to next section]**

---

**That's it! Simple, clear, impressive. Good luck! 🚀**
