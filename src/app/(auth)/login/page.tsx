import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Secure access" title="أهلًا بعودتك" description="سجّل الدخول إلى مساحة إدارة محتوى Sharks Agency.">
      <Suspense fallback={<div className="h-72 animate-pulse rounded-[7px] bg-[var(--surface-subtle)]" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
