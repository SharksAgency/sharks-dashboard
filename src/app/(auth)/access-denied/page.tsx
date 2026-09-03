import Link from "next/link"
import { AuthShell } from "@/components/auth/auth-shell"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default function AccessDeniedPage() {
  return (
    <AuthShell eyebrow="403" title="Access Denied" description="ليس لديك صلاحية نشطة للوصول إلى Sharks Dashboard. Your account is not currently authorized.">
      <div className="flex flex-wrap gap-3">
        <SignOutButton />
        <Link className="inline-flex h-11 items-center rounded-[7px] px-4 text-sm font-semibold text-[var(--primary)]" href="/login">العودة</Link>
      </div>
    </AuthShell>
  )
}
