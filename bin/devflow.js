#!/usr/bin/env node
import { Command } from 'commander';
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

const program = new Command();

program
  .name('devflow')
  .description('AI workflow orchestrator powered by GitHub Copilot CLI')
  .version('2.0.0')
  .option('--dry-run', 'Do not launch `gh copilot` (still prints/copies the prompt)')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .showHelpAfterError()
  .showSuggestionAfterError();

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
  .action(async () => new DoctorCommand().execute());

program.command('review')
  .description('Reviews pending Git changes (quality + security prompt)')
  .allowUnknownOption(false)
  .option('--pick-files', 'Interactively select files to include in the diff')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .option('--staged', 'Review staged changes only')
  .option('--unstaged', 'Review unstaged changes only')
  .option('--all', 'Review both staged and unstaged changes (default)')
  .option('--files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('--unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('--max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .action(async (cmd) => new ReviewCommand().execute(cmd));

program.command('pr')
  .description('Generates a high-quality GitHub Pull Request title + description from git changes')
  .option('--pick-files', 'Interactively select files to include in the diff')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .option('--staged', 'Use staged changes only')
  .option('--unstaged', 'Use unstaged changes only')
  .option('--all', 'Use both staged and unstaged changes (default)')
  .option('--files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('--unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('--max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .option('--language <lang>', 'Language: en | es', 'en')
  .option('--title <text>', 'Optional title hint to steer the PR title')
  .action(async (cmd) => new PRCommand().execute(cmd));

program.command('commit')
  .description('Generates a Conventional Commit message from your staged diff')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new CommitCommand().execute());

program.command('test <file>')
  .description('Generates a unit test prompt for a given file')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file) => new TestCommand().execute(file));

program.command('scaffold <idea>')
  .description('Bootstraps a project structure from a natural-language idea')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (idea) => new ScaffoldCommand().execute(idea));

program.command('explain <file>')
  .description('Explains a local file (onboarding/legacy-friendly)')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file) => new ExplainCommand().execute(file));

program.command('audit')
  .description('Generates a security/compliance audit prompt (Markdown/LaTeX)')
  .option('--pick-files', 'Interactively select files to include in the diff')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .option('-f, --format <type>', 'Output format: markdown | latex', 'markdown')
  .option('--staged', 'Audit staged changes only (default)')
  .option('--unstaged', 'Audit unstaged changes only')
  .option('--all', 'Audit both staged and unstaged changes')
  .option('--files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('--unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('--max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .option('--language <lang>', 'Report language: en | es', 'en')
  .action(async (cmd) => new AuditCommand().execute(cmd));

program.command('readme')
  .description('Generates a professional README by analyzing your project')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new ReadmeCommand().execute());

program.command('generate <description>')
  .alias('g') // Para que puedas usar 'devflow g "Login"' como en Angular
  .description('Generates context-aware code tailored to your stack')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (desc) => new GenerateCommand().execute(desc));

program.command('refactor <file>')
  .description('Refactors code using Clean Code & SOLID (preserving behavior)')
  .option('-g, --goal <goal>', 'Specific refactor goal (e.g. "Convert to async/await")', 'Clean Code & SOLID')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (file, cmd) => new RefactorCommand().execute(file, cmd.goal));

program.command('docker')
  .description('Generates a production baseline Dockerfile + docker-compose.yml')
  .option('--dry-run', 'Do not launch `gh copilot`')
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async () => new DockerCommand().execute());

program.command('demo')
  .description('Judge-mode demo: prints a 60-second script (optionally generates a demo repo)')
  .option('--setup', 'Create a temporary demo repository with staged + unstaged changes')
  .option('--dir <path>', 'Use an existing directory (defaults to current working directory)')
  .option('--dry-run', 'Do not launch `gh copilot` (recommended for demos)', true)
  .option('-c, --config <path>', 'Path to devflow config file (JSON)')
  .option('--out <file>', 'Write the generated prompt to a file')
  .option('--no-clipboard', 'Do not copy the prompt to clipboard')
  .action(async (cmd) => new DemoCommand().execute(cmd));

program.parse(process.argv);