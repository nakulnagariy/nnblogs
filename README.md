# NNBlogs - Personal Blog

A git-native personal blog built with Next.js 16, TypeScript, and Tailwind CSS.
Posts are Markdown files under `content/posts/`, authored through
[Keystatic](https://keystatic.com/) (`/keystatic`, local dev only) and
published by committing and pushing like any other change — no database, no
authentication system. GitHub's own PR/merge permissions on this repo are
the access control.

## ✨ Features

- **📝 Blog Posts** - Markdown posts with syntax highlighting, stored in git
- **🔍 Search** - Full-text search across posts
- **🐙 GitHub Integration** - Pinned-repos widget on the About page
- **📊 Analytics** - Google Analytics integration
- **📱 Responsive** - Mobile-first design
- **🌙 Dark Mode** - Automatic dark mode support

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [nn-design](https://www.npmjs.com/package/nn-design) tokens
- **Content**: Markdown files in git, authored via [Keystatic](https://keystatic.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query, used for live search only)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [Marked](https://marked.js.org/) + [Highlight.js](https://highlightjs.org/)

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nakulnagariy/nnblogs.git
   cd nnblogs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your environment variables (GitHub token, Google Analytics ID,
   site URL/name — see `.env.local.example` for the full list). None of
   these are required for `npm run dev` to work; the site degrades
   gracefully without them.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## ✍️ Writing a Post

1. Run `npm run dev` and open [http://localhost:3000/keystatic](http://localhost:3000/keystatic)
2. Create or edit a post through the admin UI — it writes directly to
   `content/posts/<slug>/index.yaml` in your working tree
3. Commit and push; publishing is just merging to `main`

To hide a post without deleting it, toggle its `Draft` field.

## 🐙 GitHub Integration

1. Create a [Personal Access Token](https://github.com/settings/tokens)
2. Add `GITHUB_USERNAME` and `GITHUB_TOKEN` to your env
3. Your pinned repos will be displayed on the About page

## 📊 Google Analytics Setup

1. Create a [Google Analytics](https://analytics.google.com/) property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add it to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## 🚀 Deployment

### Vercel (Recommended)

Import the repo at [vercel.com/new](https://vercel.com/new), set the environment variables from `.env.local.example` in the project settings, and deploy. Vercel auto-builds on every push to `main`.

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t nnblogs .
docker run -p 3000:3000 --env-file .env.local nnblogs
```

### AWS Amplify

See [AWS Deployment Guide](./docs/AWS_DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
content/
└── posts/                 # Blog posts (Keystatic-managed YAML, one dir per slug)
keystatic.config.ts        # Keystatic collection schema

src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (search, keystatic)
│   ├── blog/                # Blog listing + post pages
│   ├── keystatic/            # Keystatic admin UI mount (dev-only in practice)
│   ├── search/               # Search page
│   └── about/                 # About page
├── components/              # React components
│   ├── ui/                   # Reusable UI components
│   ├── blog/                 # Blog-specific components
│   ├── github/                # GitHub repos widget
│   ├── layout/                # Layout components
│   ├── search/                 # Search components
│   ├── analytics/               # Analytics components
│   └── providers/                # React providers
├── hooks/                    # Custom React hooks
├── lib/                       # Utility libraries
│   ├── content/                # File-based content queries (Keystatic reader)
│   ├── github.ts                 # GitHub API
│   ├── markdown.ts                # Markdown parsing
│   └── utils.ts                    # Helper functions
└── types/                     # TypeScript types
```

## 🛠️ Available Scripts

```bash
npm run dev           # Start development server (also serves /keystatic)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint errors
npm run type-check    # TypeScript type checking
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

## 🤖 AI-Powered Development

This project includes an enterprise-grade **agentic development framework** optimized for Claude, GitHub Copilot, Cursor, and other AI coding assistants.

### Framework Features

- **🎯 Deterministic AI Behavior** - Structured skills ensure consistent, repeatable task execution
- **📋 Engineering Rules** - 11 comprehensive rule files covering architecture, security, performance, etc.
- **🎨 Skill System** - 7 specialized skills for architecture review, refactoring, testing, and more
- **🔄 Clean Architecture** - Enforced layer separation and best practices
- **🛡️ Security-First** - Built-in authentication, input validation, and XSS prevention
- **♿ Accessibility** - WCAG 2.1 AA compliance standards
- **🚀 Cross-Platform** - Works with multiple AI platforms

### Directory Structure

```
.claude/                    # Claude-specific configuration
├── CLAUDE.md              # Main AI agent configuration
├── rules/                 # Engineering rules (11 files)
│   ├── architecture.md    # Server/Client components, Clean Architecture
│   ├── frontend.md        # React 19 patterns, Tailwind CSS
│   ├── api-design.md      # RESTful API standards
│   ├── backend.md         # Supabase patterns, database queries
│   ├── testing.md         # Vitest, Testing Library, AAA pattern
│   ├── code-style.md      # TypeScript strict mode, naming conventions
│   ├── security.md        # Auth, validation, XSS prevention
│   ├── performance.md     # Server Components, optimization
│   ├── accessibility.md   # WCAG compliance, semantic HTML
│   ├── documentation.md   # JSDoc, API docs
│   └── git-workflow.md    # Conventional Commits, branching
└── skills/                # Task execution patterns (7 skills)
    ├── index.md           # Skills registry
    ├── architecture-skill.md
    ├── refactor-skill.md
    ├── testing-skill.md
    ├── api-design-skill.md
    ├── performance-skill.md
    ├── security-skill.md
    └── documentation-skill.md

.ai/                       # Cross-platform AI configuration
├── AGENT.md              # Platform-agnostic behavioral expectations
├── SYSTEM_PROMPT.md      # Strict system-level prompt
└── CONTRIBUTING_AI.md    # AI contribution guidelines
```

### Using AI Skills

AI agents can invoke structured skills for complex tasks:

```
# Architecture review
"Review the architecture of the blog components"

# Security audit
"Run a security audit on the API routes"

# Performance optimization
"Optimize performance of the blog post page"

# Generate tests
"Add tests for the utils.ts file"

# Refactor code
"Refactor the post queries for better maintainability"
```

### For AI Agents

**Primary Configuration**: See [.claude/CLAUDE.md](.claude/CLAUDE.md) for complete setup

**Engineering Rules**: Review [.claude/rules/](.claude/rules/) before making changes

**Skills System**: Use [.claude/skills/](.claude/skills/) for structured task execution

**Cross-Platform**: See [.ai/AGENT.md](.ai/AGENT.md) for platform-agnostic guidelines

### For Developers

The AI framework enforces:

- TypeScript strict mode with no `any` types
- Server Components by default
- Input validation on all user input
- Authentication on protected routes
- HTML/Markdown sanitization
- Accessibility standards (WCAG 2.1 AA)
- Testing with 70%+ coverage
- Conventional Commits for git workflow

See [docs/engineering-principles.md](docs/engineering-principles.md) for complete details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Keystatic](https://keystatic.com/) - Git-backed content management
- [Vercel](https://vercel.com/) - Platform for Frontend Developers

---

Built with ❤️ by [Nakul Nagariya](https://github.com/nakulnagariy)
