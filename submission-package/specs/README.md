# Refactor Codex: Specification Overview

## Introduction

This directory contains comprehensive specifications for all major features of the Refactor Codex project. Each spec follows the EARS (Easy Approach to Requirements Syntax) pattern and INCOSE quality rules to ensure clarity, testability, and completeness.

## Specification Structure

Each feature spec contains:
- **requirements.md** - User stories and acceptance criteria following EARS patterns
- **design.md** - Technical architecture and implementation approach (to be created)
- **tasks.md** - Implementation task list with checkpoints (to be created)

## Feature Specifications

### 1. Scientific Metrics Engine
**Location:** `.kiro/specs/scientific-metrics/`

**Purpose:** Implements industry-standard code quality metrics based on established research.

**Key Features:**
- McCabe cyclomatic complexity calculation (M = decision_points + 1)
- Severity-weighted toxicity scoring
- Microsoft maintainability index
- Technical debt estimation
- Repository-level aggregate metrics

**Status:** ✅ Requirements Complete | ⏳ Design Pending | ⏳ Tasks Pending

**Related Files:**
- `backend/refactor-engine/ast-analyzer/index.js`
- Test files: `test-complexity.js`, `test-toxicity.js`, `test-calibration.js`

---

### 2. GitHub Repository Scanner
**Location:** `.kiro/specs/github-repository-scanner/`

**Purpose:** Enables comprehensive code quality analysis of entire GitHub repositories.

**Key Features:**
- GitHub API integration with rate limiting
- Batch file analysis (up to 30 files)
- Aggregate repository metrics
- File ranking and prioritization
- Technical debt hotspot identification

**Status:** ✅ Requirements Complete | ⏳ Design Pending | ⏳ Tasks Pending

**Related Files:**
- `backend/github-fetcher.js`
- `backend/server.js` (repository analysis endpoints)

---

### 3. Time Machine Analysis (🏆 WINNING FEATURE)
**Location:** `.kiro/specs/time-machine-analysis/`

**Purpose:** Tracks code quality evolution across Git commit history.

**Key Features:**
- Historical quality metric calculation
- Regression detection
- Quality trend analysis
- Best/worst commit identification
- Visualization data generation

**Status:** ✅ Requirements Complete | ⏳ Design Pending | ⏳ Tasks Pending

**Related Files:**
- `backend/commit-analyzer.js`
- `codex_mcp/mcp_server.py` (analyze_repository_history tool)

**Why This Wins:**
- Unique feature - no other tool shows code quality evolution
- Fills gap left by expensive tools like SonarQube
- Provides actionable insights for technical debt management

---

### 4. AI-Powered Refactoring Suggestions
**Location:** `.kiro/specs/ai-refactoring-suggestions/`

**Purpose:** Generates intelligent refactoring suggestions using Google Gemini AI.

**Key Features:**
- Extract function refactoring detection
- AI-generated function names and signatures
- Before/after diff generation
- Risk assessment (Low/Medium/High)
- External variable detection

**Status:** ✅ Requirements Complete | ⏳ Design Pending | ⏳ Tasks Pending

**Related Files:**
- `backend/refactor-engine/refactor-suggester/`
- `backend/report-generator.js`
- `backend/.env` (GEMINI_API_KEY configuration)

---

### 5. Multi-Language Support
**Location:** `.kiro/specs/multi-language-support/`

**Purpose:** Provides unified code analysis across JavaScript, TypeScript, and Python.

**Key Features:**
- Automatic language detection
- Node.js to Python bridge via child processes
- Consistent metrics across languages
- Language-specific code smell detection
- Feature parity across all languages

**Status:** ✅ Requirements Complete | ⏳ Design Pending | ⏳ Tasks Pending

**Related Files:**
- `backend/refactor-engine/python-analyzer/analyzer.py`
- `backend/refactor-engine/ast-analyzer/index.js`
- `backend/server.js` (language routing logic)

---

## Legacy Specs

### AST Analyzer Spec
**Location:** `.kiro/specs/ast-analyzer-spec.md`

**Status:** ✅ Updated to reference scientific-metrics spec

**Note:** This was the original spec. It has been updated to reference the more comprehensive scientific-metrics specification.

### Python Support Spec
**Location:** `.kiro/specs/python-support-spec.md`

**Status:** ✅ Updated to reference multi-language-support spec

**Note:** This was the original spec. It has been updated to reference the more comprehensive multi-language-support specification.

---

## Specification Methodology

