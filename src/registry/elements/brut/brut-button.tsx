import * as React from "react"
import { cn } from "@/lib/utils"

interface BrutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default"
}

export function BrutButton({ 
  className, 
  variant = "default",
  children,
  ...props 
}: BrutButtonProps) {
  const styles = variant === "primary" 
    ? {
        background: "var(--accent, #ff2e00)",
        color: "#fff",
        border: "2px solid var(--fg, #0d0d0d)",
      }
    : {
        background: "var(--white, #ffffff)",
        color: "var(--fg, #0d0d0d)",
        border: "2px solid var(--fg, #0d0d0d)",
      }
  
  return (
    <button
      className={cn(
        "px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-none",
        "hover:invert cursor-pointer",
        className
      )}
      style={{
        ...styles,
        borderRadius: "0",
        fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
      }}
      {...props}
    >
      {children}
    </button>
  )
}
