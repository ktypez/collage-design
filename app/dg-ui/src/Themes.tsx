import { Badge } from "./Badge"
import { useTheme } from "./lib/theme"
const THEME_META: Record<string, { name: string; vibe: string; dot: string }> = {
  mcky: { name: "mcky.space", vibe: "neobrutalism · 3px border · mono 100%", dot: "#ffe066" },
  rack: { name: "STACK//FRAME", vibe: "server rack · amber LED · Inter+mono", dot: "#ffb000" },
  crt: { name: "PIXSH v1.0", vibe: "phosphor green · scanlines · VT323", dot: "#4af626" },
  noc: { name: "PACKETGRID", vibe: "NOC dashboard · cyan+green", dot: "#35f0c8" },
  min: { name: "collage.sh", vibe: "minimal · olive lime accent", dot: "#7a9a01" },
  glitchpage: { name: "GLITCHPAGE", vibe: "error page · neon pink · Thai", dot: "#ff3d8f" },
  claude: { name: "CLAUDE PAPER", vibe: "warm editorial · clay · serif", dot: "#d97757" },
  moss: { name: "MOSS", vibe: "organic · earth + terracotta · Fraunces", dot: "#6a8c3f" },
  brut: { name: "BRUT", vibe: "brutalist · red+black · Anton · 0px radius", dot: "#ff2e00" },
}

export default function Themes() {
  const { themeId, setTheme } = useTheme()

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Themes</h1>
        <p className="text-muted-foreground">
          9 design concepts from design-gallery, each as a shadcn v4 theme preset. Select one to see it applied.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(THEME_META).map(([id, meta]) => (
          <button
            key={id}
            onClick={() => setTheme(id as any)}
            className={`group text-left p-4 rounded-lg border transition-all ${
              themeId === id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border hover:border-muted-foreground bg-card"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-8 h-8 rounded-md"
                style={{ background: meta.dot }}
              />
              <Badge variant={themeId === id ? "default" : "outline"} className="text-[10px]">
                {id}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm mb-1">{meta.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{meta.vibe}</p>
            <div className="mt-3 flex gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: meta.dot }} />
              <div className="w-3 h-3 rounded-sm bg-foreground" />
              <div className="w-3 h-3 rounded-sm bg-muted" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
