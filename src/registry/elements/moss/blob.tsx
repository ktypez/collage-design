import * as React from "react"
import { cn } from "@/lib/utils"
import "./moss-effects.css"

interface BlobProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: string
}

export function Blob({ 
  className, 
  size = "md",
  color = "var(--accent, #6a8c3f)",
  ...props 
}: BlobProps) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }
  
  return (
    <div 
      className={cn(
        "rounded-full",
        sizes[size],
        className
      )}
      style={{
        background: color,
        animation: "blob-drift 16s ease-in-out infinite",
      }}
      {...props}
    />
  )
}
