-- Promote all migrated interview prep topics from draft to published
UPDATE topics SET status = 'published' WHERE status = 'draft';
