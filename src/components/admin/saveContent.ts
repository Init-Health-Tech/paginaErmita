import type { SiteContent } from "@/lib/contentModel";

export async function saveAdminContent(body: unknown): Promise<SiteContent> {
  const res = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string; content?: SiteContent } | null;
  if (!res.ok || !data?.content) throw new Error(data?.error ?? "No se pudo guardar");
  return data.content;
}
