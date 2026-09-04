"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ConfirmDialog } from "@/components/ui/modal"
import { blogPostAction } from "@/features/blog/actions"
import { formatDate } from "@/lib/utils"
import { getPublicSiteUrl } from "@/lib/urls"

type Post = Record<string, unknown> & { id: string; slug: string; title_ar: string; status: string; is_featured: boolean; author_name: string; published_at: string | null; updated_at: string; category_id: string | null }
type Category = { id: string; name_ar: string; name_en: string }

export function BlogList({ posts, categories }: { posts: Post[]; categories: Category[] }) {
  const router = useRouter()
  const publicSiteUrl = getPublicSiteUrl()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [category, setCategory] = useState("all")
  const [deleting, setDeleting] = useState<Post | null>(null)
  const categoryMap = new Map(categories.map((item) => [item.id, item.name_ar]))
  const filtered = useMemo(() => posts.filter((post) => {
    const matchesQuery = !query || `${post.title_ar} ${post.slug} ${post.author_name}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === "all" || post.status === status) && (category === "all" || post.category_id === category)
  }), [posts, query, status, category])

  const run = (id: string, action: "publish" | "unpublish" | "archive" | "duplicate" | "delete") => startTransition(async () => {
    const result = await blogPostAction({ id, action })
    if (!result.ok) toast.error(result.message)
    else { toast.success(result.message); setDeleting(null); router.refresh() }
  })

  return (
    <>
      <PageHeader eyebrow="Sharks Journal" title="المدونة" description="إدارة المقالات، المسودات، النشر والتصنيفات من مساحة تحرير واحدة." actions={<><Link className="inline-flex h-11 items-center gap-2 rounded-[7px] border px-4 text-sm font-semibold" href="/blog/categories">التصنيفات</Link><Link className="inline-flex h-11 items-center gap-2 rounded-[7px] bg-[var(--primary)] px-4 text-sm font-semibold text-white" href="/blog/new"><Icon name="plus" size={18} />مقال جديد</Link></>} />
      <section className="surface overflow-hidden">
        <div className="grid gap-3 border-b p-4 md:grid-cols-[minmax(220px,1fr)_180px_210px_auto]">
          <div className="relative"><Icon name="search" size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" /><input className="field ps-10" placeholder="بحث في المقالات…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <select className="field" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">كل الحالات</option><option value="published">منشور</option><option value="draft">مسودة</option><option value="archived">مؤرشف</option></select>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">كل التصنيفات</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name_ar}</option>)}</select>
          <span className="self-center text-sm text-[var(--muted)]">{filtered.length} مقال</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm"><thead className="bg-[var(--surface-subtle)] text-xs text-[var(--muted)]"><tr><th className="px-4 py-3 text-start">العنوان</th><th className="px-4 py-3 text-start">التصنيف</th><th className="px-4 py-3 text-start">الحالة</th><th className="px-4 py-3 text-start">الكاتب</th><th className="px-4 py-3 text-start">التاريخ</th><th className="px-4 py-3 text-end">إجراءات</th></tr></thead><tbody className="divide-y">
            {filtered.map((post) => <tr key={post.id} className="hover:bg-[var(--surface-subtle)]"><td className="px-4 py-4"><strong className="block max-w-sm truncate">{post.title_ar}</strong><span className="text-xs text-[var(--muted)]" dir="ltr">/{post.slug}</span></td><td className="px-4 py-4">{post.category_id ? categoryMap.get(post.category_id) || "—" : "—"}</td><td className="px-4 py-4"><div className="flex gap-1"><Badge tone={post.status === "published" ? "success" : post.status === "archived" ? "warning" : "neutral"}>{post.status}</Badge>{post.is_featured ? <Badge tone="info">مميز</Badge> : null}</div></td><td className="px-4 py-4">{post.author_name}</td><td className="px-4 py-4 text-[var(--muted)]">{formatDate(post.published_at || post.updated_at)}</td><td className="px-4 py-4"><div className="flex justify-end gap-1">{publicSiteUrl ? <a className="inline-flex size-9 items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]" href={`${publicSiteUrl}/blog/${post.slug}`} target="_blank" rel="noreferrer" title="Preview"><Icon name="external" size={17} /></a> : null}<Link className="inline-flex size-9 items-center justify-center rounded-[6px] text-[var(--muted)] hover:bg-[var(--surface-subtle)]" href={`/blog/${post.id}/edit`} title="Edit"><Icon name="edit" size={17} /></Link><Button variant="ghost" size="icon" onClick={() => run(post.id, "duplicate")} disabled={pending} title="Duplicate"><Icon name="copy" size={17} /></Button>{post.status === "published" ? <Button variant="ghost" size="sm" onClick={() => run(post.id, "unpublish")} disabled={pending}>إلغاء النشر</Button> : <Button variant="ghost" size="sm" onClick={() => run(post.id, "publish")} disabled={pending}>نشر</Button>}<Button variant="ghost" size="icon" className="hover:text-[var(--danger)]" onClick={() => setDeleting(post)}><Icon name="delete" size={17} /></Button></div></td></tr>)}
          </tbody></table>
          {!filtered.length ? <div className="grid min-h-64 place-items-center text-sm text-[var(--muted)]">لا توجد مقالات تطابق البحث.</div> : null}
        </div>
      </section>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="حذف المقال؟" description="سيُحذف المقال نهائيًا بعد التأكيد. يمكنك أرشفته بدلًا من ذلك إذا أردت الاحتفاظ به." confirmLabel="حذف المقال" busy={pending} onConfirm={() => deleting && run(deleting.id, "delete")} />
    </>
  )
}
