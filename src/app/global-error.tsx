"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="ar" dir="rtl"><body><main className="grid min-h-screen place-items-center bg-[#02040a] p-6 text-center text-white"><div><p className="text-sm uppercase tracking-widest text-[#66b2ff]">Sharks Dashboard</p><h1 className="mt-4 text-2xl font-bold">حدث خطأ غير متوقع.</h1><button className="mt-5 rounded-[7px] bg-[#007fff] px-5 py-3 font-semibold" onClick={reset}>المحاولة مرة أخرى</button></div></main></body></html>
}
