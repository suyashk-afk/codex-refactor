# Design Document: Time Machine Code Quality Analysis

## Overview

The Time Machine Analysis Engine provides historical code quality tracking by analyzing metrics across Git commit history. The system fetches file contents at different commits via the GitHub API, calculates quality metrics for each version, identifies quality trends and regressions, and visualizes the evolution of code quality over time. This enables teams to understand how their code has evolved and identify commits that introduced technical debt.

The design emphasizes efficient API usage, parallel processing, and clear visualization of quality trends.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  (Express endpoints for time machine requests)          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Time Machine Orchestrator                       │
│  (Coordinates commit fetching and analysis)             │
└────┬───────────────┬───────────────┬────────────────────┘
     │               │               │
┌────▼─────────┐ ┌──▼──────────┐ ┌──▼────────────┐
│   GitHub     │ │   Metrics   │ │    Trend      │
│   Fetcher    │ │  Calculator │ │   Analyzer    │
└──────────────┘ └─────────────┘ └───────────────┘
```

### Component Responsibilities

1. **API Layer**: Handles HTTP requests for time machine analysis
2. **Time Machine Orchestrator**: Coordinates the entire analysis workflow
3. **GitHub Fetcher**: Retrieves commit history and file contents from GitHub
4. **Metrics Calculator**: Calculates quality metrics for each commit
5. **Trend Analyzer**: Identifies patterns, regressions, and improvements
6. **Visualization Formatter**: Prepares data for charting and display

## Components and Interfaces

### TimeMachineOrchestrator

**Purpose**: Main coordinator for historical analysis

**Interface**:
```javascript
class TimeMachineOrchestrator {
  /**
   * Analyzes code quality across commit history
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} filePath - Path to file in repository
   * @param {number} maxCommits - Maximum commits to analyze
   * @returns {Promise<TimeMachineResult>}
   */
  async analyzeHistory(repoUrl, filePath, maxCommits = 20)
  
  /**
   * Analyzes specific commit range
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} filePath - Path to file
   * @param {string} startCommit - Start commit SHA
   * @param {string} endCommit - End commit SHA
   * @returns {Promise<TimeMachineResult>}
   */
  async analyzeCommitRange(repoUrl, filePath, startCommit, endCommit)
}
```

### GitHubFetcher

**Purpose**: Retrieves data from GitHub API

**Interface**:
```javascript
class GitHubFetcher {
  /**
   * Fetches commit history for a file
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} filePath - Path to file
   * @param {number} maxCommits - Maximum commits to fetch
   * @returns {Promise<Array<Commit>>}
   */
  async fetchCommitHistory(owner, repo, filePath, maxCommits)
  
  /**
   * Fetches file content at specific commit
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} filePath - Path to file
   * @param {string} commitSHA - Commit SHA
   * @returns {Promise<string>} - File content
   */
  async fetchFileAtCommit(owner, repo, filePath, commitSHA)
  
  /**
   * Parses GitHub repository URL
   * @param {string} repoUrl - GitHub URL
   * @returns {{owner: string, repo: string}}
   */
  parseRepoUrl(repoUrl)
  
  /**
   * Handles API rate limiting
   * @returns {Promise<RateLimitInfo>}
   */
  async checkRateLimit()
  
  /**
   * Retries API call with exponential backoff
   * @param {Function} apiCall - API function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @returns {Promise<any>}
   */
  async retryWithBackoff(apiCall, maxRetries = 3)
}
```

### CommitAnalyzer

**Purpose**: Analyzes individual commits

**Interface**:
```javascript
class CommitAnalyzer {
  /**
   * Analyzes code quality at a specific commit
   * @param {string} code - File content at commit
   * @param {Commit} commit - Commit metadata
   * @returns {Promise<CommitAnalysis>}
   */
  async analyzeCommit(code, commit)
  
  /**
   * Analyzes multiple commits in parallel
   * @param {Array<{code: string, commit: Commit}>} commits
   * @returns {Promise<Array<CommitAnalysis>>}
   */
  async analyzeCommitsBatch(commits)
}
```

### TrendAnalyzer

**Purpose**: Identifies quality trends and patterns

**Interface**:
```javascript
class TrendAnalyzer {
  /**
   * Calculates quality deltas between commits
   * @param {Array<CommitAnalysis>} analyses
   * @returns {Array<QualityDelta>}
   */
  calculateDeltas(analyses)
  
  /**
   * Identifies regressions in code quality
   * @param {Array<QualityDelta>} deltas
   * @returns {Array<Regression>}
   */
  identifyRegressions(deltas)
  
