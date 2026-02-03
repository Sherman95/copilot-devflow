import { execa } from 'execa';

export class GitService {
  static async getDiff(cached = false) {
    const args = ['diff'];
    if (cached) args.push('--cached');
    // Agregamos HEAD para ver unstaged changes de forma segura
    if (!cached) args.push('HEAD');

    try {
      const { stdout } = await execa('git', args);
      return stdout;
    } catch (error) {
      return null;
    }
  }
}