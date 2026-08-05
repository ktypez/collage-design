import * as React from "react"
import { cn } from "@/lib/utils"
import "./crt-effects.css"

interface CrtLedProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string
}

export function CrtLed({ 
  className, 
  color = "var(--accent)",
  ...props 
}: CrtLedProps) {
  return (
    <span 
      className={cn("inline-block w-[9px] h-[9px] rounded-full mr-1 align-middle", className)}
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: "crt-led 1.2s ease-in-out infinite",
      }}
      {...props}
    />
  )
}
