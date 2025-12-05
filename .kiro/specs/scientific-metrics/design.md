# Design Document: Scientific Code Quality Metrics

## Overview

The Scientific Metrics Engine implements industry-standard code quality metrics based on established research methodologies. The system provides accurate, trustworthy code analysis through McCabe cyclomatic complexity, code toxicity scoring, and maintainability indices. This design ensures calculations follow scientifically validated formulas and produce consistent, reliable results.

The engine is designed as a modular system that can be integrated into existing code analysis workflows, providing both file-level and repository-level metrics.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  (Express endpoints for analysis requests)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Metrics Calculator                         │
│  (Orchestrates analysis and aggregation)                │
└────┬───────────────┬───────────────┬────────────────────┘
     │               │               │
┌────▼─────┐  ┌─────▼──────┐  ┌────▼──────────┐
│Complexity│  │  Toxicity  │  │Maintainability│
│Calculator│  │  Scorer    │  │   Index       │
└────┬─────┘  └─────┬──────┘  └────┬──────────┘
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
2. **Metrics Calculator**: Orchestrates metric calculations and aggregates results
3. **Complexity Calculator**: Implements McCabe cyclomatic complexity formula
4. **Toxicity Scorer**: Detects code smells and calculates severity-weighted scores
5. **Maintainability Index**: Combines multiple metrics into overall health score
6. **AST Parser**: Parses JavaScript/TypeScript code into traversable syntax trees

## Components and Interfaces

### MetricsCalculator

**Purpose**: Main orchestrator for all metric calculations

**Interface**:
```javascript
class MetricsCalculator {
  /**
   * Analyzes code and returns all metrics
   * @param {string} code - Source code to analyze
   * @param {string} filename - Optional filename for context
   * @returns {Promise<AnalysisResult>}
   */
  async analyzeCode(code, filename = 'file.js')
  
  /**
   * Analyzes multiple files and returns aggregate metrics
   * @param {Array<{path: string, code: string}>} files
   * @returns {Promise<RepositoryMetrics>}
   */
  async analyzeRepository(files)
}
```

### ComplexityCalculator

**Purpose**: Calculates McCabe cyclomatic complexity

**Interface**:
```javascript
class ComplexityCalculator {
  /**
   * Calculates complexity for a function node
   * @param {ASTNode} functionNode - AST node representing a function
   * @returns {number} - Complexity score (minimum 1)
   */
  calculateComplexity(functionNode)
  
  /**
   * Classifies complexity level
   * @param {number} complexity - Complexity score
   * @returns {string} - 'Simple' | 'Moderate' | 'Complex' | 'Very Complex' | 'Untestable'
   */
  classifyComplexity(complexity)
  
  /**
   * Counts decision points in code
   * @param {ASTNode} node - AST node to analyze
   * @returns {number} - Number of decision points
   */
  countDecisionPoints(node)
}
```

### ToxicityScorer

**Purpose**: Detects code smells and calculates toxicity scores

**Interface**:
```javascript
class ToxicityScorer {
  /**
   * Calculates toxicity score for code
   * @param {Array<CodeSmell>} smells - Detected code smells
   * @returns {number} - Toxicity score (0-100)
   */
  calculateToxicity(smells)
  
  /**
   * Detects all code smells in AST
   * @param {ASTNode} ast - Abstract syntax tree
   * @returns {Array<CodeSmell>}
   */
  detectCodeSmells(ast)
  
  /**
   * Applies severity weights to smells
   * @param {CodeSmell} smell
   * @returns {number} - Weighted score
   */
  applySeverityWeight(smell)
}
```

### MagicNumberDetector

**Purpose**: Identifies unexplained numeric literals

**Interface**:
```javascript
class MagicNumberDetector {
  /**
   * Detects magic numbers in code
   * @param {ASTNode} ast - Abstract syntax tree
   * @returns {Array<MagicNumber>}
   */
  detectMagicNumbers(ast)
  
  /**
   * Determines if a number should be ignored
   * @param {number} value - Numeric literal value
   * @param {ASTNode} context - Parent node context
   * @returns {boolean}
   */
  shouldIgnoreNumber(value, context)
}
```

## Data Models

### AnalysisResult

