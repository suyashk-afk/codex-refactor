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
        # Only suggest refactoring for functions longer than 10 lines
        function_length = node.end_lineno - node.lineno + 1 if node.end_lineno else 0
        
        if function_length >= 10:
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
        # Look for sequences of at least 3 statements
        if len(body) < 4:
            return None
        
        # Try to find a good chunk (skip the last statement if it's a return)
        end_idx = len(body) - 1 if isinstance(body[-1], ast.Return) else len(body)
        
        if end_idx < 3:
            return None
        
        # Take first 3 statements (or up to the return)
        start_idx = 0
        take_count = min(3, end_idx)
        statements = body[start_idx:take_count]
        
        if not statements:
            return None
        
        start_line = statements[0].lineno
        end_line = statements[-1].end_lineno if statements[-1].end_lineno else statements[-1].lineno
        
        lines = end_line - start_line + 1
        
        # Only suggest if substantial (3+ lines)
        if lines < 3:
            return None
        
        return (start_line, end_line, statements)
    
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
                keywords.append('loop')
            elif isinstance(stmt, ast.If):
                keywords.append('check')
            elif isinstance(stmt, ast.Assign):
                keywords.append('process')
            
            # Look for function calls
            for node in ast.walk(stmt):
                if isinstance(node, ast.Call):
                    if isinstance(node.func, ast.Name):
                        keywords.append(node.func.id)
                    elif isinstance(node.func, ast.Attribute):
                        keywords.append(node.func.attr)
        
        # Use first 2 keywords
        name_parts = [k for k in keywords if len(k) > 2][:2]
        
        if name_parts:
            return 'extracted_' + '_'.join(name_parts)
        
        # Fallback to random
        return 'extracted_' + ''.join(random.choices(string.ascii_lowercase, k=8))
    
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