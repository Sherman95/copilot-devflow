# DevFlow CLI — Judge Mode (60 seconds)

This guide is optimized for a fast evaluation: reproducible repo setup, high-signal prompts, and proof of safety/UX features.

## 0) Prereqs (10 seconds)

From any terminal:

- `devflow doctor`

Expected:
- Confirms `git`, `gh`, and `github/gh-copilot` are installed and authenticated.

## 1) Create a deterministic demo repo (10 seconds)

- `devflow demo --setup`

Expected:
- Prints a temp folder path (e.g. `%TEMP%\devflow-demo-...`).
- Creates **staged** changes containing a fake GitHub token.
- Creates **unstaged** changes containing an `eval(...)` vulnerability.

## 2) Run the workflow without launching Copilot (30 seconds)

Copy/paste the directory from step 1:

```powershell
cd "C:\path\to\devflow-demo-..."

# Review both staged + unstaged changes
# - exports prompt to a file
# - skips clipboard (works in remote/CI shells)
# - dry-run prevents opening gh-copilot UI

devflow review --all --out .devflow/judge/review.txt --no-clipboard --dry-run --max-chars 6000

# Formal audit prompt
devflow audit --all --format markdown --language en --out .devflow/judge/audit.md --no-clipboard --dry-run --max-chars 8000

# Optional: PDF-ready audit (LaTeX output you can compile to PDF)
devflow audit --all --format pdf --language en --out .devflow/judge/audit.tex --no-clipboard --dry-run --max-chars 8000

# PR title + description
devflow pr --all --out .devflow/judge/pr.md --no-clipboard --dry-run --max-chars 8000

# Conventional Commit prompt from staged diff
devflow commit --out .devflow/judge/commit.txt --no-clipboard --dry-run
```

Expected:
- Prompts are printed (backup) and written to `.devflow/judge/*`.
- The fake token is redacted to `[REDACTED]`.
- Review/audit prompt should flag `eval(...)` as high severity.

## 3) (Optional) Interactive file picking (10 seconds)

```powershell
devflow review --all --pick-files --dry-run
```

Expected:
- Shows a numbered list of changed files.
- Lets you select `1,3,5-8` or `a` for all.

## Notes for evaluators

- DevFlow doesn’t modify the repo. It generates high-quality prompts + optional `gh copilot` launch.
- `--dry-run` is demo-friendly and safe.
- Secret redaction is enabled by default (opt-out via `DEVFLOW_REDACT_SECRETS=false`).
