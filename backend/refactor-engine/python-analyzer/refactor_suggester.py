#!/usr/bin/env python3
"""
Python refactoring suggester - extracts functions and suggests improvements
Usage: echo '{"code": "...", "filename": "..."}' | python refactor_suggester.py
"""

import sys
import json
import ast
import random
import string

class RefactorAnalyzer(ast.NodeVisitor):
    def __init__(self, source_code):
        self.suggestions = []
        self.source_lines = source_code.split('\n')
        self.source_code = source_code
        
    def visit_FunctionDef(self, node):
        # Suggest refactoring for functions that are long enough
        function_length = node.end_lineno - node.lineno + 1 if node.end_lineno else 0
        
        # Count total statements including nested ones
        total_statements = sum(1 for _ in ast.walk(node) if isinstance(_, ast.stmt))
        
        # Suggest if function is long (10+ lines) OR has many statements (8+)
        if function_length >= 10 or total_statements >= 8:
            suggestion = self._analyze_function(node)
            if suggestion:
                self.suggestions.append(suggestion)
        
        self.generic_visit(node)
    
    def visit_AsyncFunctionDef(self, node):
        self.visit_FunctionDef(node)
    
    def _analyze_function(self, node):
        """Analyze a function and suggest extraction"""
        function_name = node.name
        function_body = node.body
        
        # Look for extractable blocks (loops, if statements, etc.)
        extractable = self._find_extractable_block(function_body)
        
        if not extractable:
            return None
        
        start_line, end_line, statements = extractable
        
        # Generate extracted function name
        extracted_name = self._generate_function_name(statements)
        
        # Find external variables
        external_vars = self._find_external_variables(statements, node)
        
        # Build extracted function
        extracted_code = self._build_extracted_function(
            extracted_name, 
            external_vars, 
            statements,
            isinstance(node, ast.AsyncFunctionDef)
        )
        
        # Build patched code
        patched_code = self._build_patched_code(
            node, 
            start_line, 
            end_line, 
            extracted_name, 
            external_vars
        )
        
        lines_extracted = end_line - start_line + 1
        
        return {
            'type': 'extract_function',
            'function': function_name,
            'extractedName': extracted_name,
            'parameters': external_vars,
            'returns': [],
            'linesExtracted': lines_extracted,
            'beforeSnippet': self.source_code,
            'extractedCode': extracted_code,
            'patchedCode': patched_code,
            'description': f'Extract {len(statements)} statements ({lines_extracted} lines) into {extracted_name}()',
            'benefit': f'Simplifies {function_name} and improves readability by separating concerns',
            'risk': 'low'
        }
    
    def _find_extractable_block(self, body):
        """Find a block of statements that can be extracted"""
        if not body:
            return None
        
        # Strategy 1: Look for complex if blocks (good extraction candidates)
        for i, stmt in enumerate(body):
            if isinstance(stmt, ast.If):
                # If the if block is substantial, suggest extracting it
                if stmt.end_lineno and (stmt.end_lineno - stmt.lineno) >= 5:
                    return (stmt.lineno, stmt.end_lineno, [stmt])
        
        # Strategy 2: Look for loops (good extraction candidates)
        for i, stmt in enumerate(body):
            if isinstance(stmt, (ast.For, ast.While)):
                # Check if there are statements before the loop
                if i > 0 and i >= 2:
                    # Extract statements before the loop
                    statements = body[0:i]
                    start_line = statements[0].lineno
                    end_line = statements[-1].end_lineno or statements[-1].lineno
                    if end_line - start_line + 1 >= 3:
                        return (start_line, end_line, statements)
                
                # Or extract the loop itself if it's complex
                if stmt.end_lineno and (stmt.end_lineno - stmt.lineno) >= 5:
                    return (stmt.lineno, stmt.end_lineno, [stmt])
        
        # Strategy 3: Extract middle section (avoid first and last statements)
        if len(body) >= 6:
            # Skip first statement, take next 3-4 statements
            start_idx = 1
            end_idx = min(4, len(body) - 2)  # Leave at least last statement
            statements = body[start_idx:end_idx]
            
            if statements:
                start_line = statements[0].lineno
                end_line = statements[-1].end_lineno or statements[-1].lineno
                if end_line - start_line + 1 >= 3:
                    return (start_line, end_line, statements)
        
        # Strategy 4: Take first chunk (but not if last is return)
        if len(body) >= 3:
            end_idx = len(body) - 1 if isinstance(body[-1], ast.Return) else len(body)
            
            if end_idx >= 2:
                take_count = min(2, end_idx)
                statements = body[0:take_count]
                
                if statements:
                    start_line = statements[0].lineno
                    end_line = statements[-1].end_lineno or statements[-1].lineno
                    lines = end_line - start_line + 1
                    
                    if lines >= 5:  # Only if substantial
                        return (start_line, end_line, statements)
        
        return None
    
    def _find_external_variables(self, statements, function_node):
        """Find variables used in statements that come from outside"""
        # Get function parameters
        param_names = [arg.arg for arg in function_node.args.args]
        
        # Find all names referenced in the statements
        referenced = set()
        defined = set()
        
        for stmt in statements:
            for node in ast.walk(stmt):
                if isinstance(node, ast.Name):
                    if isinstance(node.ctx, ast.Store):
                        defined.add(node.id)
                    elif isinstance(node.ctx, ast.Load):
                        referenced.add(node.id)
        
        # External variables are those referenced but not defined in the block
        external = referenced - defined
        
        # Filter to only function parameters (most common case)
        external_params = [name for name in external if name in param_names]
        
        return external_params
    
    def _generate_function_name(self, statements):
        """Generate a meaningful name for the extracted function"""
        keywords = []
        
        for stmt in statements:
            if isinstance(stmt, ast.For):
                # Get the target variable name
                if isinstance(stmt.target, ast.Name):
                    keywords.append(f'process_{stmt.target.id}')
                else:
                    keywords.append('process_items')
            elif isinstance(stmt, ast.If):
                # Try to extract condition info
                keywords.append('validate')
            elif isinstance(stmt, ast.Assign):
                # Get variable names being assigned
                for target in stmt.targets:
                    if isinstance(target, ast.Name):
                        keywords.append(f'calculate_{target.id}')
                        break
            elif isinstance(stmt, ast.Return):
                keywords.append('compute_result')
            
            # Look for function calls to understand purpose
            for node in ast.walk(stmt):
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        func_name = node.func.id
                        if func_name not in ['print', 'len', 'str', 'int', 'float', 'list', 'dict']:
                            keywords.append(func_name)
                    elif isinstance(node.func, ast.Attribute):
                        keywords.append(node.func.attr)
        
        # Use first 2 meaningful keywords
        name_parts = [k for k in keywords if len(k) > 2 and not k.startswith('_')][:2]
        
        if name_parts:
            # Clean up the name
            clean_name = '_'.join(name_parts).replace('__', '_')
            return clean_name if not clean_name.startswith('extracted_') else clean_name
        
        # Better fallback names based on statement types
        if any(isinstance(s, ast.For) for s in statements):
            return 'process_loop_logic'
        elif any(isinstance(s, ast.If) for s in statements):
            return 'validate_conditions'
        elif any(isinstance(s, ast.Assign) for s in statements):
            return 'calculate_values'
        
        return 'extracted_logic'
    
    def _build_extracted_function(self, name, params, statements, is_async):
        """Build the extracted function code"""
        indent = '    '
        
        # Function signature
        async_keyword = 'async ' if is_async else ''
        params_str = ', '.join(params) if params else ''
        lines = [f"{async_keyword}def {name}({params_str}):"]
        
        # Function body
        for stmt in statements:
            stmt_code = ast.unparse(stmt)
            # Add indentation
            for line in stmt_code.split('\n'):
                lines.append(indent + line)
        
        return '\n'.join(lines)
    
    def _build_patched_code(self, function_node, start_line, end_line, extracted_name, params):
        """Build the complete patched code with extracted function"""
        # Get original source lines
        lines = self.source_lines.copy()
        
        # Build the call to extracted function
        params_str = ', '.join(params) if params else ''
        call_line = f"    {extracted_name}({params_str})"
        
        # Calculate line indices (ast uses 1-based, lists use 0-based)
        start_idx = start_line - 1
        end_idx = end_line - 1
        
        # Get the indentation of the first statement
        original_indent = len(lines[start_idx]) - len(lines[start_idx].lstrip())
        call_line = ' ' * original_indent + f"{extracted_name}({params_str})"
        
        # Replace the extracted lines with the function call
        lines[start_idx:end_idx + 1] = [call_line]
        
        # Build extracted function code
        extracted_code = self._build_extracted_function(
            extracted_name,
            params,
            function_node.body[0:3],  # The statements we extracted
            isinstance(function_node, ast.AsyncFunctionDef)
        )
        
        # Add extracted function at the end
        lines.append('')
        lines.append(extracted_code)
        
        return '\n'.join(lines)

def suggest_refactoring(code, filename='file.py'):
    """Main function to suggest refactorings"""
    try:
        tree = ast.parse(code, filename=filename)
    except SyntaxError as e:
        return {
            'ok': False,
            'error': 'parse_error',
            'details': str(e),
            'suggestions': []
        }
    
    analyzer = RefactorAnalyzer(code)
    analyzer.visit(tree)
    
    return {
        'ok': True,
        'suggestions': analyzer.suggestions[:2],  # Limit to 2 suggestions
        'summary': {
            'total': len(analyzer.suggestions[:2]),
            'functionsAnalyzed': len([s for s in analyzer.suggestions if s])
        }
    }

if __name__ == '__main__':
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        code = input_data.get('code', '')
        filename = input_data.get('filename', 'file.py')
        
        # Suggest refactorings
        result = suggest_refactoring(code, filename)
        
        # Output JSON result to stdout
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        error_result = {
            'ok': False,
            'error': 'suggester_error',
            'details': str(e),
            'suggestions': []
        }
        print(json.dumps(error_result))
        sys.exit(1)