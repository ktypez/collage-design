import * as React from "react"
import { cn } from "@/lib/utils"

interface MckyTodoProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  items?: Array<{
    text: string
    done?: boolean
    priority?: "high" | "med" | "low"
    tag?: string
  }>
}

export function MckyTodo({ 
  className, 
  title = "today",
  items = [
    { text: "ship neobrutalism theme", done: true, priority: "high", tag: "build" },
    { text: "write blog #th", done: true, priority: "med" },
    { text: "water the plants", done: false, priority: "low" },
  ],
  ...props 
}: MckyTodoProps) {
  const priorityColors = {
    high: "var(--danger, #ff3b30)",
    med: "var(--warn, #ffb000)",
    low: "var(--info, #00d4ff)",
  }
  
  return (
    <div 
      className={cn("border-3 bg-surface", className)}
      style={{
        border: "3px solid var(--border, #0a0a0c)",
        background: "var(--surface, var(--card))",
        boxShadow: "var(--shadow, 4px 4px 0 var(--border))",
      }}
      {...props}
    >
      <div 
        className="flex items-center justify-between px-4 py-3 border-b-3"
        style={{ borderBottom: "3px solid var(--border, #0a0a0c)" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-wider">
          {title}
        </div>
        <div 
          className="text-[10px]"
          style={{ color: "var(--fg-dim, var(--muted-foreground))" }}
        >
          {items.filter(i => i.done).length} / {items.length} done
        </div>
      </div>
      
      {items.map((item, i) => (
        <div 
          key={i}
          className="flex items-center gap-2 px-4 py-2.5 border-b-2 last:border-b-0"
          style={{ borderBottom: i < items.length - 1 ? "2px solid var(--border, #0a0a0c)" : "none" }}
        >
          <div 
            className="w-3.5 h-3.5 border-2 rounded-[3px] flex-shrink-0 grid place-items-center"
            style={{ 
              border: "2px solid var(--border, #0a0a0c)",
              background: item.done ? "var(--fg, var(--foreground))" : "transparent",
            }}
          >
            {item.done && (
              <div 
                className="w-[5px] h-2 border-r-2 border-b-2 rotate-45 -translate-x-[1px] -translate-y-[1px]"
                style={{ borderColor: "var(--surface, var(--card))" }}
              />
            )}
          </div>
          
          {item.priority && (
            <div 
              className="w-2 h-2 rounded-full border flex-shrink-0"
              style={{ 
                background: priorityColors[item.priority],
                border: `1px solid var(--border, #0a0a0c)`,
              }}
            />
          )}
          
          <div 
            className={cn("flex-1 text-xs", item.done && "line-through")}
            style={{ 
              color: item.done ? "var(--fg-dim, var(--muted-foreground))" : "var(--fg, var(--foreground))",
            }}
          >
            {item.text}
          </div>
          
          {item.tag && (
            <div 
              className="text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 border-2 rounded"
              style={{ 
                border: "1.5px solid var(--border, #0a0a0c)",
                color: "var(--fg-muted, var(--muted-foreground))",
              }}
            >
              {item.tag}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
