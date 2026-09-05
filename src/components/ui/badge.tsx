import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-white text-black hover:bg-white/80": variant === "default",
          "border-transparent bg-white/10 text-white hover:bg-white/20": variant === "secondary",
          "border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/80": variant === "destructive",
          "border-transparent bg-emerald-900/50 text-emerald-200 hover:bg-emerald-900/80": variant === "success",
          "text-white border-white/20": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
