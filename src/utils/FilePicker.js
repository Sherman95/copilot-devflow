import chalk from 'chalk';
import readline from 'node:readline/promises';

function parseSelection(input, maxIndex) {
  const raw = String(input || '').trim();
  if (!raw) return [];
  if (raw.toLowerCase() === 'a' || raw.toLowerCase() === 'all') {
    return Array.from({ length: maxIndex }, (_, i) => i);
  }

  const indexes = new Set();
  for (const part of raw.split(',')) {
    const token = part.trim();
    if (!token) continue;

    // range: 1-4
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      for (let n = lo; n <= hi; n++) {
        const idx = n - 1;
        if (idx >= 0 && idx < maxIndex) indexes.add(idx);
      }
      continue;
    }

    const n = Number(token);
    if (!Number.isFinite(n)) continue;
    const idx = n - 1;
    if (idx >= 0 && idx < maxIndex) indexes.add(idx);
  }

  return Array.from(indexes);
}

export async function pickFilesInteractively({ title, files }) {
  if (!Array.isArray(files) || files.length === 0) return [];

  console.log(chalk.white(title));
  for (let i = 0; i < files.length; i++) {
    console.log(chalk.dim(`  ${i + 1}) ${files[i]}`));
  }
  console.log(chalk.dim('Select files by number (e.g. 1,3,5-8) or type "a" for all.'));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(chalk.cyan('Selection> '));
    const selectedIndexes = parseSelection(answer, files.length);
    return selectedIndexes.map((i) => files[i]);
  } finally {
    rl.close();
  }
}
