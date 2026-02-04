const DEFAULT_REPLACEMENT = '[REDACTED]';

function replaceAll(text, patterns, replacement = DEFAULT_REPLACEMENT) {
  let result = text;
  for (const pattern of patterns) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Best-effort secret redaction for prompts.
 * Goal: reduce accidental credential leakage without destroying code context.
 */
export function redactSecrets(input, options = {}) {
  const enabled = options.enabled ?? (process.env.DEVFLOW_REDACT_SECRETS !== 'false');
  if (!enabled) return input;

  if (typeof input !== 'string' || input.length === 0) return input;

  const replacement = options.replacement ?? DEFAULT_REPLACEMENT;

  let text = input;

  // 1) Private keys blocks
  text = text.replace(
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g,
    `-----BEGIN PRIVATE KEY-----\n${replacement}\n-----END PRIVATE KEY-----`
  );

  // 2) Common token formats
  text = replaceAll(text, [
    /\bghp_[A-Za-z0-9_]{20,}\b/g, // GitHub classic PAT
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, // GitHub fine-grained PAT
    /\bgho_[A-Za-z0-9_]{20,}\b/g, // GitHub OAuth
    /\bghs_[A-Za-z0-9_]{20,}\b/g, // GitHub server-to-server
    /\bghu_[A-Za-z0-9_]{20,}\b/g, // GitHub user-to-server
    /\bsk-[A-Za-z0-9]{20,}\b/g, // OpenAI-like keys
  ], replacement);

  // 3) AWS access key id
  text = text.replace(/\b(A3T[A-Z0-9]|AKIA|ASIA)[A-Z0-9]{16}\b/g, replacement);

  // 4) Generic KEY=VALUE patterns (narrowed: only when key name suggests secret)
  text = text.replace(
    /(^|\n)\s*([A-Za-z_][A-Za-z0-9_]{0,60})\s*=\s*(['"]?)([^\n'"]{6,})\3\s*(?=\n|$)/g,
    (match, prefix, key, quote, value) => {
      const lower = String(key).toLowerCase();
      const secretLike = [
        'token', 'secret', 'apikey', 'api_key', 'api-key', 'password', 'passwd', 'pwd',
        'private', 'client_secret', 'access_key', 'secret_key', 'session', 'cookie'
      ].some((needle) => lower.includes(needle));

      if (!secretLike) return match;
      return `${prefix}${key}=${quote}${replacement}${quote}`;
    }
  );

  // 5) JSON-ish "key": "value" patterns (again only secret-like keys)
  text = text.replace(
    /(\"[A-Za-z_][A-Za-z0-9_]{0,60}\"\s*:\s*)(\"[^\"\n]{6,}\")/g,
    (match, left, right) => {
      const rawKey = left.match(/\"([^\"]+)\"/)?.[1] ?? '';
      const lower = rawKey.toLowerCase();
      const secretLike = [
        'token', 'secret', 'apikey', 'api_key', 'password', 'client_secret',
        'access_key', 'secret_key'
      ].some((needle) => lower.includes(needle));

      if (!secretLike) return match;
      return `${left}\"${replacement}\"`;
    }
  );

  return text;
}
