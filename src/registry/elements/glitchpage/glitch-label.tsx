import * as React from "react"
import { cn } from "@/lib/utils"

interface GlitchLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlitchLabel({ className, children, ...props }: GlitchLabelProps) {
  return (
    <div 
      className={cn(
        "font-mono text-[11px] tracking-[0.2em] uppercase",
        className
      )}
      style={{
        color: "var(--fg-dim)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
