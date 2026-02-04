import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { execa } from 'execa';
import { redactSecrets } from './SecretRedactor.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ConfigService } from '../services/ConfigService.js';
import { applyPromptTemplate } from './TemplateEngine.js';

export class PromptHandler {
  static async copyAndNotify(text, options = {}) {
    const config = ConfigService.load({ cwd: process.cwd() });

    const outPath =
      options.out ??
      process.env.DEVFLOW_OUT ??
      config?.output?.out ??
      null;

    const envNoClipboard = process.env.DEVFLOW_NO_CLIPBOARD;
    const noClipboard =
      options.noClipboard ??
      (envNoClipboard != null ? envNoClipboard === 'true' : (config?.output?.noClipboard ?? false));

    const command = options.command ?? 'prompt';
    const wrapper = config?.templates?.wrapper ?? null;
    const commandTemplate = config?.templates?.[command] ?? null;

    const vars = {
      COMMAND: command,
      CWD: process.cwd(),
      TIMESTAMP: new Date().toISOString(),
    };

    const templatedText = applyPromptTemplate({
      wrapper,
      commandTemplate,
      prompt: text,
      vars,
    });

    const safeText = redactSecrets(templatedText);

    if (outPath) {
      const resolved = path.resolve(process.cwd(), outPath);
      await fs.mkdir(path.dirname(resolved), { recursive: true });
      await fs.writeFile(resolved, safeText, 'utf8');
      console.log(chalk.green(`✔ Prompt written to: ${resolved}`));
    }

    if (!noClipboard) {
      try {
        await clipboardy.write(safeText);
        console.log(chalk.green('✔ Prompt copied to clipboard.'));
      } catch {
        console.log(chalk.red('⚠ Clipboard copy failed.'));
      }
    } else {
      console.log(chalk.dim('ℹ Clipboard disabled; not copying prompt.'));
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