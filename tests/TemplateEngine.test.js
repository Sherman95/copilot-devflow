import { describe, test, expect } from '@jest/globals';
import { renderTemplate, applyPromptTemplate } from '../src/utils/TemplateEngine.js';

describe('TemplateEngine', () => {
  test('renderTemplate replaces placeholders (case-insensitive)', () => {
    const out = renderTemplate('Hello {{name}} from {{CWD}}', { NAME: 'DevFlow', cwd: '/repo' });
    expect(out).toBe('Hello DevFlow from /repo');
  });

  test('applyPromptTemplate applies per-command template and wrapper', () => {
    const prompt = 'BASE_PROMPT';
    const out = applyPromptTemplate({
      wrapper: 'WRAP_START\n{{PROMPT}}\nWRAP_END',
      commandTemplate: 'CMD_START\n{{prompt}}\nCMD_END',
      prompt,
      vars: { COMMAND: 'review' },
    });

    expect(out).toContain('WRAP_START');
    expect(out).toContain('CMD_START');
    expect(out).toContain('BASE_PROMPT');
    expect(out).toContain('WRAP_END');
  });

  test('applyPromptTemplate appends prompt if template has no {{PROMPT}}', () => {
    const prompt = 'BASE_PROMPT';
    const out = applyPromptTemplate({
      wrapper: null,
      commandTemplate: 'HEADER_ONLY',
      prompt,
      vars: {},
    });

    expect(out).toContain('HEADER_ONLY');
    expect(out).toContain('BASE_PROMPT');
  });
});
