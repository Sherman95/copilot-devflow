import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class ReviewCommand {
  async execute() {
    console.log(chalk.blue('🔍 Iniciando Code Review con IA...'));

    const diff = await GitService.getDiff();

    if (!diff) {
      console.log(chalk.yellow('⚠ No se detectaron cambios en Git.'));
      return;
    }

    const prompt = `
I have the following git changes. Act as a Tech Lead.
Review logic and security.
If bad, start with "REJECT". If good, "APPROVE":

${diff.substring(0, 2000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}