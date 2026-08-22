# NNBlogs - Personal Blog & Portfolio

A modern, full-featured personal blog website built with Next.js 16, TypeScript, Tailwind CSS, and Supabase (database + authentication). Also includes an additive "/learn" interview-prep platform.

## ✨ Features

- **📝 Blog Posts** - Write and publish articles with Markdown support and syntax highlighting
- **🎥 Videos** - Showcase video tutorials and content
- **💼 Projects** - Display your portfolio and GitHub repositories
- **📚 Learn** - Interview-prep topics with notes, examples, assessments, and flashcards
- **🔍 Search** - Full-text search across posts and learn topics
- **🔐 Authentication** - Secure login with Supabase Auth
- **📊 Analytics** - Google Analytics integration
- **🤖 AI Integration** - Generate content with OpenAI
- **🐙 GitHub Integration** - Display your GitHub profile and repositories
- **📱 Responsive** - Mobile-first design
- **🌙 Dark Mode** - Automatic dark mode support

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [Marked](https://marked.js.org/) + [Highlight.js](https://highlightjs.org/)

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Supabase account

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

   Fill in your environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Admin access (comma-separated Supabase Auth emails)
   ADMIN_EMAILS=you@example.com

   # GitHub
   GITHUB_USERNAME=your_github_username
   GITHUB_TOKEN=your_github_token

   # Google Analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   # OpenAI (optional)
   OPENAI_API_KEY=your_openai_key
   ```

4. **Set up the database**
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the schema from `supabase/schema.sql`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup

Run the SQL schema in your Supabase SQL Editor:

```sql
-- See supabase/schema.sql for full schema
```

This creates:

- `posts` - Blog posts with markdown content
- `videos` - Video content
- `projects` - Portfolio projects
- `categories` - Content categories
- Row Level Security policies
- Indexes for performance

## 🔐 Authentication Setup

1. Enable email/password auth in your Supabase project (Authentication → Providers)
2. Create the admin account(s) you'll sign in with (Authentication → Users)
3. Add those emails to `ADMIN_EMAILS` in `.env.local` — only listed emails can access `/admin` and `/api/admin/*`

## 📊 Google Analytics Setup

1. Create a [Google Analytics](https://analytics.google.com/) property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add it to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## 🐙 GitHub Integration

1. Create a [Personal Access Token](https://github.com/settings/tokens)
2. Add `GITHUB_USERNAME` and `GITHUB_TOKEN` to your env
3. Your profile and repos will be displayed on the Projects page

## 🤖 AI Content Generation

The blog includes optional AI-powered features:

- Generate blog post drafts
- Auto-generate excerpts
- Suggest tags for content
- Improve writing quality

To enable:

1. Get an [OpenAI API key](https://platform.openai.com/)
2. Add it to `OPENAI_API_KEY`
3. Use the `/api/ai` endpoint

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
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (incl. admin/* and learn/*)
│   ├── blog/              # Blog pages
│   ├── videos/            # Video pages
│   ├── projects/          # Projects page
│   ├── learn/              # Interview-prep platform
│   ├── search/             # Search page
│   ├── about/              # About page
│   └── sign-in/             # Supabase Auth sign-in
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── blog/             # Blog-specific components
│   ├── learn/             # Learn-specific components
│   ├── github/           # GitHub integration
│   ├── layout/           # Layout components
│   ├── search/           # Search components
│   ├── analytics/        # Analytics components
│   └── providers/        # React providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── supabase/         # Database client & queries
│   ├── github.ts         # GitHub API
│   ├── ai.ts             # AI integration
│   ├── markdown.ts       # Markdown parsing
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── middleware.ts          # Auth + admin-access middleware
```

## 🛠️ Available Scripts

```bash
npm run dev           # Start development server
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
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Vercel](https://vercel.com/) - Platform for Frontend Developers

---

Built with ❤️ by [Nakul Nagariya](https://github.com/nakulnagariy)
