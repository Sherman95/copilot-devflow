import fs from 'fs';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { execa } from 'execa';

export class GenerateCommand {
  async execute(requirement) {
    console.log(chalk.cyan(`⚡ Constructor IA: Analizando tu proyecto para generar "${requirement}"...`));

    // 1. Detectar el Framework / Lenguaje automáticamente
    let context = "Generic Project";
    let techStack = "Unknown";
    
    if (fs.existsSync('package.json')) {
      const pkg = fs.readFileSync('package.json', 'utf-8');
      if (pkg.includes('"@angular/core"')) techStack = "Angular (TypeScript)";
      else if (pkg.includes('"react"')) techStack = "React (JSX/TSX)";
      else if (pkg.includes('"vue"')) techStack = "Vue.js";
      else if (pkg.includes('"express"')) techStack = "Node.js / Express";
      else techStack = "JavaScript/Node.js";
    } else if (fs.existsSync('requirements.txt')) {
      techStack = "Python";
    }

    console.log(chalk.dim(`   (Framework detectado: ${techStack})`));

    // 2. Obtener estructura básica para saber dónde poner el archivo
    let fileTree = '';
    try {
        // Listamos solo directorios hasta nivel 2 para no saturar
        // En Windows usamos dir, en Linux find. Usamos ls-files de git que es universal si hay git.
        const { stdout } = await execa('git', ['ls-files']);
        fileTree = stdout.split('\n').slice(0, 50).join('\n'); // Primeros 50 archivos para contexto
    } catch (e) {
        fileTree = "No git structure found.";
    }

    // 3. El Prompt del Constructor
    const prompt = `
ACT AS: Senior ${techStack} Developer.
TASK: Generate the code for the following requirement: "${requirement}".

CONTEXT:
- Tech Stack: ${techStack}
- Project Structure (Partial):
${fileTree}

INSTRUCTIONS:
1. Provide the FULL CODE for the file(s) needed.
2. If it's a component (Angular/React), include logical parts (CSS/HTML/TS).
3. Suggest the best file path/name based on the project structure.
4. Don't use placeholders; implement a working basic version.

OUTPUT: Just the code and filename.
    `.trim();

    await PromptHandler.copyAndNotify(prompt, { command: 'generate' });
    await PromptHandler.launchCopilot();
  }
}