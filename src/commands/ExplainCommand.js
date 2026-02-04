import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';

export class ExplainCommand {
  async execute(filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(chalk.red('❌ File not found.'));
      return;
    }

    const relativePath = path.relative(process.cwd(), fullPath);
    console.log(chalk.blue(`🧠 Explaining ${relativePath}...`));

    const prompt = `
@${relativePath} 
Act as a Senior Engineer. 
1. Explain what this code does.
2. Identify potential bugs.
3. Suggest one optimization.
    `.trim();

    await PromptHandler.copyAndNotify(prompt, { command: 'explain' });
    await PromptHandler.launchCopilot();
  }
}