"use client"

import { useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-3xl",
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#02040a]/65 p-3 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`surface fine-scrollbar max-h-[92vh] w-full ${width} overflow-y-auto`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-[var(--surface)] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            ×
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <div className="space-y-5 p-5">
        <p className="text-sm leading-7 text-[var(--muted)]">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>إلغاء / Cancel</Button>
          <Button variant="danger" disabled={busy} onClick={onConfirm}>
            {busy ? "…" : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
