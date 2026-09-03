import { AccessManager } from "@/features/access/access-manager"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function AccessPage() {
  const user = await requireRole(["owner", "admin"])
  const { data, error } = await (await createClient()).from("dashboard_access").select("*").order("created_at")
  if (error) throw new Error(`Unable to load access records: ${error.message}`)
  return <AccessManager records={(data ?? []) as never} currentRole={user.role} />
}
