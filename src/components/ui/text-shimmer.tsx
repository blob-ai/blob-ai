
import React from "react";
import { cn } from "@/lib/utils";

interface TextShimmerProps extends React.HTMLAttributes<HTMLSpanElement> {
  duration?: number;
  children: React.ReactNode;
}

export function TextShimmer({
  children,
  className,
  duration = 5, // Increased duration from 3 to 5 seconds for slower animation
  ...props
}: TextShimmerProps) {
  return (
    <span
      {...props}
      style={
        {
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
      className={cn(
        "inline-block bg-gradient-to-r from-[var(--base-color,#3b82f6)] via-[var(--base-gradient-color,#93c5fd)] to-[var(--base-color,#3b82f6)] bg-[200%_auto] animate-shimmer bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
