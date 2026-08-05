import { Card, CardContent, CardHeader, CardTitle } from "../Card"

const COMMANDS = [
  {
    name: "dg init",
    usage: "dg init [dir]",
    desc: "Scaffold a new project with Tailwind v4, React, and shadcn/ui",
    example: "npx dg init my-app",
    flags: [
      { flag: "--dir", desc: "target directory (default: current)" },
      { flag: "--no-demo", desc: "skip demo page generation" },
    ],
  },
  {
    name: "dg add theme",
    usage: "dg add theme <id> --shadcn [--dir <path>]",
    desc: "Apply a DG theme to a shadcn project's globals.css",
    example: "npx dg add theme mcky --shadcn --dir ./my-app",
    flags: [
      { flag: "--shadcn", desc: "write to globals.css (shadcn format)" },
      { flag: "--dir", desc: "target project root (auto-finds globals.css)" },
      { flag: "--globals", desc: "explicit path to globals.css" },
    ],
  },
  {
    name: "dg shadcn",
    usage: "dg shadcn [theme-id...]",
    desc: "Generate all 9 themes in shadcn v4 format",
    example: "npx dg shadcn --oklch",
    flags: [
      { flag: "--oklch", desc: "emit oklch() format (shadcn native)" },
      { flag: "--check", desc: "verify only, no write" },
    ],
  },
  {
    name: "dg extract",
    usage: "dg extract <url|css> [--name <id>]",
    desc: "Auto-generate shadcn theme from CSS/URL (best-effort)",
    example: "npx dg extract https://example.com --name mybrand",
    flags: [
      { flag: "--file", desc: "local CSS file instead of URL" },
      { flag: "--name", desc: "custom theme name" },
      { flag: "--oklch", desc: "emit oklch format" },
      { flag: "--light-only", desc: "force light mode" },
      { flag: "--dark-only", desc: "force dark mode" },
    ],
  },
  {
    name: "dg list",
    usage: "dg list [themes|components]",
    desc: "List available themes or components",
    example: "npx dg list themes",
    flags: [],
  },
  {
    name: "dg check",
    usage: "dg check",
    desc: "Syntax-check + token contract validation + contrast check",
    example: "npx dg check",
    flags: [],
  },
  {
    name: "dg codegen",
    usage: "dg codegen [theme-id]",
    desc: "Regenerate vanilla themes from canonical THEMES map",
    example: "npx dg codegen mcky",
    flags: [],
  },
]

export default function CLIReference() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">CLI Commands</h1>
        <p className="text-muted-foreground">
          The <code className="text-sm bg-muted px-1.5 py-0.5 rounded">dg</code> CLI provides 9 commands for managing themes, components, and project setup.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Commands</h2>
        <div className="space-y-4">
          {COMMANDS.map((cmd) => (
            <Card key={cmd.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono">{cmd.usage}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{cmd.desc}</p>
                <pre className="p-3 bg-muted rounded border border-border text-xs font-mono overflow-x-auto">
                  $ {cmd.example}
                </pre>
                {cmd.flags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Flags:</p>
                    <div className="space-y-1">
                      {cmd.flags.map((f) => (
                        <div key={f.flag} className="flex gap-2 text-xs">
                          <code className="text-primary font-mono">{f.flag}</code>
                          <span className="text-muted-foreground">{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Installation</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`# Install globally
npm install -g design-gallery

# Or use npx (no install needed)
npx dg help

# Or run locally
node bin/dg.js help`}
        </pre>
      </section>
    </div>
  )
}
