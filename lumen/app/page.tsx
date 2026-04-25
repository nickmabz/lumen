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
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  // User init — determines is_new_user for the welcome message
  useEffect(() => {
    fetch("/api/user/init", { method: "POST" })
      .then((r) => r.json())
      .then((data) => setIsNewUser(data.is_new_user ?? false))
      .catch(() => setIsNewUser(false));
  }, []);

  // Load persisted chat history from Supabase on mount
  useEffect(() => {
    fetch("/api/chats")
      .then((r) => r.json())
      .then((data) => {
        if (data.chats?.length) setConversations(data.chats);
      })
      .catch(() => {});
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentId);
  const messages = (currentConversation?.messages ?? []) as Message[];

  // Reset scroll position tracking when switching conversations
  useEffect(() => {
    isAtBottomRef.current = true;
  }, [currentId]);

  // Auto-scroll only when the user is already near the bottom
  useEffect(() => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteChat = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentId === id) setCurrentId(null);
    fetch(`/api/chats/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distanceFromBottom < 80;
  };

  const sendMessage = async (text: string, webSearch = false) => {
    if (!text.trim() || isStreaming) return;

    const isNew = !currentId;
    const convId = currentId ?? crypto.randomUUID();
    const userMsgId = `msg-${Date.now()}`;
    const assistantMsgId = `msg-${Date.now() + 1}`;

    const userMsg: Message = { id: userMsgId, role: "user", content: text };
    const assistantMsg: Message = { id: assistantMsgId, role: "assistant", content: "" };

    // Capture messages before state update — needed for API payload and Supabase save
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

    let fullResponse = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, webSearch }),
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

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

      // Persist the full conversation to Supabase after successful stream
      const allMessages = [
        ...prevMessages,
        { id: userMsgId, role: "user", content: text },
        { id: assistantMsgId, role: "assistant", content: fullResponse },
      ];

      fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convId, messages: allMessages }),
      }).catch(() => {});
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
        onDelete={handleDeleteChat}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {messages.length === 0 ? (
          <>
            <EmptyState onSuggest={sendMessage} isNewUser={isNewUser} />
            <div className="max-w-3xl mx-auto w-full px-0">
              <MessageInput onSend={sendMessage} disabled={isStreaming} />
            </div>
          </>
        ) : (
          <>
            {/* Messages */}
            <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
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
