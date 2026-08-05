import * as React from "react"
import { cn } from "@/lib/utils"

interface MossCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function MossCard({ 
  className, 
  title = "Organic Growth",
  description = "Natural patterns emerge from simple rules. Watch the garden grow.",
  ...props 
}: MossCardProps) {
  return (
    <div 
      className={cn("p-5 border rounded-xl", className)}
      style={{
        background: "var(--surface, var(--card))",
        border: "1px solid var(--border, #d4c9b8)",
      }}
      {...props}
    >
      <h3 
        className="text-xl font-semibold mb-2 tracking-tight"
        style={{ 
          fontFamily: "var(--font-display, 'Fraunces', serif)",
          color: "var(--fg, var(--foreground))",
        }}
      >
        {title}
      </h3>
      <p 
        className="text-sm leading-relaxed"
        style={{ color: "var(--fg-muted, var(--muted-foreground))" }}
      >
        {description}
      </p>
    </div>
  )
}
