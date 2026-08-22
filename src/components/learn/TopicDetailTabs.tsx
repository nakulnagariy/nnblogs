"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Skeleton } from "@/components/ui/Skeleton";
import { PremiumGate } from "./PremiumGate";
import type { TopicDetail } from "@/types";

const FlashcardDeck = dynamic(() => import("./FlashcardDeck"), {
  loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  ssr: false,
});

type TabId = "notes" | "examples" | "assessment" | "flashcards" | "qa";

interface Tab {
  id: TabId;
  label: string;
}

interface TopicDetailTabsProps {
  topic: TopicDetail;
}

export function TopicDetailTabs({ topic }: TopicDetailTabsProps) {
  const tabs: Tab[] = [
    topic.notes ? { id: "notes", label: "Notes" } : null,
    topic.example ? { id: "examples", label: "Examples" } : null,
    topic.assessment ? { id: "assessment", label: "Assessment" } : null,
    topic.flashcards.length > 0 ? { id: "flashcards", label: "Flashcards" } : null,
    topic.questions.length > 0 ? { id: "qa", label: "Q&A" } : null,
  ].filter(Boolean) as Tab[];

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0]?.id ?? "notes");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  if (topic.access_level === "premium") {
    return <PremiumGate />;
  }

  if (tabs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No content available yet.</p>
    );
  }

  const sanitizedAssessment = topic.assessment
    ? DOMPurify.sanitize(topic.assessment, {
        ALLOWED_TAGS: [
          "h1", "h2", "h3", "h4", "p", "br", "strong", "em",
          "ul", "ol", "li", "code", "pre", "table", "thead",
          "tbody", "tr", "th", "td", "div", "span", "hr",
        ],
        ALLOWED_ATTR: ["class"],
      })
    : "";

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-1 border-b border-border/60 mb-6 overflow-x-auto"
        role="tablist"
        aria-label="Topic content tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {activeTab === "notes" && topic.notes && (
        <div id="panel-notes" role="tabpanel">
          <MarkdownRenderer content={topic.notes} />
        </div>
      )}

      {activeTab === "examples" && topic.example && (
        <div id="panel-examples" role="tabpanel">
          <MarkdownRenderer content={topic.example} />
        </div>
      )}

      {activeTab === "assessment" && sanitizedAssessment && (
        <div
          id="panel-assessment"
          role="tabpanel"
          className="prose prose-lg prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedAssessment }}
        />
      )}

      {activeTab === "flashcards" && topic.flashcards.length > 0 && (
        <div id="panel-flashcards" role="tabpanel">
          <FlashcardDeck flashcards={topic.flashcards} />
        </div>
      )}

      {activeTab === "qa" && topic.questions.length > 0 && (
        <div id="panel-qa" role="tabpanel" className="space-y-3">
          {topic.questions.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
                onClick={() =>
                  setOpenQuestion(openQuestion === q.id ? null : q.id)
                }
                aria-expanded={openQuestion === q.id}
              >
                <span>{q.question}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 ml-3 transition-transform",
                    openQuestion === q.id && "rotate-180",
                  )}
                />
              </button>
              {openQuestion === q.id && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                  {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
