export function getPublicSiteUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL
  if (!value) return null

  try {
    const url = new URL(value)
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      return null
    }
    return url.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

export function safeInternalPath(value: string | null | undefined, fallback = "/") {
  const candidate = value?.trim()
  if (!candidate?.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback
  }

  const base = "https://dashboard.invalid"
  const parsed = new URL(candidate, base)
  if (parsed.origin !== base) return fallback

  return `${parsed.pathname}${parsed.search}${parsed.hash}`
}
