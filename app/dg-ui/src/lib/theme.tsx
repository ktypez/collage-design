import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import themesData from "../themes.json"

type ThemeId = string
type Theme = { name: string; css: string; dark?: boolean }

interface ThemeCtx {
  theme: Theme
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  mode: "light" | "dark"
  modes: { light: boolean; dark: boolean }
  setMode: (m: "light" | "dark") => void
  themes: Record<string, Theme>
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<ThemeId>("mcky")
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    let el = document.getElementById("dg-theme") as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = "dg-theme"
      document.head.appendChild(el)
    }
    const t = (themesData.themes as Record<string, Theme>)[id]
    if (t?.css) el.textContent = t.css
  }, [id])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
  }, [mode])

  const value: ThemeCtx = {
    theme: (themesData.themes as Record<string, Theme>)[id],
    themeId: id,
    mode,
    setTheme: (i) => { setId(i); setMode((themesData.themes as Record<string, Theme>)[i]?.dark ? "dark" : "light") },
    modes: { light: true, dark: true },
    setMode,
    themes: themesData.themes as Record<string, Theme>,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useTheme must be in ThemeProvider")
  return ctx
}
