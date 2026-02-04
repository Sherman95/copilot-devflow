# DevFlow CLI — Copilot CLI Challenge Submission (Template)

> Copy this into a DEV post and edit the bracketed parts.

## GitHub Copilot CLI Challenge Submission

This is a submission for the **GitHub Copilot CLI Challenge**.

- Repo: https://github.com/Sherman95/copilot-devflow
- Tech: Node.js (ESM), Commander, Execa, GitHub Copilot CLI (`gh extension install github/gh-copilot`)

## What I Built

I built **DevFlow CLI**, a terminal-first workflow tool that turns GitHub Copilot CLI into **repeatable SDLC commands**.

Instead of starting from a blank prompt every time, DevFlow:
- collects repository context (git diffs + changed files),
- generates structured, high-signal prompts, and
- optionally launches `gh copilot`.

### Why it matters

Modern AI tools are powerful, but developers still lose time to:
- inconsistent prompts,
- missing context (diffs, filenames, scope),
- accidental secret leaks,
- copy/paste friction (clipboard fails in remote shells).

DevFlow is designed to be **fast, safe, and demo-friendly**.

## Demo (60 seconds)

**No narration needed** — just terminal recording.

```bash
# 1) Verify prerequisites
devflow doctor

# 2) Create a deterministic demo repo (staged + unstaged changes)
devflow demo --setup

# 3) cd into the printed directory, then run:
devflow review --all --out .devflow/judge/review.txt --no-clipboard --dry-run --max-chars 6000
devflow audit  --all --format markdown --language en --out .devflow/judge/audit.md --no-clipboard --dry-run --max-chars 8000
devflow pr     --all --out .devflow/judge/pr.md --no-clipboard --dry-run --max-chars 8000
devflow commit --out .devflow/judge/commit.txt --no-clipboard --dry-run
```

What you should notice:
- A fake token is automatically redacted to `[REDACTED]` in prompts.
- The review/audit flags an `eval(...)` injection risk.
- Prompts are exported to `.devflow/judge/*`.

## Key Features

- **`devflow review`**: senior-level review prompt for staged/unstaged changes
- **`devflow audit`**: formal security + code-quality audit prompt (Markdown/LaTeX)
- **`devflow pr`**: PR title options + PR description body (Markdown)
- **Config + templates**: defaults and prompt wrappers via `devflow.config.json`
- **Export + no clipboard**: `--out`, `--no-clipboard` for CI/remote shells
- **Secret redaction**: reduces accidental credential leakage in prompts
- **Judge mode**: `devflow demo --setup` + `--dry-run`

## My Experience with GitHub Copilot CLI

Copilot CLI was essential for this project because it:
- makes the workflow **terminal-native** (`gh copilot`) instead of IDE-locked,
- benefits from having the **full diff context** in one place,
- enables consistent structured outputs (review/audit/PR formats).

During development, Copilot CLI helped me iterate on:
- prompt structure and strict output formats,
- cross-platform behavior (Windows-friendly commands),
- safety improvements like secret redaction and dry-run.

## How It Works (High level)

1) Collect context: `git diff` (staged/unstaged) + file filters
2) Build prompt: role + task + constraints + structured output spec
3) Safety pass: secret redaction
4) Deliver: clipboard + backup print + optional `--out`
5) Execute (optional): launch `gh copilot` unless `--dry-run`

## Notes

Not affiliated with other projects named "DevFlow".
