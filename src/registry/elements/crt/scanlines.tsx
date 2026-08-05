import * as React from "react"

export function Scanlines() {
  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.18) 0,
          rgba(0, 0, 0, 0.18) 1px,
          transparent 1px,
          transparent 3px
        )`,
      }}
    />
  )
}
