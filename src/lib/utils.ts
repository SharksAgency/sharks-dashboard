import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value?: string | null, locale = "ar-EG") {
  if (!value) return "—"
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function mediaUrl(path?: string | null) {
  if (!path) return ""
  if (/^(https?:\/\/|\/)/.test(path)) return path
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
  return base
    ? `${base}/storage/v1/object/public/website-media/${path.replace(/^\//, "")}`
    : path
}
