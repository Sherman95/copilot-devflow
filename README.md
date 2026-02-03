# DevFlow CLI

**Automated Workflow Orchestrator powered by GitHub Copilot CLI.**  
Context-aware automation for Code Review, Testing, Documentation, and Technical Debt Reduction.

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![Node](https://img.shields.io/badge/Node-%3E%3D18-success.svg)
![Version](https://img.shields.io/badge/version-2.0.0-lightgrey.svg)

---

## 1. Executive Summary

**DevFlow CLI** is an engineering tool designed to bridge the gap between local development environments and Large Language Models (LLMs) through **GitHub Copilot CLI**. Unlike a standard chat interface, DevFlow acts as an agent inside your terminal: it gathers relevant context (git diffs, file paths, project structure) and prepares prompts to accelerate complex development tasks.

DevFlow is built for high-performance engineering teams: it helps enforce code quality standards, reduces technical debt via guided refactors, and automates documentation through context-aware generation.

---

## 2. Core Capabilities

DevFlow provides a unified interface for common SDLC tasks.

### 2.1 Quality Assurance & Security

- **Automated Code Review** (`devflow review`)  
  Performs a static analysis of staged/unstaged git changes. It validates logic, identifies anti-patterns, and checks for potential security vulnerabilities before code is committed.

- **Security & Compliance Audit** (`devflow audit --format <markdown|latex>`)  
  Generates formal audit reports suitable for technical leadership.
  - **Output Formats:** Markdown (`markdown`) or LaTeX (`latex`).
  - **Content:** Executive summary, risk table, detailed findings, and remediation roadmap.

- **Automated Refactoring** (`devflow refactor <file> --goal <goal>`)  
  Rewrites “dirty” code applying SOLID and Clean Code principles while preserving business logic.

### 2.2 Development Acceleration

- **Context-Aware Code Generation** (`devflow generate "<requirement>"`)  
  Implements functional logic adapted to the detected stack (Angular/React/Vue/Node/Python) by inspecting your project.
  - Example: `devflow generate "JWT Authentication Service with refresh tokens"`

- **Unit Test Fabrication** (`devflow test <file>`)  
  Generates a comprehensive unit-test prompt for a target file, focused on edge cases, error handling, and success paths.

- **Project Scaffolding** (`devflow scaffold "<idea>"`)  
  Bootstraps project architecture from a natural language description.

- **Infrastructure as Code** (`devflow docker`)  
  Generates `Dockerfile` and `docker-compose.yml` suitable as a production baseline.

### 2.3 Documentation & Engineering Operations

- **Documentation Synthesis** (`devflow readme`)  
  Analyzes your repository structure and generates a professional README.

- **Semantic Commit Management** (`devflow commit`)  
  Enforces Conventional Commits by generating semantic commit messages from `git diff`.

- **Code Explanation** (`devflow explain <file>`)  
  Produces step-by-step explanations of complex files for onboarding and legacy understanding.

---

## 3. How It Works

DevFlow prepares a structured prompt, copies it to your clipboard, prints a backup in the terminal, and then launches GitHub Copilot CLI (`gh copilot`) so you can paste and run with full context.

---

## 4. Technical Architecture

DevFlow is organized as a modular, layered CLI.

```text
copilot-devflow/
├── bin/
│   └── devflow.js                 # CLI entry point & command registration
├── src/
│   ├── commands/                  # Command pattern implementations
│   │   ├── AuditCommand.js
│   │   ├── CommitCommand.js
│   │   ├── DockerCommand.js
│   │   ├── ExplainCommand.js
│   │   ├── GenerateCommand.js
│   │   ├── ReadmeCommand.js
│   │   ├── RefactorCommand.js
│   │   ├── ReviewCommand.js
│   │   ├── ScaffoldCommand.js
│   │   └── TestCommand.js
│   ├── services/
│   │   └── GitService.js          # Git diff/context gathering
│   └── utils/
│       └── PromptHandler.js       # Clipboard + Copilot CLI launcher
└── tests/                         # Jest tests
```

---

## 5. Installation

### Prerequisites

- Node.js (v18+)
- Git
- GitHub CLI authenticated + Copilot extension installed

```bash
gh auth login
gh extension install github/gh-copilot
```

### Setup

```bash
git clone https://github.com/ronaldazuero/copilot-devflow.git
cd copilot-devflow
npm install
npm link
```

---

## 6. Usage Reference

| Command | Arguments | Description |
| --- | --- | --- |
| `devflow review` | - | Audits pending git changes for quality/security. |
| `devflow commit` | - | Generates a semantic commit message from changes. |
| `devflow audit` | `--format <markdown\|latex>` | Generates a formal audit report. |
| `devflow test` | `<file>` | Generates a unit test prompt for a specific file. |
| `devflow generate` | `"<requirement>"` | Generates functional code adapted to your project. |
| `devflow refactor` | `<file>` `--goal "<goal>"` | Refactors code applying SOLID/Clean Code. |
| `devflow docker` | - | Generates Docker baseline configuration. |
| `devflow scaffold` | `"<idea>"` | Bootstraps project structure from a description. |
| `devflow explain` | `<file>` | Explains the logic flow of a file. |
| `devflow readme` | - | Auto-generates project documentation. |

---

## 7. Contributing

- Run tests: `npm test`
- Keep changes focused and add/adjust tests when needed.

---

## 8. License

Released under the **ISC License**.

---

## 9. Author

**Ronald Azuero** (2026)
