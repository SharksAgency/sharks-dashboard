"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault()
        setBusy(true)
        await createClient().auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })
        setBusy(false)
        setSent(true)
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">البريد الإلكتروني / Email</span>
        <input className="field" dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {sent ? <p className="rounded-[7px] bg-emerald-500/10 p-3 text-sm text-emerald-600">إذا كان الحساب موجودًا، ستصلك رسالة الاستعادة.</p> : null}
      <Button className="w-full" type="submit" disabled={busy}>{busy ? "…" : "إرسال رابط الاستعادة"}</Button>
    </form>
  )
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault()
        setBusy(true)
        const { error } = await createClient().auth.updateUser({ password })
        setBusy(false)
        setMessage(error ? "تعذر تحديث كلمة المرور." : "تم تحديث كلمة المرور بنجاح.")
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">كلمة المرور الجديدة</span>
        <input className="field" dir="ltr" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={busy}>{busy ? "…" : "تحديث كلمة المرور"}</Button>
    </form>
  )
}
