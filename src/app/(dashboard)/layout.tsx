import { DashboardShell } from "@/components/layout/dashboard-shell"
import { requireDashboardUser } from "@/lib/auth"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDashboardUser()
  return <DashboardShell user={user}>{children}</DashboardShell>
}
