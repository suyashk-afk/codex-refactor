# Specs Directory Structure

## Current Structure

```
.kiro/specs/
│
├── README.md                           # Overview of all specifications
├── SPECS_COMPLETE.md                   # Summary of completed work
├── DIRECTORY_STRUCTURE.md              # This file
│
├── ast-analyzer-spec.md                # Legacy spec (updated with references)
├── python-support-spec.md              # Legacy spec (updated with references)
│
├── scientific-metrics/
│   ├── requirements.md                 # ✅ COMPLETE (8 req, 40 criteria)
│   ├── design.md                       # ⏳ TODO
│   └── tasks.md                        # ⏳ TODO
│
├── github-repository-scanner/
│   ├── requirements.md                 # ✅ COMPLETE (8 req, 40 criteria)
│   ├── design.md                       # ⏳ TODO
│   └── tasks.md                        # ⏳ TODO
│
├── time-machine-analysis/
│   ├── requirements.md                 # ✅ COMPLETE (9 req, 45 criteria)
│   ├── design.md                       # ⏳ TODO
│   └── tasks.md                        # ⏳ TODO
│
├── ai-refactoring-suggestions/
│   ├── requirements.md                 # ✅ COMPLETE (9 req, 45 criteria)
│   ├── design.md                       # ⏳ TODO
│   └── tasks.md                        # ⏳ TODO
│
└── multi-language-support/
    ├── requirements.md                 # ✅ COMPLETE (9 req, 45 criteria)
    ├── design.md                       # ⏳ TODO
    └── tasks.md                        # ⏳ TODO
```

## File Descriptions

### Root Level Files

#### README.md
- **Purpose:** Central documentation for all specifications
- **Contents:**
  - Overview of all 7 specs
  - EARS patterns and INCOSE rules
  - Development workflow (4 phases)
  - Usage guidelines for developers, Kiro, reviewers, and stakeholders
  - Contributing guidelines
  - References to standards

#### SPECS_COMPLETE.md
- **Purpose:** Summary of completed requirements phase
- **Contents:**
  - What was created (9 files)
  - Statistics (52 requirements, 255 criteria)
  - Quality indicators
  - Next steps for design phase
  - Success metrics

#### DIRECTORY_STRUCTURE.md
- **Purpose:** Visual guide to specs organization
- **Contents:** This file

#### ast-analyzer-spec.md (Legacy)
- **Purpose:** Original AST analyzer specification
- **Status:** ✅ Updated with references to scientific-metrics spec
- **Contents:**
  - Core functionality overview
  - Metrics to calculate
  - Implementation notes
  - Links to related specs

#### python-support-spec.md (Legacy)
- **Purpose:** Original Python support specification
- **Status:** ✅ Updated with references to multi-language-support spec
- **Contents:**
  - Language detection overview
  - Python analysis approach
  - Architecture notes
  - Links to related specs

### Feature Spec Directories

Each feature has its own directory with three files:

#### requirements.md ✅
- **Status:** Complete for all 5 features
- **Format:** EARS patterns + INCOSE rules
- **Structure:**
  - Introduction
  - Glossary
  - Requirements (with user stories)
  - Acceptance Criteria (4-9 per requirement)

#### design.md ⏳
- **Status:** TODO for all 5 features
- **Planned Structure:**
  - Architecture Overview
  - Components and Interfaces
  - Data Models
  - Correctness Properties (for property-based testing)
  - Error Handling
  - Testing Strategy

#### tasks.md ⏳
- **Status:** TODO for all 5 features
- **Planned Structure:**
  - Numbered task list
  - Sub-tasks with requirement references
  - Property-based test tasks
  - Checkpoint tasks
  - Optional tasks marked with *

## Statistics

### Completed (Phase 1: Requirements)
- ✅ 5 comprehensive requirements documents
- ✅ 2 updated legacy specs
- ✅ 3 documentation files
- ✅ 52 total requirements
- ✅ 255 total acceptance criteria
- ✅ 100% EARS pattern compliance
- ✅ 100% INCOSE rule compliance

### Pending (Phase 2: Design)
- ⏳ 5 design documents
- ⏳ Correctness properties definition
- ⏳ Component interface specifications
- ⏳ Data model definitions
- ⏳ Testing strategy documentation

