import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type DashboardRole = "owner" | "admin" | "editor"

export type DashboardUser = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  role: DashboardRole
}

export const getDashboardUser = cache(async (): Promise<DashboardUser | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const [{ data: access }, { data: profile }] = await Promise.all([
    supabase
      .from("dashboard_access")
      .select("role,is_active")
      .eq("registered_user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name,avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  if (!access || !["owner", "admin", "editor"].includes(access.role)) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    fullName: profile?.full_name || user.user_metadata.full_name || user.email,
    avatarUrl: profile?.avatar_url ?? null,
    role: access.role as DashboardRole,
  }
})

export async function requireDashboardUser() {
  const user = await getDashboardUser()
  if (!user) redirect("/access-denied")
  return user
}

export async function requireRole(roles: DashboardRole[]) {
  const user = await requireDashboardUser()
  if (!roles.includes(user.role)) redirect("/access-denied")
  return user
}
