import type { Metadata } from "next";
import { LearnClient } from "@/components/learn/LearnClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Interview Prep | NNBlogs",
  description:
    "Master frontend engineering with structured notes, code examples, flashcards and practice questions.",
};

export default function LearnPage() {
  return (
    <main className="container mx-auto px-6 max-w-6xl py-20">
      <div className="mb-12">
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-3">
          Interview Prep
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Learn</h1>
        <p className="text-muted-foreground max-w-xl">
          Structured notes, code examples, flashcards and practice questions
          across frontend engineering topics.
        </p>
      </div>

      <LearnClient />
    </main>
  );
}
