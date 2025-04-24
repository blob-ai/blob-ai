
import React from 'react';
import { cn } from '@/lib/utils';

interface CardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  transparent?: boolean;
}

/**
 * A reusable container component for card-like elements
 */
export function CardContainer({
  children,
  className,
  fullWidth = false,
  noPadding = false,
  transparent = false,
  ...props
}: CardContainerProps) {
  return (
    <div
      className={cn(
        !transparent && "bg-black/20 border border-white/10 rounded-lg transition-all hover:bg-black/30",
        !noPadding && "p-2 sm:p-3",
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
