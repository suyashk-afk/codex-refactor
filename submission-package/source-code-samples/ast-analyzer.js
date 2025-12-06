// backend/refactor-engine/ast-analyzer/index.js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const crypto = require('crypto');

/**
 * Hash helper for repeated-snippet detection
 */
function hashString(s) {
  return crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
}

/**
 * Compute nesting depth for a function using the path.traverse API.
 */
function computeNestingDepth(functionPath) {
  let maxDepth = 0;

  functionPath.traverse({
    enter(path) {
      if (path.isBlockStatement() || path.isIfStatement() || path.isForStatement()
        || path.isWhileStatement() || path.isSwitchStatement() || path.isTryStatement()) {
        let depth = 0;
        let p = path;
        while (p && p !== functionPath && p.node) {
          if (p.isBlockStatement() || p.isIfStatement() || p.isForStatement()
            || p.isWhileStatement() || p.isSwitchStatement() || p.isTryStatement()) {
            depth++;
          }
          p = p.parentPath;
        }
        if (depth > maxDepth) maxDepth = depth;
      }
    }
  });

  return maxDepth;
}

/**
 * Count nested callbacks inside a function
 */
function countNestedCallbacks(functionPath) {
  let count = 0;
  functionPath.traverse({
    CallExpression(callPath) {
      const args = callPath.node.arguments || [];
      if (args.some(a => a.type === 'FunctionExpression' || a.type === 'ArrowFunctionExpression')) {
        count++;
      }
    }
  });
  return count;
}

/**
 * Calculate TRUE Cyclomatic Complexity (McCabe)
 * Formula: M = E - N + 2P
 * Simplified: M = decision_points + 1
 * 
 * Decision points:
 * - if, else if
 * - for, while, do-while
 * - case in switch
 * - catch
 * - &&, || in conditions
 * - ternary operator (? :)
 */
function calculateCyclomaticComplexity(functionPath) {
  let complexity = 1; // Start at 1 (base path)
  
  functionPath.traverse({
    // Conditional statements
    IfStatement() { complexity++; },
    
    // Loops
    ForStatement() { complexity++; },
    ForInStatement() { complexity++; },
    ForOfStatement() { complexity++; },
    WhileStatement() { complexity++; },
    DoWhileStatement() { complexity++; },
    
    // Switch cases (each case adds a path)
    SwitchCase(path) {
      // Don't count default case as it doesn't add complexity
      if (path.node.test !== null) {
        complexity++;
      }
    },
    
    // Ternary operator
    ConditionalExpression() { complexity++; },
    
    // Logical operators (short-circuit evaluation creates branches)
    LogicalExpression(path) {
      // Only count && and || at decision points
      if (path.node.operator === '&&' || path.node.operator === '||') {
        complexity++;
      }
    },
    
    // Exception handling
    CatchClause() { complexity++; }
  });
  
  return complexity;
}

/**
 * Count branches (for backward compatibility)
 */
function countBranches(functionPath) {
  return calculateCyclomaticComplexity(functionPath) - 1; // Remove base path for branch count
}

/**
 * NEW: Detect code smells in a function
 */
