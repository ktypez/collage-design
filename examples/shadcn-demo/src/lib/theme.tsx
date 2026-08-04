import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Dynamic theme injection — import the raw CSS of each DG theme and
// inject it as a <style> tag on top of globals.css. Because the theme
// css only contains `:root` / `.dark` variable blocks, it overrides the
// shadcn defaults at runtime → instant theme switch, zero re-render.

const themes: Record<string, { name: string; load: () => Promise<string> }> = {
  mcky: { name: "mcky.space", load: () => import("../themes/mcky.css?raw").then(m => m.default) },
  rack: { name: "STACK//FRAME", load: () => import("../themes/rack.css?raw").then(m => m.default) },
  crt: { name: "PIXSH v1.0", load: () => import("../themes/crt.css?raw").then(m => m.default) },
  noc: { name: "PACKETGRID", load: () => import("../themes/noc.css?raw").then(m => m.default) },
  min: { name: "collage.sh", load: () => import("../themes/min.css?raw").then(m => m.default) },
  glitchpage: { name: "GLITCHPAGE", load: () => import("../themes/glitchpage.css?raw").then(m => m.default) },
  claude: { name: "CLAUDE PAPER", load: () => import("../themes/claude.css?raw").then(m => m.default) },
  moss: { name: "MOSS", load: () => import("../themes/moss.css?raw").then(m => m.default) },
  brut: { name: "BRUT", load: () => import("../themes/brut.css?raw").then(m => m.default) },
}

type ThemeCtx = {
  id: string
  name: string
  mode: "light" | "dark"
  setTheme: (id: string) => void
  toggleMode: () => void
  setMode: (m: "light" | "dark") => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string>("mcky")
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    let el = document.getElementById("dg-theme") as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = "dg-theme"
      document.head.appendChild(el)
    }
    themes[id]?.load().then(css => { if (el) el.textContent = css })
  }, [id])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
  }, [mode])

  const value: ThemeCtx = {
    id,
    name: themes[id]?.name ?? id,
    mode,
    setTheme: setId,
    toggleMode: () => setMode(m => (m === "light" ? "dark" : "light")),
    setMode,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
