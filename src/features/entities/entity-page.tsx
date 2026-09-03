import { EntityManager } from "@/features/entities/entity-manager"
import { getEntityRows } from "@/features/entities/queries"
import { entityConfigs, type EntityName } from "@/lib/entities"

export async function EntityPage({
  entity,
  filter,
  fixedValues,
  keys,
  overrideTitle,
}: {
  entity: EntityName
  filter?: { column: string; value: string }
  fixedValues?: Record<string, string | number | boolean>
  keys?: string[]
  overrideTitle?: { ar: string; en: string }
}) {
  const rows = await getEntityRows(entity, filter, keys)
  return <EntityManager initialRows={rows} config={entityConfigs[entity]} fixedValues={fixedValues} overrideTitle={overrideTitle} />
}
