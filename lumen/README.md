<div align="center">

# ◉ Lumen

### *Light in the dark*

**An AI coding assistant that brings clarity to every developer's workflow.**

![Status](https://img.shields.io/badge/status-actively%20in%20development-ffbe3d?style=flat-square&labelColor=111318)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-d97706?style=flat-square)

</div>

---

## What is Lumen?

Lumen is an AI coding assistant designed to act as an always-available senior developer for developers. It sits alongside your workflow to help you move faster, ship cleaner code, and catch issues before they reach production.

Instead of context-switching to Stack Overflow, documentation sites, or generic chat tools, Lumen gives you a single focused interface built to think like a developer — understanding not just *what* you're asking, but *why* it matters in a real codebase.

> Lumen V2 brings semantic codebase awareness, real-time web search, persistent chat history, and a fully personalized experience — purpose-built for professional code work.

---

## Features

**Codebase-Aware Answers via RAG**
Upload your own source files and Lumen indexes them using semantic embeddings and vector search. Every response is grounded in your actual code — not generic examples. Ask about a specific function, a pattern in your codebase, or a bug in a file you uploaded, and Lumen retrieves the most relevant context automatically.

**Real-Time Web Search**
Toggle web search on from the input bar to give Lumen access to current information — framework release notes, package documentation, recent CVEs, and anything else that post-dates its training data.

**Persistent Chat History**
Conversations are saved and synced so your work is never lost. Reload the page, close the tab, come back later — your full history is right where you left it. Each conversation gets its own shareable URL (`/chat/[id]`) so refreshing returns you to the exact conversation you were in.

**Personalized New User Experience**
Lumen detects whether you're a first-time or returning user and tailors its greeting accordingly — a guided welcome for newcomers, a clean return to work for regulars.

**Usage Capping with Friendly Warnings**
Free-tier users get a clear, friendly message when they reach their monthly query limit — no silent failures, no confusing errors.

**Token Limit Warnings**
As your message approaches the input size limit, a live token counter appears in amber as a soft warning, turning red if you exceed it. The send button is blocked and a concise inline message explains how to trim the input for better results.

**Animated Thinking Indicator**
A pulsing amber sun animation plays while Lumen is generating a response — subtle, on-brand, and clearly communicates that work is in progress.

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
| AI | State-of-the-art language model via streaming API |
| Embeddings | Semantic embedding model for vector search |
| Database | [Supabase](https://supabase.com) — Postgres + pgvector |
| Auth | [Clerk](https://clerk.com) |
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
- API keys for the AI and embedding providers
- A [Supabase](https://supabase.com) project with pgvector enabled
- A [Clerk](https://clerk.com) application

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nickmabz/lumen.git
cd lumen

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Then open .env.local and fill in all required values (see below)

# 4. Run the Supabase migrations (see /supabase/migrations)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `AI_API_KEY` | API key for the language model provider | Yes |
| `EMBEDDING_API_KEY` | API key for the semantic embedding provider | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |

---

## Project Structure

```
lumen/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming chat API with RAG context injection
│   │   ├── chats/route.ts         # Conversation persistence (GET/POST)
│   │   ├── chats/[id]/route.ts    # Delete conversation
│   │   ├── rag/upload/route.ts    # Index a code file (chunk → embed → store)
│   │   ├── rag/search/route.ts    # Semantic search over indexed files
│   │   ├── rag/files/route.ts     # List indexed files
│   │   ├── rag/files/[fileName]/route.ts  # Delete indexed file
│   │   └── user/init/route.ts     # New vs returning user detection
│   ├── chat/[conversationId]/
│   │   └── page.tsx               # Deep-link to a specific conversation
│   ├── globals.css                # Theme tokens, animations, prose styles
│   ├── layout.tsx                 # Root layout with auth + theme providers
│   └── page.tsx                   # Home — new chat entry point
├── components/
│   ├── ChatApp.tsx                # Core chat logic, state, and streaming
│   ├── ChatMessage.tsx            # User + assistant message bubbles
│   ├── CodeBlock.tsx              # Syntax-highlighted code with copy button
│   ├── EmptyState.tsx             # Landing state with suggestion cards
│   ├── LumenLogo.tsx              # Animated amber glow logo
│   ├── MessageInput.tsx           # Textarea with token counter, web search toggle, and file upload
│   ├── Sidebar.tsx                # Conversation history + indexed codebase files
│   ├── ThemeProvider.tsx          # Dark/light mode context
│   └── ThemeToggle.tsx            # Theme switcher button
├── lib/
│   ├── rag.ts                     # Chunking, embedding, and vector search helpers
│   ├── voyage.ts                  # Embedding API client
│   ├── supabase-server.ts         # Server-side Supabase client
│   └── supabase.ts                # Client-side Supabase instance
└── .env.local                     # Secret keys (not committed)
```

---

## Design

Lumen uses a custom design system built on two modes:

- **Dark mode** — `#111318` deep charcoal base, built for long coding sessions
- **Light mode** — `#FAFAF8` warm white, clean and readable

The primary accent color is **amber `#FFBE3D`** — representing the "light in the dark" concept throughout the UI: glowing logo animations, user message bubbles, streaming cursor, inline code highlights, active toggle states, and hover states.

Code blocks are always rendered on a dark background regardless of app theme, keeping code maximally readable in both modes.

---

## Status

Lumen V2 is **actively in development**. Core features — AI chat, RAG codebase indexing, web search, persistent history, auth, and usage capping — are functional and production-ready.

---

## Author

Built by **Nicolas Mabeya**

---

<div align="center">

*Lumen — Light in the dark*

</div>
