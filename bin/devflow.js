#!/usr/bin/env node
import { Command } from 'commander';
import { ReviewCommand } from '../src/commands/ReviewCommand.js';
import { CommitCommand } from '../src/commands/CommitCommand.js';
import { TestCommand } from '../src/commands/TestCommand.js';
import { ScaffoldCommand } from '../src/commands/ScaffoldCommand.js';
import { ExplainCommand } from '../src/commands/ExplainCommand.js';

const program = new Command();

program
  .name('devflow')
  .description('Tu Tech Lead IA Modular y Escalable v2.0')
  .version('2.0.0');

// 1. REVIEW
program.command('review')
  .description('Analiza cambios pendientes en Git')
  .action(async () => new ReviewCommand().execute());

// 2. COMMIT
program.command('commit')
  .description('Genera mensajes de commit semánticos')
  .action(async () => new CommitCommand().execute());

// 3. TEST
program.command('test <file>')
  .description('Genera tests unitarios para un archivo')
  .action(async (file) => new TestCommand().execute(file));

// 4. SCAFFOLD
program.command('scaffold <idea>')
  .description('Genera estructura de proyecto')
  .action(async (idea) => new ScaffoldCommand().execute(idea));

// 5. EXPLAIN
program.command('explain <file>')
  .description('Explica un archivo local')
  .action(async (file) => new ExplainCommand().execute(file));

program.parse(process.argv);