```javascript
{
  qualityScore: number,        // 0-100 overall quality
  complexity: {
    average: number,           // Average complexity across functions
    max: number,               // Highest complexity found
    functions: Array<{
      name: string,
      complexity: number,
      classification: string,
      lineNumber: number
    }>
  },
  toxicity: {
    score: number,             // 0-100 toxicity score
    smells: Array<CodeSmell>
  },
  maintainability: {
    index: number,             // 0-100 maintainability index
    classification: string     // 'Maintainable' | 'Difficult to Maintain'
  },
  technicalDebt: {
    totalMinutes: number,
    breakdown: Object<string, number>
  },
  linesOfCode: number
}
```

### CodeSmell

```javascript
{
  type: string,                // 'long_function' | 'deep_nesting' | 'magic_number' | etc.
  severity: string,            // 'Critical' | 'High' | 'Medium' | 'Low'
  line: number,
  message: string,
  context: string,             // Code snippet showing the smell
  impactMultiplier: number     // 1.0 - 1.5 based on smell type
}
```

### RepositoryMetrics

```javascript
{
  averageQuality: number,
  totalSmells: number,
  smellDensity: number,        // Smells per 1000 lines
  totalLinesAnalyzed: number,
  averageComplexity: number,
  repositoryMaintainability: number,
  filesAnalyzed: number,
  worstFiles: Array<{
    path: string,
    qualityScore: number,
    smellCount: number
  }>
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complexity Minimum Value
*For any* function AST node, the calculated complexity should be greater than or equal to 1
**Validates: Requirements 1.4**

### Property 2: Complexity Formula Correctness
*For any* function with N decision points, the complexity should equal N + 1
**Validates: Requirements 1.1**

### Property 3: Complexity Classification Boundaries
*For any* complexity value C, the classification should match the defined thresholds (1-4: Simple, 5-7: Moderate, 8-10: Complex, 11-20: Very Complex, >20: Untestable)
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 4: Toxicity Score Range
*For any* set of code smells, the toxicity score should be between 0 and 100 inclusive
**Validates: Requirements 3.3, 3.4, 3.5**

### Property 5: Zero Smells Zero Toxicity
*For any* code with no detected smells, the toxicity score should equal 0
**Validates: Requirements 3.4**

### Property 6: Maintainability Index Range
*For any* calculated maintainability index, the value should be between 0 and 100 inclusive
**Validates: Requirements 4.3**

### Property 7: Maintainability Formula Correctness
*For any* quality score Q, toxicity T, and complexity C, the maintainability index should equal 0.5 × Q + 0.3 × (100 - T) + 0.2 × (100 - 5C)
**Validates: Requirements 4.1, 4.2**

### Property 8: Magic Number Exclusions
*For any* numeric literal in the set {0, 1, 2, 10, 100, 1000}, it should not be flagged as a magic number
**Validates: Requirements 5.1**

### Property 9: Technical Debt Zero for No Smells
*For any* code with no smells, the technical debt should be 0 minutes
**Validates: Requirements 6.5**

### Property 10: Technical Debt Calculation
*For any* set of N code smells, the technical debt should equal N × 15 minutes
**Validates: Requirements 6.1, 6.2**

### Property 11: Repository Average Calculation
*For any* set of files with quality scores, the repository average should equal the sum of (quality_score × lines_of_code) divided by total lines
**Validates: Requirements 7.5**

### Property 12: Smell Density Calculation
*For any* repository with S smells and L lines of code, the smell density should equal (S / L) × 1000
**Validates: Requirements 7.2**

### Property 13: Consistent Results for Identical Code
*For any* code string, analyzing it twice should produce identical quality scores
**Validates: Requirements 8.2**

### Property 14: Analysis Performance
*For any* file with up to 1000 lines, analysis should complete within 5 seconds
**Validates: Requirements 8.5**

## Error Handling

### Parsing Errors
- **Strategy**: Catch syntax errors from AST parser
- **Response**: Return error object with line number and error message
- **User Impact**: Clear feedback about what's wrong with the code

### Invalid Input
- **Strategy**: Validate input before processing
- **Response**: Return 400 Bad Request with validation errors
- **User Impact**: Immediate feedback on incorrect API usage

### Performance Timeouts
- **Strategy**: Implement timeout for analysis operations
- **Response**: Return partial results with timeout warning
- **User Impact**: Get results for analyzed portions even if timeout occurs

### Division by Zero
- **Strategy**: Check for zero denominators in calculations
- **Response**: Use safe defaults (e.g., 0 complexity if no functions)
- **User Impact**: Graceful handling of edge cases

## Testing Strategy

### Unit Testing
We'll use **Jest** as the testing framework for JavaScript/TypeScript code.

**Unit Test Coverage**:
- Test complexity calculation for functions with 0, 1, 5, 10, 20, and 50 decision points
- Test toxicity scoring with various combinations of smells
- Test maintainability index formula with boundary values
- Test magic number detection with common values and edge cases
- Test classification functions with boundary values
- Test error handling for invalid input

**Example Unit Tests**:
- Empty function should have complexity 1
- Function with single if statement should have complexity 2
- Code with no smells should have toxicity 0
- Magic numbers 0, 1, 2 should not be flagged

### Property-Based Testing
We'll use **fast-check** for property-based testing in JavaScript.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random AST structures and verify properties hold
- Tests will be tagged with comments referencing the design document properties

**Test Tagging Format**: `// Feature: scientific-metrics, Property {number}: {property_text}`

