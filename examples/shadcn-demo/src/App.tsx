import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/lib/theme"

const THEME_LIST = [
  { id: "mcky", sw: "#ffe066" },
  { id: "rack", sw: "#ffb000" },
  { id: "crt", sw: "#4af626" },
  { id: "noc", sw: "#35f0c8" },
  { id: "min", sw: "#7a9a01" },
  { id: "glitchpage", sw: "#ff3d8f" },
  { id: "claude", sw: "#d97757" },
  { id: "moss", sw: "#6a8c3f" },
  { id: "brut", sw: "#ff2e00" },
]

export default function App() {
  const { id, name, mode, setTheme, toggleMode } = useTheme()
  const [sound, setSound] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <span className="font-mono text-sm font-semibold tracking-tight">
            DG → shadcn <span className="text-muted-foreground">· drop-in demo</span>
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:block">
              theme: <span className="font-mono font-medium text-foreground">{id}</span>
            </span>
            <Button variant="outline" size="sm" onClick={toggleMode}>
              {mode === "light" ? "🌙 dark" : "☀️ light"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* theme picker */}
        <section className="mb-10">
          <h1 className="mb-1 text-3xl font-bold tracking-tight">{name}</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            9 design concepts จาก design-gallery ใช้เป็น shadcn theme preset — สลับได้ทันที runtime.
            Components ทั้งหมดเป็น Radix UI ผ่าน shadcn CLI.
          </p>
          <div className="flex flex-wrap gap-2">
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                  id === t.id
                    ? "border-ring bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.sw }} />
                {t.id}
              </button>
            ))}
          </div>
        </section>

        {/* buttons + badges */}
        <section className="mb-8 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Buttons & badges</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button>primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="outline">outline</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="destructive">destructive</Button>
            <Button disabled>disabled</Button>
            <Badge>default</Badge>
            <Badge variant="secondary">secondary</Badge>
            <Badge variant="destructive">destructive</Badge>
            <Badge variant="outline">outline</Badge>
          </div>
        </section>

        {/* cards + dialog */}
        <section className="mb-8 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Cards + dialog</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Card description ที่ใช้ theme tokens ของเรา</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  พิสูจน์ว่า color / radius / shadow จาก themes/shadcn/&lt;id&gt;.css
                  ตกไปถึง Radix component จริง.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Radix dialog</DialogTitle>
                      <DialogDescription>
                        This dialog is Radix UI — theme comes from our preset.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-muted-foreground">
                      Focus trap, ARIA, ESC — ทั้งหมด Radix จัดการให้
                    </div>
                    <DialogFooter>
                      <Button type="submit">confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">secondary</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form controls</CardTitle>
                <CardDescription>Input, switch — styled by our vars</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Input placeholder="email@example.com" />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Sound effects</div>
                    <div className="text-xs text-muted-foreground">Play sound on new task</div>
                  </div>
                  <Switch checked={sound} onCheckedChange={setSound} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* tabs + alert */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Tabs + alerts</h2>
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="pt-2">
              <Alert>
                <AlertTitle>Account tab</AlertTitle>
                <AlertDescription>
                  Tabs content — ใช้ theme tokens เหมือนกันหมด
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="billing" className="pt-2">
              <Alert variant="destructive">
                <AlertTitle>Billing overdue</AlertTitle>
                <AlertDescription>ตัวอย่าง destructive alert</AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="settings" className="pt-2">
              <Alert variant="default">
                <AlertTitle>Settings</AlertTitle>
                <AlertDescription>ทุกอย่างอ่านจาก CSS variables เดียวกัน</AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </section>

        <footer className="mt-12 border-t pt-6 text-center font-mono text-xs text-muted-foreground">
          React 19 · Radix UI · Tailwind v4 · theme จาก design-gallery/themes/shadcn
        </footer>
      </main>
    </div>
  )
}
