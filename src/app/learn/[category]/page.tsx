import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTopicCategories } from "@/lib/supabase/queries";
import { CategoryClient } from "@/components/learn/CategoryClient";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const categories = await getTopicCategories().catch(() => []);
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getTopicCategories().catch(() => []);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.name} | Interview Prep | NNBlogs`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = await getTopicCategories().catch(() => []);
  const cat = categories.find((c) => c.slug === category);

  if (!cat) notFound();

  return (
    <main className="container mx-auto px-6 max-w-6xl py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/learn" className="hover:text-foreground transition-colors">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">{cat.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All categories
        </Link>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl" role="img" aria-label={cat.name}>
            {cat.icon}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: cat.color }}
          >
            {cat.name}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-xl">{cat.description}</p>
      </div>

      <CategoryClient categorySlug={category} />
    </main>
  );
}
