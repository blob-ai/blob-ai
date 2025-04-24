
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * A consistent page header with title, description, and action area
 */
export function PageHeader({
  title,
  description,
  className,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn("w-full px-4 md:px-6 py-6 border-b border-white/10 bg-background sticky top-0 z-10", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 max-w-[1200px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-white/70 mt-1">{description}</p>}
        </div>
        
        {actions && <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">{actions}</div>}
      </div>
    </div>
  );
}
