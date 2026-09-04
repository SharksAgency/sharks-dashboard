import type { NextConfig } from "next"

const supabaseUrl = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
      : undefined
  } catch {
    return undefined
  }
})()

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = []
if (supabaseUrl) {
  remotePatterns.push({
    protocol: (supabaseUrl.protocol.replace(":", "") as "http" | "https") || "https",
    hostname: supabaseUrl.hostname,
    port: supabaseUrl.port || undefined,
    pathname: "/storage/v1/object/public/**",
  })
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  images: { remotePatterns },
}

export default nextConfig
