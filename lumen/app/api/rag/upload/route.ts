import { auth } from "@clerk/nextjs/server";
import { chunkCode, embedAndStore } from "@/lib/rag";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, content } = await request.json();

  if (!fileName || !content) {
    return Response.json(
      { error: "fileName and content are required" },
      { status: 400 }
    );
  }

  const chunks = chunkCode(content, fileName);
  await embedAndStore(chunks, userId, fileName);

  return Response.json({ success: true, chunks: chunks.length });
}
