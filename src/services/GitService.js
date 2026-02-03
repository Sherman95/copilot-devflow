import { execa } from 'execa';

export class GitService {
  static async getDiff(cached = false) {
    const args = ['diff'];
    if (cached) args.push('--cached');
    // Eliminamos HEAD para evitar conflictos si el repo es nuevo
    // si cached es false, git diff por defecto mira el working tree
    
    try {
      const { stdout } = await execa('git', args);
      return stdout;
    } catch (error) {
      return null; // Retornamos null tranquilo, sin explotar
    }
  }
}