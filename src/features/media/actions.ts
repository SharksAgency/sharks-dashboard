"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireDashboardUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function saveMediaAlt(input: unknown) {
  await requireDashboardUser()
  const parsed = z.object({ id: z.uuid(), alt_text_ar: z.string(), alt_text_en: z.string().nullable().optional() }).safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid media metadata." }
  const supabase = await createClient()
  const { error } = await supabase.from("media_assets").update({ alt_text_ar: parsed.data.alt_text_ar, alt_text_en: parsed.data.alt_text_en || null }).eq("id", parsed.data.id)
  if (error) return { ok: false, message: error.message }
  await supabase.from("dashboard_activity").insert({ action: "updated", entity_type: "media_assets", entity_id: parsed.data.id })
  revalidatePath("/media")
  return { ok: true, message: "Metadata saved" }
}

export async function deleteMedia(input: unknown) {
  await requireDashboardUser()
  const parsed = z.object({ id: z.uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid media record." }
  const supabase = await createClient()
  const { data: asset, error: readError } = await supabase.from("media_assets").select("id,bucket,path").eq("id", parsed.data.id).single()
  if (readError || !asset) return { ok: false, message: readError?.message ?? "Asset not found." }

  const references: [string, string][] = [
    ["services", "image_url"], ["scenarios", "cover_image_url"], ["scenarios", "og_image_url"], ["blog_posts", "cover_image_url"], ["blog_posts", "og_image_url"],
    ["projects", "cover_image_url"], ["projects", "thumbnail_image_url"], ["project_gallery", "image_url"], ["partners", "logo_url"], ["team_members", "photo_url"],
  ]
  for (const [table, column] of references) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true }).eq(column, asset.path)
    if (count) return { ok: false, message: `This file is referenced by ${table}. Replace that reference before deleting it.` }
  }

  const { error: storageError } = await supabase.storage.from(asset.bucket).remove([asset.path])
  if (storageError) return { ok: false, message: storageError.message }
  const { error } = await supabase.from("media_assets").delete().eq("id", asset.id)
  if (error) return { ok: false, message: error.message }
  await supabase.from("dashboard_activity").insert({ action: "deleted", entity_type: "media_assets", entity_id: asset.id })
  revalidatePath("/media")
  return { ok: true, message: "Media deleted" }
}
