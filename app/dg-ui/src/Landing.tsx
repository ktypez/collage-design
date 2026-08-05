import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"
import { useTheme } from "./lib/theme"
import { Package, Palette, Settings, Search, Zap, CheckCircle, Sun, Moon } from "lucide-react"

const features = [
  { icon: Palette, title: "9 Design Concepts", desc: "mcky, rack, crt, noc, min, glitchpage, claude, moss, brut" },
  { icon: Package, title: "54+ Components", desc: "Radix UI primitives, theme-agnostic, copy-paste" },
  { icon: Settings, title: "Token System", desc: "CSS variables: --primary, --background, --radius, etc." },
  { icon: Search, title: "Auto-Extract", desc: "Paste CSS → auto-generate shadcn theme" },
  { icon: Zap, title: "0 Dependencies", desc: "Pure CSS variables, no runtime overhead" },
  { icon: CheckCircle, title: "Type Safe", desc: "TypeScript + React 19 + Tailwind v4" },
]

const themes = [
  { name: "mcky", color: "#ffe066", label: "mcky.space", vibe: "neobrutalism" },
  { name: "rack", color: "#ffb000", label: "STACK//FRAME", vibe: "server rack" },
  { name: "crt", color: "#4af626", label: "PIXSH", vibe: "phosphor green" },
  { name: "noc", color: "#35f0c8", label: "PACKETGRID", vibe: "NOC dashboard" },
  { name: "min", color: "#7a9a01", label: "collage.sh", vibe: "minimal" },
  { name: "glitchpage", color: "#ff3d8f", label: "GLITCHPAGE", vibe: "error page" },
  { name: "claude", color: "#d97757", label: "CLAUDE PAPER", vibe: "warm editorial" },
  { name: "moss", color: "#6a8c3f", label: "MOSS", vibe: "organic" },
  { name: "brut", color: "#ff2e00", label: "BRUT", vibe: "brutalist" },
]

export default function Landing() {
  const { setTheme, mode, setMode } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating light/dark toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-1 p-1 rounded-lg border border-border bg-card/90 backdrop-blur">
        <button
          onClick={() => setMode("light")}
          aria-label="Light mode"
          className={`p-2 rounded-md transition-colors ${
            mode === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMode("dark")}
          aria-label="Dark mode"
          className={`p-2 rounded-md transition-colors ${
            mode === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          }`}
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4">Design Gallery Framework</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Build beautiful UIs<br />
          <span className="text-primary">with 9 design themes</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          9 design concepts from design-gallery — each as a shadcn v4 theme preset.
          React 19 + Radix UI + Tailwind v4. Zero dependencies in the theme layer.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
            Get Started
          </button>
          <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent">
            View Docs
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Why DG Framework?</h2>
          <p className="text-muted-foreground text-center mb-10">
            A complete design system for modern web applications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader className="pb-2">
                  <f.icon className="w-6 h-6 text-primary mb-2" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Gallery */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">9 Design Themes</h2>
          <p className="text-muted-foreground text-center mb-8">
            Each theme is a complete shadcn v4 preset with exact brand colors
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name as any)}
                className="p-4 rounded-lg border border-border text-left hover:border-primary transition-colors min-w-0"
              >
                <div className="flex items-center gap-3 mb-2 min-w-0">
                  <div
                    className="w-8 h-8 rounded-md border border-border shrink-0"
                    style={{ background: t.color }}
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{t.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.vibe}</div>
                  </div>
                </div>
                <Badge variant="outline" className="mt-2">{t.name}</Badge>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-4 sm:px-6 py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Quick Start</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="font-mono text-sm">
                  <p className="text-muted-foreground mb-2">1. Install framework</p>
                  <code className="block p-3 bg-background rounded border border-border overflow-x-auto whitespace-pre">
                    npx dg init my-app
                  </code>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="font-mono text-sm">
                  <p className="text-muted-foreground mb-2">2. Add a theme</p>
                  <code className="block p-3 bg-background rounded border border-border overflow-x-auto whitespace-pre">
                    npx dg add theme mcky --shadcn --dir .
                  </code>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="font-mono text-sm">
                  <p className="text-muted-foreground mb-2">3. Add components</p>
                  <code className="block p-3 bg-background rounded border border-border overflow-x-auto whitespace-pre">
                    npx shadcn@latest add button card dialog tabs
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Architecture</h2>
          <Card>
            <CardContent className="p-8">
              <pre className="font-mono text-sm overflow-auto">{`design-gallery/
├── src/tokens/schema.css      ← 25+9 HSL tokens (light/dark)
├── src/tokens/motion.css      ← 14 motion tokens
├── src/components/base.css    ← 54+ components (vanilla, deprecated)
├── src/components/components.js ← JS controllers
├── themes/shadcn/             ← 9 shadcn v4 presets (hex + oklch)
│   ├── _base.css              ← one-time @theme inline mapping
│   └── <id>.css               ← theme tokens
├── themes/json/               ← 9 JSON themes (React Native)
├── tools/
│   ├── shadcn-adapter.mjs     ← themes → shadcn v4
│   ├── extract.mjs            ← CSS/URL → theme (auto)
│   ├── codegen.mjs            ← canonical THEMES map
│   ├── validate.mjs           ← token contract + contrast
│   └── motion-tokens.mjs      ← motion CSS variables
└── bin/dg.js                  ← CLI: init/add/theme/extract/check`}</pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>Design Gallery Framework · Built by ktypez</p>
        <p className="mt-1">
          <a href="https://github.com/ktypez/design-gallery" className="underline">GitHub</a> · 
          React 19 · Radix UI · Tailwind v4
        </p>
      </footer>
    </div>
  )
}
