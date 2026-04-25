"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { LumenLogo } from "./LumenLogo";
import { ThemeToggle } from "./ThemeToggle";

export type Conversation = {
  id: string;
  messages: Array<{ id: string; role: string; content: string }>;
};

export type IndexedFile = {
  file_name: string;
  created_at: string;
};

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  indexedFiles: IndexedFile[];
  onDeleteFile: (fileName: string) => void;
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
  onDelete,
  indexedFiles,
  onDeleteFile,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  const handleTrashClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmingId(id);
  };

  const handleConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
    setConfirmingId(null);
    setHoveredId(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingId(null);
  };

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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        {/* Conversation list */}
        {conversations.length === 0 ? (
          <p className="px-2 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
            No conversations yet
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((conv) => {
              const isConfirming = confirmingId === conv.id;
              const isHovered = hoveredId === conv.id;

              return (
                <div
                  key={conv.id}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    if (confirmingId === conv.id) setConfirmingId(null);
                  }}
                >
                  <button
                    className={`sidebar-item${conv.id === currentId ? " active" : ""}`}
                    style={{ paddingRight: 30 }}
                    onClick={() => {
                      if (!isConfirming) onSelect(conv.id);
                    }}
                    title={getTitle(conv)}
                  >
                    {getTitle(conv)}
                  </button>

                  {isConfirming && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        paddingRight: 8,
                        paddingLeft: 20,
                        borderRadius: "0 7px 7px 0",
                        background: `linear-gradient(to right, transparent, var(--bg-sidebar) 35%)`,
                        pointerEvents: "auto",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          userSelect: "none",
                        }}
                      >
                        Delete?
                      </span>
                      <button
                        onClick={(e) => handleConfirm(e, conv.id)}
                        title="Confirm delete"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: "none",
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "rgb(239, 68, 68)",
                          cursor: "pointer",
                          flexShrink: 0,
                          padding: 0,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(239, 68, 68, 0.28)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "rgba(239, 68, 68, 0.15)";
                        }}
                      >
                        <CheckIcon />
                      </button>
                      <button
                        onClick={handleCancel}
                        title="Cancel"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: "none",
                          background: "transparent",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          flexShrink: 0,
                          padding: 0,
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--text-primary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--text-secondary)";
                        }}
                      >
                        <XIcon />
                      </button>
                    </div>
                  )}

                  {!isConfirming && (
                    <button
                      onClick={(e) => handleTrashClick(e, conv.id)}
                      title="Delete chat"
                      style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: "none",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: 0,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.15s, color 0.15s",
                        pointerEvents: isHovered ? "auto" : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "rgb(239, 68, 68)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--text-secondary)";
                      }}
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* My Codebase section */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              height: 1,
              background: "var(--border)",
              marginBottom: 10,
            }}
          />
          <p
            className="px-2 pb-1"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            My Codebase
          </p>

          {indexedFiles.length === 0 ? (
            <p
              className="px-2 py-2 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)", opacity: 0.5 }}
            >
              No files indexed yet — upload a file to get started
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {indexedFiles.map((file) => {
                const isHovered = hoveredFile === file.file_name;
                return (
                  <div
                    key={file.file_name}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredFile(file.file_name)}
                    onMouseLeave={() => setHoveredFile(null)}
                  >
                    <div
                      className="sidebar-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        paddingRight: 30,
                        cursor: "default",
                      }}
                      title={file.file_name}
                    >
                      <span style={{ flexShrink: 0, fontSize: 12, lineHeight: 1 }}>📎</span>
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {file.file_name}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteFile(file.file_name)}
                      title="Remove from codebase"
                      style={{
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: "none",
                        background: "transparent",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: 0,
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.15s, color 0.15s",
                        pointerEvents: isHovered ? "auto" : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "rgb(239, 68, 68)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--text-secondary)";
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
