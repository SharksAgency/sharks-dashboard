import Link from "next/link"

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center p-6 text-center"><div><strong className="text-6xl font-black text-[var(--primary)]">404</strong><h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1><Link className="mt-5 inline-block text-sm font-semibold text-[var(--primary)]" href="/">العودة إلى الرئيسية</Link></div></main>
}
