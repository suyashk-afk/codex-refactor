# Design Document: Multi-Language Code Analysis Support

## Overview

The Multi-Language Analysis Engine extends code quality analysis to support JavaScript, TypeScript, and Python through a unified interface. The system automatically detects the programming language, routes analysis to the appropriate engine (Babel for JS/TS, Python AST for Python), and provides consistent metrics across all languages. This enables polyglot development teams to maintain consistent quality standards.

The design emphasizes seamless integration between Node.js and Python runtimes while maintaining a consistent API and metric format.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  (Unified interface for all languages)                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            Language Router                              │
│  (Detects language and routes to appropriate engine)   │
└────┬───────────────────────────────────┬────────────────┘
     │                                   │
┌────▼─────────────────┐    ┌───────────▼────────────────┐
│  JavaScript/TypeScript│    │   Python Analysis Engine  │
│    Analysis Engine    │    │   (Python subprocess)     │
│   (Babel Parser)      │    │                           │
└───────────────────────┘    └───────────────────────────┘
```

### Component Responsibilities

1. **API Layer**: Provides unified interface for code analysis
2. **Language Router**: Detects language and routes to appropriate engine
3. **JS/TS Analysis Engine**: Analyzes JavaScript/TypeScript using Babel
4. **Python Analysis Engine**: Analyzes Python using Python AST module
5. **Process Bridge**: Manages Node.js ↔ Python communication
6. **Metrics Normalizer**: Ensures consistent metric format across languages

## Components and Interfaces

### LanguageRouter

**Purpose**: Detects language and routes to appropriate analysis engine

**Interface**:
```javascript
class LanguageRouter {
  /**
   * Detects the programming language
   * @param {string} code - Source code
   * @param {string} filename - Optional filename with extension
   * @returns {string} - 'javascript' | 'typescript' | 'python'
   */
  detectLanguage(code, filename = '')
  
  /**
   * Routes analysis to appropriate engine
   * @param {string} code - Source code
   * @param {string} language - Detected language
   * @returns {Promise<AnalysisResult>}
   */
  async routeAnalysis(code, language)
  
  /**
   * Analyzes code patterns to infer language
   * @param {string} code - Source code
   * @returns {string} - Detected language
   */
  analyzeCodePatterns(code)
}
```

### JavaScriptAnalysisEngine

**Purpose**: Analyzes JavaScript/TypeScript code using Babel

**Interface**:
```javascript
class JavaScriptAnalysisEngine {
  /**
   * Analyzes JavaScript/TypeScript code
   * @param {string} code - Source code
   * @param {boolean} isTypeScript - Whether code is TypeScript
   * @returns {Promise<AnalysisResult>}
   */
  async analyze(code, isTypeScript = false)
  
  /**
   * Parses code into AST
   * @param {string} code - Source code
   * @param {boolean} isTypeScript - Whether to use TS preset
   * @returns {ASTNode}
   */
  parse(code, isTypeScript)
  
  /**
   * Detects JavaScript-specific code smells
   * @param {ASTNode} ast - Abstract syntax tree
   * @returns {Array<CodeSmell>}
   */
  detectJavaScriptSmells(ast)
}
```

### PythonAnalysisEngine

**Purpose**: Analyzes Python code using Python AST module

**Interface**:
```javascript
class PythonAnalysisEngine {
  /**
   * Analyzes Python code via subprocess
   * @param {string} code - Python source code
   * @returns {Promise<AnalysisResult>}
   */
  async analyze(code)
  
  /**
   * Spawns Python process for analysis
   * @param {string} code - Python source code
   * @returns {Promise<ChildProcess>}
   */
  async spawnPythonProcess(code)
  
  /**
   * Sends code to Python process via stdin
   * @param {ChildProcess} process - Python subprocess
   * @param {string} code - Code to analyze
   * @returns {Promise<void>}
   */
  async sendCodeToProcess(process, code)
  
  /**
   * Reads analysis results from stdout
   * @param {ChildProcess} process - Python subprocess
   * @returns {Promise<AnalysisResult>}
   */
  async readResultsFromProcess(process)
}
```

### ProcessBridge

**Purpose**: Manages Node.js to Python communication

**Interface**:
```javascript
class ProcessBridge {
  /**
   * Spawns a Python child process
   * @param {string} scriptPath - Path to Python script
   * @returns {ChildProcess}
   */
  spawnPythonProcess(scriptPath)
  
