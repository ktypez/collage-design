import * as React from "react"
import { cn } from "@/lib/utils"

interface MckyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function MckyCard({ 
  className, 
  title = "Neobrutalism",
  description = "3px borders, hard shadows, mono fonts. No mercy.",
  ...props 
}: MckyCardProps) {
  return (
    <div 
      className={cn("p-4 border-3", className)}
      style={{
        background: "var(--surface, var(--card))",
        border: "3px solid var(--border, #0a0a0c)",
        boxShadow: "var(--shadow, 4px 4px 0 var(--border))",
      }}
      {...props}
    >
      <h3 
        className="text-lg font-bold mb-2 uppercase tracking-wide"
        style={{ 
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          color: "var(--fg, var(--foreground))",
        }}
      >
        {title}
      </h3>
      <p 
        className="text-sm"
        style={{ color: "var(--fg-muted, var(--muted-foreground))" }}
      >
        {description}
      </p>
    </div>
  )
}
