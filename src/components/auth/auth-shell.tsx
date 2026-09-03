import Link from "next/link"
import type { ReactNode } from "react"

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="sharks-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--primary)]" />
      <div className="w-full max-w-[440px]">
        <Link href="/login" className="mb-8 inline-flex items-center gap-3" aria-label="Sharks Dashboard">
          <span className="grid size-10 place-items-center bg-[#0f1628] text-lg font-black text-white [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]">
            S
          </span>
          <span>
            <strong className="block text-sm tracking-[0.16em]">SHARKS</strong>
            <span className="text-[11px] tracking-[0.22em] text-[var(--muted)]">DASHBOARD</span>
          </span>
        </Link>

        <section className="surface p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{description}</p>
          <div className="mt-7">{children}</div>
        </section>
        <p className="mt-5 text-center text-xs text-[var(--muted)]">
          Private workspace · Sharks Agency
        </p>
      </div>
    </main>
  )
}
