# Requirements Document: Scientific Code Quality Metrics

## Introduction

This feature implements industry-standard code quality metrics based on established research and methodologies. The system calculates McCabe cyclomatic complexity, code toxicity scores, and maintainability indices using scientifically validated formulas to provide accurate, trustworthy code analysis.

## Glossary

- **System**: The Scientific Metrics Engine
- **McCabe Complexity**: Cyclomatic complexity metric measuring the number of linearly independent paths through code
- **Toxicity Score**: Severity-weighted measure of code smells and technical debt
- **Maintainability Index**: Microsoft's formula for measuring code maintainability (0-100 scale)
- **Decision Point**: A control flow statement that creates a branch (if, for, while, switch, etc.)
- **Code Smell**: A pattern in code that indicates potential quality issues
- **Technical Debt**: Estimated time required to fix all identified code quality issues

## Requirements

### Requirement 1: McCabe Cyclomatic Complexity Calculation

**User Story:** As a developer, I want accurate cyclomatic complexity calculations based on McCabe's original formula, so that I can trust the complexity metrics for code review decisions.

#### Acceptance Criteria

1. WHEN the System analyzes a function THEN the System SHALL calculate complexity using the formula M = decision_points + 1
2. WHEN counting decision points THEN the System SHALL include if statements, for loops, while loops, switch cases, ternary operators, logical AND operators, logical OR operators, and catch blocks
3. WHEN a function contains nested control structures THEN the System SHALL count each decision point independently
4. WHEN the System calculates complexity THEN the System SHALL return an integer value greater than or equal to 1
5. WHERE a function has no decision points THEN the System SHALL return a complexity value of 1

### Requirement 2: Complexity Calibration and Thresholds

**User Story:** As a developer, I want complexity scores calibrated to industry-standard thresholds, so that I can interpret complexity levels correctly.

#### Acceptance Criteria

1. WHEN complexity is between 1 and 4 THEN the System SHALL classify the code as Simple
2. WHEN complexity is between 5 and 7 THEN the System SHALL classify the code as Moderate
3. WHEN complexity is between 8 and 10 THEN the System SHALL classify the code as Complex
4. WHEN complexity is between 11 and 20 THEN the System SHALL classify the code as Very Complex
5. WHEN complexity exceeds 20 THEN the System SHALL classify the code as Untestable

### Requirement 3: Code Toxicity Scoring

**User Story:** As a technical lead, I want a severity-weighted toxicity score that reflects the true impact of code smells, so that I can prioritize refactoring efforts effectively.

#### Acceptance Criteria

1. WHEN the System detects code smells THEN the System SHALL weight each smell by severity (Critical=10, High=5, Medium=2, Low=1)
2. WHEN calculating toxicity THEN the System SHALL apply impact multipliers based on smell type (Complexity=1.5x, Nesting=1.3x, Length=1.2x, Magic Numbers=1.0x)
3. WHEN computing the final toxicity score THEN the System SHALL normalize the result to a 0-100 scale
4. WHEN code has no smells THEN the System SHALL return a toxicity score of 0
5. WHEN toxicity exceeds 100 in raw calculation THEN the System SHALL cap the score at 100

### Requirement 4: Maintainability Index Calculation

**User Story:** As a project manager, I want a maintainability index that combines multiple metrics, so that I can assess overall code health at a glance.

#### Acceptance Criteria

1. WHEN the System calculates maintainability index THEN the System SHALL use the formula MI = 0.5 × Q + 0.3 × (100 - T) + 0.2 × (100 - 5C)
2. WHEN computing maintainability index THEN the System SHALL incorporate quality score (Q), toxicity (T), and average complexity (C)
3. WHEN maintainability index is calculated THEN the System SHALL return a value between 0 and 100
4. WHEN maintainability index exceeds 70 THEN the System SHALL classify the code as Maintainable
5. WHEN maintainability index is below 50 THEN the System SHALL classify the code as Difficult to Maintain

### Requirement 5: Magic Number Detection

**User Story:** As a code reviewer, I want accurate magic number detection that avoids false positives, so that I can focus on genuine issues.

#### Acceptance Criteria

1. WHEN the System detects numeric literals THEN the System SHALL ignore common values (0, 1, 2, 10, 100, 1000)
2. WHEN a numeric literal appears in an array index operation THEN the System SHALL not flag it as a magic number
3. WHEN a numeric literal appears in a variable declaration THEN the System SHALL not flag it as a magic number
4. WHEN a function contains three or more unexplained numeric literals in calculations THEN the System SHALL flag them as magic numbers
5. WHEN the System flags magic numbers THEN the System SHALL provide the line number and context for each occurrence

### Requirement 6: Technical Debt Estimation

**User Story:** As a stakeholder, I want technical debt expressed in time units, so that I can understand the cost of code quality issues.

#### Acceptance Criteria

1. WHEN the System calculates technical debt THEN the System SHALL estimate 15 minutes per code smell
2. WHEN aggregating technical debt THEN the System SHALL sum the time estimates for all detected smells
3. WHEN technical debt exceeds 60 minutes THEN the System SHALL express the result in hours
4. WHEN the System reports technical debt THEN the System SHALL include both total time and breakdown by smell type
5. WHEN code has no smells THEN the System SHALL report zero technical debt

### Requirement 7: Repository-Level Metrics

**User Story:** As a team lead, I want aggregate metrics across an entire repository, so that I can identify files needing the most attention.

#### Acceptance Criteria

1. WHEN the System analyzes multiple files THEN the System SHALL calculate average quality score across all files
2. WHEN computing repository metrics THEN the System SHALL calculate smell density per 1000 lines of code
3. WHEN the System identifies problematic files THEN the System SHALL rank files by quality score in ascending order
4. WHEN reporting repository health THEN the System SHALL include total lines analyzed, total smells detected, and average complexity
5. WHEN the System calculates repository maintainability THEN the System SHALL weight file scores by lines of code

### Requirement 8: Metric Validation and Accuracy

**User Story:** As a quality engineer, I want metrics validated against known test cases, so that I can verify the accuracy of calculations.

#### Acceptance Criteria

1. WHEN the System is tested THEN the System SHALL correctly calculate complexity for reference implementations
2. WHEN validating toxicity scores THEN the System SHALL produce consistent results for identical code
3. WHEN testing edge cases THEN the System SHALL handle empty functions, single-line functions, and deeply nested functions correctly
4. WHEN the System encounters parsing errors THEN the System SHALL report the error without crashing
5. WHEN metrics are calculated THEN the System SHALL complete analysis within 5 seconds for files up to 1000 lines
