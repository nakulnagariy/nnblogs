---
name: content-generator
description: >
  Generate production-quality educational content for interview prep topics.
  Use when filling placeholder files with real content: notes, code examples,
  assessments, and flashcards.
---

# Content Generator

## When to Use

- Processing placeholder files from the Svelte migration
- Generating notes.md, example.js, assessment.html, or flashcards.csv

## Process

1. Load 2-3 COMPLETE reference files of the same type from the same category
2. Read the topic name and category context
3. Generate content matching the reference style and depth
4. Store generation metadata (model, tokens, prompt hash)

## Output Standards

- notes.md: 800-1500 words, real-world examples, gotchas, code snippets
- example.js: 3-5 runnable, commented code examples
- assessment.html: 5-8 MCQs using shared assessment.css/js patterns
- flashcards.csv: 10-15 Q&A pairs, varying difficulty
- Also generate 3-5 interview questions per topic

## Quality Bar

- No hallucinated APIs or methods
- Code must be syntactically correct and runnable
- Explanations must be technically accurate
- Flashcard answers must be complete (not just "yes/no")
