
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A reusable section header component with consistent styling
 */
export function SectionHeader({
  title,
  description,
  className,
  rightContent,
  children
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex flex-col gap-2", className)}>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-white/70">{description}</p>}
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
