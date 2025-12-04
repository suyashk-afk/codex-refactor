const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

/**
 * Find variables used in statements that are defined outside
 */
function findExternalVariables(statements, functionParams) {
  const externalVars = new Set();
  const declaredInBlock = new Set();
  const referencedVars = new Set();

  // Collect variables declared in these statements
  statements.forEach(stmt => {
    traverse(
      { type: "File", program: { type: "Program", body: [stmt] } },
      {
        VariableDeclarator(path) {
          if (path.node.id && path.node.id.name) {
            declaredInBlock.add(path.node.id.name);
          }
        },
        FunctionDeclaration(path) {
          if (path.node.id?.name) {
            declaredInBlock.add(path.node.id.name);
          }
        }
      }
    );
  });

  // Find ALL referenced variables first
  statements.forEach(stmt => {
    traverse(
      { type: "File", program: { type: "Program", body: [stmt] } },
      {
        Identifier(path) {
          const name = path.node.name;
          
          // Skip if it's a binding identifier (left side of declaration)
          if (path.isBindingIdentifier()) return;
          
          // Skip if it's a property key (obj.prop - we want obj, not prop)
          if (path.parent.type === 'MemberExpression' && path.parent.property === path.node) return;
          
          referencedVars.add(name);
        }
      }
    );
  });

  // Now filter to only external variables
  referencedVars.forEach(name => {
    // Skip if declared in this block
    if (declaredInBlock.has(name)) return;
    
    // Skip global/built-in objects
    const globals = ['console', 'Date', 'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'undefined', 'null', 'true', 'false'];
    if (globals.includes(name)) return;
    
    // Only add if it's from function parameters (most common case)
    if (functionParams.includes(name)) {
      externalVars.add(name);
    }
  });

  return Array.from(externalVars);
}

/**
 * Check if variable is modified in statements
 */
function findModifiedVariables(statements) {
  const modified = new Set();
  
  statements.forEach(stmt => {
    traverse(
      { type: "File", program: { type: "Program", body: [stmt] } },
      {
        AssignmentExpression(path) {
          if (path.node.left.type === 'Identifier') {
            modified.add(path.node.left.name);
          }
        },
        UpdateExpression(path) {
          if (path.node.argument.type === 'Identifier') {
            modified.add(path.node.argument.name);
          }
        },
        VariableDeclarator(path) {
          // Also track variables declared and used later
          if (path.node.id.type === 'Identifier') {
            modified.add(path.node.id.name);
          }
        }
      }
    );
  });
  
  // Filter out loop variables that won't be used outside
  return Array.from(modified).filter(v => v !== 'i' && v !== 'j' && v !== 'k');
}

/**
 * Generate a meaningful name based on what the code does
 */
function generateSmartName(statements) {
  const keywords = new Set();
  
  statements.forEach(stmt => {
    traverse(
      { type: "File", program: { type: "Program", body: [stmt] } },
      {
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier') {
            keywords.add(path.node.callee.name);
          } else if (path.node.callee.property?.name) {
            keywords.add(path.node.callee.property.name);
          }
        },
        ForStatement() {
          keywords.add('loop');
        },
        IfStatement() {
          keywords.add('check');
        }
      }
    );
  });

  const keywordArray = Array.from(keywords).filter(k => k.length > 2).slice(0, 2);
  if (keywordArray.length > 0) {
    return 'extracted_' + keywordArray.join('_');
  }
  
  return 'extracted_' + Math.random().toString(36).slice(2, 10);
}

/**
 * Find extractable statement groups
 */
function findExtractableGroups(fnNode) {
  const body = fnNode.body.body;
  if (!body || body.length < 4) return [];

  const groups = [];
  
  // Try to find a good chunk to extract (at least 3 statements)
  for (let i = 0; i < body.length - 2; i++) {
    // Don't extract the last return statement
    let endIdx = i + 3;
    if (endIdx >= body.length && body[body.length - 1].type === 'ReturnStatement') {
      endIdx = body.length - 1;
    }
    
    if (endIdx > i + 2) {
      const group = body.slice(i, endIdx);
      
      // Calculate lines
      const startLine = group[0].loc?.start.line || 0;
      const endLine = group[group.length - 1].loc?.end.line || 0;
      const lines = endLine - startLine + 1;
      
      // Only suggest if substantial (3+ lines, not just comments)
      if (lines >= 3 && group.length >= 2) {
        groups.push({
          startIndex: i,
          endIndex: endIdx,
          statements: group,
          lines: lines
        });
        break; // Take first good candidate only
      }
    }
  }
  
  return groups;
}

