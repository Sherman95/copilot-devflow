import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { execa } from 'execa';

export class ReadmeCommand {
  async execute() {
    console.log(chalk.magenta('📝 Analyzing project to generate a professional README prompt...'));

    // 1. Obtener estructura de archivos (sin node_modules ni .git)
    // Usamos 'git ls-files' que es más limpio que 'tree'
    let fileStructure = '';
    try {
      const { stdout } = await execa('git', ['ls-files']);
      fileStructure = stdout;
    } catch (e) {
      fileStructure = 'No git files found. Assume standard structure.';
    }

    // 2. Leer package.json para contexto extra (si existe)
    let pkgJson = '';
    if (fs.existsSync('package.json')) {
      pkgJson = fs.readFileSync('package.json', 'utf-8');
    }

    // 3. El Prompt Maestro
    const prompt = `
ACT AS: Expert Technical Writer & Developer Advocate.
TASK: Generate a beautiful, professional README.md for this project.
LANGUAGE: English (Standard for GitHub).

REQUIREMENTS:
1. Use distinct emojis for sections.
2. Include Badges (Shields.io) for Tech Stack (Node, Python, etc) & License.
3. Sections: 
   - 🚀 Introduction
   - 🛠 Installation & Usage
   - ✨ Key Features (Deduce them from file names like 'AuditCommand', 'ReviewCommand')
   - 🏗 Architecture
   - 🤝 Contributing

CONTEXT:
Project Structure:
${fileStructure.substring(0, 1000)}

Package Info:
${pkgJson.substring(0, 500)}

OUTPUT: Only the raw Markdown code.
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}