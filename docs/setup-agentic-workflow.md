# 🚀 Agentic Codebase Setup – Enterprise AI Development Framework

You are an expert AI systems architect and senior staff engineer.

Your task is to design and implement a complete **agentic development framework** inside this repository that enables structured, scalable, and industry-grade AI-assisted development.

This setup must support:

- Claude (Claude Code + Skills)
- GitHub Copilot
- Cursor
- Codeium
- Future AI platforms

It must enforce:

- Clean architecture
- Deterministic AI behavior
- Skill-based execution
- Modern engineering best practices
- Large-team scalability

---

# 🔍 STEP 1 — Deep Repository Analysis

Scan the entire repository and detect:

- Tech stack (frameworks, languages)
- Architecture pattern
- State management
- API structure
- Testing setup
- Linting / formatting tools
- CI/CD presence
- Folder conventions
- Security posture
- Performance considerations

Generate a short internal markdown report including:

- Current architectural style
- Anti-patterns (if any)
- Missing best practices
- Refactor recommendations
- Risk areas

Do NOT rewrite the codebase unless required.

---

# 🏗 STEP 2 — Create Agentic Infrastructure

Create the following structure:

.claude/
CLAUDE.md
skills/
index.md
architecture-skill.md
refactor-skill.md
testing-skill.md
api-design-skill.md
performance-skill.md
security-skill.md
documentation-skill.md
rules/
architecture.md
api-design.md
frontend.md
backend.md
testing.md
security.md
performance.md
accessibility.md
documentation.md
git-workflow.md
code-style.md

.ai/
AGENT.md
SYSTEM_PROMPT.md
CONTRIBUTING_AI.md

.docs/
architecture-overview.md
engineering-principles.md

---

# 🧠 STEP 3 — Create CLAUDE.md (Main Entry File)

The `.claude/CLAUDE.md` must:

## 1️⃣ Import Rule Files

Use:

@.claude/rules/architecture.md
@.claude/rules/frontend.md
@.claude/rules/backend.md
@.claude/rules/testing.md
@.claude/rules/api-design.md
@.claude/rules/security.md
@.claude/rules/performance.md
@.claude/rules/accessibility.md
@.claude/rules/documentation.md
@.claude/rules/git-workflow.md
@.claude/rules/code-style.md
@.claude/skills/index.md

## 2️⃣ Define:

- Project mission
- Tech stack summary
- Architectural philosophy
- Engineering principles
- AI operational boundaries
- Deterministic behavior rules

## 3️⃣ AI Behavior Requirements

The AI must:

- Never introduce breaking changes silently
- Follow architecture rules strictly
- Always include tests when modifying logic
- Never introduce new dependencies without justification
- Avoid premature abstraction
- Enforce strong typing
- Keep components small and composable
- Avoid business logic in UI
- Prefer pure functions
- Update documentation when modifying behavior
- Never leak secrets
- Always validate input

---

# 🧩 STEP 4 — Modular Rule Files

Each rule file must contain:

- Clear principles
- Do / Don’t section
- Examples
- Strict enforcement rules

Define modern standards such as:

- Clean Architecture
- SOLID
- Feature-based folder organization
- DTO pattern (backend)
- Strict TypeScript mode
- REST/GraphQL consistency
- Error shape standardization
- Logging structure
- Testing coverage threshold
- WCAG accessibility baseline
- Commit conventions (Conventional Commits)

---

# 🧠 STEP 5 — Add Claude Skills System

Based on:

- https://github.com/anthropics/skills
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

Implement a structured skill registry.

## Create `.claude/skills/index.md`

This must:

- List all available skills
- Describe when to invoke them
- Define skill triggers
- Define expected output format
- Provide deterministic execution steps

---

## Required Skills to Implement

Each skill must:

- Have a clear purpose
- Define input requirements
- Define output format
- Define execution steps
- Include constraints
- Include safety checks

---

### 1️⃣ Architecture Review Skill

