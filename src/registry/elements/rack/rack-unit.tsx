import * as React from "react"
import { cn } from "@/lib/utils"
import "./rack-effects.css"

interface RackUnitProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  ledColor?: string
  showScrews?: boolean
}

export function RackUnit({ 
  className, 
  label,
  ledColor = "var(--accent)",
  showScrews = true,
  ...props 
}: RackUnitProps) {
  return (
    <div 
      className={cn(
        "relative flex items-center justify-between px-4 min-h-[44px] font-mono text-sm",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #1c1c20, #0a0a0c)",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
      }}
      {...props}
    >
      {showScrews && (
        <>
          <div 
            className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #5a5a63, #1a1a20)",
              boxShadow: "0 0 0 1px #0a0a0c",
            }}
          />
          <div 
            className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, #5a5a63, #1a1a20)",
              boxShadow: "0 0 0 1px #0a0a0c",
            }}
          />
        </>
      )}
      <span>{label}</span>
      <div 
        className="w-2 h-2 rounded-full"
        style={{
          background: ledColor,
          boxShadow: `0 0 8px ${ledColor}`,
          animation: "rk-led 1.4s ease-in-out infinite",
        }}
      />
    </div>
  )
}
