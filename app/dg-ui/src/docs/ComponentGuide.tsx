
import { Badge } from "../Badge"

const categories = [
  {
    name: "Foundations",
    count: 12,
    components: ["button", "input", "textarea", "select", "checkbox", "radio", "switch", "label", "separator", "skeleton", "kbd", "toggle"],
  },
  {
    name: "Surfaces",
    count: 10,
    components: ["card", "alert", "badge", "status-pill", "blockquote", "code", "terminal", "empty", "avatar", "aspect-ratio"],
  },
  {
    name: "Data Display",
    count: 8,
    components: ["table", "tabs", "accordion", "progress", "pagination", "breadcrumb", "scroll-area", "spinner"],
  },
  {
    name: "Forms",
    count: 7,
    components: ["form", "field", "item", "slider", "toggle-group", "combobox", "command"],
  },
  {
    name: "Overlays",
    count: 11,
    components: ["dialog", "sheet", "drawer", "popover", "tooltip", "hover-card", "menu", "contextmenu", "menubar", "navmenu", "toast"],
    note: "Require JavaScript (components.js)",
  },
  {
    name: "Advanced",
    count: 6,
    components: ["resizable", "collapsible", "calendar", "datepicker", "carousel", "motion"],
    note: "Require JavaScript (components.js)",
  },
]

export default function ComponentGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Components</h1>
        <p className="text-muted-foreground">
          54+ components organized by category. All components use CSS variables from the token system.
          Overlay and advanced components require JavaScript (<code className="text-sm bg-muted px-1.5 py-0.5 rounded">components.js</code>).
        </p>
      </div>

      {categories.map((cat) => (
        <section key={cat.name}>
          <h2 className="text-xl font-semibold mb-3">
            {cat.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({cat.count})</span>
          </h2>
          {cat.note && (
            <p className="text-xs text-muted-foreground mb-3 italic">{cat.note}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {cat.components.map((comp) => (
              <div
                key={comp}
                className="p-3 rounded-lg border border-border bg-card hover:border-muted-foreground transition-colors"
              >
                <span className="font-mono text-sm font-medium">{comp}</span>
                {cat.note?.includes("JavaScript") && (
                  <Badge variant="outline" className="text-[10px] ml-1">JS</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="text-xl font-semibold mb-3">Adding Components</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm">
{`# Add via DG CLI
npx dg add component button

# Add via shadcn CLI (Radix-based)
npx shadcn@latest add button card dialog tabs`}
        </pre>
      </section>
    </div>
  )
}
