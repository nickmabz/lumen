"use client";

import { useEffect, useRef, useState } from "react";

const WARN_CHARS = 6000;
const MAX_CHARS = 8000;

interface MessageInputProps {
  onSend: (text: string, webSearch: boolean) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = value.length;
  const approxTokens = Math.round(charCount / 4);
  const isOverLimit = charCount > MAX_CHARS;
  const showCounter = charCount > WARN_CHARS;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const canSend = value.trim().length > 0 && !disabled && !isOverLimit;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim(), webSearch);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  return (
    <div className="px-4 pb-5 pt-2 flex-shrink-0">
      {isOverLimit && (
        <p className="text-xs mb-2 px-1" style={{ color: "#ef4444" }}>
          ⚠️ Input too large — paste a smaller section.
        </p>
      )}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-shadow"
        style={{
          background: "var(--bg-input)",
          border: `1px solid ${isOverLimit ? "#ef4444" : "var(--border-input)"}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lumen anything…"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed"
          style={{
            color: "var(--text-primary)",
            maxHeight: 180,
            overflow: "auto",
            fontFamily: "inherit",
          }}
        />

        <button
          onClick={() => setWebSearch((v) => !v)}
          disabled={disabled}
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all"
          style={{
            width: 32,
            height: 32,
            background: webSearch ? "#ffbe3d" : "transparent",
            border: `1px solid ${webSearch ? "#ffbe3d" : "var(--border-input)"}`,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.4 : 1,
          }}
          title={webSearch ? "Web search on" : "Web search off"}
        >
          <GlobeIcon active={webSearch} />
        </button>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all"
          style={{
            width: 32,
            height: 32,
            background: canSend ? "#ffbe3d" : "transparent",
            border: `1px solid ${canSend ? "#ffbe3d" : "var(--border-input)"}`,
            cursor: canSend ? "pointer" : "default",
            opacity: disabled && !canSend ? 0.4 : canSend ? 1 : 0.45,
          }}
          title="Send (Enter)"
        >
          <SendIcon active={canSend} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <p
          className="text-xs"
          style={{ color: "var(--text-secondary)", opacity: 0.6 }}
        >
          Enter to send · Shift+Enter for new line
        </p>
        {showCounter && (
          <p
            className="text-xs tabular-nums"
            style={{ color: isOverLimit ? "#ef4444" : "#ffbe3d" }}
          >
            ~{approxTokens.toLocaleString()} / 2,000 tokens
          </p>
        )}
      </div>
    </div>
  );
}

function GlobeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#1c1917" : "var(--text-secondary)"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#1c1917" : "var(--text-secondary)"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
