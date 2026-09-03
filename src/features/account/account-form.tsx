"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePreferences } from "@/components/preferences-provider"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/lib/auth"

export function AccountForm({ user, profile }: { user: DashboardUser; profile: { full_name: string; avatar_url: string | null; preferred_language: string | null } | null }) {
  const router = useRouter()
  const { locale, setLocale } = usePreferences()
  const [name, setName] = useState(profile?.full_name || user.fullName)
  const [avatar, setAvatar] = useState(profile?.avatar_url || "")
  const [language, setLanguage] = useState<"ar" | "en">(profile?.preferred_language === "en" ? "en" : locale)
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    const { error } = await createClient().rpc("update_dashboard_profile", { p_full_name: name, p_avatar_url: avatar || null, p_preferred_language: language })
    setBusy(false)
    if (error) toast.error(error.message)
    else { setLocale(language); toast.success("تم تحديث الحساب"); router.refresh() }
  }
  const updatePassword = async () => {
    if (password.length < 8) { toast.error("استخدم 8 أحرف على الأقل"); return }
    setBusy(true)
    const { error } = await createClient().auth.updateUser({ password })
    setBusy(false)
    if (error) toast.error(error.message)
    else { setPassword(""); toast.success("تم تحديث كلمة المرور") }
  }

  return (
    <>
      <PageHeader eyebrow="Profile" title="الحساب" description="بياناتك الشخصية وتفضيلات لغة لوحة التحكم وأمان الحساب." />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <section className="surface space-y-4 p-5"><h2 className="font-bold">الملف الشخصي</h2><label className="block"><span className="mb-1.5 block text-sm font-semibold">الاسم</span><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">البريد</span><input className="field" dir="ltr" value={user.email} readOnly /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">رابط الصورة</span><input className="field" dir="ltr" value={avatar} onChange={(e) => setAvatar(e.target.value)} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">اللغة</span><select className="field" value={language} onChange={(e) => setLanguage(e.target.value as "ar" | "en")}><option value="ar">العربية</option><option value="en">English</option></select></label><div className="flex items-center justify-between"><span className="text-sm text-[var(--muted)]">Role: {user.role}</span><Button disabled={busy} onClick={save}>حفظ الملف</Button></div></section>
        <section className="surface h-fit space-y-4 p-5"><h2 className="font-bold">كلمة المرور</h2><p className="text-sm leading-7 text-[var(--muted)]">يتم حفظ كلمة المرور وإدارتها بالكامل عبر Supabase Auth ولا تظهر لمسؤولي اللوحة.</p><label className="block"><span className="mb-1.5 block text-sm font-semibold">كلمة مرور جديدة</span><input className="field" dir="ltr" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></label><Button variant="secondary" disabled={busy || !password} onClick={updatePassword}>تحديث كلمة المرور</Button></section>
      </div>
    </>
  )
}
