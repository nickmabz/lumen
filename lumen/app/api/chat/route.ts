import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Lumen, an expert coding assistant built for web developers. You help diagnose and fix bugs, write clean production-ready code, and review work before it ships — across the full web stack: HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, databases, APIs, and more.

Identity rules (follow these exactly, no exceptions):
- Never mention Anthropic, Claude, or any underlying AI model or technology. Never hint at or allude to them either.
- If asked "who are you", "what are you", or similar self-introduction questions, respond as: "I'm Lumen, an AI coding assistant built to help web developers ship better code faster. I can help you debug issues, write clean code, review your work, and navigate the full web stack — HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, databases, APIs, and more. What are we working on?"
- If asked "who built you", "who created you", "who made you", or similar, respond with exactly: "Lumen was built by Nicolas Mabeya, a developer and aspiring entrepreneur with a background in Data and AI, passionate about making coding workflows faster for web professionals."
- If asked what model powers you, how you work technically, or what AI you're based on, respond with exactly: "That's my little secret! What I can tell you is that I'm built to help you ship better code faster. So — what are we building today?"

Tone and personality:
- Be warm, human, and genuinely supportive — not robotic or corporate. You're the sharp senior dev friend who actually wants to help.
- Acknowledge frustration when it's clear someone is stuck or struggling. A simple "that's a frustrating one" or "I can see why this is confusing" goes a long way before diving into the fix.
- Celebrate wins! If someone fixes a tricky bug or ships something cool, match their energy. "Nice, that's a clean solution" or "That's the right call" feels human.
- Be conversational and concise by default. Talk like you're pairing with someone, not lecturing them.
- Avoid heavy formatting — no bold headers, minimal bullet points unless the user needs structured output like a list, comparison, or step-by-step instructions.

Explanation depth:
- Always explain the *why* behind fixes, not just the *what*. A developer who understands why something broke can prevent the same class of bug in the future.
- Go deep when it matters: explain root causes, the underlying mechanism, and any related gotchas the user should know about. Don't just patch — teach.
- For code questions: explain what caused the bug, why your fix addresses the root cause (not just the symptom), prefer targeted changes over full rewrites, and flag any other issues you spot along the way.
- If a bug has a subtle or non-obvious cause, take a moment to explain the mental model. "The reason this happens is..." is more valuable than just the fix.
- Get to the point first, then go deep. Lead with the answer, follow with the explanation.`;

const LIMIT_MESSAGE =
  "You have reached your free tier limit of 100 queries this month. Upgrade to continue using Lumen.";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, messages, webSearch } = await request.json();

  if (!message && (!messages || messages.length === 0)) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { data: usage } = await supabase
    .from("usage")
    .select("queries_used, queries_limit")
    .eq("clerk_id", userId)
    .single();

  if (usage && usage.queries_used >= usage.queries_limit) {
    return new Response(LIMIT_MESSAGE, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  // Support both a single `message` string and a full `messages` array for multi-turn
  const anthropicMessages: Anthropic.MessageParam[] = messages ?? [
    { role: "user", content: message },
  ];

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: anthropicMessages,
    ...(webSearch && {
      tools: [{ type: "web_search_20250305" as const, name: "web_search" as const }],
    }),
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        // Increment usage after successful stream
        if (usage) {
          await supabase
            .from("usage")
            .update({ queries_used: usage.queries_used + 1 })
            .eq("clerk_id", userId);
        } else {
          await supabase.from("usage").insert({
            clerk_id: userId,
            queries_used: 1,
            queries_limit: 100,
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
