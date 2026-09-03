import { MediaLibrary } from "@/features/media/media-library"
import { requireDashboardUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function MediaPage() {
  const user = await requireDashboardUser()
  const { data, error } = await (await createClient()).from("media_assets").select("*").order("created_at", { ascending: false }).limit(250)
  if (error) throw new Error(`Unable to load media: ${error.message}`)
  return <MediaLibrary assets={data ?? []} userId={user.id} />
}
