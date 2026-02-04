import chalk from 'chalk';
import { PromptHandler } from '../utils/PromptHandler.js';
import { GitService } from '../services/GitService.js';
import { ConfigService } from '../services/ConfigService.js';
import { pickFilesInteractively } from '../utils/FilePicker.js';

export class AuditCommand {
  async execute(arg = 'markdown') {
    const options = typeof arg === 'string' ? { format: arg } : (arg ?? {});
    const rawFormat = (options.format || 'markdown').toLowerCase();
    const format = rawFormat === 'pdf' ? 'latex' : rawFormat;
    const formatLabel = rawFormat.toUpperCase();
    const config = ConfigService.load({ cwd: process.cwd() });

    const language = (options.language || config?.defaults?.language || 'en').toLowerCase();

    const configuredScope = config?.defaults?.auditScope;
    const scope = options.scope || (options.all ? 'all' : (options.unstaged ? 'unstaged' : (options.staged ? 'staged' : (configuredScope || 'staged'))));

    const unified = options.unified ?? config?.defaults?.unified;
    const maxChars = options.maxChars ?? config?.defaults?.maxChars;

    let paths = typeof options.files === 'string'
      ? options.files.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const shouldPickFiles = Boolean(options.pickFiles) && paths.length === 0;
    if (shouldPickFiles) {
      const candidates = await GitService.getChangedFiles({
        staged: scope === 'all' || scope === 'staged',
        unstaged: scope === 'all' || scope === 'unstaged',
      });

      if (candidates.length === 0) {
        console.log(chalk.yellow('⚠ No changed files found to pick from.'));
        return;
      }

      const picked = await pickFilesInteractively({
        title: `Pick files to audit (scope: ${scope}):`,
        files: candidates,
      });

      if (picked.length === 0) {
        console.log(chalk.yellow('⚠ No files selected.'));
        return;
      }

      paths = picked;
    }

    console.log(chalk.magenta(`🧐 Generating audit report prompt (${formatLabel}, scope: ${scope})...`));

    const diff = await GitService.getCombinedDiff({
      staged: scope === 'all' || scope === 'staged',
      unstaged: scope === 'all' || scope === 'unstaged',
      unified,
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

      if (rawFormat === 'pdf') {
        template += `
PDF NOTE:
- Produce LaTeX that compiles cleanly with pdflatex/xelatex.
- Avoid external images. Keep it self-contained.
- Include a title, author, and date.
`;
      }
    }

    const prompt = `
  ACT AS: Senior Software Architect & Security Auditor.
  TASK: Write a comprehensive security + code quality audit report for the following changes.
  FORMAT: ${formatLabel} (Strictly follow the structure below).
  LANGUAGE: ${language === 'es' ? 'Spanish (Professional/Formal)' : 'English (Professional/Formal)'}.

${template}

CODE TO AUDIT:
${context.substring(0, Number(maxChars) || 6000)}
    `.trim();

    await PromptHandler.copyAndNotify(prompt, {
      command: 'audit',
      out: options.out,
      noClipboard: options.noClipboard,
    });
    await PromptHandler.launchCopilot();
  }
}