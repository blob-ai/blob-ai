
import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  fullWidth?: boolean;
}

/**
 * A consistent container for page content with proper spacing and max width
 */
export function PageContainer({ 
  children, 
  className,
  noPadding = false,
  fullWidth = false
}: PageContainerProps) {
  return (
    <div className={cn(
      "w-full mx-auto", 
      !fullWidth && "max-w-[1200px]",
      !noPadding && "px-3 sm:px-4 md:px-6 py-3 sm:py-4",
      className
    )}>
      {children}
    </div>
  );
}