### Pending (Phase 3: Tasks)
- ⏳ 5 task lists
- ⏳ Implementation task breakdown
- ⏳ Property-based test tasks
- ⏳ Checkpoint definitions
- ⏳ Optional task marking

### Pending (Phase 4: Implementation)
- ⏳ Feature implementation
- ⏳ Test writing
- ⏳ Validation against criteria
- ⏳ Documentation updates

## Feature Breakdown

### 1. Scientific Metrics (8 requirements, 40 criteria)
**Focus:** Industry-standard code quality calculations

**Key Requirements:**
- McCabe complexity calculation
- Complexity calibration and thresholds
- Code toxicity scoring
- Maintainability index
- Magic number detection
- Technical debt estimation
- Repository-level metrics
- Metric validation

**Related Code:**
- `backend/refactor-engine/ast-analyzer/index.js`
- `test-complexity.js`, `test-toxicity.js`, `test-calibration.js`

---

### 2. GitHub Repository Scanner (8 requirements, 40 criteria)
**Focus:** Comprehensive repository analysis

**Key Requirements:**
- GitHub URL parsing
- Repository file discovery
- GitHub API integration
- Batch file analysis
- Aggregate repository metrics
- File ranking and prioritization
- Error handling and resilience
- Performance and scalability

**Related Code:**
- `backend/github-fetcher.js`
- `backend/server.js` (repository endpoints)

---

### 3. Time Machine Analysis (9 requirements, 45 criteria) 🏆
**Focus:** Historical code quality tracking

**Key Requirements:**
- Git commit history retrieval
- Historical file content retrieval
- Quality metrics per commit
- Quality trend detection
- Regression identification
- Best/worst commit identification
- Visualization data formatting
- Performance and rate limiting
- Commit filtering and selection

**Related Code:**
- `backend/commit-analyzer.js`
- `codex_mcp/mcp_server.py` (analyze_repository_history)

**Why This Wins:**
- Unique feature in the market
- Fills gap left by expensive tools
- Provides actionable insights

---

### 4. AI-Powered Refactoring (9 requirements, 45 criteria)
**Focus:** Intelligent refactoring suggestions

**Key Requirements:**
- Code analysis for opportunities
- Extract function generation
- External variable detection
- Before/after diff generation
- Risk assessment
- Gemini AI integration
- Refactoring validation
- Suggestion ranking
- Performance optimization

**Related Code:**
- `backend/refactor-engine/refactor-suggester/`
- `backend/report-generator.js`
- `backend/.env` (GEMINI_API_KEY)

---

### 5. Multi-Language Support (9 requirements, 45 criteria)
**Focus:** Unified analysis across languages

**Key Requirements:**
- Automatic language detection
- JavaScript/TypeScript engine
- Python analysis engine
- Node.js to Python bridge
- Consistent metrics across languages
- Language-specific smell detection
- Error handling and fallback
- Performance optimization
- Feature parity

**Related Code:**
- `backend/refactor-engine/python-analyzer/analyzer.py`
- `backend/refactor-engine/ast-analyzer/index.js`
- `backend/server.js` (language routing)

---

## Cross-References

### Specs That Reference Each Other

**scientific-metrics** references:
- multi-language-support (for language-specific metrics)

**github-repository-scanner** references:
- scientific-metrics (for quality calculations)
- multi-language-support (for file type handling)

**time-machine-analysis** references:
- scientific-metrics (for historical metrics)
- github-repository-scanner (for API integration)

**ai-refactoring-suggestions** references:
- scientific-metrics (for quality improvement estimation)
- multi-language-support (for language-specific refactoring)

**multi-language-support** references:
- scientific-metrics (for consistent metric calculation)

**ast-analyzer-spec** references:
- scientific-metrics (comprehensive version)
- multi-language-support (for JS/TS specifics)

**python-support-spec** references:
- multi-language-support (comprehensive version)
- scientific-metrics (for Python metrics)

---

## Quality Assurance

### Requirements Quality Checklist
For each requirements.md:
- [x] Has Introduction section
- [x] Has Glossary with all terms
- [x] Has numbered Requirements
- [x] Each requirement has User Story
- [x] Each requirement has 4-9 Acceptance Criteria
- [x] All criteria follow EARS patterns
- [x] All criteria comply with INCOSE rules
- [x] All criteria are testable
- [x] No vague terms
- [x] No escape clauses
- [x] Active voice throughout
- [x] Consistent terminology

