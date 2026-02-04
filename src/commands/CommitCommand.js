import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class CommitCommand {
  async execute() {
    console.log(chalk.blue('✍️  Generating commit message prompt...'));

    const diff = await GitService.getDiff(true); // true = --cached (staged files)

    if (!diff) {
      console.log(chalk.yellow('⚠ No staged changes found. Run: git add -A'));
      return;
    }

    const prompt = `
Generate a semantic git commit message for these changes.
Use Conventional Commits format (e.g., "feat: ...", "fix: ...").
Just show the message, no quotes.

CHANGES:
${diff.substring(0, 2000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt, { command: 'commit' });
    await PromptHandler.launchCopilot();
  }
}