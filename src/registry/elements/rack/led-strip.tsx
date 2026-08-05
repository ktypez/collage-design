import * as React from "react"
import { cn } from "@/lib/utils"
import "./rack-effects.css"

interface LedStripProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[]
  animated?: boolean
}

export function LedStrip({ 
  className, 
  colors = ["var(--accent-2)", "var(--accent)", "var(--led-cyan)", "var(--accent-2)"],
  animated = true,
  ...props 
}: LedStripProps) {
  return (
    <div className={cn("flex gap-2 items-center", className)} {...props}>
      {colors.map((color, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
            animation: animated ? `rk-led 1.4s ease-in-out infinite ${i * 0.3}s` : undefined,
          }}
        />
      ))}
    </div>
  )
}
