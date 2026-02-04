import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';

export class TestCommand {
  async execute(filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // Validación básica
    if (!fs.existsSync(fullPath)) {
      console.log(chalk.red(`❌ File not found: "${filePath}"`));
      return;
    }

    const relativePath = path.relative(process.cwd(), fullPath);
    console.log(chalk.magenta(`🧪 Designing tests for: ${relativePath}...`));

    const prompt = `
@${relativePath}
Act as a QA Engineer.
Write comprehensive unit tests for this file.
- If JS/TS, use Jest.
- If Python, use Pytest.
- Cover edge cases.
Just show the code.
    `.trim();

    await PromptHandler.copyAndNotify(prompt, { command: 'test' });
    await PromptHandler.launchCopilot();
  }
}