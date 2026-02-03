import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class CommitCommand {
  async execute() {
    console.log(chalk.blue('✍️  Generando mensaje de commit...'));

    const diff = await GitService.getDiff(true); // true = --cached (staged files)

    if (!diff) {
      console.log(chalk.yellow('⚠ No hay archivos en Stage. Ejecuta "git add" primero.'));
      return;
    }

    const prompt = `
Generate a semantic git commit message for these changes.
Use Conventional Commits format (e.g., "feat: ...", "fix: ...").
Just show the message, no quotes.

CHANGES:
${diff.substring(0, 2000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}