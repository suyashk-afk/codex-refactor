# Design Document: AI-Powered Refactoring Suggestions

## Overview

The AI Refactoring Suggestion Engine provides intelligent, context-aware refactoring recommendations powered by Google Gemini AI. The system analyzes code structure, identifies extract function opportunities, generates meaningful function names, and provides before/after diffs with risk assessments. This enables developers to refactor code safely and effectively with AI assistance.

The engine combines static analysis with AI-powered suggestions to provide high-quality refactoring recommendations that improve code maintainability and readability.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  (Express endpoints for refactoring requests)           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Refactoring Orchestrator                        │
│  (Coordinates analysis and suggestion generation)       │
└────┬───────────────┬───────────────┬────────────────────┘
     │               │               │
┌────▼─────────┐ ┌──▼──────────┐ ┌──▼────────────┐
│ Opportunity  │ │   Gemini    │ │  Validation   │
│  Detector    │ │  AI Client  │ │    Engine     │
└────┬─────────┘ └──┬──────────┘ └──┬────────────┘
     │               │               │
     └───────────────┴───────────────┘
                     │
            ┌────────▼─────────┐
            │   AST Parser     │
            │ (Babel/Acorn)    │
            └──────────────────┘
```

### Component Responsibilities

1. **API Layer**: Handles HTTP requests, validates input, returns formatted responses
2. **Refactoring Orchestrator**: Coordinates the refactoring workflow
3. **Opportunity Detector**: Identifies code blocks suitable for extraction
4. **Gemini AI Client**: Communicates with Google Gemini API for suggestions
5. **Validation Engine**: Validates generated refactorings for correctness
6. **AST Parser**: Parses code into traversable syntax trees

## Components and Interfaces

### RefactoringOrchestrator

**Purpose**: Main coordinator for refactoring workflow

**Interface**:
```javascript
class RefactoringOrchestrator {
  /**
   * Generates refactoring suggestions for code
   * @param {string} code - Source code to analyze
   * @param {string} filename - Optional filename for context
   * @returns {Promise<RefactoringSuggestions>}
   */
  async generateSuggestions(code, filename = 'file.js')
  
  /**
   * Applies a specific refactoring to code
   * @param {string} code - Original code
   * @param {Refactoring} refactoring - Refactoring to apply
   * @returns {string} - Refactored code
   */
  applyRefactoring(code, refactoring)
}
```

### OpportunityDetector

**Purpose**: Identifies code blocks suitable for extraction

**Interface**:
```javascript
class OpportunityDetector {
  /**
   * Finds refactoring opportunities in code
   * @param {ASTNode} ast - Abstract syntax tree
   * @returns {Array<Opportunity>}
   */
  detectOpportunities(ast)
  
  /**
   * Ranks opportunities by potential impact
   * @param {Array<Opportunity>} opportunities
   * @returns {Array<Opportunity>} - Sorted by impact
   */
  rankOpportunities(opportunities)
  
  /**
   * Checks if a function is too long
   * @param {ASTNode} functionNode
   * @returns {boolean}
   */
  isFunctionTooLong(functionNode)
  
  /**
   * Checks if code block has high complexity
   * @param {ASTNode} node
   * @returns {boolean}
   */
  hasHighComplexity(node)
}
```

### GeminiAIClient

**Purpose**: Communicates with Google Gemini API

**Interface**:
```javascript
class GeminiAIClient {
  /**
   * Generates refactoring suggestions using AI
   * @param {string} code - Code to refactor
   * @param {Opportunity} opportunity - Detected opportunity
   * @returns {Promise<Array<Refactoring>>}
   */
  async generateRefactorings(code, opportunity)
  
  /**
   * Generates a meaningful function name
   * @param {string} codeBlock - Code to be extracted
   * @returns {Promise<string>}
   */
  async generateFunctionName(codeBlock)
  
  /**
   * Retries API call with exponential backoff
   * @param {Function} apiCall
   * @param {number} maxRetries
   * @returns {Promise<any>}
   */
  async retryWithBackoff(apiCall, maxRetries = 3)
}
```

### ExternalVariableAnalyzer

**Purpose**: Identifies external variables and dependencies

**Interface**:
```javascript
class ExternalVariableAnalyzer {
  /**
   * Finds external variables used in code block
   * @param {ASTNode} blockNode - Code block to analyze
   * @param {ASTNode} parentScope - Parent scope
   * @returns {ExternalVariables}
   */
  analyzeExternalVariables(blockNode, parentScope)
  
