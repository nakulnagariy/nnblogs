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

async function runMigration() {
  console.log("🔄 Running video views migration...\n");

  try {
    // Create or replace the increment_video_views function
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE OR REPLACE FUNCTION increment_video_views(video_slug VARCHAR)
        RETURNS VOID AS $$
        BEGIN
          UPDATE videos 
          SET views = views + 1 
          WHERE slug = video_slug;
        END;
        $$ LANGUAGE plpgsql;
      `,
    });

    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log(
        "⚠️  exec_sql RPC not found, trying direct SQL execution...\n",
      );

      const { error: directError } = await supabase
        .from("videos")
        .select("id")
        .limit(1);

      if (directError) {
        throw new Error(`Database connection failed: ${directError.message}`);
      }

      console.log("✅ Database connection successful!");
      console.log(
        "\n📝 Please run this SQL manually in your Supabase SQL Editor:\n",
      );
      if (supabaseUrl) {
        const urlParts = supabaseUrl.split("//")[1]?.split(".");
        const projectId = urlParts?.[0];
        if (projectId) {
          console.log(
            `https://supabase.com/dashboard/project/${projectId}/sql/new\n`,
          );
        }
      }
      console.log("---");
      console.log(`CREATE OR REPLACE FUNCTION increment_video_views(video_slug VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1 
  WHERE slug = video_slug;
END;
$$ LANGUAGE plpgsql;`);
      console.log("---\n");
      return;
    }

    console.log("✅ Migration completed successfully!");
    console.log("✅ increment_video_views function created/updated");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
