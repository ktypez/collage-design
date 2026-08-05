import { Routes, Route, NavLink } from "react-router-dom"
import GettingStarted from "./GettingStarted"
import TokenSystem from "./TokenSystem"
import ThemesGuide from "./ThemesGuide"
import CLIReference from "./CLIReference"
import ComponentGuide from "./ComponentGuide"

const links = [
  { to: "/docs", label: "Overview" },
  { to: "/docs/getting-started", label: "Getting Started" },
  { to: "/docs/tokens", label: "Token System" },
  { to: "/docs/themes", label: "Themes" },
  { to: "/docs/cli", label: "CLI Commands" },
  { to: "/docs/components", label: "Components" },
]

export default function DocsLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border h-screen sticky top-0 overflow-y-auto p-4">
        <h2 className="text-lg font-bold mb-4">Documentation</h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/docs"}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 p-3 rounded-lg bg-muted border border-border text-xs">
          <p className="font-medium mb-1">Version 0.5.0</p>
          <p className="text-muted-foreground">9 themes · 54 components · 99 tests</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 max-w-4xl">
        <Routes>
          <Route index element={<GettingStarted />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="tokens" element={<TokenSystem />} />
          <Route path="themes" element={<ThemesGuide />} />
          <Route path="cli" element={<CLIReference />} />
          <Route path="components" element={<ComponentGuide />} />
        </Routes>
      </main>
    </div>
  )
}
