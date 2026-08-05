import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useTheme } from "./lib/theme"
import { Home, Palette, Settings, Package, Search, BookOpen, LayoutDashboard, Menu } from "lucide-react"

const nav = [
  { to: "/", icon: Home, label: "Landing" },
  { to: "/home", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/themes", icon: Palette, label: "Themes" },
  { to: "/builder", icon: Settings, label: "Builder" },
  { to: "/components", icon: Package, label: "Components" },
  { to: "/extract", icon: Search, label: "Extract" },
  { to: "/docs", icon: BookOpen, label: "Documentation" },
]

export default function Layout() {
  const { themeId, mode, setMode } = useTheme()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">DG</div>
          <div>
            <div className="font-semibold text-sm">Design Gallery</div>
            <div className="text-xs text-muted-foreground">v0.5.0</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50"
              }`
            }
          >
            <n.icon className="w-4 h-4 shrink-0" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border space-y-2">
        <div className="text-xs text-muted-foreground font-mono">Theme: {themeId}</div>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("light")}
            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
              mode === "light" ? "bg-primary text-primary-foreground border-primary" : "border-border"
            }`}
          >Light</button>
          <button
            onClick={() => setMode("dark")}
            className={`flex-1 text-xs py-1.5 rounded border transition-colors ${
              mode === "dark" ? "bg-primary text-primary-foreground border-primary" : "border-border"
            }`}
          >Dark</button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r border-border flex-col bg-card sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border flex flex-col bg-card">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 p-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md border border-border text-muted-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-semibold text-sm">Design Gallery</div>
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setMode("light")}
              className={`text-xs px-2 py-1 rounded border ${
                mode === "light" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}
            >light</button>
            <button
              onClick={() => setMode("dark")}
              className={`text-xs px-2 py-1 rounded border ${
                mode === "dark" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}
            >dark</button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
