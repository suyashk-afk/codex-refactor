#!/usr/bin/env python3
"""
Standalone Python code analyzer that reads from stdin and outputs JSON
Usage: echo '{"code": "...", "filename": "..."}' | python analyzer.py
"""

import sys
import json
import ast
from collections import defaultdict

class CodeAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.functions = []
        self.imports = 0
        self.current_function = None
        self.nesting_depth = 0
        self.max_nesting = 0
        
    def visit_Import(self, node):
        self.imports += len(node.names)
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node):
        self.imports += len(node.names)
        self.generic_visit(node)
    
    def visit_FunctionDef(self, node):
        prev_function = self.current_function
        prev_max_nesting = self.max_nesting
        
        self.current_function = {
            'name': node.name,
            'start': node.lineno,
            'end': node.end_lineno,
            'length': node.end_lineno - node.lineno + 1 if node.end_lineno else 1,
            'nesting': 0,
            'branchCount': 0,
            'nestedCallbacks': 0,
            'params': len(node.args.args),
            'isAsync': isinstance(node, ast.AsyncFunctionDef),
            'smells': []
        }
        
        self.max_nesting = 0
        self.nesting_depth = 0
        
        for stmt in node.body:
            self.visit(stmt)
        
        self.current_function['nesting'] = self.max_nesting
        self._detect_smells(self.current_function, node)
        self.functions.append(self.current_function)
        
        self.current_function = prev_function
        self.max_nesting = prev_max_nesting
    
    def visit_AsyncFunctionDef(self, node):
        self.visit_FunctionDef(node)
    
    def visit_If(self, node):
        if self.current_function:
            self.current_function['branchCount'] += 1
            self.nesting_depth += 1
            self.max_nesting = max(self.max_nesting, self.nesting_depth)
        
        self.generic_visit(node)
        
        if self.current_function:
            self.nesting_depth -= 1
    
    def visit_For(self, node):
        if self.current_function:
            self.current_function['branchCount'] += 1
            self.nesting_depth += 1
            self.max_nesting = max(self.max_nesting, self.nesting_depth)
        
        self.generic_visit(node)
        
        if self.current_function:
            self.nesting_depth -= 1
    
    def visit_While(self, node):
        if self.current_function:
            self.current_function['branchCount'] += 1
            self.nesting_depth += 1
            self.max_nesting = max(self.max_nesting, self.nesting_depth)
        
        self.generic_visit(node)
        
        if self.current_function:
            self.nesting_depth -= 1
    
    def visit_Try(self, node):
        if self.current_function:
            self.nesting_depth += 1
            self.max_nesting = max(self.max_nesting, self.nesting_depth)
        
        self.generic_visit(node)
        
        if self.current_function:
            self.nesting_depth -= 1
    
    def visit_With(self, node):
        if self.current_function:
            self.nesting_depth += 1
            self.max_nesting = max(self.max_nesting, self.nesting_depth)
        
        self.generic_visit(node)
        
        if self.current_function:
            self.nesting_depth -= 1
    
    def _detect_smells(self, func_data, node):
        smells = []
        
        if func_data['length'] > 20:
            smells.append({
                'type': 'long_function',
                'severity': 'high',
                'message': f"Function '{func_data['name']}' is {func_data['length']} lines long. Consider breaking it into smaller functions.",
                'suggestion': 'Extract logical blocks into separate functions'
            })
        
        if func_data['nesting'] > 3:
            smells.append({
                'type': 'deep_nesting',
                'severity': 'high',
                'message': f"Function '{func_data['name']}' has nesting depth of {func_data['nesting']}. This makes code hard to read.",
                'suggestion': 'Use early returns or extract nested logic into helper functions'
            })
        
        if func_data['branchCount'] > 10:
            smells.append({
                'type': 'high_complexity',
                'severity': 'high',
                'message': f"Function '{func_data['name']}' has {func_data['branchCount']} decision points. This is very complex.",
                'suggestion': 'Simplify logic or break into smaller functions'
            })
        
        if func_data['params'] > 4:
            smells.append({
                'type': 'too_many_parameters',
                'severity': 'medium',
                'message': f"Function '{func_data['name']}' has {func_data['params']} parameters.",
                'suggestion': 'Consider using a configuration object or dataclass'
            })
        
        magic_numbers = self._find_magic_numbers(node)
        if magic_numbers:
            smells.append({
                'type': 'magic_numbers',
                'severity': 'medium',
                'message': f"Function '{func_data['name']}' contains magic numbers: {', '.join(map(str, magic_numbers))}",
                'suggestion': 'Extract magic numbers into named constants'
            })
        
        has_try = any(isinstance(stmt, ast.Try) for stmt in ast.walk(node))
        if not has_try and func_data['length'] > 10:
            smells.append({
                'type': 'missing_error_handling',
                'severity': 'medium',
                'message': f"Function '{func_data['name']}' lacks error handling.",
                'suggestion': 'Add try-except blocks for potential errors'
            })
        
        func_data['smells'] = smells
    
    def _find_magic_numbers(self, node):
        magic_numbers = set()
        
        for n in ast.walk(node):
            if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
                if n.value not in [0, 1, -1, 100, True, False]:
                    magic_numbers.add(n.value)
        
        return sorted(magic_numbers)

