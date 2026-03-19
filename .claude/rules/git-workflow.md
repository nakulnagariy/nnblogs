# Git Workflow Rules

## Conventional Commits

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, tooling
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system

### ✅ DO: Write clear commit messages

```bash
# ✅ GOOD: Descriptive, follows convention
feat(blog): add pagination to blog post list

Added pagination component with page size selector.
Posts are now loaded in pages of 10 by default.

Closes #123

# ✅ GOOD: Bug fix with context
fix(auth): resolve infinite redirect loop on sign-in

Fixed issue where users were redirected infinitely between
/sign-in and / routes when session validation failed.

# ✅ GOOD: Breaking change marker
feat(api)!: change posts endpoint response format

BREAKING CHANGE: /api/posts now returns { data, total, page }
instead of just an array. Update all clients accordingly.

# ✅ GOOD: Multiple changes in one commit
refactor(components): extract reusable UI components

- Moved Button to components/ui
- Created Card component
- Standardized component props pattern
```

### ❌ DON'T: Write vague commits

```bash
# ❌ BAD: Vague message
update code

# ❌ BAD: No type prefix
Added new feature

# ❌ BAD: Too generic
fix bug

# ❌ BAD: Rambling message
Changed some stuff in the posts page and also updated the header
and fixed that thing that was broken yesterday
```

## Branch Naming

### Convention

```
<type>/<short-description>
```

### ✅ DO: Use descriptive branch names

```bash
# ✅ GOOD: Feature branches
git checkout -b feat/blog-pagination
git checkout -b feat/video-support
git checkout -b feat/search-filters

# ✅ GOOD: Bug fixes
git checkout -b fix/auth-redirect-loop
git checkout -b fix/mobile-nav-overflow

# ✅ GOOD: Refactoring
git checkout -b refactor/extract-ui-components
git checkout -b refactor/optimize-queries

# ✅ GOOD: Documentation
git checkout -b docs/update-api-documentation

# ✅ GOOD: Include issue number
git checkout -b feat/123-add-comments
git checkout -b fix/456-pagination-bug
```

### ❌ DON'T: Use unclear branch names

```bash
# ❌ BAD: Too vague
git checkout -b updates
git checkout -b fixes

# ❌ BAD: No prefix
git checkout -b pagination

# ❌ BAD: Too long
git checkout -b feat/add-pagination-to-blog-posts-and-also-fix-some-bugs-and-refactor-code
```

## Branch Strategy

### Main Branches

- **main**: Production-ready code
- **develop**: Integration branch for features (optional if using trunk-based)

### ✅ DO: Follow branching workflow

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feat/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feat/new-feature

# After PR approval, merge to main
# Delete feature branch
git branch -d feat/new-feature
git push origin --delete feat/new-feature
```

## Pull Request Guidelines

### ✅ DO: Create comprehensive PRs

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [x] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Added pagination component
- Updated API endpoint to support page parameter
- Added tests for pagination logic

## Testing

- [ ] Unit tests pass (`npm test`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Manual testing completed

## Screenshots (if applicable)

[Screenshot of pagination UI]

## Related Issues

Closes #123
Related to #124

## Checklist

- [x] Code follows project code style
- [x] Added/updated tests
- [x] Updated documentation
- [x] No console errors
- [x] Tested in multiple browsers
```

### ❌ DON'T: Create minimal PRs

```markdown
# ❌ BAD: Vague PR description

Added pagination

# ❌ BAD: No context

Updated files

# ❌ BAD: Huge PR without explanation

Changed 50 files across the entire codebase
```

## Commit Frequency

### ✅ DO: Commit logically

```bash
# ✅ GOOD: Logical, atomic commits
git commit -m "feat(blog): add pagination component"
git commit -m "feat(blog): integrate pagination with API"
git commit -m "test(blog): add pagination tests"
git commit -m "docs(blog): update API documentation"

# ✅ GOOD: Keep commits focused
# Each commit does one thing and is self-contained
```

### ❌ DON'T: Commit too frequently or infrequently

```bash
# ❌ BAD: WIP commits
git commit -m "wip"
git commit -m "still working"
git commit -m "almost done"
git commit -m "now it works"

# ❌ BAD: Giant commit
git commit -m "feat: complete redesign of entire application"
# 200 files changed, 10,000 insertions, 8,000 deletions
```

