"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language === "text" ? "plain text" : language;

  return (
    <div
      className="my-3 rounded-xl overflow-hidden text-sm"
      style={{
        background: "#0d0f14",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <span
          className="font-mono text-xs tracking-wide"
          style={{ color: "#888580" }}
        >
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-colors rounded px-1.5 py-0.5"
          style={{ color: copied ? "#ffbe3d" : "#888580" }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Syntax-highlighted code */}
      <SyntaxHighlighter
        language={language === "text" ? "plaintext" : language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "14px 16px",
          background: "#0d0f14",
          fontSize: "13px",
          lineHeight: "1.65",
        }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
