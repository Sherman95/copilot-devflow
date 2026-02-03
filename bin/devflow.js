#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import clipboardy from 'clipboardy';
import { execa } from 'execa';
import ora from 'ora';

const program = new Command();

program
  .name('devflow')
  .description('Tu compañero de IA para el ciclo completo de desarrollo')
  .version('1.0.0');

// --- FUNCIÓN DE AYUDA: Copiar y Mostrar ---
// Esto asegura que si el portapapeles falla, el usuario aún pueda usar la herramienta
async function copyAndNotify(text, type = 'Prompt') {
  try {
    await clipboardy.write(text);
    console.log(chalk.green(`✔ ${type} copiado al portapapeles automáticamente.`));
  } catch (err) {
    console.log(chalk.red('⚠ No se pudo copiar al portapapeles (hazlo manual).'));
  }
  
  // Siempre mostramos el prompt en gris por si acaso
  console.log(chalk.dim('---------------------------------------------------'));
  console.log(chalk.cyan(text)); 
  console.log(chalk.dim('---------------------------------------------------'));
  console.log(chalk.yellow('👉 Presiona CTRL+V en la siguiente pantalla y dale Enter.\n'));
}

// --- COMANDO 1: EXPLAIN (Explicar Archivo) ---
program
  .command('explain <file>')
  .description('Explica código y sugiere optimizaciones (Rol: Senior Engineer)')
  .action(async (filePath) => {
    const spinner = ora('Leyendo archivo...').start();
    
    // 1. Validación robusta
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      spinner.fail(chalk.red(`Error: No encuentro el archivo "${filePath}"`));
      return;
    }

    // 2. Preparar contexto
    const relativePath = path.relative(process.cwd(), fullPath);
    const spinnerMsg = `Analizando ${relativePath}...`;
    spinner.succeed(chalk.blue.bold(spinnerMsg));

    // 3. Prompt de Ingeniería (Mejorado)
    const prompt = `
@${relativePath} 
Act as a Senior Software Engineer.
1. Summarize the logic of this file.
2. CRITICAL: Identify bugs, security risks, or hardcoded credentials.
3. Suggest a cleaner or more modern way to write the most complex function.
    `.trim();

    // 4. Ejecutar
    await copyAndNotify(prompt, 'Análisis');
    await execa('gh', ['copilot'], { stdio: 'inherit' });
  });

// --- COMANDO 2: REVIEW (Code Review de Git) ---
// ¡ESTE ES EL COMANDO GANADOR! 
// Analiza lo que estás a punto de subir a GitHub.
program
  .command('review')
  .description('Analiza tus cambios pendientes (git diff) antes de hacer commit')
  .action(async () => {
    const spinner = ora('Buscando cambios en git...').start();

    try {
      // Obtenemos los cambios no guardados (staged y unstaged)
      const { stdout } = await execa('git', ['diff', 'HEAD']);
      
      if (!stdout) {
        spinner.warn(chalk.yellow('No hay cambios detectados en git para revisar.'));
        return;
      }

      spinner.succeed(chalk.blue('Cambios detectados. Generando Code Review...'));

      // Prompt especial para Diffs
      // Nota: No pegamos todo el diff si es gigante, pero le decimos a Copilot que use su contexto de git si puede,
      // o pegamos el diff si es razonable. Para asegurar, usamos el texto.
      const prompt = `
I have the following git changes. Act as a Tech Lead performing a Code Review.
Focus on: Logic errors, missing validations, and code style.

CHANGES:
${stdout.substring(0, 2000)} 
${stdout.length > 2000 ? '...(truncated)' : ''}
      `.trim();

      await copyAndNotify(prompt, 'Code Review');
      await execa('gh', ['copilot'], { stdio: 'inherit' });

    } catch (error) {
      spinner.fail('Error leyendo git. ¿Es esto un repositorio git?');
    }
  });

// --- COMANDO 3: SCAFFOLD (Generador) ---
program
  .command('scaffold <idea>')
  .description('Genera estructura de proyecto mediante comandos de Shell')
  .action(async (idea) => {
    console.log(chalk.magenta(`🏗️  Arquitecto IA: Diseñando "${idea}"...`));
    
    const prompt = `Generate shell commands (bash) to create the folder structure and empty files for: ${idea}. Use mkdir -p and touch. Just show the commands.`;

    await copyAndNotify(prompt, 'Plan de arquitectura');
    await execa('gh', ['copilot'], { stdio: 'inherit' });
  });

// --- COMANDO 4: DOCTOR (Fixer) ---
// Para cuando tienes un error en la terminal y no sabes qué es
program
  .command('doctor <error_msg>')
  .description('Te ayuda a solucionar un mensaje de error específico')
  .action(async (errorMsg) => {
    console.log(chalk.red(`🚑 Llamando al doctor para: "${errorMsg}"...`));
    
    const prompt = `I am getting this error in my terminal: "${errorMsg}". Explain why it happens and give me the command to fix it.`;
    
    await copyAndNotify(prompt, 'Diagnóstico');
    await execa('gh', ['copilot'], { stdio: 'inherit' });
  });

program.parse(process.argv);