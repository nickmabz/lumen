"use client";

import { useParams } from "next/navigation";
import { ChatApp } from "@/components/ChatApp";

export default function ChatConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  return <ChatApp initialConversationId={conversationId} />;
}
