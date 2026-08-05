import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type ThemeId = string
interface Theme { id: string; name: string; css: string; dark?: boolean }

const THEME_KEY = "dg:theme"
const MODE_KEY = "dg:mode"

function getStored(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

// Import installed themes from src/themes/ — ONLY what's installed
// (tweakcn model: add more with `npx dg add theme <id> --ui`)
const themeModules = import.meta.glob("../themes/*.css", { eager: true, query: "?raw" })

function parseName(css: string, id: string): string {
  const nameMatch = css.match(/([A-Z][\w. ]+)[—·:]/)
  if (nameMatch) return nameMatch[1].trim()
  return id.charAt(0).toUpperCase() + id.slice(1)
}

const INSTALLED: Record<string, Theme> = Object.fromEntries(
  Object.entries(themeModules).map(([path, mod]) => {
    const css = (mod as unknown as { default: string }).default
    const id = path.split("/").pop()!.replace(".css", "")
    return [id, { id, name: parseName(css, id), css, dark: css.includes(".dark {") }]
  }),
)

// All 9 themes available in the registry (for display on Themes page)
export const AVAILABLE_THEMES: Record<string, { id: string; name: string; vibe: string; color: string }> = {
  mcky: { id: "mcky", name: "mcky.space", vibe: "neobrutalism", color: "#ffe066" },
  rack: { id: "rack", name: "STACK//FRAME", vibe: "server rack", color: "#ffb000" },
  crt: { id: "crt", name: "PIXSH", vibe: "phosphor green", color: "#4af626" },
  noc: { id: "noc", name: "PACKETGRID", vibe: "NOC dashboard", color: "#35f0c8" },
  min: { id: "min", name: "collage.sh", vibe: "minimal", color: "#7a9a01" },
  glitchpage: { id: "glitchpage", name: "GLITCHPAGE", vibe: "error page", color: "#ff3d8f" },
  claude: { id: "claude", name: "CLAUDE PAPER", vibe: "warm editorial", color: "#d97757" },
  moss: { id: "moss", name: "MOSS", vibe: "organic", color: "#6a8c3f" },
  brut: { id: "brut", name: "BRUT", vibe: "brutalist", color: "#ff2e00" },
}

export const THEME_IDS = Object.keys(INSTALLED)

interface ThemeCtx {
  theme: Theme
  themeId: ThemeId
  installed: ThemeId[]
  available: typeof AVAILABLE_THEMES
  setTheme: (id: ThemeId) => void
  installTheme: (id: ThemeId) => boolean
  mode: "light" | "dark"
  setMode: (m: "light" | "dark") => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<ThemeId>(() => {
    const stored = getStored(THEME_KEY, "")
    return INSTALLED[stored] ? stored : (THEME_IDS[0] || "")
  })
  const [mode, setMode] = useState<"light" | "dark">(() =>
    getStored(MODE_KEY, "light") as "light" | "dark"
  )
  const [installed] = useState<ThemeId[]>(THEME_IDS)

  useEffect(() => {
    if (!INSTALLED[id] && installed.length) setId(installed[0])
  }, [id, installed])

  useEffect(() => {
    let el = document.getElementById("dg-theme") as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = "dg-theme"
      document.head.appendChild(el)
    }
    const t = INSTALLED[id]
    if (t?.css) el.textContent = t.css
    try { localStorage.setItem(THEME_KEY, id) } catch {}
  }, [id])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
    try { localStorage.setItem(MODE_KEY, mode) } catch {}
  }, [mode])

  const value: ThemeCtx = {
    theme: INSTALLED[id],
    themeId: id,
    installed,
    available: AVAILABLE_THEMES,
    setTheme: (i) => { if (INSTALLED[i]) setId(i) },
    installTheme: (i) => {
      // Runtime-install: fetch + inject the theme CSS from registry path
      // (dev only — for production, run `dg add theme <id> --ui`)
      if (INSTALLED[i]) return true
      return false
    },
    mode,
    setMode,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useTheme must be in ThemeProvider")
  return ctx
}
