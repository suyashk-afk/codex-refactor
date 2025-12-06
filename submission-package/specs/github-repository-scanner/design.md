# Design Document: GitHub Repository Scanner

## Overview

The GitHub Repository Scanner enables comprehensive code quality analysis of entire GitHub repositories. The system fetches repository structure via the GitHub API, discovers analyzable files, performs batch analysis with concurrent processing, and provides aggregate metrics to identify technical debt hotspots. This enables teams to assess overall repository health and prioritize refactoring efforts across multiple files.

The design emphasizes efficient API usage, parallel processing, and clear prioritization of files needing attention.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                            │
│  (Express endpoints for repository scan requests)       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Repository Scanner Orchestrator                 │
│  (Coordinates discovery and batch analysis)             │
└────┬───────────────┬───────────────┬────────────────────┘
     │               │               │
┌────▼─────────┐ ┌──▼──────────┐ ┌──▼────────────┐
│   GitHub     │ │   Batch     │ │  Aggregator   │
│   Fetcher    │ │  Analyzer   │ │   & Ranker    │
└──────────────┘ └─────────────┘ └───────────────┘
```

### Component Responsibilities

1. **API Layer**: Handles HTTP requests for repository scanning
2. **Repository Scanner Orchestrator**: Coordinates the entire scanning workflow
3. **GitHub Fetcher**: Retrieves repository tree and file contents
4. **File Discoverer**: Identifies analyzable files in repository
5. **Batch Analyzer**: Analyzes multiple files concurrently
6. **Aggregator & Ranker**: Computes aggregate metrics and ranks files

## Components and Interfaces

### RepositoryScannerOrchestrator

**Purpose**: Main coordinator for repository scanning

**Interface**:
```javascript
class RepositoryScannerOrchestrator {
  /**
   * Scans entire repository for code quality
   * @param {string} repoUrl - GitHub repository URL
   * @param {number} maxFiles - Maximum files to analyze
   * @returns {Promise<RepositoryScanResult>}
   */
  async scanRepository(repoUrl, maxFiles = 30)
  
  /**
   * Scans specific directory in repository
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} directory - Directory path to scan
   * @returns {Promise<RepositoryScanResult>}
   */
  async scanDirectory(repoUrl, directory)
}
```

### GitHubFetcher

**Purpose**: Retrieves data from GitHub API

**Interface**:
```javascript
class GitHubFetcher {
  /**
   * Fetches repository tree structure
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<RepositoryTree>}
   */
  async fetchRepositoryTree(owner, repo)
  
  /**
   * Fetches file content
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} - File content
   */
  async fetchFileContent(owner, repo, filePath)
  
  /**
   * Fetches multiple files concurrently
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {Array<string>} filePaths - Array of file paths
   * @param {number} maxConcurrent - Max concurrent requests
   * @returns {Promise<Array<FileContent>>}
   */
  async fetchFilesBatch(owner, repo, filePaths, maxConcurrent = 5)
  
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
}
```

### FileDiscoverer

**Purpose**: Identifies analyzable files in repository

**Interface**:
```javascript
class FileDiscoverer {
  /**
   * Discovers analyzable files in repository tree
   * @param {RepositoryTree} tree - Repository tree structure
   * @param {number} maxFiles - Maximum files to return
   * @returns {Array<string>} - Array of file paths
   */
  discoverFiles(tree, maxFiles)
  
  /**
   * Filters files by extension
   * @param {Array<TreeNode>} nodes - Tree nodes
   * @returns {Array<string>} - Filtered file paths
   */
  filterByExtension(nodes)
  
  /**
   * Checks if file is analyzable
   * @param {string} filePath - Path to file
   * @returns {boolean}
   */
  isAnalyzable(filePath)
  
  /**
   * Traverses directory tree recursively
   * @param {TreeNode} node - Current tree node
   * @param {Array<string>} accumulator - Accumulated file paths
   */
  traverseTree(node, accumulator)
}
```

### BatchAnalyzer

**Purpose**: Analyzes multiple files concurrently

**Interface**:
```javascript
class BatchAnalyzer {
  /**
   * Analyzes multiple files in batch
   * @param {Array<FileContent>} files - Files to analyze
   * @returns {Promise<Array<FileAnalysis>>}
   */
  async analyzeBatch(files)
  
  /**
   * Analyzes single file
   * @param {FileContent} file - File to analyze
   * @returns {Promise<FileAnalysis>}
   */
  async analyzeFile(file)
  
