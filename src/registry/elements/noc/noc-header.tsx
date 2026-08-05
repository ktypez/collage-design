import * as React from "react"
import { cn } from "@/lib/utils"
import "./noc-effects.css"

interface NocHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function NocHeader({ 
  className, 
  label = "// MOCKUP · NOC_01",
  ...props 
}: NocHeaderProps) {
  return (
    <div 
      className={cn("flex items-center gap-2 px-4 py-2 border-b font-mono text-[10px] tracking-widest", className)}
      style={{
        background: "var(--surface-2, var(--muted))",
        borderBottomColor: "var(--border-bright, var(--border))",
        color: "var(--fg, var(--foreground))",
      }}
      {...props}
    >
      <div 
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: "var(--ok, #3ddc84)",
          boxShadow: "0 0 6px var(--ok, #3ddc84)",
          animation: "noc-pulse 1.6s ease-in-out infinite",
        }}
      />
      {label}
    </div>
  )
}
