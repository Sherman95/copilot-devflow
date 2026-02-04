import fs from 'node:fs';
import path from 'node:path';

function safeJsonParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base)) return override;
  if (!isPlainObject(override)) return base;

  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function findConfigFile(startDir) {
  const candidates = [
    process.env.DEVFLOW_CONFIG,
    'devflow.config.json',
    '.devflowrc.json',
    '.devflowrc',
  ].filter(Boolean);

  let current = startDir;
  while (true) {
    for (const name of candidates) {
      const filePath = path.isAbsolute(name) ? name : path.join(current, name);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return filePath;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export class ConfigService {
  static #cache = null;

  static getDefaultConfig() {
    return {
      defaults: {
        unified: 3,
        maxChars: 6000,
        language: 'en',
        reviewScope: 'all',
        auditScope: 'staged',
      },
      output: {
        out: null,
        noClipboard: false,
      },
      templates: {
        // wrapper is applied to every prompt if present
        wrapper: null,
        // per-command templates (optional)
        // review: '...{{PROMPT}}...'
      },
    };
  }

  static load({ cwd = process.cwd(), force = false } = {}) {
    if (this.#cache && !force) return this.#cache;

    const base = this.getDefaultConfig();
    const configPath = findConfigFile(cwd);

    let userConfig = {};
    if (configPath) {
      const raw = fs.readFileSync(configPath, 'utf8');
      userConfig = safeJsonParse(raw, {});
      userConfig.__configPath = configPath;
    }

    const merged = deepMerge(base, userConfig);

    // Env overrides
    if (process.env.DEVFLOW_REDACT_SECRETS === 'false') {
      merged.defaults.redactSecrets = false;
    }

    this.#cache = merged;
    return merged;
  }
}
