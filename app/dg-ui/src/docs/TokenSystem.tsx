import { Card, CardContent, CardHeader, CardTitle } from "../Card"

export default function TokenSystem() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Token System</h1>
        <p className="text-muted-foreground">
          CSS custom properties that power all components. Defined in
          <code className="text-sm bg-muted px-1.5 py-0.5 rounded">src/tokens/schema.css</code>
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Color Tokens</h2>
        <p className="text-sm text-muted-foreground mb-3">
          All colors use HSL space-separated format: <code>H S% L%</code>.
          Components use <code>hsl(var(--primary))</code> or <code>hsl(var(--primary) / 0.5)</code> for opacity.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Surface & Brand</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-mono space-y-1">
              <div><span className="text-primary">--background</span> page bg</div>
              <div><span className="text-primary">--foreground</span> page text</div>
              <div><span className="text-primary">--card</span> raised surface</div>
              <div><span className="text-primary">--primary</span> main action color</div>
              <div><span className="text-primary">--secondary</span> secondary action</div>
              <div><span className="text-primary">--muted</span> subtle bg</div>
              <div><span className="text-primary">--accent</span> hover/selection</div>
              <div><span className="text-primary">--destructive</span> danger/delete</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status & Extended</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-mono space-y-1">
              <div><span className="text-primary">--success</span> green status</div>
              <div><span className="text-primary">--warning</span> yellow/amber</div>
              <div><span className="text-primary">--info</span> blue info</div>
              <div><span className="text-primary">--border</span> border color</div>
              <div><span className="text-primary">--input</span> input border</div>
              <div><span className="text-primary">--ring</span> focus ring</div>
              <div><span className="text-primary">--accent-2</span> secondary accent</div>
              <div><span className="text-primary">--terracotta</span> earth tone</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Shape Tokens</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-sm font-mono space-y-1 pt-4">
              <div><span className="text-primary">--radius</span> corner radius</div>
              <div><span className="text-primary">--radius-sm/md/lg/xl/2xl/3xl/4xl</span> scale</div>
              <div><span className="text-primary">--border-width</span> thickness</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-sm font-mono space-y-1 pt-4">
              <div><span className="text-primary">--shadow</span> base shadow</div>
              <div><span className="text-primary">--shadow-md</span> medium</div>
              <div><span className="text-primary">--shadow-lg</span> large</div>
              <div><span className="text-primary">--ease-spring</span> motion</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Typography Tokens</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-sm font-mono space-y-1 pt-4">
              <div><span className="text-primary">--font-sans</span> body font</div>
              <div><span className="text-primary">--font-mono</span> code font</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-sm font-mono space-y-1 pt-4">
              <div><span className="text-primary">--font-serif</span> display font</div>
              <div><span className="text-primary">--font-display</span> heading font</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Motion Tokens</h2>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm">
{`/* src/tokens/motion.css */
--duration-fast: 0.1s;
--duration-normal: 0.2s;
--ease-spring: cubic-bezier(0.34, 1.4, 0.5, 1);
--ease-bounce: cubic-bezier(0.68, -0.6, 0.32, 1.6);`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">How to Customize</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Override any token in your theme.css to change the entire look.
        </p>
        <pre className="p-4 bg-muted rounded-lg border border-border font-mono text-sm">
{`:root {
  --primary: 50 100% 71%;        /* amber */
  --radius: 0.375rem;            /* 6px */
  --border-width: 3px;           /* brutalist */
  --shadow: 4px 4px 0 var(--border); /* hard shadow */
  --font-sans: 'JetBrains Mono', ...;
}`}
        </pre>
      </section>
    </div>
  )
}
