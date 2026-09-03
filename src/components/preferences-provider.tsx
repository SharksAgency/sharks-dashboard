"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Toaster } from "sonner"

export type Locale = "ar" | "en"
export type Theme = "light" | "dark" | "system"

type Preferences = {
  locale: Locale
  theme: Theme
  setLocale: (locale: Locale) => void
  setTheme: (theme: Theme) => void
}

const PreferencesContext = createContext<Preferences | null>(null)

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
  document.documentElement.style.colorScheme = dark ? "dark" : "light"
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar")
  const [theme, setThemeState] = useState<Theme>("system")

  useEffect(() => {
    const storedLocale = localStorage.getItem("sharks-dashboard-locale") as Locale
    const storedTheme = localStorage.getItem("sharks-dashboard-theme") as Theme
    const nextLocale = storedLocale === "en" ? "en" : "ar"
    const nextTheme = ["light", "dark", "system"].includes(storedTheme)
      ? storedTheme
      : "system"
    queueMicrotask(() => {
      setLocaleState(nextLocale)
      setThemeState(nextTheme)
    })
    document.documentElement.lang = nextLocale
    document.documentElement.dir = nextLocale === "ar" ? "rtl" : "ltr"
    applyTheme(nextTheme)
  }, [])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => applyTheme("system")
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [theme])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem("sharks-dashboard-locale", next)
    document.cookie = `sharks-dashboard-locale=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr"
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem("sharks-dashboard-theme", next)
    applyTheme(next)
  }, [])

  const value = useMemo(
    () => ({ locale, theme, setLocale, setTheme }),
    [locale, theme, setLocale, setTheme],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
      <Toaster
        position={locale === "ar" ? "bottom-left" : "bottom-right"}
        richColors
        closeButton
      />
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider")
  return value
}
