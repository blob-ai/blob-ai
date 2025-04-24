
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface ActionButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  label: string;
  mobileIconOnly?: boolean;
}

/**
 * A reusable action button with consistent styling and icon support
 * with responsive behavior options
 */
export function ActionButton({
  icon,
  label,
  className,
  variant = "default",
  size = "default",
  mobileIconOnly = false,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "flex items-center gap-2", 
        mobileIconOnly && "sm:px-4",
        className
      )}
      {...props}
    >
      {icon && icon}
      {mobileIconOnly ? (
        <span className="hidden sm:inline">{label}</span>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  );
}
