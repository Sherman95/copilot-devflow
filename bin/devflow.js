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

const program = new Command();

program
  .name('devflow')
  .description('Tu Tech Lead IA Modular y Escalable v2.0')
  .version('2.0.0');

program.command('review')
  .description('Analiza cambios pendientes en Git')
  .action(async () => new ReviewCommand().execute());

program.command('commit')
  .description('Genera mensajes de commit semánticos')
  .action(async () => new CommitCommand().execute());

program.command('test <file>')
  .description('Genera tests unitarios para un archivo')
  .action(async (file) => new TestCommand().execute(file));

program.command('scaffold <idea>')
  .description('Genera estructura de proyecto')
  .action(async (idea) => new ScaffoldCommand().execute(idea));

program.command('explain <file>')
  .description('Explica un archivo local')
  .action(async (file) => new ExplainCommand().execute(file));

program.command('audit')
  .description('Genera un informe profesional (Markdown/LaTeX)')
  .option('-f, --format <type>', 'Formato de salida', 'markdown')
  .action(async (cmd) => new AuditCommand().execute(cmd.format));

program.command('readme')
  .description('✨ Genera un README.md profesional automáticamente analizando tu proyecto')
  .action(async () => new ReadmeCommand().execute());

program.command('generate <description>')
  .alias('g') // Para que puedas usar 'devflow g "Login"' como en Angular
  .description('Genera código (Componentes, Servicios, Clases) adaptado a tu Framework')
  .action(async (desc) => new GenerateCommand().execute(desc));

program.command('refactor <file>')
  .description('Reescribe código sucio aplicando principios SOLID y Clean Code')
  .option('-g, --goal <goal>', 'Objetivo específico (ej: "Convertir a Async/Await")', 'Clean Code & SOLID')
  .action(async (file, cmd) => new RefactorCommand().execute(file, cmd.goal));

program.command('docker')
  .description('Genera Dockerfile y docker-compose.yml listos para producción')
  .action(async () => new DockerCommand().execute());

program.parse(process.argv);