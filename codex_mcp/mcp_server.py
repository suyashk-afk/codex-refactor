import asyncio
import requests
import json
from typing import Any, List

# Updated import paths for MCP
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

server = Server(
    name="codex-refactor-mcp",
    version="1.0.0",
)

def call_backend(path, body):
    url = f"http://localhost:4000{path}"
    try:
        res = requests.post(url, json=body, timeout=30)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

@server.list_tools()
async def list_tools() -> List[Tool]:
    return [
        Tool(
            name="analyze_code",
            description="Analyzes JavaScript/TypeScript code for quality issues, complexity, code smells, and provides a quality score (0-100). Returns detailed metrics including function-level analysis with nesting depth, cyclomatic complexity, and specific code smell detection.",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string", 
                        "description": "The JavaScript or TypeScript code to analyze"
                    },
                    "filename": {
                        "type": "string", 
                        "description": "Optional filename for context",
                        "default": "file.js"
                    },
                },
                "required": ["code"],
            },
        ),
        Tool(
            name="suggest_refactors",
            description="Suggests refactoring opportunities in JavaScript/TypeScript code, specifically extract function refactorings. Returns actionable suggestions with before/after code, extracted function code, parameters, return values, and risk assessment.",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string", 
                        "description": "The JavaScript or TypeScript code to analyze for refactoring"
                    },
                    "filename": {
                        "type": "string", 
                        "description": "Optional filename for context",
                        "default": "file.js"
                    },
                },
                "required": ["code"],
            },
        ),
        Tool(
            name="detect_code_smells",
            description="Detects specific code smells and anti-patterns in JavaScript/TypeScript code. Returns categorized issues including long functions, deep nesting, magic numbers, callback hell, missing error handling, and high complexity with severity levels and remediation suggestions.",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "The JavaScript or TypeScript code to check for code smells"
                    }
                },
                "required": ["code"]
            }
        ),
        Tool(
            name="get_quality_score",
            description="Calculates an overall code quality score (0-100) for JavaScript/TypeScript code. Returns the score along with a health status (healthy, needs_improvement, or critical) and summary statistics about functions and issues found.",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "The JavaScript or TypeScript code to score"
                    }
                },
                "required": ["code"]
            }
        ),
        Tool(
            name="analyze_repository_history",
            description="🏆 TIME MACHINE: Analyzes code quality evolution across commit history for any GitHub repository file. Shows quality trends over time, identifies regressions, finds best/worst commits, and tracks your coding journey. This is UNIQUE - no other tool shows historical code quality like this.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_url": {
                        "type": "string",
                        "description": "GitHub repository URL (e.g., 'https://github.com/lodash/lodash')"
                    },
                    "file_path": {
                        "type": "string",
                        "description": "Path to file in repository (e.g., 'src/array.js')"
                    },
                    "max_commits": {
                        "type": "number",
                        "description": "Maximum number of commits to analyze (default: 10, max: 20)",
                        "default": 10
                    }
                },
                "required": ["repo_url", "file_path"]
            }
        )
    ]

def format_analysis_result(result):
    """Format analysis result into readable text"""
    if not result.get("ok"):
        return f"Error: {result.get('error', 'Unknown error')}"
    
    analysis = result.get("analysis", {})
    
    output = "## Code Analysis Results\n\n"
    output += f"**Quality Score:** {analysis.get('qualityScore', 'N/A')}/100\n"
    output += f"**Status:** {analysis.get('summary', {}).get('healthStatus', 'unknown')}\n\n"
    
    output += "### Summary\n"
    output += f"- Functions: {analysis.get('summary', {}).get('totalFunctions', 0)}\n"
    output += f"- Average Length: {analysis.get('summary', {}).get('averageLength', 0)} lines\n"
    output += f"- Total Code Smells: {analysis.get('totalSmells', 0)}\n\n"
    
    if analysis.get('smellsByType'):
        output += "### Code Smells by Type\n"
        for smell_type, count in analysis.get('smellsByType', {}).items():
            output += f"- {smell_type.replace('_', ' ').title()}: {count}\n"
        output += "\n"
    
    if analysis.get('functions'):
        output += "### Function Details\n"
        for fn in analysis.get('functions', []):
            output += f"\n**{fn['name']}** ({fn['length']} lines)\n"
            output += f"- Nesting Depth: {fn['nesting']}\n"
            output += f"- Cyclomatic Complexity: {fn['branchCount']}\n"
            
            if fn.get('smells'):
                output += "- Issues:\n"
                for smell in fn['smells']:
                    output += f"  - [{smell['severity'].upper()}] {smell['type'].replace('_', ' ')}: {smell['message']}\n"
                    output += f"    💡 {smell['suggestion']}\n"
    
    return output

