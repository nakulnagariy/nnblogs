"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Flashcard } from "@/types";

interface FlashcardDeckProps {
  flashcards: Flashcard[];
}

export default function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) return null;

  const card = flashcards[index] ?? flashcards[0];
  if (!card) return null;

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % flashcards.length);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <p className="text-sm text-muted-foreground font-mono">
        {index + 1} / {flashcards.length}
      </p>

      {/* Card */}
      <div
        className="w-full max-w-2xl cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label={flipped ? "Show front" : "Show back (click to flip)"}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-56 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex items-center justify-center p-6 rounded-2xl border border-border/60 bg-card text-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-base font-medium leading-relaxed text-foreground">
              {card.front}
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex items-center justify-center p-6 rounded-2xl border border-border/60 bg-muted/30 text-center backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-sm leading-relaxed text-foreground">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Click card to flip</p>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={prev} aria-label="Previous card">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setFlipped(false); setIndex(0); }}
          aria-label="Restart deck"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={next} aria-label="Next card">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
