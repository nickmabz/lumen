"use client";

import { useUser } from "@clerk/nextjs";

const SUGGESTIONS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
  isNewUser: boolean | null;
}

export function EmptyState({ onSuggest, isNewUser }: EmptyStateProps) {
  const { user } = useUser();
  const raw = user?.firstName ?? "";
  const firstName = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "";

  const heading =
    isNewUser === false
      ? `Welcome back${firstName ? `, ${firstName}` : ""}`
      : "Welcome to Lumen";

  const subtitle =
    isNewUser === false
      ? "Ready to pick up where you left off."
      : "Your AI coding assistant.";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            style={{
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            {heading}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          {SUGGESTIONS.map(({ icon, label, description, prompt }) => (
            <button
              key={label}
              className="suggestion-card"
              onClick={() => onSuggest(prompt)}
              style={{ padding: "10px 12px", gap: 4 }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{icon}</span>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
