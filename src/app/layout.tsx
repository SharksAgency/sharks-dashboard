import type { Metadata, Viewport } from "next"
import "@dawod/thmanyah-font-web/sans.css"
import "./globals.css"
import { PreferencesProvider } from "@/components/preferences-provider"

export const metadata: Metadata = {
  title: { default: "Sharks Dashboard", template: "%s | Sharks Dashboard" },
  description: "Private content operations for Sharks Agency.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#02040a" },
  ],
}

const preferenceScript = `
  (() => {
    try {
      const locale = localStorage.getItem('sharks-dashboard-locale') === 'en' ? 'en' : 'ar';
      const theme = localStorage.getItem('sharks-dashboard-theme') || 'system';
      const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    } catch {}
  })();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
      </head>
      <body>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  )
}
