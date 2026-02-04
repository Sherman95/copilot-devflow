import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { execa } from 'execa';

async function fileExists(filePath) {
  try {
    await fsp.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function tryRunEngine(engine, args, options) {
  try {
    await execa(engine, args, options);
    return { ok: true, engine };
  } catch (err) {
    if (err?.code === 'ENOENT') return { ok: false, notFound: true, engine };
    return { ok: false, error: err, engine };
  }
}

export class PdfCommand {
  async execute(texPath, options = {}) {
    const fullTexPath = path.resolve(process.cwd(), texPath);

    if (!fs.existsSync(fullTexPath)) {
      console.log(chalk.red(`❌ File not found: ${texPath}`));
      return;
    }

    if (!fullTexPath.toLowerCase().endsWith('.tex')) {
      console.log(chalk.yellow('⚠ Input does not end with .tex (continuing anyway).'));
    }

    const cwd = path.dirname(fullTexPath);
    const baseName = path.basename(fullTexPath, path.extname(fullTexPath));
    const desiredOut = options.out ? path.resolve(process.cwd(), options.out) : null;

    const enginePref = String(options.engine || '').toLowerCase();
    const engines = enginePref
      ? [enginePref]
      : ['pdflatex', 'xelatex'];

    console.log(chalk.cyan(`📄 Compiling LaTeX to PDF (${engines.join(' → ')})...`));

    // Compile into the tex file folder to keep auxiliary files local.
    // Use -halt-on-error to fail fast and keep output understandable.
    const commonArgs = [
      '-interaction=nonstopmode',
      '-halt-on-error',
      fullTexPath,
    ];

    let lastError = null;
    let usedEngine = null;

    for (const engine of engines) {
      const res = await tryRunEngine(engine, commonArgs, { cwd, stdio: 'inherit' });
      if (res.ok) {
        usedEngine = res.engine;
        lastError = null;
        break;
      }
      if (res.notFound) {
        lastError = { notFound: true, engine: res.engine };
        continue;
      }
      lastError = res.error;
      break;
    }

    if (!usedEngine) {
      if (lastError?.notFound) {
        console.log(chalk.red('✖ No LaTeX engine found (pdflatex/xelatex).'));
        console.log(chalk.dim('Install one of these and try again:'));
        console.log(chalk.dim('- MiKTeX (Windows): https://miktex.org/download'));
        console.log(chalk.dim('- TeX Live: https://tug.org/texlive/'));
      } else {
        console.log(chalk.red('✖ LaTeX compilation failed.'));
      }
      process.exitCode = 1;
      return;
    }

    const producedPdf = path.join(cwd, `${baseName}.pdf`);
    if (!(await fileExists(producedPdf))) {
      console.log(chalk.red('✖ PDF output not found after compilation.'));
      process.exitCode = 1;
      return;
    }

    if (desiredOut && path.resolve(producedPdf) !== path.resolve(desiredOut)) {
      await fsp.mkdir(path.dirname(desiredOut), { recursive: true });
      await fsp.copyFile(producedPdf, desiredOut);
      console.log(chalk.green(`✔ PDF written to: ${desiredOut}`));
    } else {
      console.log(chalk.green(`✔ PDF generated: ${producedPdf}`));
    }

    console.log(chalk.dim(`(engine: ${usedEngine})`));
  }
}
