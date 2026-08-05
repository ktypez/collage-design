import { Badge } from "./Badge"
import { useTheme, AVAILABLE_THEMES } from "./lib/theme"

export default function Themes() {
  const { themeId, setTheme, installed } = useTheme()

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Themes</h1>
        <p className="text-muted-foreground">
          {installed.length} installed · {Object.keys(AVAILABLE_THEMES).length} available in registry.
          Add more with <code className="text-sm bg-muted px-1.5 py-0.5 rounded">npx dg add theme &lt;id&gt; --ui</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(AVAILABLE_THEMES).map(([id, meta]) => {
          const isInstalled = installed.includes(id)
          const isActive = themeId === id
          return (
            <div
              key={id}
              className={`group text-left p-4 rounded-lg border transition-all ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card"
              } ${isInstalled ? "cursor-pointer hover:border-muted-foreground" : "opacity-70"}`}
              onClick={() => isInstalled && setTheme(id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-md"
                  style={{ background: meta.color }}
                />
                {isInstalled ? (
                  <Badge variant={isActive ? "default" : "outline"} className="text-[10px]">
                    {isActive ? "active" : "installed"}
                  </Badge>
                ) : (
                  <Badge variant="muted" className="text-[10px]">+ add</Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1">{meta.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{meta.vibe}</p>
              <div className="mt-3 flex gap-1 items-center">
                <div className="w-3 h-3 rounded-sm" style={{ background: meta.color }} />
                <div className="w-3 h-3 rounded-sm bg-foreground" />
                <div className="w-3 h-3 rounded-sm bg-muted" />
                {!isInstalled && (
                  <code className="ml-auto text-[10px] font-mono text-muted-foreground">
                    dg add theme {id} --ui
                  </code>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
