import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';

export class RefactorCommand {
  async execute(filePath, goal = 'general cleanup') {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(chalk.red(`❌ File not found: ${filePath}`));
      return;
    }

    const code = fs.readFileSync(fullPath, 'utf-8');
    const relativePath = path.relative(process.cwd(), fullPath);

    console.log(chalk.blue(`🧹 Preparing refactor prompt for ${relativePath}...`));
    console.log(chalk.dim(`   Goal: ${goal}`));

    const prompt = `
ACT AS: Senior Software Architect & Clean Code Evangelist.
TASK: Refactor the following code to improve quality without breaking functionality.

GOAL: ${goal} (e.g., Apply SOLID, Extract Methods, Modernize Syntax).

INSTRUCTIONS:
1. Break down large functions into smaller, single-responsibility functions.
2. Rename variables to be semantic.
3. Add JSDoc/Comments explaining complex parts.
4. If JS, use modern ES6+ features (Async/Await, Arrow functions).

CODE TO REFACTOR:
${code.substring(0, 3000)}

OUTPUT: Only the refactored code block.
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}