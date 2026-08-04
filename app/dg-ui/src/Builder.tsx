import { useState, useEffect } from "react"
import { useTheme } from "./lib/theme"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"

const TOKEN_NAMES: Array<{ key: string; label: string; color?: boolean }> = [
  { key: "--background", label: "Background", color: true },
  { key: "--foreground", label: "Foreground", color: true },
  { key: "--card", label: "Card", color: true },
  { key: "--primary", label: "Primary", color: true },
  { key: "--primary-foreground", label: "Primary FG", color: true },
  { key: "--secondary", label: "Secondary", color: true },
  { key: "--muted", label: "Muted", color: true },
  { key: "--muted-foreground", label: "Muted FG", color: true },
  { key: "--accent", label: "Accent", color: true },
  { key: "--accent-foreground", label: "Accent FG", color: true },
  { key: "--destructive", label: "Destructive", color: true },
  { key: "--destructive-foreground", label: "Destructive FG", color: true },
  { key: "--border", label: "Border", color: true },
  { key: "--ring", label: "Ring", color: true },
  { key: "--radius", label: "Radius", color: false },
  { key: "--shadow", label: "Shadow", color: false },
]

function parseHslToHex(hsl: string): string {
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/)
  if (!match) return "#000000"
  const [h, s, l] = match.slice(1).map(Number)
  const a = s / 100, b = l / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = b - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * Math.max(0, Math.min(1, c))).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex: string): string {
  const h = parseInt(hex.slice(1, 3), 16) / 255
  const s = parseInt(hex.slice(3, 5), 16) / 255
  const l = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(h, s, l), min = Math.min(h, s, l)
  let h2 = 0, s2 = 0, l2 = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s2 = l2 > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case h: h2 = ((s - l) / d + (s < l ? 6 : 0)) / 6; break
      case s: h2 = ((l - h) / d + 2) / 6; break
      case l: h2 = ((h - s) / d + 4) / 6; break
    }
  }
  return `${Math.round(h2 * 360)} ${Math.round(s2 * 100)}% ${Math.round(l2 * 100)}%`
}

export default function Builder() {
  const { themeId, theme } = useTheme()
  const [tokens, setTokens] = useState<Record<string, string>>({})

  useEffect(() => {
    if (theme?.css) {
      const vars: Record<string, string> = {}
      const re = /--([\w-]+)\s*:\s*([^;]+);/g
      let m
      while ((m = re.exec(theme.css)) !== null) {
        vars[`--${m[1]}`] = m[2].trim()
      }
      setTokens(vars)
    }
  }, [theme])

  const updateToken = (key: string, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }))
    // Apply live
    let el = document.getElementById("dg-builder") as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = "dg-builder"
      document.head.appendChild(el)
    }
    el.textContent = `:root, .dark { ${Object.entries(tokens).map(([k, v]) => `${k}: ${k === key ? value : v};`).join("\n")} }`
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Theme Builder</h1>
        <p className="text-muted-foreground">
          Visual editor for theme tokens. Edit values on the left, see changes in real-time.
        </p>
        <div className="mt-2 flex gap-2">
          <Badge>base: {themeId}</Badge>
          <Badge variant="muted">editing</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TOKEN_NAMES.map(({ key, label, color }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground w-24 shrink-0">{label}</label>
                  {color ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="color"
                        value={parseHslToHex(tokens[key] || "#000000")}
                        onChange={e => updateToken(key, hexToHsl(e.target.value))}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={tokens[key] || ""}
                        onChange={e => updateToken(key, e.target.value)}
                        className="flex-1 text-xs font-mono bg-muted rounded px-2 py-1 border border-border"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={tokens[key] || ""}
                      onChange={e => updateToken(key, e.target.value)}
                      className="flex-1 text-xs font-mono bg-muted rounded px-2 py-1 border border-border"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground font-mono">
            <div className="font-semibold mb-1">CSS output</div>
            <pre className="bg-muted p-3 rounded border border-border overflow-auto max-h-48 text-[11px] leading-relaxed">
{`:root {\n${Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`}
            </pre>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Primary</button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">Secondary</button>
                <button className="px-4 py-2 border border-border rounded-md text-sm font-medium">Outline</button>
                <button className="px-4 py-2 text-sm font-medium">Ghost</button>
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium">Destructive</button>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">primary</div>
                <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">secondary</div>
                <div className="px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-xs font-semibold">danger</div>
                <div className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold">muted</div>
                <div className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">accent</div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="font-semibold mb-1">Card preview</div>
                <p className="text-sm text-muted-foreground mb-2">This card uses the current token values.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm">Save</button>
                  <button className="px-3 py-1.5 border border-border rounded-md text-sm">Cancel</button>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="font-semibold mb-2">Form preview</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Name</label>
                    <input type="text" placeholder="Enter name" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    <input type="email" placeholder="name@example.com" className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