/**
 * MAIN ENGINE — Working extraction with simplified logic
 */
function suggestExtractFunction(code, filename = 'file.js') {
  let ast;

  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "classProperties", "optionalChaining", "dynamicImport"]
    });
  } catch (err) {
    return {
      ok: false,
      error: 'parse_error',
      details: err.message,
      suggestions: []
    };
  }

  const suggestions = [];
  let functionsAnalyzed = 0;

  traverse(ast, {
    FunctionDeclaration(fnPath) {
      if (suggestions.length >= 2) {
        fnPath.stop();
        return;
      }

      const fnName = fnPath.node.id?.name || '<anonymous>';
      const fnLength = fnPath.node.loc ? 
        (fnPath.node.loc.end.line - fnPath.node.loc.start.line + 1) : 0;

      // Lower threshold to 8 lines for demo purposes
      if (fnLength < 8) return;

      functionsAnalyzed++;

      // Get function parameter names
      const functionParamNames = fnPath.node.params.map(p => p.name || (p.type === 'Identifier' ? p.name : null)).filter(Boolean);

      const groups = findExtractableGroups(fnPath.node);
      if (groups.length === 0) return;

      const group = groups[0];
      const extractedName = generateSmartName(group.statements);
      const externalVars = findExternalVariables(group.statements, functionParamNames);
      const modifiedVars = findModifiedVariables(group.statements);

      // Build extracted function
      const params = externalVars.map(v => t.identifier(v));
      
      // Add return for modified variables if any
      let extractedBody = [...group.statements];
      if (modifiedVars.length === 1) {
        extractedBody.push(t.returnStatement(t.identifier(modifiedVars[0])));
      } else if (modifiedVars.length > 1) {
        extractedBody.push(
          t.returnStatement(
            t.objectExpression(
              modifiedVars.map(v => t.objectProperty(t.identifier(v), t.identifier(v), false, true))
            )
          )
        );
      }
      
      const extractedFnAst = t.functionDeclaration(
        t.identifier(extractedName),
        params,
        t.blockStatement(extractedBody)
      );

      // Create modified version of the code
      try {
        // Clone and modify
        const modifiedBody = [...fnPath.node.body.body];
        
        // Create call to extracted function
        const callArgs = externalVars.map(v => t.identifier(v));
        let replacementStmt;
        
        if (modifiedVars.length === 0) {
          replacementStmt = t.expressionStatement(
            t.callExpression(t.identifier(extractedName), callArgs)
          );
        } else if (modifiedVars.length === 1) {
          replacementStmt = t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.identifier(modifiedVars[0]),
              t.callExpression(t.identifier(extractedName), callArgs)
            )
          );
        } else {
          replacementStmt = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.objectPattern(
                modifiedVars.map(v => t.objectProperty(t.identifier(v), t.identifier(v), false, true))
              ),
              t.callExpression(t.identifier(extractedName), callArgs)
            )
          ]);
        }
        
        // Replace extracted statements with function call
        modifiedBody.splice(group.startIndex, group.statements.length, replacementStmt);
        
        // Create new function with modified body
        const modifiedFn = t.functionDeclaration(
          fnPath.node.id,
          fnPath.node.params,
          t.blockStatement(modifiedBody),
          fnPath.node.generator,
          fnPath.node.async
        );
        
        // Build complete modified program
        const modifiedAst = {
          type: "File",
          program: {
            type: "Program",
            body: [
              ...ast.program.body.filter(node => 
                !(node.type === 'FunctionDeclaration' && node.id?.name === fnName)
              ),
              modifiedFn,
              extractedFnAst
            ],
            sourceType: "module"
          }
        };

        // Generate code
        const patchedCode = generator(modifiedAst, { retainLines: false, compact: false }).code;
        const extractedCode = generator(extractedFnAst, { retainLines: false, compact: false }).code;

        suggestions.push({
          type: "extract_function",
          function: fnName,
          extractedName,
          parameters: externalVars,
          returns: modifiedVars,
          linesExtracted: group.lines,
          beforeSnippet: code,
          extractedCode,
          patchedCode,
          description: `Extract ${group.statements.length} statements (${group.lines} lines) into ${extractedName}(${externalVars.join(', ')})`,
          benefit: `Simplifies ${fnName} and improves readability by separating concerns`,
          risk: modifiedVars.length > 0 ? "medium" : "low"
        });
      } catch (err) {
        console.error("Error generating suggestion:", err);
      }
    }
  });

  return {
    ok: true,
    suggestions,
    summary: {
      total: suggestions.length,
      functionsAnalyzed
    }
  };
}

module.exports = { suggestExtractFunction };