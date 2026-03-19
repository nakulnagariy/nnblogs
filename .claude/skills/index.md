# Claude Skills Registry

This directory contains structured skills that guide Claude's execution for specific tasks. Each skill defines triggers, inputs, outputs, and deterministic execution steps.

## Available Skills

### 1. Architecture Review Skill

**File**: `architecture-skill.md`  
**Purpose**: Evaluate code against architectural rules and detect violations  
**Triggers**:

- "review architecture"
- "analyze structure"
- "validate layering"
- "check architecture"

**Use When**: Need to validate code follows architectural patterns (Server vs Client Components, layer separation, dependency rules)

---

### 2. Refactor Skill

**File**: `refactor-skill.md`  
**Purpose**: Improve code maintainability without changing behavior  
**Triggers**:

- "refactor"
- "improve code quality"
- "clean up code"
- "extract component"

**Use When**: Code works but needs improved readability, reduced complexity, or better organization

---

### 3. Testing Skill

**File**: `testing-skill.md`  
**Purpose**: Generate missing tests and improve coverage  
**Triggers**:

- "add tests"
- "write tests"
- "test coverage"
- "generate tests"

**Use When**: Need to add tests for new features or increase coverage for untested code

---

### 4. API Design Skill

**File**: `api-design-skill.md`  
**Purpose**: Validate API endpoint consistency and design  
**Triggers**:

- "review api"
- "validate endpoint"
- "check api design"
- "api audit"

**Use When**: Creating new API routes or validating existing ones for consistency

---

### 5. Performance Optimization Skill

**File**: `performance-skill.md`  
**Purpose**: Identify and fix performance issues  
**Triggers**:

- "optimize performance"
- "improve performance"
- "performance audit"
- "find bottlenecks"

**Use When**: App feels slow, bundle size is large, or queries are inefficient

---

### 6. Security Audit Skill

**File**: `security-skill.md`  
**Purpose**: Identify security vulnerabilities and issues  
**Triggers**:

- "security audit"
- "check security"
- "security review"
- "find vulnerabilities"

**Use When**: Before releasing features, especially those handling user input or authentication

---

### 7. Documentation Skill

**File**: `documentation-skill.md`  
**Purpose**: Generate and update documentation  
**Triggers**:

- "document code"
- "add documentation"
- "update docs"
- "generate jsdoc"

**Use When**: Public APIs lack documentation or README needs updates

---

## How Skills Work

### Invocation

Skills are invoked by keywords in user requests. When triggered:

1. Skill defines execution steps
2. Claude follows steps deterministically
3. Output follows skill-specified format
4. Results are validated against constraints

### Skill Structure

Each skill defines:

- **Purpose**: What the skill accomplishes
- **Triggers**: Keywords that invoke the skill
- **Input Requirements**: What data/context is needed
- **Execution Steps**: Deterministic process to follow
- **Output Format**: Structured result format
- **Constraints**: Limitations and safety checks
- **Examples**: Sample inputs and outputs

### Extending Skills

To add a new skill:

1. Create `skillname-skill.md` in this directory
2. Follow the skill template structure
3. Add entry to this index with triggers
4. Reference from main `CLAUDE.md` file

## Skill Composition

Skills can be combined:

- "Refactor and add tests" → Refactor Skill + Testing Skill
- "Review API security" → API Design Skill + Security Skill
- "Optimize and document" → Performance Skill + Documentation Skill

## Success Criteria

A skill execution is successful when:

- All defined steps are completed
- Output matches specified format
- Constraints are respected
- No breaking changes introduced (unless explicitly requested)
- Existing tests still pass
