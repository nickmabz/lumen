import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("users")
    .select("is_new_user")
    .eq("clerk_id", userId)
    .single();

  if (!existing) {
    await supabase.from("users").insert({
      clerk_id: userId,
      is_new_user: true,
      last_seen_at: new Date().toISOString(),
    });
    return Response.json({ is_new_user: true });
  }

  await supabase
    .from("users")
    .update({ last_seen_at: new Date().toISOString(), is_new_user: false })
    .eq("clerk_id", userId);

  return Response.json({ is_new_user: false });
}
