import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';
import { ConfigService } from '../services/ConfigService.js';
import { pickFilesInteractively } from '../utils/FilePicker.js';

export class PRCommand {
  async execute(options = {}) {
    console.log(chalk.cyan('🧾 Generating Pull Request prompt...'));

    const config = ConfigService.load({ cwd: process.cwd() });

    const configuredScope = config?.defaults?.reviewScope;
    const scope = options.scope || (options.all ? 'all' : (options.staged ? 'staged' : (options.unstaged ? 'unstaged' : (configuredScope || 'all'))));
    const unified = options.unified ?? config?.defaults?.unified;
    const maxChars = options.maxChars ?? config?.defaults?.maxChars;
    const language = (options.language || config?.defaults?.language || 'en').toLowerCase();

    let paths = typeof options.files === 'string'
      ? options.files.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const shouldPickFiles = Boolean(options.pickFiles) && paths.length === 0;
    if (shouldPickFiles) {
      const candidates = await GitService.getChangedFiles({
        staged: scope === 'all' || scope === 'staged',
        unstaged: scope === 'all' || scope === 'unstaged',
      });

      if (candidates.length === 0) {
        console.log(chalk.yellow('⚠ No changed files found to pick from.'));
        return;
      }

      const picked = await pickFilesInteractively({
        title: `Pick files to include in the PR context (scope: ${scope}):`,
        files: candidates,
      });

      if (picked.length === 0) {
        console.log(chalk.yellow('⚠ No files selected.'));
        return;
      }

      paths = picked;
    }

    const diff = await GitService.getCombinedDiff({
      staged: scope === 'all' || scope === 'staged',
      unstaged: scope === 'all' || scope === 'unstaged',
      unified,
      paths,
    });

    if (!diff) {
      console.log(chalk.yellow('⚠ No git changes found for the selected scope.'));
      console.log(chalk.dim('Tip: stage files with: git add -A'));
      return;
    }

    const titleHint = typeof options.title === 'string' && options.title.trim() ? options.title.trim() : null;

    const prompt = `
ACT AS: Staff Engineer.
TASK: Write a high-quality GitHub Pull Request description for the changes below.
LANGUAGE: ${language === 'es' ? 'Spanish (Professional/Formal)' : 'English (Professional/Clear)'}.

REQUIREMENTS:
- Output Markdown only.
- Provide 3 PR title options (Conventional Commit style).
- Then a complete PR body with:
  1) Summary (what + why)
  2) Changes (bulleted)
  3) How to test (step-by-step)
  4) Risk & rollout notes
  5) Security considerations (secrets, auth, injection)
  6) Checklist
- Be concise, but actionable.

${titleHint ? `TITLE HINT:\n${titleHint}\n` : ''}

CHANGES:
${diff.substring(0, Number(maxChars) || 8000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt, {
      command: 'pr',
      out: options.out,
      noClipboard: options.noClipboard,
    });
    await PromptHandler.launchCopilot();
  }
}
