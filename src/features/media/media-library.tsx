"use client"

import Image from "next/image"
import { useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ConfirmDialog, Modal } from "@/components/ui/modal"
import { deleteMedia, saveMediaAlt } from "@/features/media/actions"
import { createClient } from "@/lib/supabase/client"
import { formatDate, mediaUrl } from "@/lib/utils"

type Asset = { id: string; bucket: string; path: string; filename: string; mime_type: string | null; size: number | null; alt_text_ar: string; alt_text_en: string | null; created_at: string }
const folders = ["general", "blog", "projects", "scenarios", "services", "partners", "team"]

export function MediaLibrary({ assets, userId }: { assets: Asset[]; userId: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [folder, setFolder] = useState("all")
  const [uploadFolder, setUploadFolder] = useState("general")
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState<Asset | null>(null)
  const [deleting, setDeleting] = useState<Asset | null>(null)
  const [altAr, setAltAr] = useState("")
  const [altEn, setAltEn] = useState("")
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(() => assets.filter((asset) => (!query || `${asset.filename} ${asset.alt_text_ar} ${asset.path}`.toLowerCase().includes(query.toLowerCase())) && (folder === "all" || asset.path.startsWith(`${folder}/`))), [assets, query, folder])

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"])
    setUploading(true)
    const supabase = createClient()
    for (const file of Array.from(files)) {
      if (!allowed.has(file.type) || file.size > 15 * 1024 * 1024) { toast.error(`${file.name}: unsupported type or larger than 15 MB`); continue }
      const clean = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-")
      const path = `${uploadFolder}/${Date.now()}-${clean}`
      const { error } = await supabase.storage.from("website-media").upload(path, file, { cacheControl: "31536000", upsert: false })
      if (error) { toast.error(error.message); continue }
      const { error: metadataError } = await supabase.from("media_assets").insert({ bucket: "website-media", path, filename: file.name, mime_type: file.type, size: file.size, uploaded_by: userId })
      if (metadataError) toast.error(metadataError.message)
      else toast.success(`${file.name} uploaded`)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
    router.refresh()
  }

  const saveAlt = () => editing && startTransition(async () => {
    const result = await saveMediaAlt({ id: editing.id, alt_text_ar: altAr, alt_text_en: altEn })
    if (!result.ok) toast.error(result.message)
    else { toast.success("تم حفظ النص البديل"); setEditing(null); router.refresh() }
  })
  const remove = () => deleting && startTransition(async () => {
    const result = await deleteMedia({ id: deleting.id })
    if (!result.ok) toast.error(result.message)
    else { toast.success("تم حذف الملف"); setDeleting(null); router.refresh() }
  })

  return (
    <>
      <PageHeader eyebrow="Supabase Storage" title="مكتبة الوسائط" description="ملفات الموقع داخل حاوية website-media مع بيانات بديلة قابلة للتحرير وحذف آمن للمراجع المعروفة." actions={<><select className="field !w-auto" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>{folders.map((item) => <option key={item} value={item}>{item}</option>)}</select><input ref={inputRef} className="hidden" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml" onChange={(e) => upload(e.target.files)} /><Button onClick={() => inputRef.current?.click()} disabled={uploading}><Icon name="upload" size={18} />{uploading ? "جارٍ الرفع…" : "رفع ملفات"}</Button></>} />
      {uploading ? <div className="mb-4 h-1 overflow-hidden rounded-full bg-[var(--primary-soft)]"><div className="h-full w-1/2 animate-pulse bg-[var(--primary)]" /></div> : null}
      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row"><div className="relative flex-1"><Icon name="search" size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" /><input className="field ps-10" placeholder="بحث بالاسم أو النص البديل…" value={query} onChange={(e) => setQuery(e.target.value)} /></div><select className="field md:max-w-52" value={folder} onChange={(e) => setFolder(e.target.value)}><option value="all">كل المجلدات</option>{folders.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
        {filtered.length ? <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{filtered.map((asset) => <article key={asset.id} className="overflow-hidden rounded-[8px] border"><div className="relative aspect-[4/3] bg-[var(--surface-subtle)]"><Image src={mediaUrl(asset.path)} alt={asset.alt_text_ar || asset.filename} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" unoptimized={asset.mime_type === "image/svg+xml"} /></div><div className="p-3"><strong className="block truncate text-sm" dir="ltr" title={asset.filename}>{asset.filename}</strong><p className="mt-1 truncate text-xs text-[var(--muted)]" dir="ltr">{asset.path}</p><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-[var(--muted)]">{asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : "—"} · {formatDate(asset.created_at)}</span><div className="flex"><Button variant="ghost" size="icon" onClick={async () => { await navigator.clipboard.writeText(mediaUrl(asset.path)); toast.success("URL copied") }} title="Copy URL"><Icon name="copy" size={16} /></Button><Button variant="ghost" size="icon" onClick={() => { setEditing(asset); setAltAr(asset.alt_text_ar); setAltEn(asset.alt_text_en || "") }} title="Edit alt text"><Icon name="edit" size={16} /></Button><Button variant="ghost" size="icon" className="hover:text-[var(--danger)]" onClick={() => setDeleting(asset)} title="Delete"><Icon name="delete" size={16} /></Button></div></div></div></article>)}</div> : <div className="grid min-h-72 place-items-center p-8 text-center"><div><Icon name="image" size={34} className="mx-auto text-[var(--primary)]" /><h2 className="mt-3 font-bold">لا توجد ملفات مطابقة.</h2><p className="mt-1 text-sm text-[var(--muted)]">ارفع صورة حقيقية أو غيّر عوامل البحث.</p></div></div>}
      </section>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="تحرير النص البديل" width="max-w-lg"><div className="space-y-4 p-5"><label className="block"><span className="mb-1.5 block text-sm font-semibold">النص البديل العربي</span><input className="field" dir="rtl" value={altAr} onChange={(e) => setAltAr(e.target.value)} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">English alt text</span><input className="field" dir="ltr" value={altEn} onChange={(e) => setAltEn(e.target.value)} /></label><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>إلغاء</Button><Button onClick={saveAlt} disabled={pending}>حفظ</Button></div></div></Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="حذف الملف؟" description="سيفحص النظام المراجع المباشرة المعروفة أولًا. لن يُحذف ملف مستخدم في غلاف أو صورة محتوى معروفة." confirmLabel="حذف الملف" busy={pending} onConfirm={remove} />
    </>
  )
}
