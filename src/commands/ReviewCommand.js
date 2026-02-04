import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';
import { ConfigService } from '../services/ConfigService.js';
import { pickFilesInteractively } from '../utils/FilePicker.js';

export class ReviewCommand {
  async execute(options = {}) {
    console.log(chalk.blue('🔍 Starting AI code review...'));

    const config = ConfigService.load({ cwd: process.cwd() });

    const configuredScope = config?.defaults?.reviewScope;
    const scope = options.scope || (options.all ? 'all' : (options.staged ? 'staged' : (options.unstaged ? 'unstaged' : (configuredScope || 'all'))));
    const unified = options.unified ?? config?.defaults?.unified;
    const maxChars = options.maxChars ?? config?.defaults?.maxChars;

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
        title: `Pick files to review (scope: ${scope}):`,
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

    const prompt = `
ACT AS: Senior Tech Lead.
TASK: Review the following git changes.
FOCUS:
- Correctness, maintainability, and performance
- Security issues (secrets, injection, auth, unsafe patterns)

OUTPUT:
1) Start with exactly one word: APPROVE or REJECT
2) Then list findings grouped by severity (High/Med/Low)
3) Provide concrete fixes with code snippets when useful

CHANGES:
${diff.substring(0, Number(maxChars) || 4000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt, {
      command: 'review',
      out: options.out,
      noClipboard: options.noClipboard,
    });
    await PromptHandler.launchCopilot();
  }
}