  /**
   * Sends JSON data to Python process
   * @param {ChildProcess} process - Python subprocess
   * @param {Object} data - Data to send
   * @returns {Promise<void>}
   */
  async sendJSON(process, data)
  
  /**
   * Receives JSON data from Python process
   * @param {ChildProcess} process - Python subprocess
   * @returns {Promise<Object>}
   */
  async receiveJSON(process)
  
  /**
   * Handles process errors
   * @param {ChildProcess} process - Python subprocess
   * @param {Function} errorHandler - Error callback
   */
  handleErrors(process, errorHandler)
  
  /**
   * Cleans up process resources
   * @param {ChildProcess} process - Python subprocess
   */
  cleanup(process)
}
```

### ProcessPool

**Purpose**: Manages pool of Python processes for performance

**Interface**:
```javascript
class ProcessPool {
  /**
   * Gets an available Python process from pool
   * @returns {Promise<ChildProcess>}
   */
  async getProcess()
  
  /**
   * Returns process to pool
   * @param {ChildProcess} process - Python subprocess
   */
  releaseProcess(process)
  
  /**
   * Initializes process pool
   * @param {number} maxProcesses - Maximum concurrent processes
   */
  initialize(maxProcesses = 5)
  
  /**
   * Shuts down all processes in pool
   */
  shutdown()
}
```

### MetricsNormalizer

**Purpose**: Ensures consistent metric format across languages

**Interface**:
```javascript
class MetricsNormalizer {
  /**
   * Normalizes metrics to standard format
   * @param {Object} rawMetrics - Language-specific metrics
   * @param {string} language - Source language
   * @returns {AnalysisResult}
   */
  normalize(rawMetrics, language)
  
