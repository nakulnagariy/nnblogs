import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * POST /api/admin/upload
 *
 * Uploads an image file to Supabase Storage.
 * Requires authentication with ADMIN or EDITOR role.
 *
 * @param request - FormData with `file` (image) and optional `bucket` (storage bucket name)
 * @returns JSON with `url` of the uploaded file
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check user role
    const role = (sessionClaims as Record<string, unknown>)?.role || "VIEWER";
    if (!["ADMIN", "EDITOR"].includes(role as string)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "posts-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 },
      );
    }

    // 4. Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 },
      );
    }

    // 5. Generate a unique filename
    const extension = file.name.split(".").pop() || "jpg";
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[^a-zA-Z0-9.-]/g, "_") // sanitize
      .substring(0, 50); // limit length
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}-${sanitizedName}.${extension}`;

    // 6. Convert File to Buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 7. Ensure bucket exists (create if missing)
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error("Failed to list storage buckets:", listError);
      return NextResponse.json(
        { error: `Storage unavailable: ${listError.message}` },
        { status: 500 },
      );
    }

    const bucketExists = buckets?.some((b) => b.name === bucket);

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(
        bucket,
        { public: true, fileSizeLimit: 10 * 1024 * 1024 },
      );
      if (createError) {
        console.error("Failed to create storage bucket:", createError);
        return NextResponse.json(
          { error: `Could not create storage bucket: ${createError.message}` },
          { status: 500 },
        );
      }
    }

    // 8. Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 },
      );
    }

    // 9. Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json(
      { url: publicUrl, path: data.path },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/admin/upload:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
