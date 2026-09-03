import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode
  tone?: "neutral" | "success" | "info" | "warning"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        tone === "neutral" && "text-[var(--muted)]",
        tone === "success" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        tone === "info" &&
          "border-[var(--primary)]/20 bg-[var(--primary-soft)] text-[var(--primary)]",
        tone === "warning" &&
          "border-orange-500/20 bg-orange-500/10 text-[var(--warning)]",
        className,
      )}
    >
      {children}
    </span>
  )
}
