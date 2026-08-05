import * as React from "react"
import { cn } from "@/lib/utils"
import "./crt-effects.css"

interface BlinkCursorProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BlinkCursor({ className, ...props }: BlinkCursorProps) {
  return (
    <span 
      className={cn("inline-block w-2.5 h-[1em] align-text-bottom", className)}
      style={{
        background: "var(--accent)",
        animation: "crt-blink 1s steps(1) infinite",
      }}
      {...props}
    />
  )
}
