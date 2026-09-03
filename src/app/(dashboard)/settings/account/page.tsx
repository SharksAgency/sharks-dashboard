import { AccountForm } from "@/features/account/account-form"
import { requireDashboardUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function AccountPage() {
  const user = await requireDashboardUser()
  const { data } = await (await createClient()).from("profiles").select("full_name,avatar_url,preferred_language").eq("id", user.id).maybeSingle()
  return <AccountForm user={user} profile={data} />
}
