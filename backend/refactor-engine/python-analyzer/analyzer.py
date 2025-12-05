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
        complexity = calculate_complexity(func_data)
        
        # Long function detection (matching JS thresholds)
        if func_data['length'] > 100:
            smells.append({
                'type': 'long_function',
                'severity': 'critical',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' is {func_data['length']} lines long (critical threshold: 100+)",
                'suggestion': 'Break this function into multiple smaller, focused functions'
            })
        elif func_data['length'] > 50:
            smells.append({
                'type': 'long_function',
                'severity': 'high',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' is {func_data['length']} lines long (high threshold: 50+)",
                'suggestion': 'Consider extracting logical blocks into separate functions'
            })
        elif func_data['length'] > 20:
            smells.append({
                'type': 'moderate_function',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' is {func_data['length']} lines long",
                'suggestion': 'Could be simplified by extracting some logic'
            })
        
        # Deep nesting detection
        if func_data['nesting'] > 4:
            smells.append({
                'type': 'deep_nesting',
                'severity': 'high',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has nesting depth of {func_data['nesting']} (threshold: 4)",
                'suggestion': 'Use early returns, guard clauses, or extract nested logic'
            })
        elif func_data['nesting'] > 3:
            smells.append({
                'type': 'moderate_nesting',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has nesting depth of {func_data['nesting']}",
                'suggestion': 'Consider flattening with early returns'
            })
        
        # High complexity detection (McCabe)
        if complexity > 20:
            smells.append({
                'type': 'high_complexity',
                'severity': 'critical',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has cyclomatic complexity of {complexity} (critical: 20+)",
                'suggestion': 'Refactor immediately - this is untestable'
            })
        elif complexity > 10:
            smells.append({
                'type': 'high_complexity',
                'severity': 'high',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has cyclomatic complexity of {complexity} (high: 10+)",
                'suggestion': 'Break into smaller functions to reduce complexity'
            })
        elif complexity > 7:
            smells.append({
                'type': 'moderate_complexity',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has cyclomatic complexity of {complexity}",
                'suggestion': 'Consider simplifying the logic'
            })
        
        # Too many parameters
        if func_data['params'] > 5:
            smells.append({
                'type': 'too_many_parameters',
                'severity': 'high',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has {func_data['params']} parameters (threshold: 5)",
                'suggestion': 'Use a dataclass, dictionary, or configuration object'
            })
        elif func_data['params'] > 3:
            smells.append({
                'type': 'too_many_parameters',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' has {func_data['params']} parameters",
                'suggestion': 'Consider grouping related parameters'
            })
        
        # Magic numbers
        magic_numbers = self._find_magic_numbers(node)
        if len(magic_numbers) > 3:
            smells.append({
                'type': 'magic_numbers',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' contains {len(magic_numbers)} magic numbers",
                'suggestion': 'Extract magic numbers into named constants at module level'
            })
        elif magic_numbers:
            smells.append({
                'type': 'magic_numbers',
                'severity': 'low',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' contains magic numbers: {', '.join(map(str, magic_numbers[:3]))}",
                'suggestion': 'Consider using named constants for clarity'
            })
        
        # Missing error handling
        has_try = any(isinstance(stmt, ast.Try) for stmt in ast.walk(node))
        if not has_try and func_data['length'] > 15:
            smells.append({
                'type': 'missing_error_handling',
                'severity': 'medium',
                'line': func_data['start'],
                'message': f"Function '{func_data['name']}' lacks error handling",
                'suggestion': 'Add try-except blocks for potential errors'
            })
        
        func_data['smells'] = smells
        func_data['complexity'] = complexity
    
    def _find_magic_numbers(self, node):
        magic_numbers = set()
        
        for n in ast.walk(node):
            if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
                if n.value not in [0, 1, -1, 100, True, False]:
                    magic_numbers.add(n.value)
        
        return sorted(magic_numbers)

def calculate_complexity(func):
    """Calculate McCabe cyclomatic complexity: M = E - N + 2P (simplified to branches + 1)"""
    return func['branchCount'] + 1

