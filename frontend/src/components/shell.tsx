import { cn } from '@/lib/utils';
import * as React from 'react';

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start w-full h-full gap-4 p-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
