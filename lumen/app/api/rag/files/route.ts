import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  // chunk_index = 0 gives exactly one row per file with the original created_at
  const { data, error } = await supabase
    .from("embeddings")
    .select("file_name, created_at")
    .eq("clerk_id", userId)
    .eq("chunk_index", 0)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ files: data ?? [] });
}
