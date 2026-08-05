import * as React from "react"
import { cn } from "@/lib/utils"

interface NocTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string
  unit?: string
}

export function NocTile({ 
  className, 
  label = "CPU",
  value = "42%",
  unit = "▲ stable",
  ...props 
}: NocTileProps) {
  return (
    <div 
      className={cn(
        "border rounded p-2.5 min-h-[40px] flex flex-col justify-center gap-0.5 font-mono",
        className
      )}
      style={{
        background: "var(--surface, var(--card))",
        borderColor: "var(--border, #2a2a32)",
      }}
      {...props}
    >
      <div 
        className="tracking-wider text-[9px] uppercase"
        style={{ color: "var(--fg-dim, var(--muted-foreground))" }}
      >
        {label}
      </div>
      <div 
        className="text-[22px] font-bold leading-tight"
        style={{ color: "var(--accent-2, #00ff66)" }}
      >
        {value}
      </div>
      {unit && (
        <div 
          className="tracking-wide text-[9px]"
          style={{ color: "var(--ok, #3ddc84)" }}
        >
          {unit}
        </div>
      )}
    </div>
  )
}
