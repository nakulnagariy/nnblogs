import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient, supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSessionClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'posts-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG' },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 },
      );
    }

    const extension = file.name.split('.').pop() || 'jpg';
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    const timestamp = Date.now();
    const filePath = `${user.id}/${timestamp}-${sanitizedName}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error('Failed to list storage buckets:', listError);
      return NextResponse.json(
        { error: `Storage unavailable: ${listError.message}` },
        { status: 500 },
      );
    }

    const bucketExists = buckets?.some((b) => b.name === bucket);

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      });
      if (createError) {
        console.error('Failed to create storage bucket:', createError);
        return NextResponse.json(
          { error: `Could not create storage bucket: ${createError.message}` },
          { status: 500 },
        );
      }
    }

    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/upload:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
