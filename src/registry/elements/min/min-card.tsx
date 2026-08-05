import * as React from "react"
import { cn } from "@/lib/utils"

interface MinCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function MinCard({ 
  className, 
  title = "Minimal Design",
  description = "Clean, focused, essential. Nothing more, nothing less.",
  ...props 
}: MinCardProps) {
  return (
    <div 
      className={cn("p-5 border rounded-lg", className)}
      style={{
        background: "var(--surface, var(--card))",
        border: "1px solid var(--border, #e5e5e5)",
      }}
      {...props}
    >
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--fg, var(--foreground))" }}
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