  /**
   * Determines if variable is modified
   * @param {string} varName - Variable name
   * @param {ASTNode} blockNode - Code block
   * @returns {boolean}
   */
  isVariableModified(varName, blockNode)
  
  /**
   * Generates function signature
   * @param {ExternalVariables} externalVars
   * @returns {FunctionSignature}
   */
  generateSignature(externalVars)
}
```

### ValidationEngine

**Purpose**: Validates refactoring correctness

**Interface**:
```javascript
class ValidationEngine {
  /**
   * Validates a refactoring suggestion
   * @param {Refactoring} refactoring
   * @returns {ValidationResult}
   */
  validate(refactoring)
  
  /**
   * Checks if extracted function is syntactically valid
   * @param {string} functionCode
   * @returns {boolean}
   */
  isSyntacticallyValid(functionCode)
  
  /**
   * Verifies all external variables are captured
   * @param {Refactoring} refactoring
   * @returns {boolean}
   */
  areExternalVariablesCaptured(refactoring)
}
```

### DiffGenerator

**Purpose**: Generates before/after diffs

**Interface**:
```javascript
class DiffGenerator {
  /**
   * Generates a diff for a refactoring
   * @param {string} originalCode
   * @param {string} refactoredCode
   * @returns {Diff}
   */
  generateDiff(originalCode, refactoredCode)
  
