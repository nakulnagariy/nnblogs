import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Sample technical YouTube videos
const sampleVideos = [
  {
    title: "Next.js 15 - What's New and Breaking Changes",
    slug: "nextjs-15-whats-new",
    description:
      "A comprehensive overview of Next.js 15 features including the new App Router enhancements, Server Actions improvements, and breaking changes you need to know about. Learn how to migrate your existing Next.js applications to version 15.",
    video_url: "https://www.youtube.com/watch?v=gSSsZReIFRk",
    thumbnail_url: "https://i.ytimg.com/vi/gSSsZReIFRk/maxresdefault.jpg",
    duration: "18:45",
    category: "Web Development",
    tags: ["nextjs", "react", "javascript", "web-dev"],
    published: true,
    views: 1250,
  },
  {
    title: "TypeScript 5.0 Deep Dive - New Features",
    slug: "typescript-5-deep-dive",
    description:
      "Explore the latest features in TypeScript 5.0 including decorators, const type parameters, and performance improvements. This tutorial covers practical examples and real-world use cases.",
    video_url: "https://youtu.be/5IQCp5GJqPk",
    thumbnail_url: "https://i.ytimg.com/vi/5IQCp5GJqPk/maxresdefault.jpg",
    duration: "25:30",
    category: "Programming",
    tags: ["typescript", "javascript", "programming", "types"],
    published: true,
    views: 980,
  },
  {
    title: "Docker & Kubernetes Tutorial for Beginners",
    slug: "docker-kubernetes-tutorial",
    description:
      "Learn container orchestration from scratch. This tutorial covers Docker basics, Kubernetes architecture, pods, services, deployments, and how to deploy your first containerized application.",
    video_url: "https://www.youtube.com/watch?v=bhBSlnQcq2k",
    thumbnail_url: "https://i.ytimg.com/vi/bhBSlnQcq2k/maxresdefault.jpg",
    duration: "42:15",
    category: "DevOps",
    tags: ["docker", "kubernetes", "devops", "containers"],
    published: true,
    views: 2340,
  },
  {
    title: "PostgreSQL Advanced Query Optimization",
    slug: "postgresql-query-optimization",
    description:
      "Master advanced PostgreSQL query optimization techniques. Learn about indexes, query planning, EXPLAIN ANALYZE, materialized views, and how to identify and fix performance bottlenecks.",
    video_url: "https://www.youtube.com/watch?v=clrtT_4WBAw",
    thumbnail_url: "https://i.ytimg.com/vi/clrtT_4WBAw/maxresdefault.jpg",
    duration: "31:20",
    category: "Database",
    tags: ["postgresql", "database", "sql", "performance"],
    published: true,
    views: 756,
  },
  {
    title: "React Server Components Explained",
    slug: "react-server-components-explained",
    description:
      "Understanding React Server Components and how they revolutionize the way we build React applications. Learn the difference between client and server components, when to use each, and best practices.",
    video_url: "https://youtu.be/VIwWgV3Lc6s",
    thumbnail_url: "https://i.ytimg.com/vi/VIwWgV3Lc6s/maxresdefault.jpg",
    duration: "22:18",
    category: "Web Development",
    tags: ["react", "javascript", "server-components", "nextjs"],
    published: true,
    views: 1820,
  },
  {
    title: "Building RESTful APIs with Node.js & Express",
    slug: "nodejs-express-rest-api",
    description:
      "Complete guide to building production-ready REST APIs using Node.js and Express. Covers routing, middleware, error handling, authentication, and best practices for API design.",
    video_url: "https://www.youtube.com/watch?v=pKd0Rpw7O48",
    thumbnail_url: "https://i.ytimg.com/vi/pKd0Rpw7O48/maxresdefault.jpg",
    duration: "38:50",
    category: "Backend",
    tags: ["nodejs", "express", "api", "backend"],
    published: true,
    views: 1456,
  },
  {
    title: "Tailwind CSS - From Zero to Hero",
    slug: "tailwind-css-zero-to-hero",
    description:
      "Master Tailwind CSS utility-first approach. Learn core concepts, responsive design, dark mode, custom configurations, and how to build beautiful UIs faster than ever before.",
    video_url: "https://www.youtube.com/watch?v=UBOj6rqRUME",
    thumbnail_url: "https://i.ytimg.com/vi/UBOj6rqRUME/maxresdefault.jpg",
    duration: "28:35",
    category: "CSS",
    tags: ["tailwind", "css", "styling", "web-design"],
    published: true,
    views: 2105,
  },
  {
    title: "Git & GitHub Advanced Workflow Strategies",
    slug: "git-github-advanced-workflow",
    description:
      "Advanced Git techniques for professional developers. Learn about rebasing, cherry-picking, bisect, GitHub Actions, branch protection rules, and collaborative workflows.",
    video_url: "https://youtu.be/qsTthZi23VE",
    thumbnail_url: "https://i.ytimg.com/vi/qsTthZi23VE/maxresdefault.jpg",
    duration: "33:42",
    category: "DevOps",
    tags: ["git", "github", "version-control", "workflow"],
    published: false,
    views: 432,
  },
  {
    title: "GraphQL vs REST - Which Should You Choose?",
    slug: "graphql-vs-rest-comparison",
    description:
      "In-depth comparison between GraphQL and REST APIs. Explore the pros and cons of each approach, performance considerations, and how to decide which is right for your project.",
    video_url: "https://www.youtube.com/watch?v=yWzKJPw_VzM",
    thumbnail_url: "https://i.ytimg.com/vi/yWzKJPw_VzM/maxresdefault.jpg",
    duration: "19:28",
    category: "Backend",
    tags: ["graphql", "rest", "api", "architecture"],
    published: false,
    views: 289,
  },
  {
    title: "WebAssembly (WASM) - The Future of Web Performance",
    slug: "webassembly-future-web-performance",
    description:
      "Discover WebAssembly and how it brings near-native performance to web applications. Learn about use cases, how to compile to WASM, and integration with JavaScript.",
    video_url: "https://youtu.be/cbB3QEwWMlA",
    thumbnail_url: "https://i.ytimg.com/vi/cbB3QEwWMlA/maxresdefault.jpg",
    duration: "26:15",
    category: "Programming",
    tags: ["webassembly", "wasm", "performance", "web"],
    published: true,
    views: 1123,
  },
  {
    title: "Microservices Architecture Patterns",
    slug: "microservices-architecture-patterns",
    description:
      "Understanding microservices architecture design patterns. Covers service discovery, API gateways, circuit breakers, event-driven architecture, and when to use microservices.",
    video_url: "https://www.youtube.com/watch?v=CZ3wIuvmHeM",
    thumbnail_url: "https://i.ytimg.com/vi/CZ3wIuvmHeM/maxresdefault.jpg",
    duration: "45:20",
    category: "Backend",
    tags: ["microservices", "architecture", "distributed-systems", "backend"],
    published: true,
    views: 876,
  },
  {
    title: "Supabase - Open Source Firebase Alternative",
    slug: "supabase-firebase-alternative",
    description:
      "Complete introduction to Supabase - the open-source Firebase alternative. Learn about authentication, real-time subscriptions, storage, and building full-stack applications with PostgreSQL.",
    video_url: "https://youtu.be/dU7GwCOgvNY",
    thumbnail_url: "https://i.ytimg.com/vi/dU7GwCOgvNY/maxresdefault.jpg",
    duration: "36:44",
    category: "Database",
    tags: ["supabase", "postgresql", "backend", "database"],
    published: false,
    views: 645,
  },
];

