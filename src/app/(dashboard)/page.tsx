import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Icon, type IconName } from "@/components/ui/icon"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

const metrics: { table: string; filter?: [string, string | boolean]; label: string; icon: IconName }[] = [
  { table: "blog_posts", filter: ["status", "published"], label: "المقالات المنشورة", icon: "blog" },
  { table: "blog_posts", filter: ["status", "draft"], label: "المسودات", icon: "content" },
  { table: "services", filter: ["is_active", true], label: "الخدمات النشطة", icon: "services" },
  { table: "scenarios", filter: ["is_published", true], label: "السيناريوهات", icon: "scenarios" },
  { table: "projects", filter: ["is_published", true], label: "المشاريع", icon: "projects" },
  { table: "team_members", filter: ["is_active", true], label: "أعضاء الفريق", icon: "team" },
  { table: "partners", filter: ["is_active", true], label: "الشركاء والعملاء", icon: "partners" },
]

export default async function OverviewPage() {
  const supabase = await createClient()
  const counts = await Promise.all(metrics.map(async (metric) => {
    let query = supabase.from(metric.table).select("*", { count: "exact", head: true })
    if (metric.filter) query = query.eq(metric.filter[0], metric.filter[1])
    const { count } = await query
    return count ?? 0
  }))
  const { data: activity } = await supabase.from("dashboard_activity").select("id,action,entity_type,created_at").order("created_at", { ascending: false }).limit(6)

  const quickActions = [
    ["مقال جديد", "/blog/new", "blog"], ["سيناريو", "/scenarios", "scenarios"], ["مشروع", "/projects", "projects"], ["عضو فريق", "/team", "team"],
  ] as const

  return (
    <>
      <PageHeader eyebrow="Control center" title="صباح الإبداع." description="لقطة تشغيلية حقيقية للمحتوى المنشور والعمل الجاري في Sharks Agency." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article key={`${metric.table}-${index}`} className="surface p-5">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--muted)]">{metric.label}</span><span className="grid size-9 place-items-center rounded-[7px] bg-[var(--primary-soft)] text-[var(--primary)]"><Icon name={metric.icon} size={19} /></span></div>
            <strong className="mt-5 block text-3xl font-black tabular-nums">{counts[index]}</strong>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="surface overflow-hidden">
          <header className="border-b px-5 py-4"><h2 className="font-bold">آخر النشاطات</h2><p className="mt-1 text-xs text-[var(--muted)]">Recent activity</p></header>
          {activity?.length ? <div className="divide-y">{activity.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4 text-sm"><div><strong className="capitalize">{item.action}</strong><span className="mx-2 text-[var(--muted)]">·</span><span>{item.entity_type}</span></div><time className="text-xs text-[var(--muted)]">{formatDate(item.created_at)}</time></div>)}</div> : <div className="grid min-h-56 place-items-center p-6 text-center text-sm text-[var(--muted)]">سيظهر سجل النشاط هنا بعد أول تعديل.</div>}
        </section>
        <section className="surface p-5"><h2 className="font-bold">إجراءات سريعة</h2><div className="mt-4 grid gap-2">{quickActions.map(([label, href, icon]) => <Link key={href} href={href} className="flex h-12 items-center gap-3 rounded-[7px] border px-3 text-sm font-semibold transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]"><Icon name={icon} size={19} className="text-[var(--primary)]" /><span>+ {label}</span></Link>)}</div></section>
      </div>
    </>
  )
}
