"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar, type Conversation } from "@/components/Sidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { EmptyState } from "@/components/EmptyState";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === currentId);
  const messages = (currentConversation?.messages ?? []) as Message[];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const isNew = !currentId;
    const convId = currentId ?? `conv-${Date.now()}`;
    const userMsgId = `msg-${Date.now()}`;
    const assistantMsgId = `msg-${Date.now() + 1}`;

    const userMsg: Message = { id: userMsgId, role: "user", content: text };
    const assistantMsg: Message = { id: assistantMsgId, role: "assistant", content: "" };

    // Capture current messages before state update for API call
    const prevMessages = messages;

    if (isNew) {
      setCurrentId(convId);
      setConversations((prev) => [
        { id: convId, messages: [userMsg, assistantMsg] },
        ...prev,
      ]);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: [...c.messages, userMsg, assistantMsg] }
            : c
        )
      );
    }

    setIsStreaming(true);

    const apiMessages = [
      ...prevMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: (m as Message).content + chunk }
                  : m
              ),
            };
          })
        );
      }
    } catch {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: "Sorry, something went wrong. Please try again." }
                : m
            ),
          };
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const streamingMsgId = isStreaming ? messages[messages.length - 1]?.id : null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      <Sidebar
        conversations={conversations}
        currentId={currentId}
        onSelect={(id) => {
          if (!isStreaming) setCurrentId(id);
        }}
        onNewChat={() => {
          if (!isStreaming) setCurrentId(null);
        }}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {messages.length === 0 ? (
          <>
            <EmptyState onSuggest={sendMessage} />
            <div className="max-w-3xl mx-auto w-full px-0">
              <MessageInput onSend={sendMessage} disabled={isStreaming} />
            </div>
          </>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-6">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isStreaming && msg.id === streamingMsgId}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input pinned to bottom */}
            <div className="flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                <MessageInput onSend={sendMessage} disabled={isStreaming} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
