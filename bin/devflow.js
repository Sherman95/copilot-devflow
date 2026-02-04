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

const program = new Command();

program
  .name('devflow')
  .description('AI workflow orchestrator powered by GitHub Copilot CLI')
  .version('2.0.0')
  .showHelpAfterError()
  .showSuggestionAfterError();

program.command('doctor')
  .description('Checks prerequisites (git, gh, gh-copilot) and prints a quick setup guide')
  .action(async () => new DoctorCommand().execute());

program.command('review')
  .description('Reviews pending Git changes (quality + security prompt)')
  .option('--staged', 'Review staged changes only')
  .option('--unstaged', 'Review unstaged changes only')
  .option('--all', 'Review both staged and unstaged changes (default)')
  .option('--files <paths>', 'Comma-separated file paths to filter (passed to git diff)')
  .option('--unified <n>', 'Number of diff context lines', (v) => Number(v))
  .option('--max-chars <n>', 'Max characters to include in the prompt', (v) => Number(v))
  .action(async (cmd) => new ReviewCommand().execute(cmd));

program.command('commit')
  .description('Generates a Conventional Commit message from your staged diff')
  .action(async () => new CommitCommand().execute());

program.command('test <file>')
  .description('Generates a unit test prompt for a given file')
  .action(async (file) => new TestCommand().execute(file));

program.command('scaffold <idea>')
  .description('Bootstraps a project structure from a natural-language idea')
  .action(async (idea) => new ScaffoldCommand().execute(idea));

program.command('explain <file>')
  .description('Explains a local file (onboarding/legacy-friendly)')
  .action(async (file) => new ExplainCommand().execute(file));

program.command('audit')
  .description('Generates a security/compliance audit prompt (Markdown/LaTeX)')
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
  .action(async () => new ReadmeCommand().execute());

program.command('generate <description>')
  .alias('g') // Para que puedas usar 'devflow g "Login"' como en Angular
  .description('Generates context-aware code tailored to your stack')
  .action(async (desc) => new GenerateCommand().execute(desc));

program.command('refactor <file>')
  .description('Refactors code using Clean Code & SOLID (preserving behavior)')
  .option('-g, --goal <goal>', 'Specific refactor goal (e.g. "Convert to async/await")', 'Clean Code & SOLID')
  .action(async (file, cmd) => new RefactorCommand().execute(file, cmd.goal));

program.command('docker')
  .description('Generates a production baseline Dockerfile + docker-compose.yml')
  .action(async () => new DockerCommand().execute());

program.parse(process.argv);