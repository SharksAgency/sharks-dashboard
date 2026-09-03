"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ConfirmDialog, Modal } from "@/components/ui/modal"
import { removeAccess, saveAccess } from "@/features/access/actions"
import type { DashboardRole } from "@/lib/auth"
import { formatDate } from "@/lib/utils"

type Access = { id: string; email: string; role: DashboardRole; is_active: boolean; registered_user_id: string | null; created_at: string; updated_at: string }

export function AccessManager({ records, currentRole }: { records: Access[]; currentRole: DashboardRole }) {
  const router = useRouter()
  const [editing, setEditing] = useState<Access | "new" | null>(null)
  const [deleting, setDeleting] = useState<Access | null>(null)
  const [form, setForm] = useState({ email: "", role: "editor" as DashboardRole, is_active: true })
  const [pending, startTransition] = useTransition()
  const open = (record?: Access) => { setEditing(record ?? "new"); setForm(record ? { email: record.email, role: record.role, is_active: record.is_active } : { email: "", role: "editor", is_active: true }) }
  const submit = () => startTransition(async () => { const result = await saveAccess({ ...(editing !== "new" && editing ? { id: editing.id } : {}), ...form }); if (!result.ok) toast.error(result.message); else { toast.success(result.message); setEditing(null); router.refresh() } })
  const remove = () => deleting && startTransition(async () => { const result = await removeAccess({ id: deleting.id }); if (!result.ok) toast.error(result.message); else { toast.success(result.message); setDeleting(null); router.refresh() } })
  const registered = records.filter((item) => item.registered_user_id)
  const pendingRegistration = records.filter((item) => !item.registered_user_id)

  return (
    <>
      <PageHeader eyebrow="Security" title="الوصول والمستخدمون" description="التسجيل خاص. يجب أن يوجد البريد هنا أولًا، ولا يمنح حساب Auth وحده أي وصول للوحة." actions={<Button onClick={() => open()}><Icon name="plus" size={18} />إضافة بريد</Button>} />
      <div className="grid gap-6 xl:grid-cols-2"><AccessGroup title="مسجلون" subtitle="Registered" records={registered} onEdit={open} onDelete={setDeleting} /><AccessGroup title="مصرح لهم — بانتظار التسجيل" subtitle="Authorized — no account yet" records={pendingRegistration} onEdit={open} onDelete={setDeleting} /></div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing === "new" ? "إضافة وصول" : "تعديل الوصول"} width="max-w-lg"><form className="space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); submit() }}><label className="block"><span className="mb-1.5 block text-sm font-semibold">البريد الإلكتروني</span><input className="field" dir="ltr" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} readOnly={editing !== "new"} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">الدور</span><select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as DashboardRole })}>{currentRole === "owner" ? <><option value="owner">Owner</option><option value="admin">Admin</option></> : null}<option value="editor">Editor</option></select></label><label className="flex items-center justify-between rounded-[7px] border p-3 text-sm font-semibold"><span>وصول نشط</span><input className="size-5 accent-[var(--primary)]" type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /></label><div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>إلغاء</Button><Button type="submit" disabled={pending}>حفظ</Button></div></form></Modal>
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} title="إزالة الوصول؟" description="لن يستطيع هذا البريد الدخول إلى لوحة التحكم بعد الإزالة. لا يتم كشف أو إدارة كلمة المرور هنا." confirmLabel="إزالة الوصول" busy={pending} onConfirm={remove} />
    </>
  )
}

function AccessGroup({ title, subtitle, records, onEdit, onDelete }: { title: string; subtitle: string; records: Access[]; onEdit: (record: Access) => void; onDelete: (record: Access) => void }) {
  return <section className="surface overflow-hidden"><header className="border-b px-5 py-4"><h2 className="font-bold">{title}</h2><p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">{subtitle} · {records.length}</p></header>{records.length ? <div className="divide-y">{records.map((record) => <div key={record.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><strong className="block truncate text-sm" dir="ltr">{record.email}</strong><div className="mt-1 flex items-center gap-2"><Badge tone={record.role === "owner" ? "info" : "neutral"}>{record.role}</Badge><Badge tone={record.is_active ? "success" : "warning"}>{record.is_active ? "Active" : "Disabled"}</Badge><span className="text-[11px] text-[var(--muted)]">{formatDate(record.updated_at)}</span></div></div><div className="flex"><Button variant="ghost" size="icon" onClick={() => onEdit(record)}><Icon name="edit" size={17} /></Button><Button variant="ghost" size="icon" className="hover:text-[var(--danger)]" onClick={() => onDelete(record)}><Icon name="delete" size={17} /></Button></div></div>)}</div> : <div className="grid min-h-40 place-items-center p-5 text-sm text-[var(--muted)]">لا توجد سجلات في هذه المجموعة.</div>}</section>
}
