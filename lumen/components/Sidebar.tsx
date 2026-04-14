"use client";

import { UserButton } from "@clerk/nextjs";
import { LumenLogo } from "./LumenLogo";
import { ThemeToggle } from "./ThemeToggle";

export type Conversation = {
  id: string;
  messages: Array<{ id: string; role: string; content: string }>;
};

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

function getTitle(conv: Conversation): string {
  const first = conv.messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text = first.content.trim();
  return text.length > 32 ? text.slice(0, 32) + "…" : text;
}

export function Sidebar({
  conversations,
  currentId,
  onSelect,
  onNewChat,
}: SidebarProps) {
  return (
    <div
      className="flex flex-col h-full flex-shrink-0"
      style={{
        width: 260,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 flex-shrink-0">
        <LumenLogo size={18} glow />
        <span
          className="font-semibold tracking-widest"
          style={{ fontSize: 13, color: "var(--text-primary)", letterSpacing: "0.18em" }}
        >
          LUMEN
        </span>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-2 flex-shrink-0">
        <button className="new-chat-btn" onClick={onNewChat}>
          <PlusIcon />
          New Chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        {conversations.length === 0 ? (
          <p
            className="px-2 py-3 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            No conversations yet
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className={`sidebar-item${conv.id === currentId ? " active" : ""}`}
                onClick={() => onSelect(conv.id)}
                title={getTitle(conv)}
              >
                {getTitle(conv)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div
        className="px-4 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <UserButton />
        <ThemeToggle />
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
