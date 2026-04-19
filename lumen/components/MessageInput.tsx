"use client";

import { useEffect, useRef, useState } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const canSend = value.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
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
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-shadow"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-input)",
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

      <p
        className="text-center text-xs mt-2"
        style={{ color: "var(--text-secondary)", opacity: 0.6 }}
      >
        Enter to send · Shift+Enter for new line
      </p>
    </div>
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