function detectCodeSmells(functionPath, functionName, length) {
  const smells = [];

  // Long function (>20 lines)
  if (length && length > 20) {
    smells.push({
      type: 'long_function',
      severity: 'high',
      message: `Function '${functionName}' is ${length} lines long. Consider breaking it into smaller functions.`,
      suggestion: 'Extract logical blocks into separate functions'
    });
  }

  // Deep nesting (>3 levels)
  const nesting = computeNestingDepth(functionPath);
  if (nesting > 3) {
    smells.push({
      type: 'deep_nesting',
      severity: 'high',
      message: `Function '${functionName}' has nesting depth of ${nesting}. This makes code hard to read.`,
      suggestion: 'Use early returns or extract nested logic into helper functions'
    });
  }

  // High cyclomatic complexity (>10 branches)
  const branches = countBranches(functionPath);
  // High cyclomatic complexity (McCabe threshold: >10 is complex, >20 is untestable)
  const complexity = calculateCyclomaticComplexity(functionPath);
  if (complexity > 20) {
    smells.push({
      type: 'high_complexity',
      severity: 'critical',
      message: `Function '${functionName}' has cyclomatic complexity of ${complexity}. This is extremely complex and hard to test.`,
      suggestion: 'Urgently refactor - split into multiple functions with single responsibilities'
    });
  } else if (complexity > 10) {
    smells.push({
      type: 'high_complexity',
      severity: 'high',
      message: `Function '${functionName}' has cyclomatic complexity of ${complexity}. This is moderately complex.`,
      suggestion: 'Simplify logic or use polymorphism/strategy pattern'
    });
  }

  // Too many callbacks (>2)
  const callbacks = countNestedCallbacks(functionPath);
  if (callbacks > 2) {
    smells.push({
      type: 'callback_hell',
      severity: 'medium',
      message: `Function '${functionName}' has ${callbacks} nested callbacks.`,
      suggestion: 'Convert to async/await or use Promises'
    });
  }

  // Detect magic numbers (IMPROVED: less false positives)
  let magicNumbers = [];
  functionPath.traverse({
    NumericLiteral(path) {
      const value = path.node.value;
      
      // Ignore common acceptable values
      const acceptableValues = [
        0, 1, -1, 2, 10, 100, 1000,  // Common constants
        24, 60, 365,                  // Time-related
        256, 512, 1024,               // Buffer/memory sizes
        8, 16, 32, 64, 128           // Bit-related
      ];
      
      if (acceptableValues.includes(value)) return;
      
      // Ignore if in variable declaration (const MAX = 100)
      if (path.findParent(p => p.isVariableDeclarator())) return;
      
      // Ignore if in array index (arr[0], arr[1])
      if (path.findParent(p => p.isMemberExpression())) return;
      
      // Ignore if in return statement with single number
      const parent = path.parent;
      if (parent.type === 'ReturnStatement' && parent.argument === path.node) return;
      
      // Only flag if used in calculations or comparisons
      if (path.findParent(p => 
        p.isBinaryExpression() || 
        p.isLogicalExpression() ||
        p.isConditionalExpression()
      )) {
        magicNumbers.push(value);
      }
    }
  });
  
  // Only report if there are MULTIPLE magic numbers (not just one)
  if (magicNumbers.length > 2) {
    smells.push({
      type: 'magic_numbers',
      severity: 'medium',
      message: `Function '${functionName}' contains magic numbers: ${[...new Set(magicNumbers)].join(', ')}`,
      suggestion: 'Extract magic numbers into named constants'
    });
  }

  // NEW: Detect long parameter lists (>4 params)
  const params = functionPath.node.params || [];
  if (params.length > 4) {
    smells.push({
      type: 'too_many_parameters',
      severity: 'medium',
      message: `Function '${functionName}' has ${params.length} parameters.`,
      suggestion: 'Consider using an options object or splitting the function'
    });
  }

  // NEW: Detect missing error handling in async functions
  if (functionPath.node.async) {
    let hasTryCatch = false;
    functionPath.traverse({
      TryStatement() { hasTryCatch = true; }
    });
    if (!hasTryCatch) {
      smells.push({
        type: 'missing_error_handling',
        severity: 'medium',
        message: `Async function '${functionName}' lacks try-catch blocks.`,
        suggestion: 'Add error handling for async operations'
      });
    }
  }

  return smells;
}

/**
 * Calculate Code Toxicity Score (0-100)
 * Based on research from SonarQube, Code Climate, and academic papers
 * 
 * Toxicity factors:
 * 1. Severity-weighted smell density
 * 2. Complexity burden
 * 3. Maintainability index
 * 4. Technical debt ratio
 * 
 * 0-20: Clean code
 * 21-40: Moderate toxicity
 * 41-60: High toxicity
 * 61-80: Very toxic
 * 81-100: Extremely toxic (unmaintainable)
 */