  /**
   * Formats diff with syntax highlighting
   * @param {Diff} diff
   * @returns {string} - HTML formatted diff
   */
  formatDiff(diff)
}
```

## Data Models

### Opportunity

```javascript
{
  type: string,                // 'long_function' | 'high_complexity' | 'repeated_code'
  location: {
    start: number,             // Start line
    end: number,               // End line
    startColumn: number,
    endColumn: number
  },
  codeBlock: string,           // The code to extract
  complexity: number,          // Cyclomatic complexity
  potentialImpact: number,     // 0-100 score
  functionNode: ASTNode        // AST node reference
}
```

### Refactoring

```javascript
{
  id: string,                  // Unique identifier
  type: 'extract_function',
  functionName: string,        // Suggested function name
  parameters: Array<{
    name: string,
    type: string,              // Inferred type
    isModified: boolean
  }>,
  returnValue: {
    type: string,
    variables: Array<string>   // Variables to return
  },
  extractedFunction: string,   // The new function code
  modifiedCallingCode: string, // Updated original code
  diff: Diff,
  riskAssessment: RiskAssessment,
  qualityImprovement: number   // Expected quality score increase
}
```

### ExternalVariables

```javascript
{
  readOnly: Array<{
    name: string,
    type: string,
    firstUseLine: number
  }>,
  modified: Array<{
    name: string,
    type: string,
    modifications: Array<number>  // Line numbers
  }>,
  global: Array<string>
}
```

### RiskAssessment

```javascript
{
  level: string,               // 'Low' | 'Medium' | 'High'
  factors: Array<{
    factor: string,
    impact: string,
    description: string
  }>,
  recommendation: string,
  estimatedTimeToApply: number // Minutes
}
```

### Diff

```javascript
{
  additions: Array<{
    line: number,
    content: string
  }>,
  deletions: Array<{
    line: number,
    content: string
  }>,
  unchanged: Array<{
    line: number,
    content: string
  }>,
  formattedHtml: string
}
```

### RefactoringSuggestions

```javascript
{
  suggestions: Array<Refactoring>,
  opportunitiesFound: number,
  suggestionsGenerated: number,
  analysisTime: number,        // Milliseconds
  codeQualityBefore: number,
  estimatedQualityAfter: number
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Long Function Detection
*For any* function with more than 20 lines, it should be identified as a refactoring opportunity
**Validates: Requirements 1.1**

### Property 2: High Complexity Detection
*For any* code block with cyclomatic complexity greater than 5, it should be flagged as a candidate for extraction
**Validates: Requirements 1.2**

### Property 3: Suggestion Limit
*For any* code analysis, the system should return at most 5 refactoring suggestions
**Validates: Requirements 2.5**

### Property 4: External Variable Completeness
*For any* code block, all variables used but not defined within the block should be identified as external variables
**Validates: Requirements 3.1**

### Property 5: Modified Variable Return
*For any* variable modified within a code block, it should be marked as requiring a return value
**Validates: Requirements 3.2**

### Property 6: Diff Completeness
*For any* refactoring, the diff should include both the extracted function and the modified calling code
**Validates: Requirements 4.4**

### Property 7: Risk Level Classification
*For any* refactoring with no external dependencies, the risk level should be 'Low'
**Validates: Requirements 5.2**

### Property 8: Syntactic Validity
*For any* generated refactoring that passes validation, the extracted function should be syntactically valid
**Validates: Requirements 7.1**

### Property 9: Parameter Capture
*For any* validated refactoring, all external variables should be captured as parameters
**Validates: Requirements 7.2**

### Property 10: Performance Requirement
*For any* function with up to 100 lines, suggestion generation should complete within 10 seconds
**Validates: Requirements 9.1**

## Error Handling

### AI API Errors
- **Strategy**: Retry with exponential backoff (3 attempts)
- **Fallback**: Use rule-based refactoring suggestions
- **Response**: Return partial results with warning
- **User Impact**: Still get suggestions even if AI is unavailable

### Parsing Errors
- **Strategy**: Catch syntax errors from AST parser
- **Response**: Return error with line number and message
- **User Impact**: Clear feedback about code issues

### Validation Failures
- **Strategy**: Discard invalid suggestions silently
- **Response**: Return only valid suggestions
- **User Impact**: Only see safe, correct refactorings

### API Rate Limiting
- **Strategy**: Implement request queuing
- **Response**: Queue requests and process sequentially
- **User Impact**: Slower but reliable service

### Timeout Handling
- **Strategy**: Set 10-second timeout for AI requests
- **Response**: Return cached or rule-based suggestions
- **User Impact**: Fast response even if AI is slow

## Testing Strategy

### Unit Testing
We'll use **Jest** as the testing framework.

**Unit Test Coverage**:
- Test opportunity detection for various code patterns
- Test external variable analysis with different scopes
- Test function name generation with sample code blocks
- Test risk assessment logic with different scenarios
- Test diff generation with various refactorings
- Test validation logic for correct and incorrect refactorings

**Example Unit Tests**:
- Function with 25 lines should be detected as opportunity
- Code block using external variable should identify it correctly
- Refactoring with no dependencies should be Low risk
- Invalid syntax should fail validation

### Property-Based Testing
We'll use **fast-check** for property-based testing.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random code structures and verify properties hold
- Tests will be tagged with comments referencing the design document properties

**Test Tagging Format**: `// Feature: ai-refactoring-suggestions, Property {number}: {property_text}`

### Integration Testing
- Test end-to-end refactoring workflow with real code samples
- Test AI API integration with mock responses
- Test error scenarios (API failures, invalid code, etc.)
- Verify performance requirements with large functions

## Design Decisions and Rationales

### Decision 1: Use Gemini 2.0 Flash Model
**Rationale**: Gemini 2.0 Flash provides the best balance of speed and quality for code analysis tasks, with fast response times suitable for interactive use.

### Decision 2: Limit to 5 Suggestions
**Rationale**: More than 5 suggestions overwhelms users; focusing on top 5 ensures quality over quantity and keeps the interface manageable.

### Decision 3: 20-Line Threshold for Long Functions
**Rationale**: Based on industry best practices (Clean Code, Code Complete), functions over 20 lines often do too much and benefit from extraction.

### Decision 4: Exponential Backoff for Retries
**Rationale**: Prevents overwhelming the API during temporary failures while giving the service time to recover.

### Decision 5: Rule-Based Fallback
**Rationale**: Ensures the system remains functional even when AI is unavailable, providing value in all scenarios.

### Decision 6: Syntactic Validation Before Returning
**Rationale**: Prevents suggesting broken refactorings that would introduce bugs; better to return fewer suggestions than incorrect ones.

### Decision 7: Risk Assessment Included
**Rationale**: Empowers developers to make informed decisions about which refactorings to apply, building trust in the system.
