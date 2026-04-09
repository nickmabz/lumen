<div align="center">

# ◉ Lumen

### *Light in the dark*

**An AI-powered coding assistant built for web developers and agencies**

![Status](https://img.shields.io/badge/status-actively%20in%20development-ffbe3d?style=flat-square&labelColor=111318)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude%20API-Anthropic-d97706?style=flat-square)

</div>

---

## What is Lumen?

Lumen is an AI coding assistant designed to act as an always-available junior developer for web agencies and freelance developers. It sits alongside your workflow to help you move faster, ship cleaner code, and catch issues before they reach production.

Instead of context-switching to Stack Overflow, documentation sites, or generic chat tools, Lumen gives you a single focused interface trained to think like a developer — understanding not just *what* you're asking, but *why* it matters in a real codebase.

> Built with the Claude API (Anthropic), Lumen brings the reasoning capability of Claude to a minimal, premium chat UI purpose-built for code work.

---

## Features

**Bug Diagnosis & Fixing**
Paste a broken component, a failing API route, or a cryptic error message. Lumen identifies the root cause, explains why it happened, and delivers a targeted fix — not a rewrite.

**Code Generation**
Describe what you need in plain language. Lumen generates production-ready code with correct types, sensible defaults, and best practices baked in — no boilerplate cleanup required.

**Deployment Readiness Review**
Before you push to production, Lumen reviews your code for security vulnerabilities, performance bottlenecks, accessibility issues, missing error handling, and logical edge cases.

**Code Explanation**
Drop in an unfamiliar codebase, a library's source code, or a colleague's PR. Lumen breaks down what it does and how — at whatever level of detail you need.

**Refactoring Suggestions**
Lumen identifies opportunities to simplify, consolidate, or restructure code — with a preference for minimal, targeted changes that respect the existing architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| AI | [Claude API](https://www.anthropic.com) via `@anthropic-ai/sdk` |
| UI | [React 19](https://react.dev) |
| Markdown | `react-markdown` + `react-syntax-highlighter` |
| Fonts | Geist Sans & Geist Mono |

---

## Screenshots

> Screenshots coming soon — UI is actively being developed.

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mabeya-nicolas/lumen.git
cd lumen

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key
cp .env.local.example .env.local
# Then open .env.local and set:
# ANTHROPIC_API_KEY=your_api_key_here

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com) | Yes |

---

## Project Structure

```
lumen/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Streaming API route (Claude)
│   ├── globals.css             # Theme tokens, animations, prose styles
│   ├── layout.tsx              # Root layout with ThemeProvider
│   └── page.tsx                # Main chat page (state + streaming logic)
├── components/
│   ├── ChatMessage.tsx         # User + assistant message bubbles
│   ├── CodeBlock.tsx           # Syntax-highlighted code with copy button
│   ├── EmptyState.tsx          # Landing state with suggestion cards
│   ├── LumenLogo.tsx           # Animated amber glow logo
│   ├── MessageInput.tsx        # Auto-expanding textarea input
│   ├── Sidebar.tsx             # Conversation history sidebar
│   ├── ThemeProvider.tsx       # Dark/light mode context
│   └── ThemeToggle.tsx         # Theme switcher button
└── .env.local                  # API key (not committed)
```

---

## Design

Lumen uses a custom design system built on two modes:

- **Dark mode** — `#111318` deep charcoal base, built for long coding sessions
- **Light mode** — `#FAFAF8` warm white, clean and readable

The primary accent color is **amber `#FFBE3D`** — representing the "light in the dark" concept throughout the UI: glowing logo animations, user message bubbles, streaming cursor, inline code highlights, and hover states.

Code blocks are always rendered on a dark background regardless of app theme, keeping code maximally readable in both modes.

---

## Status

Lumen is **actively in development**. Current capabilities are functional and production-ready. Planned additions include conversation persistence, file/image uploads, and multi-model support.

---

## Author

Built by **Mabeya Nicolas**

---

<div align="center">

*Lumen — Light in the dark*

</div>
