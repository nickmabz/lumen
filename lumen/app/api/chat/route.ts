import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Lumen, an expert coding assistant for web developers. You specialize in:
- Diagnosing and fixing bugs across the full web stack (HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, databases, APIs, and more)
- Generating clean, production-ready code with best practices
- Reviewing code before deployment — catching security vulnerabilities, performance issues, accessibility problems, and logical errors

When helping with code:
- Always explain what the bug or issue is and why your fix works
- Prefer minimal, targeted changes over large rewrites unless a rewrite is clearly better
- Point out any other issues you notice while fixing the requested one
- Format code clearly with correct syntax highlighting hints
- Be direct and concise — developers want answers, not filler`;

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
    model: "claude-opus-4-6",
    max_tokens: 8096,
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