### EARS Patterns Used

All requirements follow one of six EARS patterns:

1. **Ubiquitous:** THE <system> SHALL <response>
2. **Event-driven:** WHEN <trigger>, THE <system> SHALL <response>
3. **State-driven:** WHILE <condition>, THE <system> SHALL <response>
4. **Unwanted event:** IF <condition>, THEN THE <system> SHALL <response>
5. **Optional feature:** WHERE <option>, THE <system> SHALL <response>
6. **Complex:** [WHERE] [WHILE] [WHEN/IF] THE <system> SHALL <response>

### INCOSE Quality Rules

All requirements comply with:
- Active voice (who does what)
- No vague terms ("quickly", "adequate")
- No escape clauses ("where possible")
- No negative statements ("SHALL not...")
- One thought per requirement
- Explicit and measurable conditions
- Consistent, defined terminology
- No pronouns ("it", "them")
- No absolutes ("never", "always", "100%")
- Solution-free (focus on what, not how)

---

## Development Workflow

### Phase 1: Requirements (✅ COMPLETE)
- Define user stories
- Write acceptance criteria using EARS patterns
- Ensure INCOSE compliance
- Get stakeholder approval

### Phase 2: Design (⏳ NEXT)
For each spec, create `design.md` with:
- Architecture overview
- Component interfaces
- Data models
- Correctness properties (for property-based testing)
- Error handling strategy
- Testing approach

### Phase 3: Implementation (⏳ PENDING)
For each spec, create `tasks.md` with:
- Numbered task list
- Sub-tasks with requirement references
- Property-based test tasks
- Checkpoint tasks
- Optional tasks marked with *

### Phase 4: Validation (⏳ PENDING)
- Execute tasks
- Run property-based tests
- Validate against acceptance criteria
- Document results

---

## Metrics and Goals

### Coverage Goals
- ✅ 100% of major features have requirements specs
- ⏳ 0% have design documents (next phase)
- ⏳ 0% have task lists (next phase)

### Quality Goals
- All requirements follow EARS patterns
- All requirements comply with INCOSE rules
- All acceptance criteria are testable
- All specs reference related specifications

### Testing Goals
- Property-based tests for all correctness properties
- Unit tests for specific examples and edge cases
- Integration tests for multi-component features
- End-to-end tests for user workflows

---

## How to Use These Specs

### For Developers
1. Read the requirements to understand what needs to be built
2. Review acceptance criteria to know when you're done
3. Reference related specs for context
4. Use specs to guide implementation decisions

### For Kiro AI Agent
1. Read requirements before implementing features
2. Use acceptance criteria to validate implementations
3. Generate design documents based on requirements
4. Create task lists that reference specific requirements
5. Write property-based tests for correctness properties

### For Code Reviewers
1. Verify implementations match requirements
2. Check that acceptance criteria are met
3. Ensure tests cover all specified behaviors
4. Validate that edge cases are handled

### For Stakeholders
1. Review requirements for completeness
2. Validate that user stories match needs
3. Approve acceptance criteria
4. Track progress through phases

---

## Next Steps

### Immediate (Phase 2)
1. Create design documents for each spec
2. Define correctness properties for property-based testing
3. Specify component interfaces and data models
4. Document error handling strategies

### Short-term (Phase 3)
1. Generate task lists from design documents
2. Break down tasks into implementable units
3. Reference requirements in each task
4. Mark optional tasks (tests, documentation)

### Long-term (Phase 4)
1. Execute tasks using Kiro
2. Write property-based tests
3. Validate against acceptance criteria
4. Document lessons learned

---

## Contributing

When adding new specs:
1. Create a new directory: `.kiro/specs/<feature-name>/`
2. Write `requirements.md` following EARS patterns
3. Ensure INCOSE compliance
4. Add entry to this README
5. Link related specs
6. Update coverage metrics

---

## References

### Standards and Methodologies
- **EARS:** Easy Approach to Requirements Syntax
- **INCOSE:** International Council on Systems Engineering
- **McCabe Complexity:** Thomas J. McCabe (1976)
- **Maintainability Index:** Microsoft Research
- **Technical Debt:** SonarQube model

### Documentation
- `SPEC_DRIVEN_DEVELOPMENT.md` - How specs were used in this project
- `HACKATHON_STORY.md` - The journey of building this project
- `KIRO_AND_MCP_USAGE.md` - How Kiro was integrated

---

**Status:** Requirements phase complete for all major features. Design phase ready to begin.
