import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import {
  getTopicCategories,
  getTopicBySlug,
  incrementTopicViews,
  getRelatedTopics,
} from "@/lib/supabase/queries";
import { TopicDetailTabs } from "@/components/learn/TopicDetailTabs";
import { TopicDetailWrapper } from "@/components/learn/TopicDetailWrapper";
import { TopicCard } from "@/components/learn/TopicCard";
import { DifficultyBadge } from "@/components/learn/DifficultyBadge";
import type { Metadata } from "next";

interface TopicPageProps {
  params: Promise<{ category: string; topic: string }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const categories = await getTopicCategories().catch(() => []);
  const params: { category: string; topic: string }[] = [];

  await Promise.all(
    categories.map(async (cat) => {
      // We can only pre-render known slugs; fetch topic list per category
      // Using a broad page to get all topics
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/learn/${cat.slug}?pageSize=100`,
      ).catch(() => null);
      if (!res?.ok) return;
      const data = await res.json().catch(() => null);
      if (!data?.data) return;
      for (const topic of data.data) {
        params.push({ category: cat.slug, topic: topic.slug });
      }
    }),
  );

  return params;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { category, topic } = await params;
  const topicDetail = await getTopicBySlug(category, topic).catch(() => null);
  if (!topicDetail) return { title: "Not Found" };

  const description = topicDetail.notes
    ? topicDetail.notes.replace(/[#*`]/g, "").slice(0, 160)
    : `Learn ${topicDetail.title} — interview prep notes, examples and practice questions.`;

  return {
    title: `${topicDetail.title} — ${topicDetail.category?.name ?? category} | NNBlogs`,
    description,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { category, topic } = await params;
  const topicDetail = await getTopicBySlug(category, topic);

  if (!topicDetail) notFound();

  incrementTopicViews(topicDetail.id).catch(console.error);
  const relatedTopics = await getRelatedTopics(category, topic, 3).catch(() => []);

  const cat = topicDetail.category;

  return (
    <TopicDetailWrapper>
      <div className="container mx-auto px-6 max-w-6xl py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/learn" className="hover:text-foreground transition-colors">
                Learn
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/learn/${category}`}
                className="hover:text-foreground transition-colors"
              >
                {cat?.name ?? category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">{topicDetail.title}</li>
          </ol>
        </nav>

        {/* Back link */}
        <Link
          href={`/learn/${category}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {cat?.name ?? "category"}
        </Link>

        {/* Topic header */}
        <header className="pb-8 border-b border-border/40 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <DifficultyBadge difficulty={topicDetail.difficulty} />
            <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Clock className="w-3 h-3" />
              {topicDetail.estimated_minutes} min
            </span>
            {cat && (
              <Link
                href={`/learn/${category}`}
                className="px-2.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {topicDetail.title}
          </h1>
        </header>

        {/* Tabbed content */}
        <TopicDetailTabs topic={topicDetail} />
      </div>

      {/* Related topics */}
      {relatedTopics.length > 0 && (
        <section className="border-t border-border/40">
          <div className="container mx-auto px-6 max-w-6xl py-16">
            <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-8">
              Related Topics
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTopics.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          </div>
        </section>
      )}
    </TopicDetailWrapper>
  );
}
