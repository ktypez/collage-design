import * as React from "react"
import { cn } from "@/lib/utils"
import "./glitchpage-effects.css"

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

export function GlitchText({ 
  className, 
  text = "404",
  ...props 
}: GlitchTextProps) {
  return (
    <div 
      className={cn(
        "relative font-display text-[110px] font-black leading-none",
        className
      )}
      style={{
        color: "var(--accent)",
        textShadow: "3px 0 var(--accent-2), -3px 0 #ffff00",
        animation: "gp-glitch 3s ease-in-out infinite",
      }}
      {...props}
    >
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          color: "var(--accent-2)",
          clipPath: "inset(20% 0 60% 0)",
          animation: "gp-glitch-offset 2s ease-in-out infinite",
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          color: "#ffff00",
          clipPath: "inset(60% 0 10% 0)",
          animation: "gp-glitch-offset 3s ease-in-out infinite reverse",
        }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  )
}
