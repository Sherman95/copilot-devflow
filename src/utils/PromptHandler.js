import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { execa } from 'execa';
import { redactSecrets } from './SecretRedactor.js';

export class PromptHandler {
  static async copyAndNotify(text) {
    const safeText = redactSecrets(text);
    try {
      await clipboardy.write(safeText);
      console.log(chalk.green('✔ Prompt copied to clipboard.'));
    } catch (err) {
      console.log(chalk.red('⚠ Clipboard copy failed.'));
    }
    this.printBackup(safeText);
  }

  static printBackup(text) {
    console.log(chalk.yellow('\n👇 IF PASTE FAILED, COPY THIS 👇'));
    console.log(chalk.dim('---------------------------------------------------'));
    console.log(chalk.cyan.bold(text));
    console.log(chalk.dim('---------------------------------------------------'));
    console.log(chalk.white('Then press CTRL+V in the next screen.\n'));
  }

  static async launchCopilot() {
    if (process.env.DEVFLOW_DRY_RUN === 'true') {
      console.log(chalk.dim('ℹ Dry run: not launching `gh copilot`.'));
      return;
    }
    await execa('gh', ['copilot'], { stdio: 'inherit' });
  }
}