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
 * Count branches (cyclomatic complexity indicator)
 */
function countBranches(functionPath) {
  let branches = 0;
  functionPath.traverse({
    IfStatement() { branches++; },
    ForStatement() { branches++; },
    ForInStatement() { branches++; },
    ForOfStatement() { branches++; },
    WhileStatement() { branches++; },
    DoWhileStatement() { branches++; },
    SwitchStatement() { branches++; },
    ConditionalExpression() { branches++; },
    LogicalExpression() { branches++; } // NEW: count && and ||
  });
  return branches;
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
  if (branches > 10) {
    smells.push({
      type: 'high_complexity',
      severity: 'high',
      message: `Function '${functionName}' has ${branches} decision points. This is very complex.`,
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

  // NEW: Detect magic numbers
  let magicNumbers = [];
  functionPath.traverse({
    NumericLiteral(path) {
      const value = path.node.value;
      // Ignore common values like 0, 1, -1, 100
      if (![0, 1, -1, 100].includes(value) && !path.findParent(p => p.isVariableDeclarator())) {
        magicNumbers.push(value);
      }
    }
  });
  if (magicNumbers.length > 0) {
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
 * NEW: Calculate overall code quality score (0-100)
 */
function calculateQualityScore(analysis) {
  // If no functions, return perfect score (empty file or just declarations)
  if (!analysis.functions || analysis.functions.length === 0) {
    return 100;
  }

  let totalScore = 0;
  const penalties = {
    long_function: 8,
    deep_nesting: 10,
    high_complexity: 12,
    callback_hell: 7,
    magic_numbers: 5,
    too_many_parameters: 6,
    missing_error_handling: 8
  };

  // Calculate score per function, then average
  analysis.functions.forEach(fn => {
    let fnScore = 100;
    
    (fn.smells || []).forEach(smell => {
      fnScore -= penalties[smell.type] || 5;
    });
    
    // Bonus for concise functions
    if ((fn.length || 0) < 15) {
      fnScore += 5;
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
      const branches = countBranches(path);
      const smells = detectCodeSmells(path, name, len);

      result.functions.push({
        name,
        start,
        end,
        length: len,
        nesting,
        nestedCallbacks: callbacks,
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
        const branches = countBranches(init);
        const smells = detectCodeSmells(init, name, len);

        result.functions.push({
          name,
          start,
          end,
          length: len,
          nesting,
          nestedCallbacks: callbacks,
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

  // Add summary
  result.summary = {
    totalFunctions: result.functions.length,
    averageLength: result.functions.length > 0 
      ? Math.round(result.functions.reduce((sum, fn) => sum + (fn.length || 0), 0) / result.functions.length)
      : 0,
    healthStatus: result.qualityScore > 80 ? 'healthy' : result.qualityScore > 50 ? 'needs_improvement' : 'critical'
  };

  return result;
}

module.exports = { analyzeCode };