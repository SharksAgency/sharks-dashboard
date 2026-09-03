import { BlogEditorForm } from "@/features/blog/blog-editor-form"
import { createClient } from "@/lib/supabase/server"

export default async function NewBlogPostPage() {
  const { data } = await (await createClient()).from("blog_categories").select("id,name_ar,name_en").eq("is_active", true).order("sort_order")
  return <BlogEditorForm categories={data ?? []} />
}
