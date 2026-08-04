import { useState } from "react"
import { Badge } from "./Badge"

const COMPONENTS = [
  { name: "button", cat: "foundations", variants: ["primary", "secondary", "outline", "ghost", "destructive", "link"] },
  { name: "input", cat: "foundations", variants: ["default", "sm", "lg", "disabled"] },
  { name: "textarea", cat: "foundations", variants: ["default"] },
  { name: "select", cat: "foundations", variants: ["default"] },
  { name: "checkbox", cat: "foundations", variants: ["checked", "unchecked"] },
  { name: "radio", cat: "foundations", variants: ["checked", "unchecked"] },
  { name: "switch", cat: "foundations", variants: ["on", "off"] },
  { name: "label", cat: "foundations", variants: ["default"] },
  { name: "separator", cat: "foundations", variants: ["default"] },
  { name: "skeleton", cat: "foundations", variants: ["default"] },
  { name: "kbd", cat: "foundations", variants: ["default"] },
  { name: "toggle", cat: "foundations", variants: ["on", "off"] },
  { name: "card", cat: "surfaces", variants: ["default"] },
  { name: "alert", cat: "surfaces", variants: ["info", "warn", "danger", "success"] },
  { name: "badge", cat: "surfaces", variants: ["default", "secondary", "outline", "muted", "success", "danger"] },
  { name: "status", cat: "surfaces", variants: ["ok", "warn", "bad"] },
  { name: "blockquote", cat: "surfaces", variants: ["default"] },
  { name: "code", cat: "surfaces", variants: ["default"] },
  { name: "terminal", cat: "surfaces", variants: ["default"] },
  { name: "empty", cat: "surfaces", variants: ["default"] },
  { name: "avatar", cat: "surfaces", variants: ["sm", "default", "lg", "xl"] },
  { name: "aspect", cat: "surfaces", variants: ["square", "video", "portrait"] },
  { name: "table", cat: "data", variants: ["default", "striped", "compact"] },
  { name: "tabs", cat: "data", variants: ["default", "underline"], interactive: true },
  { name: "accordion", cat: "data", variants: ["single", "multiple"], interactive: true },
  { name: "progress", cat: "data", variants: ["default", "success", "warn", "danger", "indeterminate"] },
  { name: "pagination", cat: "data", variants: ["default"] },
  { name: "breadcrumb", cat: "data", variants: ["default"] },
  { name: "spinner", cat: "data", variants: ["sm", "default", "lg"] },
  { name: "dialog", cat: "overlays", variants: ["default"], interactive: true },
  { name: "sheet", cat: "overlays", variants: ["right", "left", "top", "bottom"], interactive: true },
  { name: "drawer", cat: "overlays", variants: ["default"], interactive: true },
  { name: "popover", cat: "overlays", variants: ["default"], interactive: true },
  { name: "tooltip", cat: "overlays", variants: ["top", "bottom", "left", "right"], interactive: true },
  { name: "hovercard", cat: "overlays", variants: ["default"], interactive: true },
  { name: "menu", cat: "overlays", variants: ["default"], interactive: true },
  { name: "contextmenu", cat: "overlays", variants: ["default"], interactive: true },
  { name: "menubar", cat: "overlays", variants: ["default"], interactive: true },
  { name: "navmenu", cat: "overlays", variants: ["default"], interactive: true },
  { name: "slider", cat: "forms", variants: ["default"], interactive: true },
  { name: "combobox", cat: "forms", variants: ["default"], interactive: true },
  { name: "command", cat: "forms", variants: ["default"], interactive: true },
  { name: "calendar", cat: "advanced", variants: ["default"], interactive: true },
  { name: "datepicker", cat: "advanced", variants: ["default"], interactive: true },
  { name: "carousel", cat: "advanced", variants: ["default"], interactive: true },
  { name: "resizable", cat: "advanced", variants: ["default"], interactive: true },
  { name: "collapsible", cat: "advanced", variants: ["default"], interactive: true },
]

export default function Components() {
  const [filter, setFilter] = useState("all")
  const cats = ["all", ...new Set(COMPONENTS.map(c => c.cat))]
  const filtered = filter === "all" ? COMPONENTS : COMPONENTS.filter(c => c.cat === filter)

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Components</h1>
        <p className="text-muted-foreground">
          {COMPONENTS.length} shadcn components from Radix UI primitives.
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat} {cat === "all" ? `(${COMPONENTS.length})` : `(${COMPONENTS.filter(c => c.cat === cat).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(comp => (
          <div key={comp.name} className="p-3 rounded-lg border border-border bg-card hover:border-muted-foreground transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-medium">{comp.name}</span>
              {comp.interactive && <Badge variant="outline" className="text-[10px]">JS</Badge>}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {comp.variants.map(v => (
                <span key={v} className="px-1.5 py-0.5 text-[10px] bg-muted rounded text-muted-foreground">{v}</span>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">.{comp.name}{comp.variants[0] !== "default" ? `.${comp.variants[0]}` : ""}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
