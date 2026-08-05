import * as React from "react"
import { cn } from "@/lib/utils"

interface NocGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
}

export function NocGrid({ 
  className, 
  columns = 3,
  children,
  ...props 
}: NocGridProps) {
  return (
    <div 
      className={cn("grid gap-2 rounded-md p-3.5", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        background: "rgba(10, 15, 20, 0.9)",
        border: "1px solid var(--border-bright, var(--border))",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
