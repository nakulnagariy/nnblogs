import { getVideos } from '@/lib/supabase/queries';
import { VideosClient } from '@/components/videos/VideosClient';

export const revalidate = 3600;

export default async function VideosPage() {
  const initialData = await getVideos(1, 12);

  return <VideosClient initialData={initialData} />;
}
