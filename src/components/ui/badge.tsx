import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "navy" | "gold";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-800",
    navy: "bg-asu-navy/10 text-asu-navy border border-asu-navy/20",
    gold: "bg-asu-gold-50 text-asu-gold-dark border border-asu-gold/30 font-bold",
    success: "bg-asu-green-50 text-asu-green border border-asu-green/20",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    outline: "border border-slate-300 text-slate-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
