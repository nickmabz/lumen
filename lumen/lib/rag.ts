import { embed } from "./voyage";
import { createServerSupabaseClient } from "./supabase-server";

export interface CodeChunk {
  content: string;
  fileName: string;
  index: number;
}

// ~500 tokens at 4 chars/token; 50-token overlap
const CHUNK_CHARS = 2000;
const OVERLAP_CHARS = 200;

export function chunkCode(content: string, fileName: string): CodeChunk[] {
  const lines = content.split("\n");
  const chunks: CodeChunk[] = [];
  let current = "";
  let idx = 0;

  for (const line of lines) {
    current += line + "\n";
    if (current.length >= CHUNK_CHARS) {
      chunks.push({ content: current.trimEnd(), fileName, index: idx++ });
      current = current.slice(-OVERLAP_CHARS);
    }
  }

  if (current.trim()) {
    chunks.push({ content: current.trimEnd(), fileName, index: idx });
  }

  return chunks;
}

export async function embedAndStore(
  chunks: CodeChunk[],
  clerkId: string,
  fileName: string
): Promise<void> {
  const supabase = createServerSupabaseClient();

  await supabase
    .from("embeddings")
    .delete()
    .eq("clerk_id", clerkId)
    .eq("file_name", fileName);

  // Voyage allows max 128 inputs per request
  const BATCH_SIZE = 128;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await embed(batch.map((c) => c.content), "document");
    const rows = batch.map((chunk, j) => ({
      clerk_id: clerkId,
      file_name: chunk.fileName,
      chunk_index: chunk.index,
      content: chunk.content,
      embedding: embeddings[j]?.embedding ?? [],
    }));

    await supabase.from("embeddings").insert(rows);
  }
}

export async function searchEmbeddings(
  query: string,
  clerkId: string
): Promise<Array<{ content: string; file_name: string; similarity: number }>> {
  const embedData = await embed(query, "query");
  const embedding = embedData[0]?.embedding;
  if (!embedding) return [];

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.rpc("match_embeddings", {
    query_embedding: embedding,
    match_clerk_id: clerkId,
    match_count: 5,
  });

  return data ?? [];
}
