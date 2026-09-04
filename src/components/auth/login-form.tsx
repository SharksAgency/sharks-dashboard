"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { safeInternalPath } from "@/lib/urls"

const schema = z.object({
  email: z.email("أدخل بريدًا إلكترونيًا صحيحًا / Enter a valid email"),
  password: z.string().min(8, "كلمة المرور قصيرة / Password is too short"),
})

type Values = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const submit = handleSubmit(async (values) => {
    setError("")
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword(values)
    if (signInError) {
      setError("تعذر تسجيل الدخول. راجع البريد وكلمة المرور. / Sign in failed.")
      return
    }
    const next = params.get("next")
    router.replace(safeInternalPath(next))
    router.refresh()
  })

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">البريد الإلكتروني / Email</span>
        <input className="field" dir="ltr" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <span className="mt-1 block text-xs text-[var(--danger)]">{errors.email.message}</span> : null}
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">كلمة المرور / Password</span>
        <input className="field" dir="ltr" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password ? <span className="mt-1 block text-xs text-[var(--danger)]">{errors.password.message}</span> : null}
      </label>
      {error ? <p role="alert" className="rounded-[7px] border border-red-500/20 bg-red-500/10 p-3 text-sm text-[var(--danger)]">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ الدخول…" : "تسجيل الدخول / Sign In"}
      </Button>
      <div className="flex flex-wrap justify-between gap-3 text-sm">
        <Link className="text-[var(--primary)] hover:underline" href="/register">إنشاء حساب / Create account</Link>
        <Link className="text-[var(--muted)] hover:text-[var(--foreground)]" href="/forgot-password">نسيت كلمة المرور؟</Link>
      </div>
    </form>
  )
}
