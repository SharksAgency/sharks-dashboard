import "server-only"
import type { EntityName } from "@/lib/entities"
import { entityConfigs } from "@/lib/entities"
import { createClient } from "@/lib/supabase/server"

export async function getEntityRows(entity: EntityName, filter?: { column: string; value: string }, keys?: string[]) {
  const config = entityConfigs[entity]
  const supabase = await createClient()
  let query = supabase.from(entity).select("*")
  if (filter) query = query.eq(filter.column, filter.value)
  if (keys?.length && entity === "site_settings") query = query.in("key", keys)
  const { data, error } = await query.order(config.orderBy, { ascending: config.orderAscending ?? true }).limit(500)
  if (error) throw new Error(`Unable to load ${entity}: ${error.message}`)
  return (data ?? []) as Record<string, unknown>[]
}
