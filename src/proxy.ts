import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/access-denied",
  "/auth",
]

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isPublic = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`),
  )

  if (!user && !isPublic) {
    const nextUrl = request.nextUrl.clone()
    nextUrl.pathname = "/login"
    nextUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(nextUrl)
  }

  if (user && ["/login", "/register"].includes(request.nextUrl.pathname)) {
    const nextUrl = request.nextUrl.clone()
    nextUrl.pathname = "/"
    nextUrl.search = ""
    return NextResponse.redirect(nextUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
