import * as React from "react"
import { cn } from "@/lib/utils"

interface GlitchStageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlitchStage({ className, children, ...props }: GlitchStageProps) {
  return (
    <div 
      className={cn(
        "relative z-[1] flex flex-col items-center gap-3.5 text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
