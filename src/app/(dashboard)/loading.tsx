export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-52 rounded bg-[var(--border)]" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-32 rounded-[8px] bg-[var(--surface)]" />)}</div>
      <div className="h-80 rounded-[8px] bg-[var(--surface)]" />
    </div>
  )
}
