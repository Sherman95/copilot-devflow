import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { execa } from 'execa';

export class PromptHandler {
  static async copyAndNotify(text) {
    try {
      await clipboardy.write(text);
      console.log(chalk.green('✔ Prompt copiado al portapapeles.'));
    } catch (err) {
      console.log(chalk.red('⚠ Falló el copiado automático.'));
    }
    this.printBackup(text);
  }

  static printBackup(text) {
    console.log(chalk.yellow('\n👇 SI NO SE PEGÓ, COPIA ESTO 👇'));
    console.log(chalk.dim('---------------------------------------------------'));
    console.log(chalk.cyan.bold(text));
    console.log(chalk.dim('---------------------------------------------------'));
    console.log(chalk.white('Luego presiona CTRL+V en la siguiente pantalla.\n'));
  }

  static async launchCopilot() {
    await execa('gh', ['copilot'], { stdio: 'inherit' });
  }
}