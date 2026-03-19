import { SearchBar } from '@/components/search/SearchBar';

export const metadata = {
  title: 'Search',
  description: 'Search for blog posts, videos, and projects.',
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-6 max-w-6xl">
      <header className="pt-24 pb-12 border-b border-border/40">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">
          Search
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Find anything
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Search across blog posts, videos, and projects.
        </p>
      </header>

      <div className="py-10 max-w-2xl">
        <SearchBar autoFocus />
      </div>
    </div>
  );
}
