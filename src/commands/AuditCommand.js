import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';

export class AuditCommand {
  async execute(arg = 'markdown') {
    const options = typeof arg === 'string' ? { format: arg } : (arg ?? {});
    const format = options.format || 'markdown';
    const language = (options.language || 'en').toLowerCase();
    const scope = options.scope || (options.all ? 'all' : (options.unstaged ? 'unstaged' : 'staged'));
    const paths = typeof options.files === 'string'
      ? options.files.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    console.log(chalk.magenta(`🧐 Generating audit report prompt (${format.toUpperCase()}, scope: ${scope})...`));

    const diff = await GitService.getCombinedDiff({
      staged: scope === 'all' || scope === 'staged',
      unstaged: scope === 'all' || scope === 'unstaged',
      unified: options.unified,
      paths,
    });

    const context = diff || 'No git changes found for the selected scope. Provide a general audit of architecture, security posture, and likely risk areas based on the repository structure.';

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
  TASK: Write a comprehensive security + code quality audit report for the following changes.
  FORMAT: ${format.toUpperCase()} (Strictly follow the structure below).
  LANGUAGE: ${language === 'es' ? 'Spanish (Professional/Formal)' : 'English (Professional/Formal)'}.

${template}

CODE TO AUDIT:
${context.substring(0, Number(options.maxChars) || 6000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt);
    await PromptHandler.launchCopilot();
  }
}