def calculate_quality_score(analysis):
    # If no functions, return perfect score
    if not analysis['functions']:
        return 100
    
    penalties = {
        'long_function': 8,
        'deep_nesting': 10,
        'high_complexity': 12,
        'too_many_parameters': 6,
        'magic_numbers': 5,
        'missing_error_handling': 8
    }
    
    total_score = 0
    
    # Calculate score per function, then average
    for func in analysis['functions']:
        fn_score = 100
        
        for smell in func.get('smells', []):
            fn_score -= penalties.get(smell['type'], 5)
        
        # Bonus for concise functions
        if func['length'] < 15:
            fn_score += 5
        
        total_score += max(0, min(100, fn_score))
    
    # Average score across all functions
    avg_score = round(total_score / len(analysis['functions']))
    
    return max(0, min(100, avg_score))

def analyze_python_code(code, filename='file.py'):
    try:
        tree = ast.parse(code, filename=filename)
    except SyntaxError as e:
        return {
            'error': 'parse_error',
            'details': str(e),
            'suggestion': 'Check for syntax errors in your Python code'
        }
    
    analyzer = CodeAnalyzer()
    analyzer.visit(tree)
    
    smells_by_type = defaultdict(int)
    total_smells = 0
    
    for func in analyzer.functions:
        for smell in func.get('smells', []):
            smells_by_type[smell['type']] += 1
            total_smells += 1
    
    avg_length = 0
    if analyzer.functions:
        avg_length = sum(f['length'] for f in analyzer.functions) // len(analyzer.functions)
    
    result = {
        'imports': analyzer.imports,
        'exports': 0,
        'functions': analyzer.functions,
        'totalSmells': total_smells,
        'smellsByType': dict(smells_by_type),
        'qualityScore': 0,
        'summary': {
            'totalFunctions': len(analyzer.functions),
            'averageLength': avg_length,
            'healthStatus': 'unknown'
        }
    }
    
    result['qualityScore'] = calculate_quality_score(result)
    
    score = result['qualityScore']
    result['summary']['healthStatus'] = (
        'healthy' if score > 80 else
        'needs_improvement' if score > 50 else
        'critical'
    )
    
    return result

if __name__ == '__main__':
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        code = input_data.get('code', '')
        filename = input_data.get('filename', 'file.py')
        
        # Analyze the code
        result = analyze_python_code(code, filename)
        
        # Output JSON result to stdout
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        error_result = {
            'error': 'analyzer_error',
            'details': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)