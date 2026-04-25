import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName } = await params;
  const decoded = decodeURIComponent(fileName);
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("embeddings")
    .delete()
    .eq("clerk_id", userId)
    .eq("file_name", decoded);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
