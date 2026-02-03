# 🚀 DevFlow CLI

> **Your AI Tech Lead in the Terminal.**  
> Context-aware workflow orchestrator powered by GitHub Copilot CLI.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Copilot](https://img.shields.io/badge/AI-GitHub%20Copilot-purple.svg)
![Version](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)

---

## 🚀 Introduction

**DevFlow CLI** is an intelligent wrapper around GitHub Copilot CLI that eliminates the friction of context switching during development. Instead of manually copying code, explaining project structure, or pasting git diffs, DevFlow automatically injects relevant context into AI prompts—acting as your personal **AI Tech Lead** right in the terminal.

Built for developers who want AI assistance without the overhead, DevFlow automates repetitive tasks like code reviews, commit message generation, test creation, and documentation writing.

---

## 🛠 Installation & Usage

### **Prerequisites**
- **Node.js** ≥ 18
- **GitHub Copilot CLI** installed and authenticated:
  ```bash
  gh auth login
  gh extension install github/gh-copilot
  ```

### **Installation**
```bash
# Clone the repository
git clone https://github.com/ronaldazuero/copilot-devflow.git
cd copilot-devflow

# Install dependencies
npm install

# Link globally (optional)
npm link
```

### **Quick Start**
```bash
# Review your uncommitted changes with AI
devflow review

# Generate a semantic commit message
devflow commit

# Create unit tests for a file
devflow test src/utils/validator.js

# Explain complex code
devflow explain src/services/AuthService.js

# Generate project scaffolding
devflow scaffold "REST API with Express and MongoDB"

# Create a professional audit report
devflow audit --format markdown

# Auto-generate README.md
devflow readme
```

---

## ✨ Key Features

### 🔍 **1. AI Code Review** (`review`)
Automatically analyzes your staged/unstaged Git changes and provides senior-level code review feedback. No more manual copy-pasting of diffs.

```bash
devflow review
```
- Detects bugs, anti-patterns, and security issues
- Suggests improvements before you commit
- Context-aware analysis based on your codebase

---

### 📝 **2. Smart Commit Messages** (`commit`)
Generates semantic commit messages following best practices (Conventional Commits format).

```bash
devflow commit
```
- Analyzes `git diff` automatically
- Creates meaningful, structured commit messages
- Saves time on writing descriptive commits

---

### 🧪 **3. Test Generation** (`test`)
Creates unit tests for any file using AI, understanding your testing framework and patterns.

```bash
devflow test src/utils/helper.js
```
- Detects your test framework (Jest, Mocha, etc.)
- Generates comprehensive test cases
- Follows your project's testing conventions

---

### 📦 **4. Project Scaffolding** (`scaffold`)
Bootstraps entire project structures from natural language descriptions.

```bash
devflow scaffold "React app with TypeScript and Tailwind"
```
- Creates folder structure, configs, and boilerplate
- Tailored to your tech stack preferences
- Jump-start new projects in seconds

---

### 💡 **5. Code Explanation** (`explain`)
Get detailed explanations of complex code files in plain English.

```bash
devflow explain src/algorithms/dijkstra.js
```
- Breaks down logic step-by-step
- Perfect for onboarding or reviewing legacy code
- Saves hours of documentation reading

---

### 🔐 **6. Security Audit** (`audit`)
Generates professional security/code quality audit reports in Markdown or LaTeX.

```bash
devflow audit --format markdown
```
- Scans for vulnerabilities and code smells
- Produces shareable reports for teams
- Supports multiple output formats

---

### 📄 **7. README Generation** (`readme`)
Automatically creates beautiful, professional README files by analyzing your project.

```bash
devflow readme
```
- Detects features, architecture, and dependencies
- Generates badges, installation steps, and usage examples
- Keeps documentation up-to-date effortlessly

---

## 🏗 Architecture

DevFlow follows a clean, modular architecture:

```
copilot-devflow/
├── bin/
│   └── devflow.js          # CLI entry point
├── src/
│   ├── commands/           # Command implementations
│   │   ├── AuditCommand.js
│   │   ├── CommitCommand.js
│   │   ├── ExplainCommand.js
│   │   ├── ReadmeCommand.js
│   │   ├── ReviewCommand.js
│   │   ├── ScaffoldCommand.js
│   │   └── TestCommand.js
│   ├── services/           # Business logic (AI integration, Git operations)
│   └── utils/              # Shared utilities
├── tests/                  # Unit tests
└── examples/               # Example files for testing
```

### **Design Principles**
- **Single Responsibility**: Each command handles one specific workflow
- **Composability**: Services are reusable across commands
- **Extensibility**: Easy to add new commands without modifying core logic

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, or documentation improvements, feel free to open a PR.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit using semantic messages: `git commit -m "feat: add amazing feature"`
6. Push and open a Pull Request

### **Reporting Issues**
Found a bug? Have a feature request? [Open an issue](https://github.com/ronaldazuero/copilot-devflow/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior

---

## 📜 License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ by [Ronald Azuero](https://github.com/ronaldazuero)  
Powered by [GitHub Copilot CLI](https://githubnext.com/projects/copilot-cli)

---

**⭐ If DevFlow saves you time, give it a star!**
