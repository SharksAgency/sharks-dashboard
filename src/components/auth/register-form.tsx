"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const schema = z
  .object({
    email: z.email("أدخل بريدًا إلكترونيًا صحيحًا / Enter a valid email"),
    password: z.string().min(8, "استخدم 8 أحرف على الأقل / Use at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا المرور غير متطابقتين / Passwords do not match",
  })

type Values = z.infer<typeof schema>

export function RegisterForm() {
  const [state, setState] = useState<"idle" | "denied" | "success" | "error">("idle")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const submit = handleSubmit(async (values) => {
    setState("idle")
    const supabase = createClient()
    const { data: allowed, error: accessError } = await supabase.rpc(
      "can_register_dashboard_user",
      { p_email: values.email.trim().toLowerCase() },
    )
    if (accessError) {
      setState("error")
      return
    }
    if (!allowed) {
      setState("denied")
      return
    }

    const redirectTo = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signUp({
      email: values.email.trim().toLowerCase(),
      password: values.password,
      options: { emailRedirectTo: redirectTo },
    })
    setState(error ? "error" : "success")
  })

  if (state === "success") {
    return (
      <div className="space-y-4">
        <div className="rounded-[7px] border border-emerald-500/20 bg-emerald-500/10 p-4">
          <strong className="block text-emerald-600 dark:text-emerald-400">تم إنشاء الحساب / Account created</strong>
          <p className="mt-1 text-sm leading-7 text-[var(--muted)]">تحقق من بريدك إذا كان تأكيد البريد مفعّلًا، ثم سجّل الدخول.</p>
        </div>
        <Link className="text-sm font-semibold text-[var(--primary)]" href="/login">العودة لتسجيل الدخول →</Link>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">البريد الإلكتروني / Email</span>
        <input className="field" dir="ltr" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <span className="mt-1 block text-xs text-[var(--danger)]">{errors.email.message}</span> : null}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">كلمة المرور / Password</span>
        <input className="field" dir="ltr" type="password" autoComplete="new-password" {...register("password")} />
        {errors.password ? <span className="mt-1 block text-xs text-[var(--danger)]">{errors.password.message}</span> : null}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">تأكيد كلمة المرور / Confirm password</span>
        <input className="field" dir="ltr" type="password" autoComplete="new-password" {...register("confirmPassword")} />
        {errors.confirmPassword ? <span className="mt-1 block text-xs text-[var(--danger)]">{errors.confirmPassword.message}</span> : null}
      </label>
      {state === "denied" ? (
        <div role="alert" className="rounded-[7px] border border-orange-500/25 bg-orange-500/10 p-4">
          <strong className="block text-[var(--warning)]">Access Denied</strong>
          <p className="mt-1 text-sm leading-7">ليس لديك صلاحية لإنشاء حساب في Sharks Dashboard.</p>
          <p className="text-sm text-[var(--muted)]">Your email has not been granted access to Sharks Dashboard.</p>
        </div>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="rounded-[7px] border border-red-500/20 bg-red-500/10 p-3 text-sm text-[var(--danger)]">
          تعذر إكمال التسجيل. حاول مرة أخرى. / Registration could not be completed.
        </p>
      ) : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ التحقق…" : "إنشاء الحساب / Create Account"}
      </Button>
      <Link className="block text-center text-sm text-[var(--primary)] hover:underline" href="/login">لديك حساب؟ تسجيل الدخول</Link>
    </form>
  )
}
