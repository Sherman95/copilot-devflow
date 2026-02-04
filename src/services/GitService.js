import { execa } from 'execa';

export class GitService {
  static async getDiff(arg = false) {
    const options = typeof arg === 'boolean' ? { cached: arg } : (arg ?? {});
    const cached = Boolean(options.cached);
    const unified = Number.isFinite(Number(options.unified)) ? Number(options.unified) : undefined;
    const paths = Array.isArray(options.paths) ? options.paths.filter(Boolean) : [];

    const args = ['diff'];
    if (cached) args.push('--cached');
    if (unified !== undefined) args.push(`--unified=${unified}`);
    if (paths.length > 0) args.push('--', ...paths);

    try {
      const { stdout } = await execa('git', args);
      return stdout;
    } catch {
      return null;
    }
  }

  static async getCombinedDiff(options = {}) {
    const staged = options.staged ?? true;
    const unstaged = options.unstaged ?? true;
    const unified = options.unified;
    const paths = options.paths;

    const parts = [];

    if (staged) {
      const diff = await this.getDiff({ cached: true, unified, paths });
      if (diff && diff.trim()) parts.push('### STAGED (git diff --cached)\n' + diff);
    }

    if (unstaged) {
      const diff = await this.getDiff({ cached: false, unified, paths });
      if (diff && diff.trim()) parts.push('### UNSTAGED (git diff)\n' + diff);
    }

    if (parts.length === 0) return null;
    return parts.join('\n\n');
  }
}