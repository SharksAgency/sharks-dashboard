import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthShell eyebrow="Invitation only" title="إنشاء حساب خاص" description="يمكن التسجيل فقط للبريد المضاف مسبقًا إلى قائمة الوصول.">
      <RegisterForm />
    </AuthShell>
  )
}
