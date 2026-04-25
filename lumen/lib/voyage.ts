export const VOYAGE_MODEL = "voyage-code-2";

interface EmbedResponseItem {
  embedding: number[];
  index: number;
}

export async function embed(
  input: string | string[],
  inputType: "document" | "query"
): Promise<EmbedResponseItem[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input, model: VOYAGE_MODEL, input_type: inputType }),
  });

  if (!res.ok) {
    throw new Error(`Voyage API error: ${res.status} ${res.statusText}`);
  }

  const json: { data: EmbedResponseItem[] } = await res.json();
  return json.data;
}
