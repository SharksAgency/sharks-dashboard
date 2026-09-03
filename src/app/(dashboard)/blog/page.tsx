import { BlogList } from "@/features/blog/blog-list"
import { createClient } from "@/lib/supabase/server"

export default async function BlogPage() {
  const supabase = await createClient()
  const [{ data: posts, error }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }).limit(200),
    supabase.from("blog_categories").select("id,name_ar,name_en").order("sort_order"),
  ])
  if (error) throw new Error(`Unable to load articles: ${error.message}`)
  return <BlogList posts={(posts ?? []) as never} categories={categories ?? []} />
}
