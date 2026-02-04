import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class ReviewCommand {
  async execute(options = {}) {
    console.log(chalk.blue('🔍 Starting AI code review...'));

    const scope = options.scope || (options.all ? 'all' : (options.staged ? 'staged' : (options.unstaged ? 'unstaged' : 'all')));
    const paths = typeof options.files === 'string'
      ? options.files.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const diff = await GitService.getCombinedDiff({
      staged: scope === 'all' || scope === 'staged',
      unstaged: scope === 'all' || scope === 'unstaged',
      unified: options.unified,
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
${diff.substring(0, Number(options.maxChars) || 4000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}