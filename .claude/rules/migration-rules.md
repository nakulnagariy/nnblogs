# Migration Constraints

- Every LLM call must be logged with: agent name, task ID, model, tokens, estimated cost
- Every agent decision must be logged with reasoning
- Checkpoint state after every completed task
- Generated content must be marked with is_ai_generated: true
- Quality score every generated file (0-1 scale)
- Stop and ask for human approval at these gates:
  1. After CMS recommendation
  2. After schema design
  3. After first 3 generated topics (quality check)
  4. After full migration validation
  5. After design system tokens
