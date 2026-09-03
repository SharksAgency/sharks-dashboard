import { notFound } from "next/navigation"
import { EntityPage } from "@/features/entities/entity-page"
import { createClient } from "@/lib/supabase/server"

export default async function ScenarioStepsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("scenarios").select("id,title_ar,title_en").eq("id", id).maybeSingle()
  if (!data) notFound()
  return <EntityPage entity="scenario_steps" filter={{ column: "scenario_id", value: id }} fixedValues={{ scenario_id: id }} overrideTitle={{ ar: `خطوات: ${data.title_ar}`, en: `Steps: ${data.title_en || data.title_ar}` }} />
}
