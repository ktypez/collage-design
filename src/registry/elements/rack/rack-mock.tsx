import * as React from "react"
import { cn } from "@/lib/utils"

interface RackMockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function RackMock({ className, children, ...props }: RackMockProps) {
  return (
    <div 
      className={cn(
        "relative z-10 w-[88%] flex flex-col gap-2 py-3.5 px-4",
        className
      )}
      style={{
        background: "#0a0a0c",
        border: "1px solid var(--border-bright)",
        borderRadius: "4px",
        minHeight: "220px",
      }}
      {...props}
    >
      {children}
    </div>
  )
}
