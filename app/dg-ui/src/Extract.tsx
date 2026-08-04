import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"

interface ExtractedTheme {
  tokens: Record<string, string>
  radius?: string
  fontFamily?: string
  mode: string
  colorsFound: number
}

const SAMPLE_CSS = `/* Example CSS */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --primary: #3b82f6;
  --accent: #8b5cf6;
  --border: #e5e7eb;
  --radius: 12px;
}
body { background: var(--bg); color: var(--text); }
.btn { background: var(--primary); border-radius: var(--radius); }
`

const TOKEN_MAP: Record<string, string[]> = {
  "--background": ["--bg", "--background", "--color-bg"],
  "--foreground": ["--text", "--fg", "--color-text", "--foreground"],
  "--primary": ["--primary", "--color-primary", "--brand"],
  "--border": ["--border", "--color-border"],
  "--radius": ["--radius", "--rounded"],
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function analyzeCss(css: string): ExtractedTheme {
  const tokens: Record<string, string> = {}
  const cssVars = new Map<string, string>()

  // Extract CSS custom properties
  const re = /--([\w-]+)\s*:\s*([^;]+)/g
  let m
  while ((m = re.exec(css)) !== null) {
    cssVars.set(`--${m[1]}`, m[2].trim())
  }

  // Map to shadcn slots
  for (const [slot, patterns] of Object.entries(TOKEN_MAP)) {
    for (const pattern of patterns) {
      if (cssVars.has(pattern)) {
        const val = cssVars.get(pattern)!
        if (val.startsWith("#")) {
          const [r, g, b] = hexToRgb(val)
          const [h, s, l] = rgbToHsl(r, g, b)
          tokens[slot] = `${h} ${s}% ${l}%`
        } else {
          tokens[slot] = val
        }
        break
      }
    }
  }

  // Extract all colors from the CSS
  const allColors = [...css.matchAll(/(?:^|\s)(#[0-9a-fA-F]{3,8})\b/g)].map(m => m[1])

  // Fallback: if few tokens mapped, use frequency-based heuristic
  if (Object.keys(tokens).length < 3 && allColors.length > 0) {
    if (!tokens["--background"]) {
      const [r, g, b] = hexToRgb(allColors[0])
      const [, , l] = rgbToHsl(r, g, b)
      tokens["--background"] = l > 50 ? rgbToHsl(r, g, b).join(" ") : "0 0% 100%"
    }
    if (!tokens["--foreground"] && allColors.length > 1) {
      const [r, g, b] = hexToRgb(allColors[1])
      tokens["--foreground"] = rgbToHsl(r, g, b).join(" ")
    }
  }

  // Extract radius
  const radiusMatch = css.match(/--radius\s*:\s*([^;]+)/)
  if (radiusMatch) tokens["--radius"] = radiusMatch[1].trim()

  // Extract font
  const fontMatch = css.match(/font-family\s*:\s*([^;]+)/)
  const fontFamily = fontMatch ? fontMatch[1].split(",")[0].trim().replace(/["']/g, "") : undefined

  // Detect mode from dark/light values
  const hasBg = tokens["--background"]
  const bgLightness = hasBg ? parseInt(hasBg.split(" ")[2]) : 50
  const mode = bgLightness < 30 ? "dark" : "light"

  return { tokens, fontFamily, mode, colorsFound: allColors.length }
}

export default function Extract() {
  const [input, setInput] = useState(SAMPLE_CSS)
  const [result, setResult] = useState<ExtractedTheme | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = () => {
    try {
      setError(null)
      const analyzed = analyzeCss(input)
      setResult(analyzed)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze CSS")
      setResult(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Extract Theme</h1>
        <p className="text-muted-foreground">
          Paste CSS from any website or design file → auto-generate a shadcn v4 theme preset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">Input CSS</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-64 p-3 font-mono text-xs bg-muted rounded-lg border border-border resize-none"
              placeholder="Paste CSS with :root variables..."
            />
            <div className="mt-3 flex gap-2">
              <button onClick={handleAnalyze} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                Analyze & Extract
              </button>
              <button onClick={() => { setInput(SAMPLE_CSS); setResult(null); setError(null); }} className="px-4 py-2 border border-border rounded-md text-sm">
                Reset
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              Extracted Theme
              {result && <Badge variant="success">{result.colorsFound} colors found</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={result.mode === "dark" ? "secondary" : "default"}>
                    {result.mode} mode
                  </Badge>
                  {result.fontFamily && (
                    <Badge variant="outline">{result.fontFamily}</Badge>
                  )}
                  <Badge variant="muted">{Object.keys(result.tokens).length} tokens</Badge>
                </div>

                <div className="space-y-2">
                  {Object.entries(result.tokens).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-36">{key}</span>
                      <div
                        className="w-8 h-8 rounded border border-border shrink-0"
                        style={{ background: key.includes("foreground") ? `hsl(${value})` : `hsl(${value})` }}
                      />
                      <span className="text-xs font-mono">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Generated CSS</h4>
                  <pre className="p-3 bg-muted rounded-lg border border-border text-[11px] font-mono overflow-auto max-h-64">
{`:root {
  --radius: ${result.tokens["--radius"] || "0.5rem"};
${Object.entries(result.tokens).filter(([k]) => !k.includes("radius")).map(([k, v]) => `  ${k.padEnd(24)}: ${v};`).join("\n")}
}`}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                Paste CSS and click "Analyze & Extract"
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
