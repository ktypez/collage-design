import { Badge } from "../Badge"

export default function GettingStarted() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Getting Started</h1>
        <p className="text-muted-foreground">
          Set up Design Gallery Framework in your project in 3 steps.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">1. Install the Framework</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Initialize a new project with the DG CLI. This sets up Tailwind v4, React, and
          shadcn/ui components.
        </p>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`# Create new project
npx dg init my-project
cd my-project

# Or add to existing project
npx dg init --dir ./my-existing-app`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. Add a Theme</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Choose from 9 design concepts. Each theme is a shadcn v4 preset with exact brand colors.
        </p>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`# Apply theme to your project
npx dg add theme mcky --shadcn --dir .

# Or generate all themes
npx dg shadcn
npx dg shadcn --oklch  # oklch format (shadcn native)`}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2">
          {["mcky", "rack", "crt", "noc", "min", "glitchpage", "claude", "moss", "brut"].map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">3. Add Components</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Add Radix-based shadcn components. All components use your theme tokens automatically.
        </p>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`# Add components via shadcn CLI
npx shadcn@latest add button card dialog tabs

# Or use the DG CLI to add individual components
npx dg add component button`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">4. Start Building</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function App() {
  return (
    <div className="p-8 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>My App</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  )
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Project Structure</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm overflow-x-auto">
{`my-project/
├── src/
│   ├── components/ui/     ← shadcn components (Radix)
│   ├── lib/utils.ts       ← utility functions
│   └── globals.css        ← theme tokens + Tailwind
├── themes/shadcn/         ← DG theme presets
├── bin/dg.js              ← CLI tool
├── package.json
└── tsconfig.json`}
        </pre>
      </section>
    </div>
  )
}
