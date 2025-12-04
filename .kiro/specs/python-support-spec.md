# Python Support Specification

## Overview
Extend the code analyzer to support Python in addition to JavaScript/TypeScript.

## Requirements

### Language Detection
- Auto-detect Python vs JavaScript based on:
  - File extension (.py vs .js)
  - Code patterns (def, import, class for Python)
  
### Python Analysis
- Use Python's built-in `ast` module
- Detect same code smells as JavaScript:
  - Long functions
  - Deep nesting
  - High complexity
  - Too many parameters
  - Magic numbers
  
### Architecture
- Create standalone Python script: `python-analyzer/analyzer.py`
- Node.js backend spawns Python process
- Communication via stdin/stdout with JSON

### Refactoring Support
- Extract function suggestions for Python
- Detect external variables
- Generate meaningful function names
- Build patched code with extracted functions