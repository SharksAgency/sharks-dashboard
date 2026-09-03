import { AuthShell } from "@/components/auth/auth-shell"
import { ForgotPasswordForm } from "@/components/auth/password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell eyebrow="Account recovery" title="استعادة كلمة المرور" description="سنرسل رابطًا آمنًا إلى بريد حسابك.">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
