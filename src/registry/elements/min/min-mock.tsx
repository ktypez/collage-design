import * as React from "react"
import { cn } from "@/lib/utils"

interface MinMockProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  extension?: string
  command?: string
  buttonText?: string
}

export function MinMock({ 
  className, 
  title = "collage",
  extension = ".sh",
  command = "$ build --output=png --theme=min",
  buttonText = "▶ render",
  ...props 
}: MinMockProps) {
  return (
    <div 
      className={cn("relative p-5 border rounded-xl", className)}
      style={{
        background: "var(--surface, var(--card))",
        border: "1px solid var(--border, #e5e5e5)",
        boxShadow: "0 8px 24px -12px rgba(20, 24, 16, 0.14)",
      }}
      {...props}
    >
      <div className="text-[28px] font-bold tracking-tight">
        {title}
        <span 
          className="px-1.5 rounded"
          style={{ 
            background: "var(--accent-bright, #c8ff00)",
            color: "var(--fg, #0e0e10)",
          }}
        >
          {extension}
        </span>
      </div>
      
      <div 
        className="font-mono text-xs my-1.5"
        style={{ color: "var(--fg-dim, var(--muted-foreground))" }}
      >
        {command}
      </div>
      
      <button
        className="inline-block px-4 py-2 rounded-lg text-xs font-bold"
        style={{
          background: "var(--accent, #7a9a01)",
          color: "#fff",
          boxShadow: "0 4px 14px -6px rgba(122, 154, 1, 0.4)",
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}
