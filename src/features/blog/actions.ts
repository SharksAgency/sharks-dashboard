"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireDashboardUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const blogSchema = z.object({
  id: z.uuid().optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title_ar: z.string().min(1), title_en: z.string().nullable().optional(), excerpt_ar: z.string().min(1), excerpt_en: z.string().nullable().optional(),
  deck_ar: z.string().min(1), deck_en: z.string().nullable().optional(), cover_image_url: z.string().min(1), cover_alt_ar: z.string().min(1), cover_alt_en: z.string().nullable().optional(),
  category_id: z.union([z.uuid(), z.literal("")]).nullable().optional(), author_name: z.string().min(1), status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean(), published_at: z.string().nullable().optional(), reading_time: z.coerce.number().int().min(1).max(120),
  content: z.record(z.string(), z.unknown()), related_slugs: z.array(z.string()), seo_title: z.string().nullable().optional(), seo_description: z.string().nullable().optional(), og_image_url: z.string().nullable().optional(),
})

export async function saveBlogPost(input: unknown) {
  const user = await requireDashboardUser()
  const parsed = blogSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid article." }
  const { id, ...values } = parsed.data
  const payload = {
    ...values,
    category_id: values.category_id || null,
    title_en: values.title_en || null,
    excerpt_en: values.excerpt_en || null,
    deck_en: values.deck_en || null,
    cover_alt_en: values.cover_alt_en || null,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
    og_image_url: values.og_image_url || null,
    published_at: values.status === "published" ? values.published_at || new Date().toISOString() : values.published_at || null,
    author_id: user.id,
  }
  const supabase = await createClient()
  const result = id
    ? await supabase.from("blog_posts").update(payload).eq("id", id).select("id").single()
    : await supabase.from("blog_posts").insert(payload).select("id").single()
  if (result.error) return { ok: false, message: result.error.message }
  await supabase.from("dashboard_activity").insert({ action: values.status === "published" ? "published" : id ? "updated" : "created", entity_type: "blog_posts", entity_id: result.data.id })
  revalidatePath("/blog")
  revalidatePath("/")
  return { ok: true, message: "Article saved", id: result.data.id }
}

export async function blogPostAction(input: unknown) {
  await requireDashboardUser()
  const parsed = z.object({ id: z.uuid(), action: z.enum(["publish", "unpublish", "archive", "duplicate", "delete"]) }).safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid request." }
  const { id, action } = parsed.data
  const supabase = await createClient()
  let error: { message: string } | null = null
  if (action === "delete") ({ error } = await supabase.from("blog_posts").delete().eq("id", id))
  else if (action === "duplicate") {
    const { data, error: readError } = await supabase.from("blog_posts").select("*").eq("id", id).single()
    if (readError || !data) return { ok: false, message: readError?.message ?? "Article not found." }
    const { id: _id, created_at: _created, updated_at: _updated, ...copy } = data
    void _id; void _created; void _updated
    const suffix = Date.now().toString().slice(-6)
    const result = await supabase.from("blog_posts").insert({ ...copy, slug: `${copy.slug}-copy-${suffix}`, title_ar: `${copy.title_ar} — نسخة`, status: "draft", is_featured: false, published_at: null }).select("id").single()
    error = result.error
  } else {
    const changes = action === "publish" ? { status: "published", published_at: new Date().toISOString() } : action === "archive" ? { status: "archived" } : { status: "draft", published_at: null }
    ;({ error } = await supabase.from("blog_posts").update(changes).eq("id", id))
  }
  if (error) return { ok: false, message: error.message }
  await supabase.from("dashboard_activity").insert({ action, entity_type: "blog_posts", entity_id: id })
  revalidatePath("/blog")
  revalidatePath("/")
  return { ok: true, message: action === "duplicate" ? "Draft duplicated" : "Article updated" }
}