### Design Quality Checklist (TODO)
For each design.md:
- [ ] Has Architecture Overview
- [ ] Has Component Interfaces
- [ ] Has Data Models
- [ ] Has Correctness Properties
- [ ] Has Error Handling Strategy
- [ ] Has Testing Strategy
- [ ] References requirements
- [ ] Includes diagrams where appropriate

### Task Quality Checklist (TODO)
For each tasks.md:
- [ ] Has numbered task list
- [ ] Each task references requirements
- [ ] Has sub-tasks with details
- [ ] Has checkpoint tasks
- [ ] Optional tasks marked with *
- [ ] Property-based test tasks included
- [ ] Tasks are implementable
- [ ] Tasks build incrementally

---

## Usage Guide

### For Developers

**To understand a feature:**
1. Read `requirements.md` for what needs to be built
2. Check acceptance criteria for completion definition
3. Review related specs for context

**To implement a feature:**
1. Read requirements first
2. Wait for design document (or create it)
3. Follow task list (or create it)
4. Validate against acceptance criteria

### For Kiro AI Agent

**To create design documents:**
```
"Create the design document for [feature-name] based on the requirements"
```

**To create task lists:**
```
"Create the task list for [feature-name] based on the requirements and design"
```

**To implement features:**
```
"Implement [feature-name] following the spec"
```

### For Code Reviewers

**To review implementations:**
1. Open the requirements.md
2. Check each acceptance criterion
3. Verify implementation matches
4. Validate tests cover all criteria

### For Stakeholders

**To track progress:**
1. Check README.md for overview
2. Review SPECS_COMPLETE.md for status
3. Examine individual requirements for details
4. Monitor phase completion

---

## Next Actions

### Immediate (You Choose)

**Option A: Design Phase**
Create design documents for all 5 features:
1. scientific-metrics/design.md
2. github-repository-scanner/design.md
3. time-machine-analysis/design.md
4. ai-refactoring-suggestions/design.md
5. multi-language-support/design.md

**Option B: Task Phase**
Create task lists for all 5 features:
1. scientific-metrics/tasks.md
2. github-repository-scanner/tasks.md
3. time-machine-analysis/tasks.md
4. ai-refactoring-suggestions/tasks.md
5. multi-language-support/tasks.md

**Option C: Implementation**
Pick one feature and implement it end-to-end:
- Recommended: time-machine-analysis (winning feature)
- Alternative: scientific-metrics (foundation)

**Option D: Review**
Review and refine existing requirements:
- Add missing edge cases
- Clarify ambiguous criteria
- Add performance requirements

---

## Maintenance

### When to Update Specs

**Requirements:**
- When user needs change
- When edge cases are discovered
- When acceptance criteria are unclear
- When new features are requested

**Design:**
- When architecture changes
- When new components are added
- When interfaces change
- When correctness properties are refined

**Tasks:**
- When implementation approach changes
- When new sub-tasks are identified
- When dependencies change
- When checkpoints need adjustment

### How to Update Specs

1. Update the relevant file
2. Update cross-references if needed
3. Update README.md if structure changes
4. Update SPECS_COMPLETE.md with new statistics
5. Commit with clear message

---

## Success Criteria

### Phase 1: Requirements ✅
- [x] All major features have requirements
- [x] All requirements follow EARS patterns
- [x] All requirements comply with INCOSE rules
- [x] All acceptance criteria are testable
- [x] All specs are cross-referenced

### Phase 2: Design ⏳
- [ ] All features have design documents
- [ ] All designs define correctness properties
- [ ] All designs specify component interfaces
- [ ] All designs include data models
- [ ] All designs document testing strategy

### Phase 3: Tasks ⏳
- [ ] All features have task lists
- [ ] All tasks reference requirements
- [ ] All tasks are implementable
- [ ] All tasks include checkpoints
- [ ] Property-based test tasks included

### Phase 4: Implementation ⏳
- [ ] All features implemented
- [ ] All tests written and passing
- [ ] All acceptance criteria validated
- [ ] All documentation updated

---

**Current Phase:** Requirements Complete ✅  
**Next Phase:** Design Documents ⏳  
**Total Files:** 9 (5 requirements + 2 legacy + 2 docs)
