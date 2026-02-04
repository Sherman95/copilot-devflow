function normalizeKey(key) {
  return String(key).trim();
}

/**
 * Extremely small template engine.
 * Replaces {{KEY}} with values from vars (case-insensitive).
 */
export function renderTemplate(template, vars = {}) {
  if (typeof template !== 'string' || template.length === 0) return '';

  const map = new Map();
  for (const [k, v] of Object.entries(vars)) {
    map.set(normalizeKey(k).toUpperCase(), String(v));
  }

  return template.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (match, key) => {
    const value = map.get(String(key).toUpperCase());
    return value === undefined ? match : value;
  });
}

export function applyPromptTemplate({ wrapper, commandTemplate, prompt, vars }) {
  let out = prompt;

  if (typeof commandTemplate === 'string' && commandTemplate.trim()) {
    const rendered = renderTemplate(commandTemplate, { ...vars, PROMPT: prompt });
    out = rendered.includes(prompt) || /\{\{\s*PROMPT\s*\}\}/i.test(commandTemplate)
      ? rendered
      : `${rendered}\n\n${prompt}`;
  }

  if (typeof wrapper === 'string' && wrapper.trim()) {
    const renderedWrapper = renderTemplate(wrapper, { ...vars, PROMPT: out });
    out = renderedWrapper.includes(out) || /\{\{\s*PROMPT\s*\}\}/i.test(wrapper)
      ? renderedWrapper
      : `${renderedWrapper}\n\n${out}`;
  }

  return out;
}
