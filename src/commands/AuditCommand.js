import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class AuditCommand {
  async execute(format = 'markdown') {
    console.log(chalk.magenta(`🧐 AUDITORÍA PRO: Generando informe en formato ${format.toUpperCase()}...`));

    // Obtenemos los cambios cacheados (staged)
    const diff = await GitService.getDiff(true);
    
    // Si no hay cambios, avisamos pero no fallamos (para que analice estructura general si se desea)
    const context = diff || "No hay cambios específicos en git (staged). Analiza la estructura lógica general o asume un análisis de código limpio.";

    let template = '';

    if (format === 'markdown') {
      template = `
OUTPUT FORMAT: MARKDOWN (.md)
STRUCTURE:
# Technical Security & Code Quality Audit
## 1. Executive Summary
(Brief overview of changes and risks for management)
## 2. Risk Assessment Table
| Severity | File | Issue | Recommendation |
|----------|------|-------|----------------|
| High/Med | ...  | ...   | ...            |
## 3. Detailed Technical Analysis
(Deep dive into logic, efficiency, and clean code violations)
## 4. Refactoring Roadmap
(Code blocks showing BEFORE vs AFTER)
`;
    } else if (format === 'latex') {
      template = `
OUTPUT FORMAT: LATEX (.tex)
Requirement: Use standard article class.
STRUCTURE:
\\section{Executive Summary}
\\section{Vulnerability Analysis}
\\begin{table} ... \\end{table}
\\section{Optimization Proposals}
`;
    }

    const prompt = `
ACT AS: Senior Software Architect & Security Auditor.
TASK: Write a comprehensive audit report for the following code changes.
FORMAT: ${format.toUpperCase()} (Strictly follow the structure below).
LANGUAGE: Spanish (Professional/Formal).

${template}

CODE TO AUDIT:
${context.substring(0, 3000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}