  /**
   * Provides progress updates during batch analysis
   * @param {number} completed - Number of files completed
   * @param {number} total - Total files to analyze
   * @param {Function} callback - Progress callback
   */
  reportProgress(completed, total, callback)
}
```

### AggregatorAndRanker

**Purpose**: Computes aggregate metrics and ranks files

**Interface**:
```javascript
class AggregatorAndRanker {
  /**
   * Aggregates metrics across all files
   * @param {Array<FileAnalysis>} analyses - File analyses
   * @returns {AggregateMetrics}
   */
  aggregateMetrics(analyses)
  
  /**
   * Ranks files by quality score
   * @param {Array<FileAnalysis>} analyses - File analyses
   * @returns {Array<FileAnalysis>} - Sorted by quality (ascending)
   */
  rankFilesByQuality(analyses)
  
  /**
   * Identifies technical debt hotspots
   * @param {Array<FileAnalysis>} analyses - File analyses
   * @param {number} threshold - Quality threshold
   * @returns {Array<FileAnalysis>} - Files below threshold
   */
  identifyHotspots(analyses, threshold = 50)
  
  /**
   * Calculates repository health classification
   * @param {number} averageQuality - Average quality score
   * @returns {string} - 'Healthy' | 'Needs Improvement' | 'Critical'
   */
  classifyRepositoryHealth(averageQuality)
}
```

## Data Models

### RepositoryTree

```javascript
{
  sha: string,                 // Tree SHA
  url: string,                 // API URL
  tree: Array<TreeNode>,
  truncated: boolean          // If tree was truncated
}
```

### TreeNode

```javascript
{
  path: string,                // File/directory path
  mode: string,                // File mode
  type: string,                // 'blob' | 'tree'
  sha: string,                 // Object SHA
  size: number,                // File size in bytes
  url: string                  // API URL
}
```

### FileContent

```javascript
{
  path: string,                // File path
  content: string,             // File content
  size: number,                // File size
  encoding: string             // Content encoding
}
```

### FileAnalysis

```javascript
{
  path: string,                // File path
  qualityScore: number,        // 0-100 quality score
  complexity: {
    average: number,
    max: number
  },
  toxicity: number,
  smellCount: number,
  linesOfCode: number,
  technicalDebt: number,       // Minutes
  analysisSuccess: boolean,
  error: string                // If analysis failed
}
```

### AggregateMetrics

```javascript
{
  averageQuality: number,      // Average across all files
  totalSmells: number,         // Sum of all smells
  smellDensity: number,        // Smells per 1000 lines
  totalLinesAnalyzed: number,
  averageComplexity: number,
  repositoryMaintainability: number,
  totalTechnicalDebt: number,  // Minutes
  filesAnalyzed: number,
  filesFailed: number
}
```

### RepositoryScanResult

```javascript
{
  repository: {
    owner: string,
    name: string,
    url: string
  },
  aggregateMetrics: AggregateMetrics,
  repositoryHealth: string,    // 'Healthy' | 'Needs Improvement' | 'Critical'
  fileAnalyses: Array<FileAnalysis>,
  worstFiles: Array<FileAnalysis>,  // Top 10 files needing attention
  metadata: {
    filesDiscovered: number,
    filesAnalyzed: number,
    filesFailed: number,
    analysisTime: number,      // Milliseconds
    apiRequestsUsed: number
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

### Property 1: URL Parsing
*For any* GitHub URL in format "https://github.com/owner/repo", the parser should extract owner and repo correctly
**Validates: Requirements 1.2**

### Property 2: File Extension Filtering
*For any* repository tree, only files with extensions .js, .jsx, .ts, .tsx, and .py should be included for analysis
**Validates: Requirements 2.2**

### Property 3: File Limit
*For any* repository with more than 30 analyzable files, only the first 30 should be selected
**Validates: Requirements 2.3**

### Property 4: Average Quality Calculation
*For any* set of file analyses with quality scores Q1, Q2, ..., Qn, the average should equal (Q1 + Q2 + ... + Qn) / n
**Validates: Requirements 5.1**

### Property 5: Total Smells Aggregation
*For any* set of file analyses with smell counts S1, S2, ..., Sn, the total should equal S1 + S2 + ... + Sn
**Validates: Requirements 5.2**

### Property 6: Technical Debt Aggregation
*For any* set of file analyses with debt D1, D2, ..., Dn, the total debt should equal D1 + D2 + ... + Dn
**Validates: Requirements 5.3**

### Property 7: Repository Health Classification - Healthy
*For any* repository with average quality score greater than 70, it should be classified as 'Healthy'
**Validates: Requirements 5.4**

### Property 8: Repository Health Classification - Critical
*For any* repository with average quality score less than 50, it should be classified as 'Critical'
**Validates: Requirements 5.4**

### Property 9: File Ranking Order
*For any* set of ranked files, they should be sorted by quality score in ascending order
**Validates: Requirements 6.1**

### Property 10: Priority Highlighting
*For any* file with quality score below 50, it should be highlighted as a priority
**Validates: Requirements 6.3**

### Property 11: Worst Files Limit
*For any* repository scan, at most 10 worst files should be displayed
**Validates: Requirements 6.4**

### Property 12: Concurrent Request Limit
*For any* batch file fetch, at most 5 simultaneous connections should be used
**Validates: Requirements 8.2**

### Property 13: Performance Requirement
*For any* repository with up to 30 files, analysis should complete within 60 seconds
**Validates: Requirements 4.5, 8.1**

## Error Handling

### Repository Not Found
- **Strategy**: Check API response for 404 status
- **Response**: Return error indicating repository doesn't exist or is private
- **User Impact**: Clear feedback on access issues

### Private Repository
- **Strategy**: Detect 403 or 404 responses
- **Response**: Inform user that authentication is required
- **User Impact**: Understand why access failed

### Rate Limit Exceeded
- **Strategy**: Check rate limit before and during requests
- **Response**: Display time until limit resets
- **User Impact**: Know when to retry

### File Parse Errors
- **Strategy**: Catch parsing errors for individual files
- **Response**: Log error, continue with other files
- **User Impact**: Get results for successfully analyzed files

### Network Connectivity Loss
- **Strategy**: Catch network errors
- **Response**: Display connection error message
- **User Impact**: Understand the issue

### Unexpected Errors
- **Strategy**: Catch all errors with logging
- **Response**: Return error details for debugging
- **User Impact**: Can report issues with context

## Testing Strategy

### Unit Testing
We'll use **Jest** as the testing framework.

**Unit Test Coverage**:
- Test GitHub URL parsing with various formats
- Test file discovery with mock repository trees
- Test file extension filtering
- Test aggregate metric calculations
- Test file ranking logic
- Test repository health classification
- Test error handling for each scenario
- Test rate limit checking

**Example Unit Tests**:
- URL "https://github.com/owner/repo" should parse correctly
- Only .js, .jsx, .ts, .tsx, .py files should be included
- Average quality of [80, 60, 70] should be 70
- Repository with average quality 75 should be 'Healthy'
- Files should be ranked by quality in ascending order

### Property-Based Testing
We'll use **fast-check** for property-based testing.

**Configuration**: Each property test should run a minimum of 100 iterations.

**Property Test Coverage**:
- Each correctness property listed above will be implemented as a property-based test
- Tests will generate random repository structures and verify properties hold
- Tests will be tagged with comments referencing the design document properties

**Test Tagging Format**: `// Feature: github-repository-scanner, Property {number}: {property_text}`

### Integration Testing
- Test end-to-end scanning with real GitHub repositories
- Test error scenarios (private repos, rate limits, etc.)
- Verify performance requirements with 30 files
- Test concurrent file fetching
- Test progress reporting during batch analysis

## Design Decisions and Rationales

### Decision 1: Limit to 30 Files
**Rationale**: Balances comprehensive analysis with API rate limits and analysis time; 30 files provide good repository overview without overwhelming the system.

### Decision 2: Support 5 File Extensions
**Rationale**: Covers the most common languages (JavaScript, TypeScript, Python) while keeping the scope manageable.

### Decision 3: Concurrent Fetching with 5 Max Connections
**Rationale**: Significantly reduces fetch time while respecting GitHub API best practices and avoiding rate limit issues.

### Decision 4: Rank Files by Quality (Ascending)
**Rationale**: Puts worst files first, making it easy to identify priorities for refactoring.

### Decision 5: Show Top 10 Worst Files
**Rationale**: Provides actionable focus without overwhelming users with too many files to review.

### Decision 6: Three-Tier Health Classification
**Rationale**: Simple, intuitive classification (Healthy/Needs Improvement/Critical) makes repository status immediately clear.

### Decision 7: Continue on Individual File Failures
**Rationale**: Better to return partial results than fail entirely; users still get value from successfully analyzed files.

### Decision 8: Weight Repository Maintainability by LOC
**Rationale**: Larger files have more impact on overall codebase; weighting provides more accurate aggregate metrics.

### Decision 9: Recursive Tree Traversal
**Rationale**: Ensures all files in all directories are discovered, providing complete repository coverage.

### Decision 10: Progress Reporting
**Rationale**: Long-running operations benefit from progress feedback; keeps users informed during batch analysis.