  /**
   * Identifies quality improvements
   * @param {Array<QualityDelta>} deltas
   * @returns {Array<Improvement>}
   */
  identifyImprovements(deltas)
  
  /**
   * Determines overall trend direction
   * @param {Array<CommitAnalysis>} analyses
   * @returns {string} - 'improving' | 'stable' | 'declining'
   */
  determineOverallTrend(analyses)
  
  /**
   * Finds best and worst commits
   * @param {Array<CommitAnalysis>} analyses
   * @returns {{best: CommitAnalysis, worst: CommitAnalysis}}
   */
  findExtremeCommits(analyses)
}
```

### VisualizationFormatter

**Purpose**: Formats data for visualization

**Interface**:
```javascript
class VisualizationFormatter {
  /**
   * Formats data for time series chart
   * @param {Array<CommitAnalysis>} analyses
   * @returns {ChartData}
   */
  formatForChart(analyses)
  
  /**
   * Adds markers for regressions and improvements
   * @param {ChartData} chartData
   * @param {Array<Regression>} regressions
   * @param {Array<Improvement>} improvements
   * @returns {ChartData}
   */
  addMarkers(chartData, regressions, improvements)
  
  /**
   * Formats dates consistently
   * @param {Date} date
   * @returns {string}
   */
  formatDate(date)
}
```

## Data Models

### Commit

```javascript
{
  sha: string,                 // Commit SHA
  author: string,              // Author name
  email: string,               // Author email
  date: Date,                  // Commit date
  message: string,             // Commit message
  isMerge: boolean            // Whether it's a merge commit
}
```

### CommitAnalysis

```javascript
{
  commit: Commit,
  qualityScore: number,        // 0-100 quality score
  complexity: {
    average: number,
    max: number
  },
  toxicity: number,
  smellCount: number,
  linesOfCode: number,
  analysisSuccess: boolean,
  error: string                // If analysis failed
}
```

### QualityDelta

```javascript
{
  fromCommit: Commit,
  toCommit: Commit,
  qualityChange: number,       // Positive = improvement, negative = regression
  complexityChange: number,
  toxicityChange: number,
  smellCountChange: number,
  classification: string       // 'Improvement' | 'Regression' | 'Stable'
}
```

### Regression

```javascript
{
  commit: Commit,
  qualityDrop: number,         // How much quality decreased
  previousQuality: number,
  newQuality: number,
  severity: string,            // 'Minor' | 'Moderate' | 'Severe'
  contributingFactors: Array<string>
}
```

### Improvement

```javascript
{
  commit: Commit,
  qualityGain: number,         // How much quality increased
  previousQuality: number,
  newQuality: number,
  improvementType: string      // 'Refactoring' | 'Bug Fix' | 'Cleanup'
}
```

### TimeMachineResult

```javascript
{
  repository: {
    owner: string,
    name: string,
    filePath: string
  },
  analyses: Array<CommitAnalysis>,
  trends: {
    overallDirection: string,  // 'improving' | 'stable' | 'declining'
    regressions: Array<Regression>,
    improvements: Array<Improvement>,
    bestCommit: CommitAnalysis,
    worstCommit: CommitAnalysis
  },
  visualization: ChartData,
  metadata: {
    commitsAnalyzed: number,
    commitsFailed: number,
    analysisTime: number,       // Milliseconds
    apiRequestsUsed: number
  }
}
```

### ChartData

```javascript
{
  xAxis: Array<string>,        // Formatted dates
  yAxis: Array<number>,        // Quality scores
  dataPoints: Array<{
    date: string,
    quality: number,
    commit: Commit,
    tooltip: string
  }>,
  markers: {
    regressions: Array<{x: number, y: number, label: string}>,
    improvements: Array<{x: number, y: number, label: string}>
  }
}
```

### RateLimitInfo

```javascript
{
  limit: number,               // Total requests allowed per hour
  remaining: number,           // Requests remaining
  reset: Date,                 // When limit resets
  isApproachingLimit: boolean  // True if <100 requests remaining
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Commit Limit
*For any* analysis request, at most 20 commits should be fetched
**Validates: Requirements 1.1**

### Property 2: Chronological Order
*For any* set of analyzed commits, they should be ordered chronologically from oldest to newest
**Validates: Requirements 3.4**

### Property 3: Quality Delta Calculation
*For any* two consecutive commits with quality scores Q1 and Q2, the delta should equal Q2 - Q1
**Validates: Requirements 4.1**

### Property 4: Improvement Classification
*For any* quality change greater than +5 points, the commit should be classified as an Improvement
**Validates: Requirements 4.2**

### Property 5: Regression Classification
*For any* quality change less than -5 points, the commit should be classified as a Regression
**Validates: Requirements 4.3**

### Property 6: Stable Classification
*For any* quality change between -5 and +5 points inclusive, the commit should be classified as Stable
**Validates: Requirements 4.4**

### Property 7: Regression Ranking
*For any* set of regressions, they should be ranked by severity of quality decrease in descending order
**Validates: Requirements 5.3**

### Property 8: Best Commit Identification
*For any* set of analyzed commits, the best commit should have the highest quality score
**Validates: Requirements 6.1**

### Property 9: Worst Commit Identification
*For any* set of analyzed commits, the worst commit should have the lowest quality score
**Validates: Requirements 6.2**

### Property 10: Visualization Data Completeness
*For any* analysis result, the visualization data should include commit dates on x-axis and quality scores on y-axis
**Validates: Requirements 7.2**

### Property 11: Performance Requirement
*For any* analysis of 10 commits, the total analysis time should be less than 120 seconds
**Validates: Requirements 3.5**

### Property 12: Most Recent Commit Inclusion
*For any* commit selection, the most recent commit should always be included
**Validates: Requirements 9.5**

## Error Handling

### Repository Not Found
- **Strategy**: Check API response for 404 status
- **Response**: Return error indicating repository doesn't exist or is private
- **User Impact**: Clear feedback on what went wrong

### Rate Limit Exceeded
- **Strategy**: Check rate limit before making requests
- **Response**: Return error with time until limit resets
- **User Impact**: Know when to retry

### File Not Found at Commit
- **Strategy**: Skip commit and continue with others
- **Response**: Mark commit as failed in results
- **User Impact**: Still get results for successful commits

### Network Errors
- **Strategy**: Retry with exponential backoff (3 attempts)
- **Response**: Return partial results if some commits succeeded
- **User Impact**: Get best-effort results

### Analysis Timeout
- **Strategy**: Set 120-second timeout for entire operation
- **Response**: Return results for commits analyzed before timeout
- **User Impact**: Get partial results rather than nothing

## Testing Strategy

### Unit Testing
We'll use **Jest** as the testing framework.

**Unit Test Coverage**:
- Test GitHub URL parsing with various formats
- Test commit history fetching with mock API responses
- Test file content retrieval at specific commits
- Test quality delta calculations
- Test regression and improvement identification
- Test trend analysis logic
- Test visualization data formatting
- Test rate limit handling

**Example Unit Tests**:
- URL "https://github.com/owner/repo" should parse correctly
- Quality change of +10 should be classified as Improvement
- Quality change of -10 should be classified as Regression
- Best commit should have highest quality score
- Rate limit check should prevent API calls when limit is low

### Property-Based Testing
We'll use **fast-check** for property-based testing.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random commit histories and verify properties hold
- Tests will be tagged with comments referencing the design document properties

**Test Tagging Format**: `// Feature: time-machine-analysis, Property {number}: {property_text}`

### Integration Testing
- Test end-to-end analysis with real GitHub repositories
- Test error scenarios (private repos, non-existent files, etc.)
- Verify performance requirements with 10 commits
- Test rate limiting behavior
- Test concurrent analysis requests

## Design Decisions and Rationales

### Decision 1: Limit to 20 Commits
**Rationale**: Balances comprehensive history with API rate limits and analysis time; 20 commits typically cover several months of development.

### Decision 2: Use GitHub API v3
**Rationale**: Well-documented, stable, and widely supported; provides all necessary endpoints for commit history and file contents.

### Decision 3: Parallel Commit Analysis
**Rationale**: Significantly reduces total analysis time; commits are independent and can be analyzed concurrently.

### Decision 4: 5-Point Threshold for Regressions/Improvements
**Rationale**: Filters out noise from minor fluctuations while capturing meaningful quality changes.

### Decision 5: Exponential Backoff for Retries
**Rationale**: Handles transient network errors gracefully without overwhelming the API.

### Decision 6: Include Merge Commits
**Rationale**: Merge commits can introduce significant changes and should be part of the quality history.

### Decision 7: Weight by Lines of Code for Repository Metrics
**Rationale**: Larger files have more impact on overall quality; weighting provides more accurate aggregate metrics.

### Decision 8: Always Include Most Recent Commit
**Rationale**: Users always want to know current quality; ensures relevance of analysis.

### Decision 9: Provide Partial Results on Failure
**Rationale**: Better to return some results than nothing; users can still gain insights from partial data.

### Decision 10: Format Dates Consistently
**Rationale**: Ensures visualization is readable and professional; consistent formatting aids comparison.
