import * as React from "react"
import { cn } from "@/lib/utils"

interface CrtTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CrtTerminal({ className, children, ...props }: CrtTerminalProps) {
  return (
    <div 
      className={cn(
        "relative w-[88%] px-4 py-4 font-mono text-lg leading-relaxed",
        className
      )}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--fg)",
        textShadow: "0 0 8px rgba(74, 246, 38, 0.5)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
