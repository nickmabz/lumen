"use client";

import { LumenLogo } from "./LumenLogo";

const SUGGESTIONS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    label: "Fix a bug",
    description: "Paste your code and describe the issue",
    prompt: "I have a bug in my code. Let me share it with you — can you help me diagnose and fix it?",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    label: "Generate code",
    description: "Describe what you need and I'll write it",
    prompt: "I need you to generate some code for me. Here's what I'm trying to build:",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    label: "Review before deployment",
    description: "Catch bugs, security issues, and performance problems",
    prompt: "Please review my code before I deploy it. Check for bugs, security vulnerabilities, performance issues, and anything else that could cause problems in production.",
  },
];

interface EmptyStateProps {
  onSuggest: (prompt: string) => void;
}

export function EmptyState({ onSuggest }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 w-full max-w-xl">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-4">
          <LumenLogo size={52} glow />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h1
              className="font-semibold tracking-tight"
              style={{ fontSize: 22, color: "var(--text-primary)" }}
            >
              How can I illuminate your code today?
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Light in the dark
            </p>
          </div>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {SUGGESTIONS.map(({ icon, label, description, prompt }) => (
            <button
              key={label}
              className="suggestion-card"
              onClick={() => onSuggest(prompt)}
            >
              <span style={{ color: "var(--amber)" }}>{icon}</span>
              <span
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {label}
              </span>
              <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
