import { notFound } from "next/navigation"
import { BlogEditorForm } from "@/features/blog/blog-editor-form"
import { createClient } from "@/lib/supabase/server"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("blog_categories").select("id,name_ar,name_en").order("sort_order"),
  ])
  if (!post) notFound()
  return <BlogEditorForm post={post} categories={categories ?? []} />
}