**Example Property Tests**:
- Generate random functions with varying decision points, verify M = N + 1
- Generate random smell sets, verify toxicity is 0-100
- Generate random quality/toxicity/complexity values, verify maintainability formula
- Generate random code samples, verify consistent results on repeated analysis

### Integration Testing
- Test end-to-end API requests with real code samples
- Test repository-level analysis with multiple files
- Test error scenarios (invalid code, network failures, etc.)
- Verify performance requirements with large files

## Implementation Notes

### McCabe Complexity Decision Points
The following AST node types count as decision points:
- `IfStatement`
- `ForStatement`, `ForInStatement`, `ForOfStatement`
- `WhileStatement`, `DoWhileStatement`
- `SwitchCase` (each case)
- `ConditionalExpression` (ternary operator)
- `LogicalExpression` with `&&` or `||` operators
- `CatchClause`

### Toxicity Severity Weights
- **Critical**: 10 points (e.g., functions >100 lines, nesting >5 levels)
- **High**: 5 points (e.g., functions >50 lines, nesting >4 levels)
- **Medium**: 2 points (e.g., functions >20 lines, nesting >3 levels)
- **Low**: 1 point (e.g., minor style issues)

### Toxicity Impact Multipliers
- **Complexity smells**: 1.5x (high complexity, deeply nested code)
- **Nesting smells**: 1.3x (callback hell, deep nesting)
- **Length smells**: 1.2x (long functions, long parameter lists)
- **Magic numbers**: 1.0x (unexplained literals)

### Performance Optimizations
- Cache AST parsing results for repeated analyses
- Use streaming for large file processing
- Implement worker threads for parallel file analysis
- Lazy-load analysis modules to reduce startup time

## Design Decisions and Rationales

### Decision 1: Use Babel Parser
**Rationale**: Babel is the industry standard for JavaScript/TypeScript parsing, has excellent error messages, and supports the latest syntax features.

### Decision 2: Normalize Toxicity to 0-100
**Rationale**: A 0-100 scale is intuitive and consistent with other quality metrics, making it easy to compare and understand.

### Decision 3: 15 Minutes Per Code Smell
**Rationale**: Based on industry research suggesting most code smells take 10-20 minutes to fix; 15 minutes is a reasonable average.

### Decision 4: Weight Maintainability Index Components
**Rationale**: Quality score (50%) is most important, toxicity (30%) indicates immediate issues, complexity (20%) shows long-term maintainability concerns.

### Decision 5: Cap Complexity Classification at "Untestable"
**Rationale**: Functions with complexity >20 are generally considered untestable according to McCabe's research; this provides clear guidance for refactoring.

### Decision 6: Exclude Common Numbers from Magic Number Detection
**Rationale**: Values like 0, 1, 2, 10, 100, 1000 are universally understood and rarely need explanation, reducing false positives.

### Decision 7: Repository Metrics Weighted by Lines of Code
**Rationale**: Larger files have more impact on overall codebase health; weighting by LOC provides more accurate repository-level metrics.
