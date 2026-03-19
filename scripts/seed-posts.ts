import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const samplePosts = [
  {
    title: "Getting Started with Next.js 14",
    slug: "getting-started-nextjs-14",
    excerpt:
      "Learn the fundamentals of Next.js 14 and the App Router in this comprehensive guide.",
    content:
      "# Getting Started with Next.js 14\n\nNext.js 14 brings exciting new features and improvements...",
    category: "Web Development",
    tags: ["nextjs", "react", "javascript", "tutorial"],
    published: true,
    views: 1250,
    featured_image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
  {
    title: "TypeScript Best Practices in 2026",
    slug: "typescript-best-practices-2026",
    excerpt:
      "Discover the latest TypeScript patterns and practices for writing maintainable code.",
    content:
      "# TypeScript Best Practices\n\nTypeScript has evolved significantly...",
    category: "Programming",
    tags: ["typescript", "javascript", "best-practices"],
    published: true,
    views: 892,
    featured_image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
  },
  {
    title: "Building a REST API with Node.js",
    slug: "building-rest-api-nodejs",
    excerpt:
      "Step-by-step guide to creating a production-ready REST API using Node.js and Express.",
    content:
      "# Building a REST API\n\nAPIs are the backbone of modern applications...",
    category: "Backend",
    tags: ["nodejs", "express", "api", "backend"],
    published: true,
    views: 2103,
    featured_image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
  },
  {
    title: "React Server Components Explained",
    slug: "react-server-components-explained",
    excerpt:
      "Understanding React Server Components and how they change the way we build applications.",
    content:
      "# React Server Components\n\nServer Components are a game-changer...",
    category: "Web Development",
    tags: ["react", "nextjs", "server-components"],
    published: false,
    views: 45,
    featured_image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800",
  },
  {
    title: "CSS Grid vs Flexbox: When to Use Each",
    slug: "css-grid-vs-flexbox",
    excerpt:
      "A practical comparison of CSS Grid and Flexbox with real-world examples.",
    content: "# CSS Grid vs Flexbox\n\nBoth are powerful layout tools...",
    category: "CSS",
    tags: ["css", "frontend", "layout", "design"],
    published: true,
    views: 1567,
    featured_image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
  },
  {
    title: "Database Design Principles",
    slug: "database-design-principles",
    excerpt:
      "Essential principles for designing scalable and efficient database schemas.",
    content: "# Database Design\n\nGood database design is crucial...",
    category: "Database",
    tags: ["database", "sql", "postgresql", "design"],
    published: true,
    views: 743,
    featured_image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
  },
  {
    title: "Introduction to Supabase",
    slug: "introduction-to-supabase",
    excerpt: "Get started with Supabase, the open-source Firebase alternative.",
    content: "# Introduction to Supabase\n\nSupabase is changing the game...",
    category: "Backend",
    tags: ["supabase", "backend", "database", "postgresql"],
    published: false,
    views: 23,
    featured_image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
  {
    title: "Mastering Tailwind CSS",
    slug: "mastering-tailwind-css",
    excerpt:
      "Advanced techniques and tips for building beautiful UIs with Tailwind CSS.",
    content:
      "# Mastering Tailwind CSS\n\nTailwind CSS offers unparalleled flexibility...",
    category: "CSS",
    tags: ["tailwind", "css", "frontend", "design"],
    published: true,
    views: 2456,
    featured_image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
  },
  {
    title: "Authentication with Clerk",
    slug: "authentication-with-clerk",
    excerpt:
      "Implementing secure authentication in your Next.js app using Clerk.",
    content: "# Authentication with Clerk\n\nClerk makes auth simple...",
    category: "Web Development",
    tags: ["authentication", "clerk", "nextjs", "security"],
    published: false,
    views: 12,
    featured_image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
  },
  {
    title: "JavaScript Array Methods You Should Know",
    slug: "javascript-array-methods",
    excerpt:
      "Master the most useful JavaScript array methods with practical examples.",
    content: "# JavaScript Array Methods\n\nArrays are fundamental...",
    category: "Programming",
    tags: ["javascript", "arrays", "tutorial", "fundamentals"],
    published: true,
    views: 3201,
    featured_image:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
  },
  {
    title: "Git Workflow Best Practices",
    slug: "git-workflow-best-practices",
    excerpt: "Learn professional Git workflows for team collaboration.",
    content:
      "# Git Workflow\n\nEffective Git workflows improve collaboration...",
    category: "DevOps",
    tags: ["git", "version-control", "workflow", "collaboration"],
    published: true,
    views: 956,
    featured_image:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
  },
  {
    title: "Docker for Developers",
    slug: "docker-for-developers",
    excerpt: "Everything you need to know about using Docker in development.",
    content: "# Docker for Developers\n\nContainerization is essential...",
    category: "DevOps",
    tags: ["docker", "containers", "devops", "deployment"],
    published: false,
    views: 67,
    featured_image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
  },
  {
    title: "React Hooks Deep Dive",
    slug: "react-hooks-deep-dive",
    excerpt: "Comprehensive guide to React Hooks including custom hooks.",
    content: "# React Hooks Deep Dive\n\nHooks revolutionized React...",
    category: "Web Development",
    tags: ["react", "hooks", "javascript", "frontend"],
    published: true,
    views: 1834,
    featured_image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
  {
    title: "API Security Best Practices",
    slug: "api-security-best-practices",
    excerpt: "Protect your APIs with these essential security practices.",
    content: "# API Security\n\nAPI security cannot be overlooked...",
    category: "Backend",
    tags: ["security", "api", "backend", "best-practices"],
    published: true,
    views: 1122,
    featured_image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
  },
  {
    title: "Understanding Async/Await in JavaScript",
    slug: "understanding-async-await-javascript",
    excerpt: "Master asynchronous JavaScript with async/await patterns.",
    content: "# Async/Await in JavaScript\n\nAsync programming made easy...",
    category: "Programming",
    tags: ["javascript", "async", "promises", "tutorial"],
    published: false,
    views: 8,
    featured_image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
  },
];

async function seedPosts() {
  console.log("🌱 Starting to seed posts...");

  try {
    // Try to get author_id from existing posts or environment variable
    let authorId = process.env.CLERK_USER_ID;

    if (!authorId) {
      // Try to get from existing posts
      const { data: existingPosts } = await supabase
        .from("posts")
        .select("author_id")
        .limit(1);

      if (
        existingPosts !== undefined &&
        existingPosts &&
        existingPosts.length > 0 &&
        existingPosts[0]
      ) {
        authorId = existingPosts[0].author_id;
        console.log(`✓ Using existing author ID: ${authorId}`);
      } else {
        console.error("❌ No author_id found. Please:");
        console.error("   1. Add CLERK_USER_ID to .env.local, or");
        console.error("   2. Create at least one post manually first");
        console.error(
          "\nYou can get your Clerk User ID from the Clerk Dashboard or by inspecting the session.",
        );
        return;
      }
    } else {
      console.log(`✓ Using author ID from environment: ${authorId}`);
    }

    // First, create categories if they don't exist
    const categories = Array.from(new Set(samplePosts.map((p) => p.category)));
    console.log(`\n📁 Creating categories: ${categories.join(", ")}`);

    for (const categoryName of categories) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
      const { error } = await supabase.from("categories").upsert(
        {
          name: categoryName,
          slug: slug,
          description: `Posts about ${categoryName}`,
        },
        { onConflict: "name" },
      );

      if (error && error.code !== "23505") {
        // Ignore duplicate errors
        console.error(`   ⚠️  Error creating category ${categoryName}:`, error);
      }
    }
    console.log(`✓ Categories ready`);

    // Create posts with varying created_at dates
    const now = new Date();
    const postsWithDates = samplePosts.map((post, index) => ({
      ...post,
      author_id: authorId,
      created_at: new Date(
        now.getTime() - index * 24 * 60 * 60 * 1000,
      ).toISOString(), // Each post 1 day older
      updated_at: new Date(
        now.getTime() - index * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }));

    // Insert posts
    const { data, error } = await supabase
      .from("posts")
      .insert(postsWithDates)
      .select();

    if (error) {
      console.error("❌ Error inserting posts:", error);
      return;
    }

    console.log(`\n✓ Successfully created ${data?.length || 0} posts!`);
    console.log("\n📊 Summary:");
    console.log(
      `   - Published: ${samplePosts.filter((p) => p.published).length}`,
    );
    console.log(
      `   - Drafts: ${samplePosts.filter((p) => !p.published).length}`,
    );
    console.log(`   - Categories: ${categories.join(", ")}`);
  } catch (error) {
    console.error("❌ Error seeding posts:", error);
  }
}

seedPosts();
