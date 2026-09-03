"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { usePreferences } from "@/components/preferences-provider"
import { Button } from "@/components/ui/button"
import { Icon, type IconName } from "@/components/ui/icon"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import type { DashboardUser } from "@/lib/auth"

type NavItem = { href: string; ar: string; en: string; icon: IconName; ownerOnly?: boolean }
type NavGroup = { ar: string; en: string; items: NavItem[] }

const groups: NavGroup[] = [
  { ar: "", en: "", items: [{ href: "/", ar: "الرئيسية", en: "Overview", icon: "dashboard" }] },
  {
    ar: "المحتوى", en: "Content", items: [
      { href: "/website-content", ar: "محتوى الموقع", en: "Website Content", icon: "content" },
      { href: "/services", ar: "الخدمات", en: "Services", icon: "services" },
      { href: "/scenarios", ar: "السيناريوهات", en: "Scenarios", icon: "scenarios" },
      { href: "/blog", ar: "المدونة", en: "Blog", icon: "blog" },
      { href: "/projects", ar: "المشاريع", en: "Projects", icon: "projects" },
    ],
  },
  {
    ar: "الشركة", en: "Company", items: [
      { href: "/partners", ar: "الشركاء والعملاء", en: "Partners & Clients", icon: "partners" },
      { href: "/team", ar: "الفريق", en: "Team", icon: "team" },
    ],
  },
  { ar: "الوسائط", en: "Media", items: [{ href: "/media", ar: "مكتبة الوسائط", en: "Media Library", icon: "media" }] },
  {
    ar: "الموقع", en: "Website", items: [
      { href: "/website/seo", ar: "تحسين الظهور", en: "SEO", icon: "seo" },
      { href: "/website/contact", ar: "معلومات التواصل", en: "Contact Info", icon: "contact" },
      { href: "/website/social", ar: "روابط التواصل", en: "Social Links", icon: "social" },
    ],
  },
  {
    ar: "الإعدادات", en: "Settings", items: [
      { href: "/settings/access", ar: "الوصول والمستخدمون", en: "Access & Users", icon: "access" },
      { href: "/settings/account", ar: "الحساب", en: "Account", icon: "account" },
    ],
  },
]

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardShell({ user, children }: { user: DashboardUser; children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, theme, setLocale, setTheme } = usePreferences()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  useEffect(() => {
    queueMicrotask(() =>
      setCollapsed(localStorage.getItem("sharks-dashboard-sidebar") === "collapsed"),
    )
  }, [])

  const toggleSidebar = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("sharks-dashboard-sidebar", next ? "collapsed" : "open")
  }

  const sidebar = (
    <aside className={cn("flex h-full flex-col border-e bg-[#0f1628] text-white transition-[width] duration-200", collapsed ? "w-[82px]" : "w-[264px]")}>
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <span className="grid size-9 shrink-0 place-items-center bg-white font-black text-[#0f1628] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]">S</span>
          {!collapsed ? <span><strong className="block text-sm tracking-[0.16em]">SHARKS</strong><small className="text-[9px] tracking-[0.2em] text-white/50">DASHBOARD</small></span> : null}
        </Link>
        {!collapsed ? <Button variant="ghost" size="icon" className="text-white/60 hover:bg-white/10 hover:text-white" onClick={toggleSidebar} aria-label="Collapse sidebar"><span className="text-lg">‹</span></Button> : null}
      </div>

      <nav className="fine-scrollbar flex-1 overflow-y-auto px-3 py-5">
        {collapsed ? <Button variant="ghost" size="icon" className="mx-auto mb-4 text-white/70 hover:bg-white/10 hover:text-white" onClick={toggleSidebar} aria-label="Expand sidebar"><span className="text-lg">›</span></Button> : null}
        <div className="space-y-5">
          {groups.map((group, index) => (
            <section key={`${group.en}-${index}`}>
              {!collapsed && group.en ? <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{locale === "ar" ? group.ar : group.en}</p> : null}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? (locale === "ar" ? item.ar : item.en) : undefined}
                      className={cn(
                        "relative flex h-11 items-center gap-3 rounded-[7px] px-3 text-sm font-semibold text-white/65 transition-colors hover:bg-white/[0.07] hover:text-white",
                        active && "bg-[#007fff] text-white hover:bg-[#007fff]",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Icon name={item.icon} size={20} />
                      {!collapsed ? <span className="truncate">{locale === "ar" ? item.ar : item.en}</span> : null}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className={cn("flex items-center gap-3 rounded-[7px] p-2", collapsed && "justify-center")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#007fff] text-xs font-black">{user.fullName.slice(0, 2).toUpperCase()}</span>
          {!collapsed ? <span className="min-w-0"><strong className="block truncate text-xs">{user.fullName}</strong><small className="text-[10px] uppercase tracking-wider text-white/45">{user.role}</small></span> : null}
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 start-0 z-40 hidden lg:block">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-[#02040a]/60" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 start-0">{sidebar}</div>
        </div>
      ) : null}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:ps-[82px]" : "lg:ps-[264px]")}>
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-2">
            <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Icon name="menu" /></Button>
            <div className="hidden items-center gap-2 text-sm text-[var(--muted)] sm:flex"><span>Sharks</span><span>/</span><strong className="text-[var(--foreground)]">{pathname === "/" ? (locale === "ar" ? "الرئيسية" : "Overview") : pathname.split("/").filter(Boolean).at(-1)}</strong></div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label="Switch language"><Icon name="language" /><span className="sr-only">Language</span></Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark")} aria-label="Switch theme"><Icon name={theme === "dark" ? "moon" : "sun"} /></Button>
            <div className="relative ms-1">
              <button className="grid size-9 place-items-center rounded-full bg-[#0f1628] text-xs font-black text-white" onClick={() => setUserOpen((value) => !value)} aria-label="User menu">{user.fullName.slice(0, 2).toUpperCase()}</button>
              {userOpen ? (
                <div className="surface absolute end-0 top-12 w-60 p-2">
                  <div className="border-b px-3 py-2"><strong className="block truncate text-sm">{user.fullName}</strong><span className="block truncate text-xs text-[var(--muted)]" dir="ltr">{user.email}</span></div>
                  <Link className="mt-1 flex h-10 items-center gap-2 rounded-[6px] px-3 text-sm hover:bg-[var(--surface-subtle)]" href="/settings/account"><Icon name="account" size={18} />{locale === "ar" ? "الحساب" : "Account"}</Link>
                  <button className="flex h-10 w-full items-center gap-2 rounded-[6px] px-3 text-sm text-[var(--danger)] hover:bg-red-500/10" onClick={async () => { await createClient().auth.signOut(); router.replace("/login"); router.refresh() }}><Icon name="logout" size={18} />{locale === "ar" ? "تسجيل الخروج" : "Sign out"}</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
