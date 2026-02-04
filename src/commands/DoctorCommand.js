import chalk from 'chalk';
import { execa } from 'execa';

function ok(message) {
  console.log(chalk.green(`✔ ${message}`));
}

function warn(message) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

function fail(message) {
  console.log(chalk.red(`✖ ${message}`));
}

async function commandExists(command, args = ['--version']) {
  try {
    await execa(command, args);
    return true;
  } catch {
    return false;
  }
}

export class DoctorCommand {
  async execute() {
    console.log(chalk.cyan('🩺 DevFlow Doctor: checking prerequisites...'));

    let hasErrors = false;

    const isWindows = process.platform === 'win32';

    // Node version
    const major = Number(process.versions.node.split('.')[0]);
    if (Number.isFinite(major) && major >= 18) {
      ok(`Node.js ${process.versions.node} (OK)`);
    } else {
      fail(`Node.js ${process.versions.node} detected. Required: >= 18`);
      hasErrors = true;
    }

    // Git
    if (await commandExists('git')) {
      ok('git is installed');
      try {
        await execa('git', ['rev-parse', '--is-inside-work-tree']);
        ok('git repository detected');
      } catch {
        warn('not inside a git repository (diff-based commands may have limited context)');
      }
    } else {
      fail('git is not installed');
      hasErrors = true;
    }

    // PowerShell 7 (pwsh) - recommended on Windows for Copilot CLI tool execution
    if (isWindows) {
      if (await commandExists('pwsh')) {
        ok('PowerShell 7 (pwsh) is installed');
      } else {
        warn(
          'PowerShell 7 (pwsh) not found. Some GitHub Copilot CLI tool actions may fail on Windows. ' +
            'Install: https://aka.ms/powershell (or run DevFlow with --dry-run to avoid launching Copilot).',
        );
      }
    }

    // GitHub CLI
    if (await commandExists('gh')) {
      ok('GitHub CLI (gh) is installed');

      // Auth status
      try {
        await execa('gh', ['auth', 'status']);
        ok('gh is authenticated');
      } catch {
        warn('gh is not authenticated. Run: gh auth login');
      }

      // Copilot extension
      try {
        const { stdout } = await execa('gh', ['extension', 'list']);
        const hasCopilot = /github\/gh-copilot/i.test(stdout) || /gh-copilot/i.test(stdout);

        if (hasCopilot) {
          ok('gh-copilot extension is installed');
        } else {
          fail('gh-copilot extension not found. Run: gh extension install github/gh-copilot');
          hasErrors = true;
        }
      } catch {
        warn('unable to list gh extensions. Try: gh extension list');
      }
    } else {
      fail('GitHub CLI (gh) is not installed. Install: https://cli.github.com/');
      hasErrors = true;
    }

    console.log('');
    console.log(chalk.white('Quick setup (if needed):'));
    console.log(chalk.dim('  1) gh auth login'));
    console.log(chalk.dim('  2) gh extension install github/gh-copilot'));
    if (isWindows) {
      console.log(chalk.dim('  3) (Recommended) Install PowerShell 7: https://aka.ms/powershell'));
      console.log(chalk.dim('  4) devflow review'));
    } else {
      console.log(chalk.dim('  3) devflow review'));
    }

    if (hasErrors) process.exitCode = 1;
  }
}
