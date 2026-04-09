"use client";

import ReactMarkdown from "react-markdown";
import { LumenLogo } from "./LumenLogo";
import { CodeBlock } from "./CodeBlock";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-5 px-4">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
          style={{
            background: "var(--bg-user-msg)",
            color: "#1c1917",
            fontWeight: 400,
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  const showTyping = isStreaming && content === "";

  return (
    <div className="flex gap-3 mb-5 px-4">
      {/* Lumen avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <LumenLogo size={20} glow={false} />
      </div>

      {/* Bubble */}
      <div
        className="flex-1 min-w-0 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: "var(--bg-assistant-msg)",
          border: "1px solid var(--border)",
          boxShadow: "0 0 18px rgba(255,190,61,0.045)",
        }}
      >
        {showTyping ? (
          <div className="flex items-center gap-1.5 h-5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown
              components={{
                // Block code: handled via pre wrapper
                pre({ children }) {
                  return <>{children}</>;
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const text = String(children);
                  const isBlock = !!className || text.includes("\n");

                  if (isBlock) {
                    return (
                      <CodeBlock language={match?.[1] || "text"}>
                        {text.replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <code className="inline-code" {...(props as any)}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Streaming cursor at end */}
            {isStreaming && (
              <span
                className="inline-block w-0.5 h-3.5 ml-0.5 rounded-sm align-middle"
                style={{
                  background: "var(--amber)",
                  animation: "typing 1s ease-in-out infinite",
                  verticalAlign: "middle",
                  marginBottom: 1,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
