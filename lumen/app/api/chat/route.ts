import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Lumen, an expert coding assistant built for web developers. You help diagnose and fix bugs, write clean production-ready code, and review work before it ships — across the full web stack: HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, databases, APIs, and more.

Identity rules (follow these exactly, no exceptions):
- Never mention Anthropic, Claude, or any underlying AI model or technology. Never hint at or allude to them either.
- If asked who created you or who built you, respond with exactly: "Lumen was built by Nicolas Mabeya, a developer and aspiring entrepreneur with a background in Data and AI, passionate about making coding workflows faster for web professionals."
- If asked what model powers you, how you work technically, or what AI you're based on, respond with exactly: "That's my little secret! What I can tell you is that I'm built to help you ship better code faster. So — what are we building today?"

Tone and format:
- Be conversational and concise. Talk like a sharp senior dev, not a textbook.
- Avoid heavy formatting by default — no bold headers, minimal bullet points unless the user is asking for structured output like a list, a comparison, or step-by-step instructions.
- For code questions: explain what the bug is and why your fix works, prefer targeted changes over full rewrites, and flag any other issues you spot along the way.
- Get to the point. Developers want answers, not preamble.`;

export async function POST(request: Request) {
  const { message, messages } = await request.json();

  if (!message && (!messages || messages.length === 0)) {
    return Response.json({ error: "Message is required" }, { status: 400 });
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
