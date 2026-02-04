import fs from 'fs';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { execa } from 'execa';

export class DockerCommand {
  async execute() {
    console.log(chalk.cyan('🐳 Generating Docker configuration prompt...'));

    // 1. Detectar dependencias para elegir la imagen base correcta
    let context = '';
    if (fs.existsSync('package.json')) {
      context = "Node.js Project. Package.json content:\n" + fs.readFileSync('package.json', 'utf-8');
    } else if (fs.existsSync('requirements.txt')) {
      context = "Python Project. Requirements:\n" + fs.readFileSync('requirements.txt', 'utf-8');
    } else {
      // Evitamos comandos no portables (p. ej. `ls` en Windows)
      let fileList = '';
      try {
        const { stdout } = await execa('git', ['ls-files']);
        fileList = stdout.split('\n').slice(0, 80).join('\n');
      } catch {
        try {
          fileList = fs.readdirSync(process.cwd(), { withFileTypes: true })
            .slice(0, 80)
            .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
            .join('\n');
        } catch {
          fileList = 'Unable to list files.';
        }
      }
      context = "Generic Project. File list (partial):\n" + fileList;
    }

    const prompt = `
ACT AS: Senior DevOps Engineer.
TASK: Create production-ready Docker configuration files for this project.

CONTEXT:
${context.substring(0, 2000)}

REQUIREMENTS:
1. Generate a 'Dockerfile' optimized for size (multi-stage build if possible).
2. Generate a 'docker-compose.yml' (assume a standard setup, e.g., mapping port 3000 or 8000).
3. Include a '.dockerignore' file.

OUTPUT: Provide the content for these 3 files clearly separated.
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}