import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';

export class ScaffoldCommand {
  async execute(idea) {
    console.log(chalk.cyan(`🏗️  Generating scaffold commands for: "${idea}"...`));

    const shell = process.platform === 'win32' ? 'PowerShell' : 'bash';

    const prompt = `
Generate shell commands (${shell}) to create the folder structure and empty files for: ${idea}.

Requirements:
1) Use idiomatic ${shell} commands.
2) Create folders first, then files.
3) Be safe (no destructive commands like rm/del).
4) Just output the commands, no explanation.
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}