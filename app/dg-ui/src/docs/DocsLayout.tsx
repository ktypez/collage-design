import { useState } from "react"
import { Routes, Route, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
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
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      <h2 className="text-lg font-bold mb-4 px-1">Documentation</h2>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/docs"}
            onClick={() => setOpen(false)}
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
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-border h-screen sticky top-0 overflow-y-auto p-4 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border p-4 bg-background overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Documentation</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-md border border-border" aria-label="Close menu">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/docs"}
                  onClick={() => setOpen(false)}
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
            <div className="mt-4 p-3 rounded-lg bg-muted border border-border text-xs">
              <p className="font-medium mb-1">Version 0.5.0</p>
              <p className="text-muted-foreground">9 themes · 54 components · 99 tests</p>
            </div>
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 min-w-0 p-4 md:p-8">
        {/* Mobile docs nav bar */}
        <div className="md:hidden flex items-center gap-2 mb-4 border-b border-border pb-3">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md border border-border text-muted-foreground"
            aria-label="Open docs menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">Documentation</span>
        </div>
        <div className="max-w-4xl">
          <Routes>
            <Route index element={<GettingStarted />} />
            <Route path="getting-started" element={<GettingStarted />} />
            <Route path="tokens" element={<TokenSystem />} />
            <Route path="themes" element={<ThemesGuide />} />
            <Route path="cli" element={<CLIReference />} />
            <Route path="components" element={<ComponentGuide />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
