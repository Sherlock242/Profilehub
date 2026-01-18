
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Logo = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <a href="/" ref={ref} className={className} {...props}>
      <span className="flex items-center text-lg font-headline font-bold tracking-tighter uppercase">
        <span className="text-accent">Pro</span>
        <span>Hub</span>
      </span>
    </a>
  );
});

Logo.displayName = 'Logo';