def format_suggestions_result(result):
    """Format refactoring suggestions into readable text"""
    if not result.get("ok"):
        return f"Error: {result.get('error', 'Unknown error')}"
    
    suggestions = result.get("suggestions", [])
    
    if not suggestions:
        return "No refactoring suggestions found. The code is either too short or already well-structured."
    
    output = f"## Refactoring Suggestions\n\nFound {len(suggestions)} suggestion(s):\n\n"
    
    for i, sug in enumerate(suggestions, 1):
        output += f"### {i}. {sug['description']}\n"
        output += f"**Function:** {sug['function']}\n"
        output += f"**Extracted Name:** {sug['extractedName']}\n"
        output += f"**Parameters:** {', '.join(sug.get('parameters', [])) or 'none'}\n"
        output += f"**Returns:** {', '.join(sug.get('returns', [])) or 'none'}\n"
        output += f"**Lines Extracted:** {sug.get('linesExtracted', 'N/A')}\n"
        output += f"**Risk Level:** {sug['risk']}\n"
        output += f"**Benefit:** {sug['benefit']}\n\n"
        output += f"**Extracted Function:**\n```javascript\n{sug['extractedCode']}\n```\n\n"
    
    return output

def format_code_smells(result):
    """Format code smells into readable text"""
    if not result.get("ok"):
        return f"Error: {result.get('error', 'Unknown error')}"
    
    analysis = result.get("analysis", {})
    total_smells = analysis.get('totalSmells', 0)
    
    if total_smells == 0:
        return "✨ No code smells detected! Your code looks clean."
    
    output = f"## Code Smells Detected: {total_smells}\n\n"
    
    for fn in analysis.get('functions', []):
        if fn.get('smells'):
            output += f"### In function '{fn['name']}':\n"
            for smell in fn['smells']:
                severity_emoji = "🔴" if smell['severity'] == 'high' else "🟡"
                output += f"{severity_emoji} **{smell['type'].replace('_', ' ').title()}**\n"
                output += f"   - {smell['message']}\n"
                output += f"   - 💡 Suggestion: {smell['suggestion']}\n\n"
    
    return output

def format_quality_score(result):
    """Format quality score into readable text"""
    if not result.get("ok"):
        return f"Error: {result.get('error', 'Unknown error')}"
    
    analysis = result.get("analysis", {})
    score = analysis.get('qualityScore', 0)
    status = analysis.get('summary', {}).get('healthStatus', 'unknown')
    
    status_emoji = "✅" if status == "healthy" else "⚠️" if status == "needs_improvement" else "🔴"
    
    output = f"## Code Quality Report\n\n"
    output += f"{status_emoji} **Overall Score: {score}/100**\n"
    output += f"**Health Status: {status.upper()}**\n\n"
    
    output += "### What this means:\n"
    if score > 80:
        output += "✨ Excellent! Your code is well-structured and maintainable.\n"
    elif score > 50:
        output += "⚠️ Moderate. There are some issues that should be addressed.\n"
    else:
        output += "🔴 Critical. This code needs significant refactoring.\n"
    
    output += f"\n### Key Metrics:\n"
    output += f"- Functions: {analysis.get('summary', {}).get('totalFunctions', 0)}\n"
    output += f"- Average Function Length: {analysis.get('summary', {}).get('averageLength', 0)} lines\n"
    output += f"- Total Issues: {analysis.get('totalSmells', 0)}\n"
    
    return output

