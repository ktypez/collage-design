import * as React from "react"
import { cn } from "@/lib/utils"

interface RackBezelProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function RackBezel({ 
  className, 
  label = "// MOCKUP · RACK_01",
  children,
  ...props 
}: RackBezelProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div 
        className="flex items-center gap-2 px-4 py-2.5 border-b font-mono text-[10px] tracking-widest"
        style={{
          background: "var(--bg-2)",
          borderBottomColor: "var(--border-bright)",
          color: "var(--accent)",
        }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: "var(--accent-2)",
            boxShadow: "0 0 6px var(--accent-2)",
            animation: "rk-pulse 1.4s ease-in-out infinite",
          }}
        />
        {label}
      </div>
      {children}
    </div>
  )
}
