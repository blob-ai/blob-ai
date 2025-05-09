import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-11 animate-rainbow-soft cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

        // Updated to use the exact #3260ea color as requested (base color with softening for gradient effect)
        "bg-[linear-gradient(#3260ea,#3260ea),linear-gradient(#3260ea_50%,rgba(50,96,234,0.6)_80%,rgba(50,96,234,0)),linear-gradient(90deg,#3260ea,#3260ea,#3260ea,#3260ea,#3260ea)]",

        // dark mode colors - keeping same pattern but with consistent color
        "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,#3260ea,#3260ea,#3260ea,#3260ea,#3260ea)]",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
