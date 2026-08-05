import { Card, CardContent, CardHeader, CardTitle } from "../Card"
import { Badge } from "../Badge"
import { useTheme } from "../lib/theme"

const THEMES = [
  { id: "mcky", name: "mcky.space", vibe: "neobrutalism, 3px border, hard shadow, mono 100%", modes: "dual", color: "#ffe066" },
  { id: "rack", name: "STACK//FRAME", vibe: "server rack, amber LED, Inter+mono", modes: "dark-only", color: "#ffb000" },
  { id: "crt", name: "PIXSH v1.0", vibe: "phosphor green, scanlines, VT323", modes: "dark-only", color: "#4af626" },
  { id: "noc", name: "PACKETGRID", vibe: "NOC dashboard, cyan+green", modes: "dark-only", color: "#35f0c8" },
  { id: "min", name: "collage.sh", vibe: "minimal, olive lime accent", modes: "light-only", color: "#7a9a01" },
  { id: "glitchpage", name: "GLITCHPAGE", vibe: "error page, neon pink, Thai", modes: "dark-only", color: "#ff3d8f" },
  { id: "claude", name: "CLAUDE PAPER", vibe: "warm editorial, clay, Source Serif", modes: "dual", color: "#d97757" },
  { id: "moss", name: "MOSS", vibe: "organic, earth + terracotta, Fraunces", modes: "light-only", color: "#6a8c3f" },
  { id: "brut", name: "BRUT", vibe: "brutalist, red+black, Anton", modes: "light-only", color: "#ff2e00" },
]

export default function ThemesGuide() {
  const { setTheme, themeId } = useTheme()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Themes</h1>
        <p className="text-muted-foreground">
          9 design concepts from design-gallery, each as a shadcn v4 theme preset.
          Click any theme below to switch.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Available Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((t) => (
            <Card
              key={t.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                themeId === t.id ? "border-primary ring-1 ring-primary" : ""
              }`}
              onClick={() => setTheme(t.id as any)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md border border-border"
                      style={{ background: t.color }}
                    />
                    <div>
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{t.vibe}</p>
                    </div>
                  </div>
                  <Badge variant={themeId === t.id ? "default" : "outline"}>
                    {t.modes}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Theme Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Dual Mode</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Has both light and dark variants. Toggle with <code>data-mode="light|dark"</code>.</p>
              <p className="mt-1 text-xs">mcky, claude</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Dark Only</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Dark theme only. Applied via <code>:root, .dark { }</code> to force dark.</p>
              <p className="mt-1 text-xs">rack, crt, noc, glitchpage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Light Only</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Light theme only. Shielded from <code>.dark</code> class override.</p>
              <p className="mt-1 text-xs">min, moss, brut</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Create a New Theme</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm">
{`/* themes/<id>/theme.css */
:root {
  --background: 60 17% 95%;        /* HSL space-separated */
  --foreground: 0 0% 0%;
  --primary: 50 100% 71%;           /* amber */
  --radius: 0.375rem;
  --border-width: 3px;
  --shadow: 4px 4px 0 var(--border); /* hard shadow */
  --font-sans: 'JetBrains Mono', ...;
}`}
        </pre>
        <p className="text-sm text-muted-foreground mt-2">
          Or use the theme-builder at <code>/theme-builder</code> for visual editing.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Apply a Theme</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm">
{`# Via CLI
npx dg add theme mcky --shadcn --dir .

# In HTML/CSS
<link rel="stylesheet" href="themes/mcky/theme.css">`}
        </pre>
      </section>
    </div>
  )
}
