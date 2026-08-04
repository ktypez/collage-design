import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "./lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "muted"
}
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
      {
        "border-transparent bg-primary text-primary-foreground": variant === "default",
        "border-transparent bg-secondary text-secondary-foreground": variant === "secondary",
        "border-border text-foreground": variant === "outline",
        "border-transparent bg-destructive text-destructive-foreground": variant === "destructive",
        "border-transparent bg-success text-foreground": variant === "success",
        "border-transparent bg-muted text-muted-foreground": variant === "muted",
      },
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"