def format_repository_history(result):
    """Format repository history analysis into readable text"""
    if not result.get("ok"):
        error_msg = result.get('error', 'Unknown error')
        suggestions = result.get('suggestions', [])
        hint = result.get('hint', '')
        
        output = f"❌ Error: {error_msg}\n\n"
        
        if suggestions:
            output += "💡 **Try one of these files instead:**\n"
            for file in suggestions[:5]:
                output += f"   - {file}\n"
        elif hint:
            output += f"💡 {hint}\n"
        
        return output
    
    owner = result.get('owner', '')
    repo = result.get('repo', '')
    file_path = result.get('filePath', '')
    insights = result.get('insights', {})
    timeline = result.get('timeline', [])
    
    output = f"# ⏰ Code Quality Time Machine\n\n"
    output += f"**Repository:** {owner}/{repo}\n"
    output += f"**File:** {file_path}\n"
    output += f"**Commits Analyzed:** {insights.get('totalCommits', 0)}\n\n"
    
    # Overall trend
    trend = insights.get('overallTrend', 'stable')
    change = insights.get('overallChange', 0)
    
    trend_emoji = "📈" if trend == "improving" else "📉" if trend == "declining" else "➡️"
    output += f"## {trend_emoji} Overall Trend: {trend.upper()}\n"
    output += f"Quality changed by **{'+' if change > 0 else ''}{change} points** over time\n\n"
    
    # Key insights
    output += f"### 📊 Key Metrics\n"
    output += f"- **Average Quality Score:** {insights.get('avgScore', 0)}/100\n"
    output += f"- **Best Score:** {insights.get('bestScore', 0)}/100\n"
    output += f"- **Worst Score:** {insights.get('worstScore', 0)}/100\n\n"
    
    # Best commit
    if insights.get('biggestImprovement'):
        improvement = insights['biggestImprovement']
        output += f"### ✨ Best Commit (Biggest Improvement)\n"
        output += f"**Commit:** {improvement['commit']['sha'][:8]}\n"
        output += f"**Gain:** +{improvement['gain']} points\n"
        output += f"**Message:** {improvement['commit']['message']}\n"
        output += f"**Author:** {improvement['commit']['author']}\n\n"
    
    # Worst commit
    if insights.get('biggestRegression'):
        regression = insights['biggestRegression']
        output += f"### 🔥 Worst Commit (Biggest Regression)\n"
        output += f"**Commit:** {regression['commit']['sha'][:8]}\n"
        output += f"**Drop:** -{regression['drop']} points\n"
        output += f"**Message:** {regression['commit']['message']}\n"
        output += f"**Author:** {regression['commit']['author']}\n\n"
    
    # Regressions alert
    if insights.get('regressions') and len(insights['regressions']) > 0:
        output += f"### ⚠️ Quality Regressions Detected\n"
        output += f"Found **{len(insights['regressions'])}** commit(s) that significantly decreased quality:\n\n"
        for reg in insights['regressions']:
            output += f"- **{reg['commit'][:8]}**: \"{reg['message']}\" (dropped {reg['drop']} points)\n"
        output += "\n"
    
    # Timeline
    output += f"### 📈 Quality Score Timeline\n\n"
    output += "```\n"
    output += "Commit      | Score | Change | Date       | Message\n"
    output += "------------|-------|--------|------------|------------------\n"
    
    for i, point in enumerate(timeline):
        prev_score = timeline[i + 1]['score'] if i < len(timeline) - 1 else point['score']
        change = point['score'] - prev_score
        change_str = f"+{change}" if change > 0 else str(change) if change < 0 else " 0"
        
        score_indicator = "🟢" if point['score'] > 70 else "🟡" if point['score'] > 50 else "🔴"
        
        output += f"{point['sha'][:8]} | {score_indicator} {point['score']:3d} | {change_str:>5} | {point['date'][:10]} | {point['message'][:30]}\n"
    
    output += "```\n\n"
    
    # Recommendations
    output += f"### 💡 Recommendations\n"
    if trend == "declining":
        output += "- ⚠️ Code quality is declining. Review recent commits for issues.\n"
        output += "- Consider refactoring to address accumulated technical debt.\n"
    elif trend == "improving":
        output += "- ✅ Great job! Code quality is improving over time.\n"
        output += "- Keep up the good practices you've been following.\n"
    else:
        output += "- ➡️ Code quality is stable. Consider proactive refactoring.\n"
    
    if insights.get('avgScore', 0) < 70:
        output += f"- 🔧 Average score is {insights.get('avgScore', 0)}/100. Focus on reducing code smells.\n"
    
    return output

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> List[TextContent]:
    if name == "analyze_repository_history":
        repo_url = arguments.get("repo_url")
        file_path = arguments.get("file_path")
        max_commits = arguments.get("max_commits", 10)
        
        if not repo_url or not file_path:
            return [TextContent(type="text", text="Error: 'repo_url' and 'file_path' are required")]
        
        # Limit max_commits to prevent abuse
        max_commits = min(max_commits, 20)
        
        resp = call_backend("/analyze-history", {
            "repoUrl": repo_url,
            "filePath": file_path,
            "maxCommits": max_commits
        })
        
        formatted = format_repository_history(resp)
        return [TextContent(type="text", text=formatted)]
    
    # Original tools
    code = arguments.get("code")
    filename = arguments.get("filename", "file.js")
    
    if not code:
        return [TextContent(type="text", text="Error: 'code' is required")]
    
    if name == "analyze_code":
        resp = call_backend("/analyze", {"code": code, "filename": filename})
        formatted = format_analysis_result(resp)
        return [TextContent(type="text", text=formatted)]
    
    elif name == "suggest_refactors":
        resp = call_backend("/suggest", {"code": code, "filename": filename})
        formatted = format_suggestions_result(resp)
        return [TextContent(type="text", text=formatted)]
    
    elif name == "detect_code_smells":
        resp = call_backend("/analyze", {"code": code, "filename": filename})
        formatted = format_code_smells(resp)
        return [TextContent(type="text", text=formatted)]
    
    elif name == "get_quality_score":
        resp = call_backend("/analyze", {"code": code, "filename": filename})
        formatted = format_quality_score(resp)
        return [TextContent(type="text", text=formatted)]
    
    else:
        return [TextContent(type="text", text=f"Error: Unknown tool '{name}'")]

async def main():
    print("Codex MCP server running...", flush=True)
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )

if __name__ == "__main__":
    asyncio.run(main())