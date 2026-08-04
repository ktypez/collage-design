import { NavLink, Outlet } from "react-router-dom"
import { useTheme } from "./lib/theme"
import { Home, Palette, Settings, Package, Search, } from "lucide-react"

const nav = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/themes", icon: Palette, label: "Themes" },
  { to: "/builder", icon: Settings, label: "Builder" },
  { to: "/components", icon: Package, label: "Components" },
  { to: "/extract", icon: Search, label: "Extract" },
]

export default function Layout() {
  const { themeId, mode, setMode } = useTheme()

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col bg-card">
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