## Before Committing

### ✅ DO: Check your changes

```bash
# Review what you're committing
git diff

# Review staged changes
git diff --staged

# Run checks
npm run type-check
npm run lint
npm test

# Stage specific files
git add src/components/Pagination.tsx
git add src/app/api/posts/route.ts

# Commit with message
git commit -m "feat(blog): add pagination support"
```

### Git Hooks (Husky)

```bash
# Pre-commit hook runs automatically
# - Runs ESLint on staged files
# - Runs TypeScript check
# - Runs tests on changed files

# Commit-msg hook validates commit message format
# Ensures Conventional Commits format
```

## Merging Strategy

### ✅ DO: Keep history clean

```bash
# ✅ GOOD: Squash feature commits before merging (if many WIP commits)
git checkout feat/my-feature
git rebase -i main
# Squash commits into logical units

# ✅ GOOD: Merge via PR
# Use GitHub/GitLab PR UI to merge
# Choose appropriate merge strategy:
# - Squash and merge: For messy feature branches
# - Merge commit: For clean, logical commits
# - Rebase and merge: For linear history

# ✅ GOOD: Delete branches after merge
git branch -d feat/my-feature
git push origin --delete feat/my-feature
```

### ❌ DON'T: Create messy history

```bash
# ❌ BAD: Merge conflicts everywhere
git merge main
# Fix conflicts
git commit -m "merge"
# Repeat 10 times

# ❌ BAD: Keep stale branches
# 50 merged branches still in repository
```

## Handling Conflicts

### ✅ DO: Resolve carefully

```bash
# Update your branch with latest main
git checkout feat/my-feature
git fetch origin
git rebase origin/main

# If conflicts occur:
# 1. Open conflicted files
# 2. Resolve conflicts manually
# 3. Stage resolved files
git add resolved-file.ts

# 4. Continue rebase
git rebase --continue

# 5. Force push (only on feature branches!)
git push origin feat/my-feature --force-with-lease
```

## Tags & Releases

### ✅ DO: Tag releases

```bash
# Create annotated tag for release
git tag -a v1.2.0 -m "Release version 1.2.0

Features:
- Added pagination
- Improved search
- Video support

Bug fixes:
- Fixed auth redirect issue
- Fixed mobile navigation"

# Push tags
git push origin v1.2.0

# Or push all tags
git push origin --tags
```

## .gitignore

### ✅ DO: Ignore generated files

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
*.log

# Local env files
.env*.local
.env.development
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local Claude instructions
.claude/CLAUDE.local.md
```

## Pre-Push Checklist

### ✅ DO: Validate before pushing

```bash
# 1. Ensure all tests pass
npm test

# 2. Ensure type check passes
npm run type-check

# 3. Ensure linting passes
npm run lint

# 4. Ensure build succeeds
npm run build

# 5. Review your commits
git log origin/main..HEAD

# 6. Push
git push origin feat/my-feature
```

## Rebasing Guidelines

### ✅ DO: Rebase feature branches

```bash
# Keep feature branch up to date with main
git checkout feat/my-feature
git fetch origin
git rebase origin/main

# Interactive rebase to clean up commits
git rebase -i HEAD~5
# Squash, reword, reorder commits
```

### ❌ DON'T: Rebase public branches

```bash
# ❌ BAD: Rebasing main or shared branches
git checkout main
git rebase feat/my-feature  # Never rebase main!

# ❌ BAD: Force pushing to main
git push origin main --force  # Never!
```

## Strict Rules

1. **Use Conventional Commits** - `type(scope): message`
2. **Descriptive branch names** - `type/short-description`
3. **Atomic commits** - one logical change per commit
4. **Run checks before committing** - lint, type-check, test
5. **Create meaningful PRs** - with description, testing notes
6. **Delete merged branches** - keep repository clean
7. **Never force push** - to main or shared branches
8. **Tag releases** - with version and changelog
9. **Keep feature branches short-lived** - merge frequently
10. **Rebase before merging** - keep feature branch up to date
11. **Write commit body** - for non-obvious changes
12. **Link to issues** - `Closes #123` in commits/PRs
