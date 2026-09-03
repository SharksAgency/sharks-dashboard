"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireDashboardUser } from "@/lib/auth"
import { entityConfigs, type EntityField, type EntityName } from "@/lib/entities"
import { createClient } from "@/lib/supabase/server"

const entityNames = Object.keys(entityConfigs) as [EntityName, ...EntityName[]]
const payloadSchema = z.object({
  entity: z.enum(entityNames),
  id: z.union([z.uuid(), z.string().min(1)]).optional(),
  values: z.record(z.string(), z.unknown()),
  fixedValues: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

function normalize(field: EntityField, value: unknown) {
  if (field.readonly) return undefined
  if (field.type === "boolean") return Boolean(value)
  if (field.type === "number") {
    if (value === "" || value === null || value === undefined) return null
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) throw new Error(`${field.labelEn} must be a number.`)
    return parsed
  }
  if (field.type === "array") {
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean)
    return String(value ?? "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean)
  }
  if (field.type === "json") {
    if (typeof value === "object" && value !== null) return value
    try {
      return JSON.parse(String(value || "{}"))
    } catch {
      throw new Error(`${field.labelEn} contains invalid JSON.`)
    }
  }
  if (field.type === "datetime") return value ? new Date(String(value)).toISOString() : null
  const stringValue = String(value ?? "").trim()
  if (field.required && !stringValue) throw new Error(`${field.labelEn} is required.`)
  if (field.type === "url" && stringValue && !z.url().safeParse(stringValue).success) throw new Error(`${field.labelEn} must be a valid URL.`)
  if (field.key === "slug" && stringValue && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stringValue)) throw new Error("Slug must contain lowercase letters, numbers and hyphens only.")
  return stringValue || null
}

async function logActivity(action: string, entity: string, entityId?: string) {
  const supabase = await createClient()
  await supabase.from("dashboard_activity").insert({ action, entity_type: entity, entity_id: entityId ?? null })
}

export async function saveEntity(input: unknown) {
  const user = await requireDashboardUser()
  const parsed = payloadSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid request." }
  const { entity, id, values, fixedValues } = parsed.data
  const config = entityConfigs[entity]
  const data: Record<string, unknown> = { ...fixedValues }
  try {
    for (const field of config.fields) {
      const value = normalize(field, values[field.key])
      if (value !== undefined) data[field.key] = value
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Validation failed." }
  }

  const supabase = await createClient()
  const idField = config.idField ?? "id"
  const query = id
    ? supabase.from(config.name).update(data).eq(idField, id).select(idField).single()
    : supabase.from(config.name).insert(data).select(idField).single()
  const { data: saved, error } = await query
  if (error) return { ok: false, message: error.message }
  const savedRow = saved as unknown as Record<string, unknown> | null
  const savedId = String(savedRow?.[idField] ?? id ?? "")
  await logActivity(id ? "updated" : "created", entity, savedId)
  revalidatePath("/", "layout")
  return { ok: true, message: id ? "Saved successfully" : "Created successfully", id: savedId, actor: user.id }
}

export async function deleteEntity(input: unknown) {
  await requireDashboardUser()
  const parsed = z.object({ entity: z.enum(entityNames), id: z.union([z.uuid(), z.string().min(1)]) }).safeParse(input)
  if (!parsed.success) return { ok: false, message: "Invalid request." }
  const { entity, id } = parsed.data
  const config = entityConfigs[entity]
  if (config.allowDelete === false) return { ok: false, message: "This record cannot be deleted here." }
  const supabase = await createClient()

  if (entity === "blog_categories") {
    const { count } = await supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("category_id", id)
    if (count) return { ok: false, message: "Reassign articles before deleting this category." }
  }

  const { error } = await supabase.from(config.name).delete().eq(config.idField ?? "id", id)
  if (error) return { ok: false, message: error.message }
  await logActivity("deleted", entity, id)
  revalidatePath("/", "layout")
  return { ok: true, message: "Deleted successfully" }
}