def calculate_toxicity(analysis):
    """Calculate toxicity score based on severity-weighted code smells"""
    if not analysis['functions']:
        return 0
    
    severity_weights = {
        'high': 10,
        'medium': 5,
        'low': 2
    }
    
    type_multipliers = {
        'high_complexity': 1.5,
        'deep_nesting': 1.3,
        'long_function': 1.2,
        'too_many_parameters': 1.0,
        'magic_numbers': 1.0,
        'missing_error_handling': 1.1
    }
    
    total_toxicity = 0
    
    for func in analysis['functions']:
        for smell in func.get('smells', []):
            weight = severity_weights.get(smell['severity'], 5)
            multiplier = type_multipliers.get(smell['type'], 1.0)
            total_toxicity += weight * multiplier
    
    # Normalize to 0-100 scale (assume max 20 smells at high severity)
    max_possible = 20 * 10 * 1.5
    toxicity = min(100, (total_toxicity / max_possible) * 100)
    
    return round(toxicity)

def calculate_maintainability_index(quality_score, toxicity, avg_complexity):
    """Calculate maintainability index: MI = 0.5*Q + 0.3*(100-T) + 0.2*(100-5C)"""
    complexity_penalty = min(100, avg_complexity * 5)
    mi = 0.5 * quality_score + 0.3 * (100 - toxicity) + 0.2 * (100 - complexity_penalty)
    return round(max(0, min(100, mi)))

def calculate_quality_score(analysis):
    """Calculate quality score matching JavaScript algorithm"""
    if not analysis['functions']:
        return 100
    
    total_score = 0
    
    for func in analysis['functions']:
        # Start with base score
        fn_score = 100
        
        # Calculate complexity for this function
        complexity = calculate_complexity(func)
        
        # Penalties based on metrics
        if complexity > 20:
            fn_score -= 30
        elif complexity > 10:
            fn_score -= 20
        elif complexity > 7:
            fn_score -= 10
        elif complexity > 4:
            fn_score -= 5
        
        # Length penalties
        if func['length'] > 100:
            fn_score -= 25
        elif func['length'] > 50:
            fn_score -= 15
        elif func['length'] > 20:
            fn_score -= 8
        
        # Nesting penalties
        if func['nesting'] > 4:
            fn_score -= 20
        elif func['nesting'] > 3:
            fn_score -= 12
        elif func['nesting'] > 2:
            fn_score -= 6
        
        # Parameter penalties
        if func['params'] > 5:
            fn_score -= 10
        elif func['params'] > 3:
            fn_score -= 5
        
        # Smell penalties
        smell_count = len(func.get('smells', []))
        fn_score -= smell_count * 3
        
        # Bonus for good practices
        if func['length'] < 15 and complexity < 5:
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
    
    # Calculate average complexity
    avg_complexity = 0
    if analyzer.functions:
        total_complexity = sum(calculate_complexity(f) for f in analyzer.functions)
        avg_complexity = round(total_complexity / len(analyzer.functions), 2)
    
    result = {
        'imports': analyzer.imports,
        'exports': 0,
        'functions': analyzer.functions,
        'totalSmells': total_smells,
        'smellsByType': dict(smells_by_type),
        'qualityScore': 0,
        'toxicity': 0,
        'maintainabilityIndex': 0,
        'summary': {
            'totalFunctions': len(analyzer.functions),
            'averageLength': avg_length,
            'averageComplexity': avg_complexity,
            'healthStatus': 'unknown'
        }
    }
    
    # Calculate all metrics
    result['qualityScore'] = calculate_quality_score(result)
    result['toxicity'] = calculate_toxicity(result)
    result['maintainabilityIndex'] = calculate_maintainability_index(
        result['qualityScore'],
        result['toxicity'],
        avg_complexity
    )
    
    # Calculate technical debt (15 minutes per smell)
    technical_debt_minutes = total_smells * 15
    result['technicalDebt'] = {
        'minutes': technical_debt_minutes,
        'hours': round(technical_debt_minutes / 60, 1),
        'formatted': f"{technical_debt_minutes // 60}h {technical_debt_minutes % 60}m" if technical_debt_minutes >= 60 else f"{technical_debt_minutes}m"
    }
    
    score = result['qualityScore']
    result['summary']['healthStatus'] = (
        'healthy' if score >= 80 else
        'needs_improvement' if score >= 50 else
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