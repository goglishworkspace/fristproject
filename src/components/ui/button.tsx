import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "gold" | "green";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variantStyles = {
      primary: "bg-asu-navy text-white hover:bg-asu-navy-light shadow-md shadow-asu-navy/20 active:brightness-90 active:opacity-95",
      gold: "bg-asu-gold text-slate-900 font-bold hover:bg-asu-gold-light shadow-md shadow-asu-gold/25 active:brightness-95 active:opacity-95",
      green: "bg-asu-green text-white font-bold hover:bg-asu-green-light shadow-md shadow-asu-green/20 active:brightness-95 active:opacity-95",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80 active:bg-slate-200",
      outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs active:bg-slate-100",
      danger: "bg-rose-600 text-white hover:bg-rose-700 active:brightness-90",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-100",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs rounded-lg min-h-[36px]",
      md: "px-4 py-2.5 text-sm rounded-xl min-h-[42px]",
      lg: "px-6 py-3.5 text-base rounded-xl font-bold min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-asu-navy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none touch-manipulation",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
