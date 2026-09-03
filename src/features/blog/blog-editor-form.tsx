"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/features/blog/rich-text-editor"
import { saveBlogPost } from "@/features/blog/actions"

type Row = Record<string, unknown>
type Category = { id: string; name_ar: string; name_en: string }

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] }

export function BlogEditorForm({ post, categories }: { post?: Row; categories: Category[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [dirty, setDirty] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({
    id: post?.id, slug: post?.slug ?? "", title_ar: post?.title_ar ?? "", title_en: post?.title_en ?? "", excerpt_ar: post?.excerpt_ar ?? "", excerpt_en: post?.excerpt_en ?? "",
    deck_ar: post?.deck_ar ?? "", deck_en: post?.deck_en ?? "", cover_image_url: post?.cover_image_url ?? "", cover_alt_ar: post?.cover_alt_ar ?? "", cover_alt_en: post?.cover_alt_en ?? "",
    category_id: post?.category_id ?? "", author_name: post?.author_name ?? "Sharks Studio", status: post?.status ?? "draft", is_featured: post?.is_featured ?? false,
    published_at: post?.published_at ? new Date(String(post.published_at)).toISOString().slice(0, 16) : "", reading_time: post?.reading_time ?? 1, content: post?.content ?? emptyDoc,
    related_slugs: Array.isArray(post?.related_slugs) ? post.related_slugs.join(", ") : "", seo_title: post?.seo_title ?? "", seo_description: post?.seo_description ?? "", og_image_url: post?.og_image_url ?? "",
  })
  const set = (key: string, value: unknown) => { setValues((current) => ({ ...current, [key]: value })); setDirty(true) }
  const submit = (status?: string) => startTransition(async () => {
    const result = await saveBlogPost({ ...values, status: status ?? values.status, related_slugs: String(values.related_slugs || "").split(",").map((item) => item.trim()).filter(Boolean), published_at: values.published_at ? new Date(String(values.published_at)).toISOString() : null })
    if (!result.ok) { toast.error(result.message); return }
    toast.success(status === "published" ? "تم نشر المقال" : "تم حفظ المقال")
    setDirty(false)
    router.replace(`/blog/${result.id}/edit`)
    router.refresh()
  })

  return (
    <>
      <PageHeader eyebrow={dirty ? "Unsaved changes" : "Blog editor"} title={post ? "تعديل المقال" : "مقال جديد"} description="محرر منظم ومتوافق مع قارئ المقالات الحالي في موقع Sharks Agency." actions={<><Button variant="secondary" disabled={pending} onClick={() => submit("draft")}>حفظ كمسودة</Button><Button disabled={pending} onClick={() => submit("published")}>نشر المقال</Button></>} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="surface grid gap-5 p-5 md:grid-cols-2">
            <Field label="العنوان العربي" value={values.title_ar} onChange={(v) => set("title_ar", v)} required dir="rtl" />
            <Field label="English title" value={values.title_en} onChange={(v) => set("title_en", v)} dir="ltr" />
            <Field label="المقتطف العربي" value={values.excerpt_ar} onChange={(v) => set("excerpt_ar", v)} required area dir="rtl" />
            <Field label="English excerpt" value={values.excerpt_en} onChange={(v) => set("excerpt_en", v)} area dir="ltr" />
            <Field label="المقدمة العربية" value={values.deck_ar} onChange={(v) => set("deck_ar", v)} required area dir="rtl" />
            <Field label="English deck" value={values.deck_en} onChange={(v) => set("deck_en", v)} area dir="ltr" />
          </section>
          <section><div className="mb-3"><h2 className="font-bold">المحتوى</h2><p className="text-xs text-[var(--muted)]">Structured TipTap JSON · no arbitrary HTML</p></div><RichTextEditor content={values.content as Record<string, unknown>} onChange={(json) => set("content", json)} /></section>
          <section className="surface grid gap-5 p-5 md:grid-cols-2"><Field label="عنوان SEO" value={values.seo_title} onChange={(v) => set("seo_title", v)} wide /><Field label="وصف SEO" value={values.seo_description} onChange={(v) => set("seo_description", v)} area wide /><Field label="OG image path" value={values.og_image_url} onChange={(v) => set("og_image_url", v)} dir="ltr" wide /></section>
        </div>
        <aside className="space-y-5">
          <section className="surface space-y-4 p-5"><h2 className="font-bold">إعدادات النشر</h2><Field label="Slug" value={values.slug} onChange={(v) => set("slug", v)} required dir="ltr" /><label className="block"><span className="mb-1.5 block text-sm font-semibold">الحالة</span><select className="field" value={String(values.status)} onChange={(e) => set("status", e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">التصنيف</span><select className="field" value={String(values.category_id)} onChange={(e) => set("category_id", e.target.value)}><option value="">غير مصنف</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_ar} / {category.name_en}</option>)}</select></label><Field label="الكاتب" value={values.author_name} onChange={(v) => set("author_name", v)} required /><Field label="تاريخ النشر" value={values.published_at} onChange={(v) => set("published_at", v)} type="datetime-local" dir="ltr" /><Field label="وقت القراءة (دقائق)" value={values.reading_time} onChange={(v) => set("reading_time", v)} type="number" dir="ltr" /><label className="flex items-center justify-between rounded-[7px] border p-3 text-sm font-semibold"><span>مقال مميز</span><input className="size-5 accent-[var(--primary)]" type="checkbox" checked={Boolean(values.is_featured)} onChange={(e) => set("is_featured", e.target.checked)} /></label></section>
          <section className="surface space-y-4 p-5"><h2 className="font-bold">الغلاف</h2><Field label="Cover image path" value={values.cover_image_url} onChange={(v) => set("cover_image_url", v)} required dir="ltr" /><Field label="النص البديل العربي" value={values.cover_alt_ar} onChange={(v) => set("cover_alt_ar", v)} required /><Field label="English alt" value={values.cover_alt_en} onChange={(v) => set("cover_alt_en", v)} dir="ltr" /></section>
          <section className="surface p-5"><Field label="مقالات مرتبطة (slugs)" value={values.related_slugs} onChange={(v) => set("related_slugs", v)} area dir="ltr" wide /></section>
        </aside>
      </div>
    </>
  )
}

function Field({ label, value, onChange, area, required, dir, wide, type = "text" }: { label: string; value: unknown; onChange: (value: string) => void; area?: boolean; required?: boolean; dir?: "rtl" | "ltr"; wide?: boolean; type?: string }) {
  return <label className={wide ? "md:col-span-2" : ""}><span className="mb-1.5 flex justify-between text-sm font-semibold"><span>{label}{required ? " *" : ""}</span>{["عنوان SEO", "وصف SEO"].includes(label) ? <small className="font-normal text-[var(--muted)]">{String(value ?? "").length}</small> : null}</span>{area ? <textarea className="field" dir={dir} required={required} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} /> : <input className="field" dir={dir} required={required} type={type} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />}</label>
}
