"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePreferences } from "@/components/preferences-provider"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ConfirmDialog, Modal } from "@/components/ui/modal"
import { deleteEntity, saveEntity } from "@/features/entities/actions"
import type { EntityConfig, EntityField } from "@/lib/entities"
import { cn, formatDate } from "@/lib/utils"

type Row = Record<string, unknown>

const columnLabels: Record<string, [string, string]> = {
  number: ["الرقم", "Number"], title_ar: ["العنوان", "Title"], name_ar: ["الاسم", "Name"], name_en: ["الاسم الإنجليزي", "English name"],
  name: ["الاسم", "Name"], role_ar: ["الدور", "Role"], role_en: ["الدور الإنجليزي", "English role"], type: ["النوع", "Type"], client_name: ["العميل", "Client"],
  category: ["التصنيف", "Category"], year: ["السنة", "Year"], step_number: ["الخطوة", "Step"], image_url: ["الصورة", "Image"], caption_ar: ["التعليق", "Caption"],
  is_active: ["الحالة", "Status"], is_published: ["النشر", "Published"], is_featured: ["مميز", "Featured"], is_public: ["عام", "Public"], sort_order: ["الترتيب", "Order"],
  key: ["المفتاح", "Key"], description: ["الوصف", "Description"], updated_at: ["آخر تحديث", "Updated"], created_at: ["أضيف", "Created"],
}

function initialForm(config: EntityConfig, row?: Row) {
  return Object.fromEntries(
    config.fields.map((field) => {
      const value = row?.[field.key] ?? field.defaultValue ?? (field.type === "boolean" ? false : "")
      return [field.key, field.type === "json" ? JSON.stringify(value, null, 2) : field.type === "array" && Array.isArray(value) ? value.join(", ") : value]
    }),
  )
}

function displayValue(key: string, value: unknown, locale: "ar" | "en") {
  if (typeof value === "boolean") return <Badge tone={value ? "success" : "neutral"}>{value ? (locale === "ar" ? "نعم" : "Yes") : (locale === "ar" ? "لا" : "No")}</Badge>
  if (key.endsWith("_at") && typeof value === "string") return formatDate(value, locale === "ar" ? "ar-EG" : "en-GB")
  if (Array.isArray(value)) return value.join(", ") || "—"
  if (value && typeof value === "object") return <span className="font-mono text-xs text-[var(--muted)]">JSON</span>
  const text = value === null || value === undefined || value === "" ? "—" : String(value)
  return <span className="block max-w-[260px] truncate" title={text}>{text}</span>
}