File: `architecture-skill.md`

Purpose:

- Evaluate code against architecture rules
- Detect violations
- Suggest minimal improvements

Triggers:

- "review architecture"
- "analyze structure"
- "validate layering"

Output:

- Structured markdown report
- Risk level per issue
- Refactor suggestion

---

### 2️⃣ Refactor Skill

File: `refactor-skill.md`

Purpose:

- Improve maintainability without changing behavior

Constraints:

- No breaking changes
- Preserve public interfaces
- Add tests if missing

Output:

- Before / After explanation
- Justification
- Impact analysis

---

### 3️⃣ Testing Skill

File: `testing-skill.md`

Purpose:

- Generate missing unit tests
- Increase coverage
- Detect untested logic

Must enforce:

- AAA pattern
- Deterministic tests
- Mock isolation
- Edge case coverage

---

### 4️⃣ API Design Skill

File: `api-design-skill.md`

Purpose:

- Validate endpoint consistency
- Enforce error format
- Ensure versioning
- Validate pagination
- Enforce input validation

---

### 5️⃣ Performance Optimization Skill

File: `performance-skill.md`

Purpose:

- Detect heavy renders
- Detect large bundles
- Identify N+1 queries
- Recommend lazy loading
- Suggest memoization

---

### 6️⃣ Security Audit Skill

File: `security-skill.md`

Purpose:

- Validate input sanitization
- Detect secret leaks
- Validate auth handling
- Check dependency vulnerabilities (conceptual level)
- Ensure proper headers

---

### 7️⃣ Documentation Skill

File: `documentation-skill.md`

Purpose:

- Ensure updated README
- Enforce JSDoc
- Generate missing API docs
- Update architecture-overview.md

---

# 🤖 STEP 6 — Multi-Platform AI Compatibility

Create `.ai/AGENT.md`

This must define:

- AI behavioral expectations
- Modification constraints
- Testing requirements
- File update policies
- Documentation rules
- Refactor boundaries

Create `.ai/SYSTEM_PROMPT.md`

This must be:

- Strict
- Deterministic
- Enterprise-level
- Behavior-constrained
- Based on structured reasoning
- Minimal verbosity
- Zero hallucination tolerance
- Explicit uncertainty handling

---

# 🛠 STEP 7 — Enforce Engineering Tooling

If not already present:

- ESLint (strict)
- Prettier
- TypeScript strict mode
- Husky pre-commit hooks
- Commitlint
- EditorConfig
- Testing framework baseline
- CI workflow template

Do NOT duplicate existing configs.

---

# 📦 STEP 8 — Version Control Integration

- Ensure `.claude/` is committed
- Ensure `.ai/` is committed
- Add README section explaining:
  - What is CLAUDE.md
  - What are skills
  - How agents use them
  - Why this matters
  - How to extend skills

---

# 🎯 OUTPUT EXPECTATIONS

The agent must:

1. Create all files
2. Populate them with structured enterprise-grade content
3. Avoid unnecessary verbosity
4. Keep rules strict but readable
5. Avoid over-engineering
6. Keep the system scalable
7. Make it suitable for large teams
8. Provide a summary of what was created

---

# 🧱 DESIGN PHILOSOPHY

The final system must embody:

- Clean Architecture
- SOLID
- Domain-driven thinking
- Strong typing
- Separation of concerns
- Minimal coupling
- High cohesion
- Deterministic AI behavior
- Skill-driven execution
- Explicit reasoning
- Incremental refactoring
- Enterprise maintainability

---

# 🚨 HARD RULES

- Do not rewrite entire project
- Do not introduce new frameworks
- Do not over-abstract
- Do not change public APIs without explanation
- Do not introduce untested logic
- Do not remove comments without reason

---

# 🏁 SUCCESS CRITERIA

This setup must feel like:

- A production-grade internal AI engineering framework
- Suitable for 50+ engineers
- Extensible for future AI tools
- Deterministic and predictable
- Strict but developer-friendly
