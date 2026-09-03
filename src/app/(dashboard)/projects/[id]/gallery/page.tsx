import { notFound } from "next/navigation"
import { EntityPage } from "@/features/entities/entity-page"
import { createClient } from "@/lib/supabase/server"

export default async function ProjectGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("id,title_ar,title_en").eq("id", id).maybeSingle()
  if (!data) notFound()
  return <EntityPage entity="project_gallery" filter={{ column: "project_id", value: id }} fixedValues={{ project_id: id }} overrideTitle={{ ar: `معرض: ${data.title_ar}`, en: `Gallery: ${data.title_en || data.title_ar}` }} />
}