  /**
   * Applies language-specific adjustments
   * @param {AnalysisResult} metrics - Normalized metrics
   * @param {string} language - Source language
   * @returns {AnalysisResult}
   */
  applyLanguageAdjustments(metrics, language)
}
```

## Data Models

### AnalysisResult (Unified Format)

```javascript
{
  language: string,            // 'javascript' | 'typescript' | 'python'
  qualityScore: number,        // 0-100 overall quality
  complexity: {
    average: number,
    max: number,
    functions: Array<FunctionMetrics>
  },
  toxicity: {
    score: number,
    smells: Array<CodeSmell>
  },
  maintainability: {
    index: number,
    classification: string
  },
  languageSpecificSmells: Array<CodeSmell>,
  analysisTime: number,        // Milliseconds
  engineVersion: string
}
```

### LanguageDetectionResult

```javascript
{
  language: string,            // Detected language
  confidence: number,          // 0-100 confidence score
  indicators: Array<{
    pattern: string,
    weight: number
  }>,
  fileExtension: string        // If provided
}
```

### PythonProcessRequest

```javascript
{
  action: 'analyze',
  code: string,
  options: {
    includeSmells: boolean,
    includeComplexity: boolean,
    includeMaintainability: boolean
  }
}
```

### PythonProcessResponse

```javascript
{
  success: boolean,
  result: AnalysisResult,
  error: {
    type: string,
    message: string,
    line: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: JavaScript Extension Detection
*For any* file with extension .js or .jsx, it should be classified as JavaScript
**Validates: Requirements 1.1**

### Property 2: TypeScript Extension Detection
*For any* file with extension .ts or .tsx, it should be classified as TypeScript
**Validates: Requirements 1.2**

### Property 3: Python Extension Detection
*For any* file with extension .py, it should be classified as Python
**Validates: Requirements 1.3**

### Property 4: Consistent Complexity Formula
*For any* code in any supported language, the complexity should be calculated using the McCabe formula M = decision_points + 1
**Validates: Requirements 5.1**

### Property 5: Consistent Quality Scale
*For any* code in any supported language, the quality score should be on a 0-100 scale
**Validates: Requirements 5.3**

### Property 6: Consistent Thresholds
*For any* function in any supported language, the same thresholds should apply (>20 lines for long functions, >3 levels for deep nesting)
**Validates: Requirements 5.2**

### Property 7: Unified JSON Format
*For any* analysis result regardless of language, the JSON structure should match the AnalysisResult schema
**Validates: Requirements 5.4**

### Property 8: Language Indication
*For any* analysis result, it should indicate which language was analyzed
**Validates: Requirements 5.5**

### Property 9: JavaScript Performance
*For any* JavaScript file with up to 1000 lines, analysis should complete within 3 seconds
**Validates: Requirements 8.1**

### Property 10: Python Performance
*For any* Python file with up to 1000 lines, analysis should complete within 5 seconds
**Validates: Requirements 8.2**

### Property 11: Process Pool Limit
*For any* concurrent analysis requests, at most 5 Python processes should be spawned
**Validates: Requirements 8.4**

### Property 12: Feature Parity
*For any* feature supported for JavaScript, the same feature should be supported for Python
**Validates: Requirements 9.1, 9.2**

## Error Handling

### Python Not Installed
- **Strategy**: Check for Python availability on startup
- **Response**: Return error with installation instructions
- **User Impact**: Clear guidance on system requirements

### Python Process Crash
- **Strategy**: Catch process exit events and errors
- **Response**: Log error, fall back to JavaScript-only mode
- **User Impact**: Degraded but functional service

### Parsing Failures
- **Strategy**: Try alternative language parsers
- **Response**: Return best-effort results with warnings
- **User Impact**: Still get analysis even if language detection was wrong

### Unsupported Syntax
- **Strategy**: Catch parser errors with syntax details
- **Response**: Return error with specific unsupported feature
- **User Impact**: Clear feedback on what's not supported

### Process Communication Errors
- **Strategy**: Implement timeouts and error handlers
- **Response**: Retry once, then return error
- **User Impact**: Reliable error reporting

## Testing Strategy

### Unit Testing
We'll use **Jest** for JavaScript/TypeScript and **pytest** for Python.

**Unit Test Coverage**:
- Test language detection with various file extensions
- Test language detection with code patterns
- Test Babel parser with JavaScript and TypeScript
- Test Python AST parser with Python code
- Test process bridge communication
- Test metrics normalization across languages
- Test error handling for each language

**Example Unit Tests**:
- File with .js extension should be detected as JavaScript
- Code with "def" keyword should be detected as Python
- JavaScript and Python should produce same metric structure
- Process pool should not exceed 5 processes

### Property-Based Testing
We'll use **fast-check** for JavaScript and **Hypothesis** for Python.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random code in different languages and verify properties hold
- Tests will be tagged with comments referencing the design document properties

**Test Tagging Format**: `// Feature: multi-language-support, Property {number}: {property_text}`

### Integration Testing
- Test end-to-end analysis for JavaScript, TypeScript, and Python
- Test process pool under concurrent load
- Test error scenarios (Python not installed, process crashes, etc.)
- Verify performance requirements with large files
- Test language detection edge cases

## Design Decisions and Rationales

### Decision 1: Use Babel for JavaScript/TypeScript
**Rationale**: Babel is the industry standard, has excellent TypeScript support via presets, and provides robust error messages.

### Decision 2: Use Python AST Module
**Rationale**: Python's built-in AST module is reliable, well-documented, and requires no external dependencies.

### Decision 3: Subprocess Communication via stdio
**Rationale**: stdio is simple, reliable, and works across all platforms; JSON serialization is straightforward and human-readable.

### Decision 4: Process Pool with 5 Max Processes
**Rationale**: Balances performance (parallel processing) with resource usage; 5 processes handle typical load without overwhelming the system.

### Decision 5: Unified Metric Format
**Rationale**: Consistent format enables fair comparison across languages and simplifies client code that consumes the API.

### Decision 6: Language-Specific Smell Detection
**Rationale**: Each language has unique idioms and anti-patterns; detecting them improves relevance and value of analysis.

### Decision 7: Fallback to JavaScript-Only Mode
**Rationale**: Ensures the system remains functional even if Python is unavailable, providing value in degraded scenarios.

### Decision 8: Same Thresholds Across Languages
**Rationale**: Maintains consistency and fairness; a 20-line function is too long regardless of language.
