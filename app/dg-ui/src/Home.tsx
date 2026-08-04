import { useTheme } from "./lib/theme"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"
import { Package, Palette, Settings } from "lucide-react"

export default function Home() {
  const { themeId, setTheme } = useTheme()
  const themeCount = 9
  const componentCount = 53

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Design Gallery <span className="text-primary">Framework</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          9 design concepts → shadcn v4 theme presets. React + Radix UI + Tailwind v4.
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">Radix UI</Badge>
          <Badge variant="secondary">Tailwind v4</Badge>
          <Badge>{themeCount} themes</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{themeCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Design themes</p>
            <p className="text-xs text-muted-foreground">mcky · rack · crt · noc · min · glitchpage · claude · moss · brut</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{componentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">shadcn components</p>
            <p className="text-xs text-muted-foreground">Radix UI primitives · Tailwind</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">dependencies in theme layer</p>
            <p className="text-xs text-muted-foreground">Pure CSS variables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">9</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">DG CLI commands</p>
            <p className="text-xs text-muted-foreground">init · add · theme · list · codegen · shadcn · extract · check · serve</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Palette className="w-4 h-4" /> Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground font-mono text-xs bg-muted p-3 rounded">
              npx shadcn@latest init -b radix
            </p>
            <p className="text-muted-foreground font-mono text-xs bg-muted p-3 rounded">
              npx dg add theme mcky --shadcn
            </p>
            <p className="text-muted-foreground font-mono text-xs bg-muted p-3 rounded">
              npx shadcn@latest add button card dialog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Settings className="w-4 h-4" /> Current Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded border border-border bg-primary text-primary-foreground text-center text-sm font-medium">primary</div>
              <div className="p-2 rounded border border-border bg-secondary text-secondary-foreground text-center text-sm">secondary</div>
              <div className="p-2 rounded border border-border bg-accent text-accent-foreground text-center text-sm">accent</div>
              <div className="p-2 rounded border border-border bg-muted text-muted-foreground text-center text-sm">muted</div>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Active: {themeId}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4" /> Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(useTheme().themes).map(([id]) => (
              <button
                key={id}
                onClick={() => setTheme(id as any)}
                className={`p-3 rounded border text-left text-sm transition-all ${
                  themeId === id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="font-medium">{id}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
