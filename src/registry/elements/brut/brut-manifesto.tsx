import * as React from "react"
import { cn } from "@/lib/utils"

interface BrutManifestoProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string
  title?: string
  accent?: string
  description?: string
}

export function BrutManifesto({ 
  className, 
  kicker = "// manifesto · v1.0",
  title = "BEauty is not",
  accent = "requested.",
  description = "1px border · 0px radius · 100% attitude. design ที่ไม่ขออนุญาตใคร และไม่ต้องขอโทษด้วย",
  ...props 
}: BrutManifestoProps) {
  return (
    <div 
      className={cn("relative p-6 border-3", className)}
      style={{
        background: "var(--white, #ffffff)",
        border: "3px solid var(--fg, #0d0d0d)",
      }}
      {...props}
    >
      <div 
        className="h-3.5 mb-3.5"
        style={{ background: "var(--accent, #ff2e00)" }}
      />
      
      <div 
        className="font-mono text-[10px] tracking-widest uppercase mb-1.5 font-bold"
        style={{ color: "var(--fg, #0d0d0d)" }}
      >
        {kicker}
      </div>
      
      <h3 
        className="text-[34px] font-normal uppercase leading-none mb-2"
        style={{ 
          fontFamily: "var(--font-display, 'Anton', sans-serif)",
          color: "var(--fg, #0d0d0d)",
        }}
      >
        {title} <span style={{ color: "var(--accent, #ff2e00)" }}>{accent}</span>
      </h3>
      
      <p 
        className="text-xs mb-3.5"
        style={{ color: "var(--fg-muted, var(--muted-foreground))" }}
      >
        {description}
      </p>
    </div>
  )
}
