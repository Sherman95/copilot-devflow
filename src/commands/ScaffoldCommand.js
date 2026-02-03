import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';

export class ScaffoldCommand {
  async execute(idea) {
    console.log(chalk.cyan(`🏗️  Arquitecto IA: Diseñando estructura para "${idea}"...`));

    const prompt = `
Generate shell commands (bash) to create the folder structure and empty files for: ${idea}. 
Use 'mkdir -p' and 'touch'. 
Just show the commands, no explanation.
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}