function calculateToxicity(result) {
  if (!result.functions || result.functions.length === 0) return 0;
  
  // Severity weights (based on remediation effort)
  const severityWeights = {
    critical: 10,
    high: 5,
    medium: 2,
    low: 1
  };
  
  // Smell type impact multipliers (some smells are worse than others)
  const smellImpact = {
    high_complexity: 1.5,      // Very hard to fix
    deep_nesting: 1.3,         // Requires restructuring
    long_function: 1.2,        // Time-consuming to split
    callback_hell: 1.4,        // Async refactoring is hard
    magic_numbers: 0.8,        // Easy to fix
    missing_error_handling: 1.1
  };
  
  let weightedSmellScore = 0;
  let totalLines = 0;
  let totalComplexity = 0;
  
  // Calculate weighted smell score
  result.functions.forEach(fn => {
    totalLines += fn.length || 0;
    totalComplexity += fn.complexity || 1;
    
    fn.smells.forEach(smell => {
      const severityWeight = severityWeights[smell.severity] || 1;
      const impactMultiplier = smellImpact[smell.type] || 1.0;
      weightedSmellScore += severityWeight * impactMultiplier;
    });
  });
  
  // 1. Smell Density (weighted smells per 100 lines of code)
  const smellDensity = totalLines > 0 
    ? (weightedSmellScore / totalLines) * 100 
    : 0;
  
  // 2. Complexity Burden (average complexity above threshold)
  const avgComplexity = totalComplexity / result.functions.length;
  const complexityBurden = Math.max(0, (avgComplexity - 5) * 5); // 5 is acceptable threshold
  
  // 3. Maintainability Index (inverse of quality score)
  const maintainabilityPenalty = (100 - result.qualityScore) * 0.3;
  
  // 4. Technical Debt Ratio (functions with smells / total functions)
  const functionsWithSmells = result.functions.filter(fn => fn.smells.length > 0).length;
  const debtRatio = (functionsWithSmells / result.functions.length) * 30;
  
  // Combine factors (weighted average)
  const toxicity = Math.min(100, Math.round(
    smellDensity * 0.35 +           // 35% weight on smell density
    complexityBurden * 0.25 +       // 25% weight on complexity
    maintainabilityPenalty * 0.25 + // 25% weight on maintainability
    debtRatio * 0.15                // 15% weight on debt ratio
  ));
  
  return toxicity;
}

/**
 * NEW: Calculate overall code quality score (0-100)
 */
function calculateQualityScore(analysis) {
  // If no functions, return perfect score (empty file or just declarations)
  if (!analysis.functions || analysis.functions.length === 0) {
    return 100;
  }

  let totalScore = 0;
  const penalties = {
    long_function: 15,      // Increased
    deep_nesting: 20,       // Increased significantly
    high_complexity: 25,    // Increased significantly
    callback_hell: 12,      // Increased
    magic_numbers: 8,       // Increased
    too_many_parameters: 10, // Increased
    missing_error_handling: 10 // Increased
  };

  // Calculate score per function, then average
  analysis.functions.forEach(fn => {
    let fnScore = 100;
    
    // Apply penalties for each smell
    (fn.smells || []).forEach(smell => {
      fnScore -= penalties[smell.type] || 5;
    });
    
    // Additional penalties based on metrics
    const nesting = fn.nesting || 0;
    const length = fn.length || 0;
    const branches = fn.branchCount || 0;
    
    // Extra penalty for extreme nesting (beyond what smell detection catches)
    if (nesting > 5) {
      fnScore -= (nesting - 5) * 5; // -5 per level above 5
    }
    
    // Extra penalty for very long functions
    if (length > 30) {
      fnScore -= (Math.floor((length - 30) / 10)) * 5; // -5 per 10 lines above 30
    }
    
    // Extra penalty for high branch count
    if (branches > 15) {
      fnScore -= (branches - 15) * 3; // -3 per branch above 15
    }
    
    totalScore += Math.max(0, Math.min(100, fnScore));
  });

  // Average score across all functions
  const avgScore = Math.round(totalScore / analysis.functions.length);
  
  return Math.max(0, Math.min(100, avgScore));
}

/**
 * Main analysis function - IMPROVED
 */