async function seedVideos() {
  console.log("🎥 Starting video seeding process...\n");

  try {
    // Get author_id from existing videos or use from env
    const { data: existingVideos } = await supabase
      .from("videos")
      .select("author_id")
      .limit(1);

    let authorId: string;
    if (existingVideos && existingVideos.length > 0 && existingVideos[0]) {
      authorId = existingVideos[0].author_id;
      console.log(`✅ Using existing author_id: ${authorId}`);
    } else {
      authorId = process.env.CLERK_USER_ID || "user_default";
      console.log(`⚠️  No existing videos found. Using author_id: ${authorId}`);
    }

    // Create categories first
    const categories = [
      "Web Development",
      "Programming",
      "DevOps",
      "Database",
      "Backend",
      "CSS",
    ];
    console.log("\n📁 Creating categories...");

    for (const category of categories) {
      const slug = category.toLowerCase().replace(/\s+/g, "-");
      const { error } = await supabase.from("categories").upsert(
        {
          name: category,
          slug,
          description: `${category} tutorials and guides`,
        },
        { onConflict: "name" },
      );

      if (error && !error.message.includes("duplicate")) {
        console.error(
          `   ❌ Error creating category ${category}:`,
          error.message,
        );
      } else {
        console.log(`   ✅ ${category}`);
      }
    }

    // Add created_at dates to videos (spread over last 30 days)
    const now = new Date();
    const videosWithDates = sampleVideos.map((video, index) => {
      const daysAgo = Math.floor(index * 2.5); // Spread over ~30 days
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      return {
        ...video,
        author_id: authorId,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
      };
    });

    // Insert videos
    console.log("\n🎬 Inserting sample videos...");
    const { data: insertedVideos, error: insertError } = await supabase
      .from("videos")
      .upsert(videosWithDates, { onConflict: "slug" })
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(
      `\n✅ Successfully seeded ${insertedVideos?.length || 0} videos!`,
    );

    // Print summary
    const published = videosWithDates.filter((v) => v.published).length;
    const drafts = videosWithDates.filter((v) => !v.published).length;

    console.log("\n📊 Summary:");
    console.log(`   Total videos: ${videosWithDates.length}`);
    console.log(`   Published: ${published}`);
    console.log(`   Drafts: ${drafts}`);
    console.log(`   Categories: ${categories.length}`);
    console.log("\n🎉 Video seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding videos:", error);
    process.exit(1);
  }
}

seedVideos();
