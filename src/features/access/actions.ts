"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const accessSchema = z.object({ id: z.uuid().optional(), email: z.email().transform((value) => value.trim().toLowerCase()), role: z.enum(["owner", "admin", "editor"]), is_active: z.boolean() })

export async function saveAccess(input: unknown) {
  const user = await requireRole(["owner", "admin"])
  const parsed = accessSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid access record." }
  if (user.role === "admin" && parsed.data.role !== "editor") return { ok: false, message: "Admins can grant editor access only." }
  const { id, ...values } = parsed.data
  const supabase = await createClient()
  if (id) {
    const { data: target } = await supabase
      .from("dashboard_access")
      .select("registered_user_id,role")
      .eq("id", id)
      .maybeSingle()
    if (
      target?.registered_user_id === user.id &&
      (!values.is_active || values.role !== target.role)
    ) {
      return { ok: false, message: "You cannot disable or change your own role." }
    }
  }
  const result = id
    ? await supabase.from("dashboard_access").update(values).eq("id", id).select("id").single()
    : await supabase.from("dashboard_access").insert({ ...values, invited_by: user.id }).select("id").single()
  if (result.error) return { ok: false, message: result.error.message }
  await supabase.from("dashboard_activity").insert({ action: id ? "access_updated" : "access_granted", entity_type: "dashboard_access", entity_id: result.data.id })
  revalidatePath("/settings/access")
  return { ok: true, message: id ? "Access updated" : "Access added" }
}

export async function removeAccess(input: unknown) {
  const user = await requireRole(["owner", "admin"])
  const parsed = z.object({ id: z.uuid() }).safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid access record." }
  const supabase = await createClient()
  const { data: target } = await supabase.from("dashboard_access").select("role,registered_user_id").eq("id", parsed.data.id).single()
  if (!target) return { ok: false, message: "Access record not found." }
  if (target.registered_user_id === user.id) return { ok: false, message: "You cannot remove your own access." }
  if (user.role === "admin" && target.role !== "editor") return { ok: false, message: "Admins can remove editor access only." }
  const { error } = await supabase.from("dashboard_access").delete().eq("id", parsed.data.id)
  if (error) return { ok: false, message: error.message }
  await supabase.from("dashboard_activity").insert({ action: "access_removed", entity_type: "dashboard_access", entity_id: parsed.data.id })
  revalidatePath("/settings/access")
  return { ok: true, message: "Access removed" }
}
