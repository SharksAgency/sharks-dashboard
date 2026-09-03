import { AuthShell } from "@/components/auth/auth-shell"
import { ResetPasswordForm } from "@/components/auth/password-form"

export default function ResetPasswordPage() {
  return (
    <AuthShell eyebrow="Account security" title="كلمة مرور جديدة" description="اختر كلمة مرور قوية لا تقل عن ثمانية أحرف.">
      <ResetPasswordForm />
    </AuthShell>
  )
}
