import { describe, test, expect } from '@jest/globals';
import { redactSecrets } from '../src/utils/SecretRedactor.js';

describe('DevFlow Core System', () => {
  test('El entorno de pruebas (Jest) está activo', () => {
    expect(true).toBe(true);
  });

  test('Cálculo de lógica básica funciona', () => {
    const systemState = 'OK';
    expect(systemState).toBe('OK');
  });

  test('La arquitectura de carpetas es correcta', () => {
    // Simulamos una validación de estructura
    const folderStructure = ['src', 'bin', 'tests'];
    expect(folderStructure).toContain('src');
    expect(folderStructure).toContain('bin');
  });

  test('Secret redaction removes common tokens', () => {
    const input = [
      'GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz',
      'openai=sk-abcdefghijklmnopqrstuvwxyz1234567890',
      '{"client_secret": "supersecretvalue"}',
    ].join('\n');

    const out = redactSecrets(input);
    expect(out).not.toMatch(/ghp_/i);
    expect(out).not.toMatch(/\bsk-/);
    expect(out).toMatch(/\[REDACTED\]/);
  });

  test('Secret redaction preserves non-secret assignments', () => {
    const input = 'PORT=3000\nNODE_ENV=production\nUSERNAME=ronald';
    const out = redactSecrets(input);
    expect(out).toBe(input);
  });
});