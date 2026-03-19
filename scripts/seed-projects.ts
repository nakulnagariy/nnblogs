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

const sampleProjects = [
  {
    name: "NNBlogs - Full-Stack Blog Platform",
    description:
      "Modern blog platform with Next.js 15, TypeScript, Supabase, and Clerk authentication",
    long_description:
      "A comprehensive blogging platform featuring markdown support, video content, and portfolio showcase. Built with Next.js 15 App Router for optimal performance, Supabase for real-time database, and Clerk for authentication. Includes admin dashboard for content management, analytics tracking, and SEO optimization.",
    github_url: "https://github.com/nakulnagariy/nnblogs",
    live_url: "https://nnblogs.vercel.app",
    image_url:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Clerk",
      "Tailwind CSS",
      "React Query",
    ],
    featured: true,
  },
  {
    name: "E-Commerce REST API",
    description: "Scalable e-commerce API with Node.js, Express, and MongoDB",
    long_description:
      "Built a RESTful API for an e-commerce platform handling products, orders, users, and payments. Implemented JWT authentication, role-based access control, and Stripe payment integration. Designed with microservices architecture principles for scalability.",
    github_url: "https://github.com/example/ecommerce-api",
    live_url: null,
    image_url:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    technologies: [
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Stripe API",
      "Docker",
    ],
    featured: true,
  },
  {
    name: "Real-Time Chat Application",
    description: "WebSocket-based chat app with React and Socket.io",
    long_description:
      "Developed a real-time messaging application supporting private and group chats, file sharing, and online presence indicators. Used Socket.io for bidirectional communication and Redis for session management and message queuing.",
    github_url: "https://github.com/example/chat-app",
    live_url: "https://chat-demo.example.com",
    image_url:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800",
    technologies: [
      "React",
      "Socket.io",
      "Node.js",
      "Redis",
      "PostgreSQL",
      "Material-UI",
    ],
    featured: true,
  },
  {
    name: "Task Management Dashboard",
    description: "Kanban-style project management tool with drag-and-drop",
    long_description:
      "Created a collaborative task management system inspired by Trello. Features include drag-and-drop task organization, real-time collaboration, custom workflows, and team permissions. Implemented with React DnD for smooth interactions.",
    github_url: "https://github.com/example/task-manager",
    live_url: "https://tasks.example.com",
    image_url:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
    technologies: [
      "React",
      "TypeScript",
      "Firebase",
      "React DnD",
      "Styled Components",
    ],
    featured: false,
  },
  {
    name: "Weather Forecast App",
    description: "Progressive Web App for weather forecasts with geolocation",
    long_description:
      "Built a PWA that provides detailed weather forecasts using OpenWeatherMap API. Features offline support, push notifications for weather alerts, and location-based forecasts. Optimized for mobile-first experience with service workers.",
    github_url: "https://github.com/example/weather-app",
    live_url: "https://weather.example.com",
    image_url:
      "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800",
    technologies: [
      "React",
      "PWA",
      "Service Workers",
      "OpenWeatherMap API",
      "Tailwind CSS",
    ],
    featured: false,
  },
  {
    name: "Machine Learning Image Classifier",
    description: "CNN-based image classification using TensorFlow",
    long_description:
      "Developed a convolutional neural network for image classification trained on custom datasets. Built web interface for real-time image upload and prediction. Achieved 94% accuracy on test data through transfer learning with MobileNetV2.",
    github_url: "https://github.com/example/ml-classifier",
    live_url: null,
    image_url:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    technologies: ["Python", "TensorFlow", "Keras", "Flask", "NumPy", "OpenCV"],
    featured: false,
  },
  {
    name: "GraphQL API Gateway",
    description: "Unified GraphQL gateway for microservices architecture",
    long_description:
      "Designed and implemented a GraphQL API gateway that aggregates multiple REST microservices. Provides a single endpoint for frontend clients with efficient data fetching, caching, and error handling. Reduced API calls by 60% through query optimization.",
    github_url: "https://github.com/example/graphql-gateway",
    live_url: null,
    image_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    technologies: [
      "GraphQL",
      "Apollo Server",
      "Node.js",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    featured: false,
  },
  {
    name: "CI/CD Pipeline Automation",
    description: "Automated deployment pipeline with GitHub Actions and AWS",
    long_description:
      "Built comprehensive CI/CD pipeline automating testing, building, and deployment processes. Integrated automated testing, code quality checks, security scanning, and multi-environment deployments. Reduced deployment time from 2 hours to 10 minutes.",
    github_url: "https://github.com/example/cicd-pipeline",
    live_url: null,
    image_url:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
    technologies: [
      "GitHub Actions",
      "AWS",
      "Docker",
      "Terraform",
      "Jest",
      "SonarQube",
    ],
    featured: false,
  },
];

async function seedProjects() {
  console.log("🚀 Starting projects seeding process...\n");

  try {
    // Add timestamps to projects
    const now = new Date();
    const projectsWithDates = sampleProjects.map((project, index) => {
      const daysAgo = Math.floor(index * 15); // Spread over several months
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      return {
        ...project,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString(),
      };
    });

    // Insert projects
    console.log("📦 Inserting sample projects...");
    const { data: insertedProjects, error: insertError } = await supabase
      .from("projects")
      .insert(projectsWithDates)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log(
      `\n✅ Successfully seeded ${insertedProjects?.length || 0} projects!`,
    );

    // Print summary
    const featured = projectsWithDates.filter((p) => p.featured).length;
    const regular = projectsWithDates.filter((p) => !p.featured).length;
    const uniqueTech = new Set(projectsWithDates.flatMap((p) => p.technologies))
      .size;

    console.log("\n📊 Summary:");
    console.log(`   Total projects: ${projectsWithDates.length}`);
    console.log(`   Featured: ${featured}`);
    console.log(`   Regular: ${regular}`);
    console.log(`   Unique technologies: ${uniqueTech}`);
    console.log("\n🎉 Projects seeding completed successfully!");

    console.log("\n🔗 Projects included:");
    projectsWithDates.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} ${p.featured ? "⭐" : ""}`);
    });
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    process.exit(1);
  }
}

seedProjects();
