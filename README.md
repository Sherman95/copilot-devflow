# 🚀 DevFlow CLI

> **Your AI Tech Lead in the Terminal.**
> Context-aware workflow orchestrator powered by GitHub Copilot CLI.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Copilot](https://img.shields.io/badge/AI-GitHub%20Copilot-purple.svg)

## 💡 The Problem
Using GitHub Copilot in the terminal is powerful, but **context switching is expensive**.
- You have to manually copy-paste code files.
- You have to explain your project structure repeatedly.
- You have to copy `git diffs` manually to get code reviews.

## ⚡ The Solution: DevFlow
**DevFlow** is an intelligent wrapper around the `gh copilot` CLI that automates context injection. It reads your file system, git status, and project structure to craft the perfect prompt for the AI.

## ✨ Features

### 🔥 1. AI Code Review (`review`)
The killer feature. DevFlow reads your staged/unstaged changes (`git diff`) and acts as a **Senior Tech Lead**, rejecting bad code before you commit.
```bash
devflow review