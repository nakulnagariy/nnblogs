const fs = require('fs');
const path = require('path');

const BASE = "C:/personal projects/Bench-interview-preparation/app/static/content";

function wordCount(p) {
  try { return fs.readFileSync(p, 'utf8').split(/\s+/).filter(Boolean).length; }
  catch { return 0; }
}

function hasTodo(p) {
  try { return fs.readFileSync(p, 'utf8').includes('TODO'); }
  catch { return false; }
}

function countFunctions(p) {
  try {
    const c = fs.readFileSync(p, 'utf8');
    const f1 = (c.match(/function\s+\w+\s*\(/g) || []).length;
    const f2 = (c.match(/(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\(/g) || []).length;
    const f3 = (c.match(/(?:const|let|var)\s+\w+\s*=\s*async\s+\w+\s*=>/g) || []).length;
    return f1 + f2 + f3;
  } catch { return 0; }
}

function countCsvRows(p) {
  try {
    const lines = fs.readFileSync(p, 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
    return Math.max(0, lines.length - 1);
  } catch { return 0; }
}

function countHtmlQuestions(p) {
  try {
    const c = fs.readFileSync(p, 'utf8');
    const h = (c.match(/<h[34][^>]*>/g) || []).length;
    const q = (c.match(/class="[^"]*question[^"]*"/g) || []).length;
    return h + q;
  } catch { return 0; }
}

function fileSize(p) {
  try { return fs.statSync(p).size; } catch { return 0; }
}

function classifyFile(p, fname) {
  const ext = path.extname(fname).toLowerCase();
  const size = fileSize(p);

  if (ext === '.md') {
    const wc = wordCount(p);
    const todo = hasTodo(p);
    const complete = wc > 200 && !todo;
    return { file_type: 'notes', word_count: wc, has_todo: todo, size_bytes: size,
      status: complete ? 'complete' : 'placeholder',
      reason: (todo ? 'has_todo' : 'no_todo') + ', ' + wc + 'w' };
  } else if (ext === '.js') {
    const fc = countFunctions(p);
    const complete = fc > 5;
    return { file_type: 'example', function_count: fc, size_bytes: size,
      status: complete ? 'complete' : 'placeholder',
      reason: fc + ' functions' };
  } else if (ext === '.csv') {
    const rows = countCsvRows(p);
    const complete = rows > 3;
    return { file_type: 'flashcards', row_count: rows, size_bytes: size,
      status: complete ? 'complete' : 'placeholder',
      reason: rows + ' rows' };
  } else if (ext === '.html') {
    const qc = countHtmlQuestions(p);
    const complete = qc > 3 || size > 15000;
    return { file_type: 'assessment', question_count: qc, size_bytes: size,
      status: complete ? 'complete' : 'placeholder',
      reason: qc + ' questions, ' + size + 'B' };
  } else {
    return { file_type: 'other', size_bytes: size, status: 'complete', reason: 'other' };
  }
}

function walkDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir).sort();
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

const allFiles = walkDir(BASE);
const entries = [];

for (const fpath of allFiles) {
  const rel = fpath.slice(BASE.length).replace(/\\/g, '/').replace(/^\//, '');
  const parts = rel.split('/');
  const category = parts[0] || 'unknown';
  const topic = parts[1] || 'root';
  const fname = parts[parts.length - 1];

  const info = classifyFile(fpath, fname);
  entries.push({ path: rel, category, topic, filename: fname, ...info });
}

const total = entries.length;
const complete = entries.filter(e => e.status === 'complete').length;
const placeholder = total - complete;

const byCategory = {};
for (const e of entries) {
  if (!byCategory[e.category]) byCategory[e.category] = { total: 0, complete: 0, placeholder: 0 };
  byCategory[e.category].total++;
  byCategory[e.category][e.status]++;
}

const manifest = {
  generated_at: "2026-06-16",
  source_path: BASE,
  files: entries,
  summary: {
    total_files: total,
    complete,
    placeholder,
    completion_rate_pct: Math.round(complete / total * 1000) / 10,
    by_category: byCategory
  }
};

const outPath = "C:/personal projects/nnblogs/docs/reports/migration-manifest.json";
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log('Written: ' + total + ' files, ' + complete + ' complete (' + Math.round(complete/total*100) + '%), ' + placeholder + ' placeholder');
for (const [cat, s] of Object.entries(byCategory).sort()) {
  console.log('  ' + cat + ': ' + s.total + ' total, ' + s.complete + ' complete (' + Math.round(s.complete/s.total*100) + '%)');
}
