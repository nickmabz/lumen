import { auth } from "@clerk/nextjs/server";
import { searchEmbeddings } from "@/lib/rag";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query } = await request.json();

  if (!query) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  const chunks = await searchEmbeddings(query, userId);
  return Response.json({ chunks });
}
