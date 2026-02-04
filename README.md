# DevFlow CLI

AI workflow orchestrator powered by GitHub Copilot CLI.

DevFlow is a terminal-first developer tool that:
- gathers local repository context (git diffs, file paths, project structure),
- builds structured prompts for common SDLC tasks, and
- optionally launches `gh copilot` so you can execute the workflow with full context.

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![Node](https://img.shields.io/badge/Node-%3E%3D18-success.svg)
![Version](https://img.shields.io/badge/version-2.0.0-lightgrey.svg)
[![CI](https://github.com/Sherman95/copilot-devflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Sherman95/copilot-devflow/actions/workflows/ci.yml)

---

## Overview

Unlike a chat interface, DevFlow operates inside your terminal and focuses on repeatable workflows: review, audit, tests, docs, refactors, scaffolding, and code generation. DevFlow does not silently modify your repository; it prepares high-quality prompts and keeps the developer in control.

---

## Key Features

### Quality and security

- `devflow review` performs a senior-level code review prompt for staged/unstaged diffs.
- `devflow audit` generates a formal security + code-quality audit prompt in Markdown or LaTeX.
- Prompts are protected by default with automatic secret redaction.

### Engineering productivity

- `devflow commit` generates Conventional Commit messages from staged changes.
- `devflow test <file>` creates unit test prompts for a target file.
- `devflow explain <file>` produces onboarding-friendly explanations.
- `devflow generate "<requirement>"` creates context-aware code prompts tailored to your stack.
- `devflow refactor <file>` prepares a refactor prompt with a specific goal.
- `devflow docker` produces a baseline production Docker configuration prompt.
- `devflow scaffold "<idea>"` outputs shell commands (platform-aware) to scaffold a project.

---

## How It Works

1. DevFlow collects context (for example, `git diff` and file metadata).
2. DevFlow constructs a structured prompt (role, task, output format, constraints).
3. DevFlow copies the prompt to your clipboard and prints a backup.
4. DevFlow launches `gh copilot` unless you use `--dry-run`.

---

## Installation

### Prerequisites

- Node.js 18+
- Git
- GitHub CLI (`gh`) with the Copilot extension installed and authenticated

```bash
gh auth login
gh extension install github/gh-copilot
```

### Setup

```bash
git clone https://github.com/Sherman95/copilot-devflow.git
cd copilot-devflow
npm install
npm link
```

---

## Quick Start

```bash
devflow doctor

# Review both staged and unstaged changes (do not launch Copilot)
devflow review --all --dry-run

# Generate an audit prompt in Markdown
devflow audit --all --format markdown --language en --dry-run

# Generate a Conventional Commit message prompt (staged diff)
devflow commit --dry-run

# Export the prompt to a file (and skip clipboard)
devflow review --all --out .devflow/prompts/review.txt --no-clipboard --dry-run
```

---

## Judge Mode (60 seconds)

Fast, deterministic evaluation flow:

```bash
devflow doctor
devflow demo --setup
```

Then `cd` into the printed demo directory and run:

```bash
devflow review --all --out .devflow/judge/review.txt --no-clipboard --dry-run --max-chars 6000
devflow audit  --all --format markdown --language en --out .devflow/judge/audit.md --no-clipboard --dry-run --max-chars 8000
devflow commit --out .devflow/judge/commit.txt --no-clipboard --dry-run
```

What you should notice:
- The demo repo contains both staged + unstaged changes.
- A fake token is automatically redacted to `[REDACTED]` in prompts.
- The review/audit should flag `eval(...)` as a high-severity issue.

Full judge guide: see [docs/JUDGE.md](docs/JUDGE.md)

---

## Command Reference

### `devflow doctor`

Checks prerequisites (Node, git, `gh`, auth status, and Copilot extension) and prints quick setup guidance.

```bash
devflow doctor
```

### `devflow demo`

Judge-mode helper that prints a 60-second script. With `--setup`, it creates a temporary demo repository containing both staged and unstaged changes.

```bash
devflow demo --setup
```

### `devflow review`

Options:
- `--pick-files` interactively select files to include
- `--staged` review staged changes only
- `--unstaged` review unstaged changes only
- `--all` review both (default)
- `--files <a.js,b.js>` filter by file paths
- `--unified <n>` diff context lines
- `--max-chars <n>` max prompt size
- `--out <file>` write the generated prompt to a file
- `--no-clipboard` do not copy the prompt to clipboard
- `--config <path>` path to a JSON config file
- `--dry-run` do not launch `gh copilot`

Example:

```bash
devflow review --all --files src/app.js,src/auth.js --unified 5 --max-chars 6000 --dry-run
```

### `devflow audit`

Options:
- `--format <markdown|latex>` output format
- `--language <en|es>` report language
- `--pick-files` interactively select files to include
- `--staged|--unstaged|--all`, `--files`, `--unified`, `--max-chars`, `--dry-run`
- `--out <file>`, `--no-clipboard`, `--config <path>`

Example:

```bash
devflow audit --all --format markdown --language en --max-chars 8000 --dry-run
```

### `devflow commit`

Generates a Conventional Commit message prompt from the staged diff.

```bash
git add -A
devflow commit --dry-run
```

### `devflow test <file>`

```bash
devflow test src/utils/PromptHandler.js --dry-run
```

### `devflow explain <file>`

```bash
devflow explain src/services/GitService.js --dry-run
```

### `devflow readme`

```bash
devflow readme --dry-run
```

### `devflow generate "<requirement>"`

```bash
devflow generate "JWT Authentication Service with refresh tokens" --dry-run
```

### `devflow refactor <file>`

```bash
devflow refactor src/commands/ReviewCommand.js --goal "Extract helper functions" --dry-run
```

### `devflow docker`

```bash
devflow docker --dry-run
```

### `devflow scaffold "<idea>"`

```bash
devflow scaffold "REST API with Express and MongoDB" --dry-run
```

---

## Safety: Secret Redaction

DevFlow applies best-effort secret redaction before copying/printing prompts.

- Default: enabled
- Disable: set `DEVFLOW_REDACT_SECRETS=false`

---

## Dry Run Mode

Use `--dry-run` to prevent launching `gh copilot` (the prompt is still copied/printed). You can also set `DEVFLOW_DRY_RUN=true`.

---

## Configuration

DevFlow can load defaults and templates from a JSON config file.

Search order (from current directory up to repo root):
- `devflow.config.json`
- `.devflowrc.json`
- `.devflowrc`

You can also point directly to a file:
- CLI: `--config path/to/devflow.config.json`
- Env: `DEVFLOW_CONFIG=path/to/devflow.config.json`

Example config: `examples/devflow.config.json`

### Defaults

Supported keys under `defaults`:
- `unified` (diff context lines)
- `maxChars` (prompt cap)
- `language` (`en` | `es`) (used by `audit`)
- `reviewScope` (`all` | `staged` | `unstaged`)
- `auditScope` (`all` | `staged` | `unstaged`)

### Templates

You can wrap or override prompts with templates:
- `templates.wrapper`: applied to every command
- `templates.<command>`: applied to a specific command (e.g. `review`, `audit`)

Placeholders:
- `{{PROMPT}}` (the generated prompt)
- `{{COMMAND}}`, `{{CWD}}`, `{{TIMESTAMP}}`

---

## Prompt Export

- `--out <file>` writes the final prompt (after templates + redaction) to disk
- `--no-clipboard` skips clipboard copy (useful for CI or remote shells)

---

## Technical Architecture

```text
copilot-devflow/
├── .github/workflows/ci.yml       # CI (npm test)
├── bin/
│   └── devflow.js                 # CLI entry point & command registration
├── src/
│   ├── commands/                  # Command pattern implementations
│   │   ├── AuditCommand.js
│   │   ├── CommitCommand.js
│   │   ├── DemoCommand.js
│   │   ├── DoctorCommand.js
│   │   ├── DockerCommand.js
│   │   ├── ExplainCommand.js
│   │   ├── GenerateCommand.js
│   │   ├── ReadmeCommand.js
│   │   ├── RefactorCommand.js
│   │   ├── ReviewCommand.js
│   │   ├── ScaffoldCommand.js
│   │   └── TestCommand.js
│   ├── services/
│   │   ├── ConfigService.js       # loads config defaults + templates
│   │   └── GitService.js          # git diff + context helpers
│   └── utils/
│       ├── FilePicker.js          # optional interactive file picker
│       ├── PromptHandler.js       # clipboard/export + optional Copilot launcher
│       ├── SecretRedactor.js      # best-effort secret redaction
│       └── TemplateEngine.js      # tiny {{VARS}} templating support
└── tests/                         # Jest tests
```

---

## Contributing

```bash
npm test
```

Please keep changes focused and add/adjust tests when applicable.

---

## License

ISC.

---

## Author

Ronald Azuero
