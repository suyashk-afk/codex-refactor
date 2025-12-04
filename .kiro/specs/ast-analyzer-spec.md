# AST Analyzer Specification

## Overview
Build a JavaScript/TypeScript AST analyzer that detects code smells and calculates quality metrics.

## Requirements

### Core Functionality
- Parse JavaScript/TypeScript using Babel parser
- Traverse AST to detect:
  - Long functions (>20 lines)
  - Deep nesting (>3 levels)
  - High cyclomatic complexity (>10)
  - Magic numbers
  - Missing error handling
  
### Metrics to Calculate
- Function length
- Nesting depth
- Branch count (complexity)
- Overall quality score (0-100)

### Output Format
Return JSON with:
- Quality score
- List of functions analyzed
- Code smells by type
- Suggestions for improvement

## Implementation Notes
- Use @babel/parser for AST generation
- Use @babel/traverse for AST walking
- Implement visitor pattern for smell detection