function Field({ field, value, onChange, locale }: { field: EntityField; value: unknown; onChange: (value: unknown) => void; locale: "ar" | "en" }) {
  const label = locale === "ar" ? field.labelAr : field.labelEn
  if (field.type === "boolean") {
    return (
      <label className="flex min-h-12 items-center justify-between gap-3 rounded-[7px] border px-3">
        <span className="text-sm font-semibold">{label}</span>
        <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
      </label>
    )
  }
  if (field.type === "select") {
    return (
      <label className={cn("block", field.wide && "md:col-span-2")}>
        <span className="mb-1.5 block text-sm font-semibold">{label}{field.required ? " *" : ""}</span>
        <select className="field" value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}>
          {field.options?.map((option) => <option key={option.value} value={option.value}>{locale === "ar" ? option.labelAr : option.labelEn}</option>)}
        </select>
      </label>
    )
  }
  const textarea = field.type === "textarea" || field.type === "json"
  return (
    <label className={cn("block", field.wide && "md:col-span-2")}>
      <span className="mb-1.5 flex items-center justify-between gap-3 text-sm font-semibold">
        <span>{label}{field.required ? " *" : ""}</span>
        {typeof value === "string" && ["seo_title", "seo_description"].includes(field.key) ? <small className="font-normal text-[var(--muted)]">{value.length}</small> : null}
      </span>
      {textarea ? (
        <textarea className={cn("field", field.type === "json" && "min-h-44 font-mono text-xs")} dir={field.dir} required={field.required} readOnly={field.readonly} placeholder={field.placeholder} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="field" dir={field.dir} type={field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "datetime" ? "datetime-local" : "text"} required={field.required} readOnly={field.readonly} placeholder={field.placeholder} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

export function EntityManager({
  initialRows,
  config,
  fixedValues,
  overrideTitle,
}: {
  initialRows: Row[]
  config: EntityConfig
  fixedValues?: Record<string, string | number | boolean>
  overrideTitle?: { ar: string; en: string }
}) {
  const { locale } = usePreferences()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState<Row | "new" | null>(null)
  const [deleting, setDeleting] = useState<Row | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>(() => initialForm(config))
  const [pending, startTransition] = useTransition()
  const idField = config.idField ?? "id"

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) return initialRows
    return initialRows.filter((row) => config.searchKeys.some((key) => String(row[key] ?? "").toLocaleLowerCase().includes(needle)))
  }, [config.searchKeys, initialRows, query])

  const open = (row?: Row) => {
    setEditing(row ?? "new")
    setForm(initialForm(config, row))
  }

  const save = () => startTransition(async () => {
    const result = await saveEntity({ entity: config.name, id: editing && editing !== "new" ? String(editing[idField]) : undefined, values: form, fixedValues })
    if (!result.ok) { toast.error(result.message); return }
    toast.success(locale === "ar" ? "تم الحفظ بنجاح" : result.message)
    setEditing(null)
    router.refresh()
  })

  const remove = () => {
    if (!deleting) return
    startTransition(async () => {
      const result = await deleteEntity({ entity: config.name, id: String(deleting[idField]) })
      if (!result.ok) { toast.error(result.message); return }
      toast.success(locale === "ar" ? "تم الحذف" : result.message)
      setDeleting(null)
      router.refresh()
    })
  }

  const title = overrideTitle ? (locale === "ar" ? overrideTitle.ar : overrideTitle.en) : (locale === "ar" ? config.titleAr : config.titleEn)
  return (
    <>
      <PageHeader
        eyebrow="Sharks CMS"
        title={title}
        description={locale === "ar" ? config.descriptionAr : config.descriptionEn}
        actions={config.allowCreate === false ? undefined : <Button onClick={() => open()}><Icon name="plus" size={18} />{locale === "ar" ? `إضافة ${config.singularAr}` : `Add ${config.singularEn}`}</Button>}
      />

      <section className="surface overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Icon name="search" size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input className="field ps-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "ar" ? "بحث…" : "Search…"} />
          </div>
          <span className="text-sm text-[var(--muted)]">{filtered.length} {locale === "ar" ? "عنصر" : "items"}</span>
        </div>

        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-[var(--surface-subtle)] text-start text-xs text-[var(--muted)]">
                <tr>{config.columns.map((column) => <th key={column} className="px-4 py-3 text-start font-semibold">{columnLabels[column]?.[locale === "ar" ? 0 : 1] ?? column}</th>)}<th className="px-4 py-3 text-end font-semibold">{locale === "ar" ? "إجراءات" : "Actions"}</th></tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((row) => (
                  <tr key={String(row[idField])} className="hover:bg-[var(--surface-subtle)]">
                    {config.columns.map((column) => <td key={column} className="px-4 py-3.5">{displayValue(column, row[column], locale)}</td>)}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {config.detailsHref ? <Link className="inline-flex h-9 items-center gap-1 rounded-[6px] px-2 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-soft)]" href={config.detailsHref.replace("{id}", String(row[idField]))}>{locale === "ar" ? config.detailsLabelAr : config.detailsLabelEn}</Link> : null}
                        <Button variant="ghost" size="icon" onClick={() => open(row)} aria-label="Edit"><Icon name="edit" size={17} /></Button>
                        {config.allowDelete === false ? null : <Button variant="ghost" size="icon" className="hover:text-[var(--danger)]" onClick={() => setDeleting(row)} aria-label="Delete"><Icon name="delete" size={17} /></Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div><span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]"><Icon name={config.icon} size={23} /></span><h2 className="mt-4 font-bold">{locale === "ar" ? `لا توجد ${config.titleAr} حتى الآن.` : `No ${config.titleEn.toLowerCase()} yet.`}</h2><p className="mt-2 text-sm text-[var(--muted)]">{locale === "ar" ? "ابدأ عندما تصبح البيانات الحقيقية جاهزة." : "Start when verified content is ready."}</p>{config.allowCreate === false ? null : <Button className="mt-5" onClick={() => open()}><Icon name="plus" size={18} />{locale === "ar" ? `إضافة ${config.singularAr}` : `Add ${config.singularEn}`}</Button>}</div>
          </div>
        )}
      </section>

      <Modal open={editing !== null} onClose={() => !pending && setEditing(null)} title={editing === "new" ? (locale === "ar" ? `إضافة ${config.singularAr}` : `Add ${config.singularEn}`) : (locale === "ar" ? `تعديل ${config.singularAr}` : `Edit ${config.singularEn}`)} description={locale === "ar" ? "الحقول العربية تُكتب من اليمين، والإنجليزية من اليسار." : "Arabic fields preserve RTL; English fields preserve LTR."} width="max-w-4xl">
        <form className="grid gap-5 p-5 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); save() }}>
          {config.fields.map((field) => <Field key={field.key} field={field} locale={locale} value={form[field.key]} onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))} />)}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex justify-end gap-2 border-t bg-[var(--surface)] px-5 py-4 md:col-span-2">
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={pending}>{locale === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button type="submit" disabled={pending}>{pending ? (locale === "ar" ? "جارٍ الحفظ…" : "Saving…") : (locale === "ar" ? "حفظ التغييرات" : "Save changes")}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title={locale === "ar" ? "تأكيد الحذف" : "Confirm deletion"} description={locale === "ar" ? "لن يتم تنفيذ الحذف حتى تؤكد. قد تمنع قاعدة البيانات الحذف إذا كان العنصر مستخدمًا." : "Nothing is deleted until you confirm. Referenced records may be protected."} confirmLabel={locale === "ar" ? "حذف" : "Delete"} busy={pending} onConfirm={remove} />
    </>
  )
}
