#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { ReviewCommand } from '../src/commands/ReviewCommand.js';
import { CommitCommand } from '../src/commands/CommitCommand.js';
import { TestCommand } from '../src/commands/TestCommand.js';
import { ScaffoldCommand } from '../src/commands/ScaffoldCommand.js';
import { ExplainCommand } from '../src/commands/ExplainCommand.js';
import { AuditCommand } from '../src/commands/AuditCommand.js';
import { ReadmeCommand } from '../src/commands/ReadmeCommand.js';
import { GenerateCommand } from '../src/commands/GenerateCommand.js';
import { RefactorCommand } from '../src/commands/RefactorCommand.js';
import { DockerCommand } from '../src/commands/DockerCommand.js';
import { DoctorCommand } from '../src/commands/DoctorCommand.js';
import { DemoCommand } from '../src/commands/DemoCommand.js';
import { PRCommand } from '../src/commands/PRCommand.js';
import { PdfCommand } from '../src/commands/PdfCommand.js';

const program = new Command();

program
  .name('devflow')
  .description('AI workflow orchestrator powered by GitHub Copilot CLI')
  .version('2.0.0')
  .option('-n, --dry-run', 'Do not launch `gh copilot` (still prints/copies the prompt)')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .showHelpAfterError()
  .showSuggestionAfterError();

program.configureOutput({
  writeErr: (str) => process.stderr.write(chalk.red(str)),
});

program.addHelpText(
  'beforeAll',
  `\n${chalk.cyanBright.bold('DevFlow')} ${chalk.dim('— AI workflow orchestrator powered by GitHub Copilot CLI')}\n` +
    `${chalk.dim('Tips: use aliases like `devflow r`, `devflow a`, `devflow p` and short flags like -n -o -N -P -A.')}\n\n`,
);

program.addHelpText(
  'afterAll',
  `${chalk.dim('\nExamples:\n')}  devflow doctor\n  devflow r -A -n\n  devflow a -A -f pdf -o audit.tex -N -n\n  devflow p -A -o pr.md -N -n\n`,
);

program.hook('preAction', (thisCommand, actionCommand) => {
  const globalOpts = thisCommand?.opts?.() ?? {};
  const actionOpts = actionCommand?.opts?.() ?? {};
  const dryRun = Boolean(globalOpts.dryRun || actionOpts.dryRun);
  process.env.DEVFLOW_DRY_RUN = dryRun ? 'true' : 'false';

  const configPath = globalOpts.config || actionOpts.config;
  if (configPath) process.env.DEVFLOW_CONFIG = String(configPath);

  const outPath = globalOpts.out || actionOpts.out;
  if (outPath) process.env.DEVFLOW_OUT = String(outPath);

  const noClipboard = Boolean(globalOpts.clipboard === false || actionOpts.clipboard === false);
  process.env.DEVFLOW_NO_CLIPBOARD = noClipboard ? 'true' : 'false';
});

program.command('doctor')
  .description('Checks prerequisites (git, gh, gh-copilot) and prints a quick setup guide')
  .alias('dr')
  .action(async () => new DoctorCommand().execute());

program.command('review')
  .description('Reviews pending Git changes (quality + security prompt)')
  .alias('r')
  .allowUnknownOption(false)
  .option('-P, --pick-files', 'Interactively select files to include in the diff')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .option('-S, --staged', 'Review staged changes only')
  .option('-U, --unstaged', 'Review unstaged changes only')
  .option('-A, --all', 'Review both staged and unstaged changes (default)')
  .option('-F, --files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('-u, --unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('-m, --max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .action(async (cmd) => new ReviewCommand().execute(cmd));

program.command('pr')
  .description('Generates a high-quality GitHub Pull Request title + description from git changes')
  .alias('p')
  .option('-P, --pick-files', 'Interactively select files to include in the diff')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .option('-S, --staged', 'Use staged changes only')
  .option('-U, --unstaged', 'Use unstaged changes only')
  .option('-A, --all', 'Use both staged and unstaged changes (default)')
  .option('-F, --files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('-u, --unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('-m, --max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .option('-l, --language <lang>', 'Language: en | es', 'en')
  .option('--title <text>', 'Optional title hint to steer the PR title')
  .action(async (cmd) => new PRCommand().execute(cmd));

program.command('commit')
  .description('Generates a Conventional Commit message from your staged diff')
  .alias('cm')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new CommitCommand().execute());

program.command('test <file>')
  .description('Generates a unit test prompt for a given file')
  .alias('t')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file) => new TestCommand().execute(file));

program.command('scaffold <idea>')
  .description('Bootstraps a project structure from a natural-language idea')
  .alias('s')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (idea) => new ScaffoldCommand().execute(idea));

program.command('explain <file>')
  .description('Explains a local file (onboarding/legacy-friendly)')
  .alias('x')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file) => new ExplainCommand().execute(file));

program.command('audit')
  .description('Generates a security/compliance audit prompt (Markdown/LaTeX)')
  .alias('a')
  .option('-P, --pick-files', 'Interactively select files to include in the diff')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .option('-f, --format <type>', 'Output format: markdown | latex | pdf', 'markdown')
  .option('-S, --staged', 'Audit staged changes only (default)')
  .option('-U, --unstaged', 'Audit unstaged changes only')
  .option('-A, --all', 'Audit both staged and unstaged changes')
  .option('-F, --files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('-u, --unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('-m, --max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .option('-l, --language <lang>', 'Report language: en | es', 'en')
  .action(async (cmd) => new AuditCommand().execute(cmd));

program.command('readme')
  .description('Generates a professional README by analyzing your project')
  .alias('rm')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new ReadmeCommand().execute());

program.command('generate <description>')
  .alias('g') // Para que puedas usar 'devflow g "Login"' como en Angular
  .description('Generates context-aware code tailored to your stack')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (desc) => new GenerateCommand().execute(desc));

program.command('refactor <file>')
  .description('Refactors code using Clean Code & SOLID (preserving behavior)')
  .alias('rf')
  .option('-g, --goal <goal>', 'Specific refactor goal (e.g. "Convert to async/await")', 'Clean Code & SOLID')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file, cmd) => new RefactorCommand().execute(file, cmd.goal));

program.command('docker')
  .description('Generates a production baseline Dockerfile + docker-compose.yml')
  .alias('dk')
  .option('-n, --dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new DockerCommand().execute());

program.command('demo')
  .description('Judge-mode demo: prints a 60-second script (optionally generates a demo repo)')
  .alias('d')
  .option('--setup', 'Create a temporary demo repository with staged + unstaged changes')
  .option('--dir <path>', 'Use an existing directory (defaults to current working directory)')
  .option('-n, --dry-run', 'Do not launch `gh copilot` (recommended for demos)', true)
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('-o, --out <file>', 'Write the generated prompt to a file')
  .option('-N, --no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (cmd) => new DemoCommand().execute(cmd));

program.command('pdf <file>')
  .description('Compiles a local LaTeX .tex file to PDF using pdflatex/xelatex')
  .alias('tex')
  .option('--engine <name>', 'Engine to use: pdflatex | xelatex')
  .option('-o, --out <file>', 'Copy the generated PDF to this path')
  .action(async (file, cmd) => new PdfCommand().execute(file, cmd));

program.parse(process.argv);