function analyzeCode(code, filename = 'file.js') {
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'classProperties', 'optionalChaining', 'dynamicImport']
    });
  } catch (err) {
    return { 
      error: 'parse_error', 
      details: err.message,
      suggestion: 'Check for syntax errors in your code'
    };
  }

  const result = {
    imports: 0,
    exports: 0,
    functions: [],
    repeatedSnippets: {},
    qualityScore: 0,
    totalSmells: 0,
    smellsByType: {}
  };

  // Gather imports/exports and analyze functions
  traverse(ast, {
    ImportDeclaration(path) {
      result.imports++;
    },
    ExportNamedDeclaration(path) {
      result.exports++;
    },
    ExportDefaultDeclaration(path) {
      result.exports++;
    },
    FunctionDeclaration(path) {
      const name = path.node.id ? path.node.id.name : '<anonymous>';
      const start = path.node.loc ? path.node.loc.start.line : null;
      const end = path.node.loc ? path.node.loc.end.line : null;
      const len = (start && end) ? (end - start + 1) : null;

      const nesting = computeNestingDepth(path);
      const callbacks = countNestedCallbacks(path);
      const complexity = calculateCyclomaticComplexity(path);
      const branches = complexity - 1; // Branch count for backward compatibility
      const smells = detectCodeSmells(path, name, len);

      result.functions.push({
        name,
        start,
        end,
        length: len,
        nesting,
        nestedCallbacks: callbacks,
        complexity, // TRUE cyclomatic complexity
        branchCount: branches,
        smells,
        isAsync: path.node.async || false
      });

      // Track smell counts
      smells.forEach(smell => {
        result.totalSmells++;
        result.smellsByType[smell.type] = (result.smellsByType[smell.type] || 0) + 1;
      });
    },
    VariableDeclarator(path) {
      // Catch arrow functions and function expressions
      if (path.node.init && (path.node.init.type === 'ArrowFunctionExpression' || path.node.init.type === 'FunctionExpression')) {
        const name = path.node.id && path.node.id.name ? path.node.id.name : '<varFn>';
        const init = path.get('init');
        const loc = init.node.loc || null;
        const start = loc ? loc.start.line : null;
        const end = loc ? loc.end.line : null;
        const len = (start && end) ? (end - start + 1) : null;

        const nesting = computeNestingDepth(init);
        const callbacks = countNestedCallbacks(init);
        const complexity = calculateCyclomaticComplexity(init);
        const branches = complexity - 1; // Branch count for backward compatibility
        const smells = detectCodeSmells(init, name, len);

        result.functions.push({
          name,
          start,
          end,
          length: len,
          nesting,
          nestedCallbacks: callbacks,
          complexity, // TRUE cyclomatic complexity
          branchCount: branches,
          smells,
          isAsync: init.node.async || false
        });

        smells.forEach(smell => {
          result.totalSmells++;
          result.smellsByType[smell.type] = (result.smellsByType[smell.type] || 0) + 1;
        });
      }
    }
  });

  // Repeated-snippet detection (improved)
  const lines = code.split(/\r?\n/);
  const map = {};
  for (let i = 0; i < lines.length - 2; i++) {
    const snippet = lines.slice(i, i + 3).join('\n').trim();
    if (snippet.length < 15) continue; // Increased threshold
    if (snippet.startsWith('//') || snippet.startsWith('/*')) continue; // Skip comments
    const h = hashString(snippet);
    map[h] = map[h] || { count: 0, snippet, lines: [] };
    map[h].count++;
    map[h].lines.push(i + 1);
  }
  for (const k of Object.keys(map)) {
    if (map[k].count > 1) {
      result.repeatedSnippets[k] = map[k];
    }
  }

  // Calculate overall quality score
  result.qualityScore = calculateQualityScore(result);

  // Calculate average cyclomatic complexity
  result.avgComplexity = result.functions.length > 0
    ? Math.round((result.functions.reduce((sum, fn) => sum + (fn.complexity || 1), 0) / result.functions.length) * 10) / 10
    : 0;

  // Calculate REAL code toxicity (scientific model)
  result.toxicityScore = calculateToxicity(result);

  // Add summary
  result.summary = {
    totalFunctions: result.functions.length,
    averageLength: result.functions.length > 0 
      ? Math.round(result.functions.reduce((sum, fn) => sum + (fn.length || 0), 0) / result.functions.length)
      : 0,
    averageComplexity: result.avgComplexity,
    toxicity: result.toxicityScore,
    healthStatus: result.qualityScore > 80 ? 'healthy' : result.qualityScore > 50 ? 'needs_improvement' : 'critical'
  };

  return result;
}

module.exports = { analyzeCode };