import * as React from 'react'

import { cn } from '@/lib/utils'


type DisplayFieldProps = {
  children: React.ReactNode;
  className?: string;
};

export function DisplayField({ children, className }: DisplayFieldProps) {
  return (
    <p
      className={cn(
        'w-full py-2 px-1 bg-transparent border-0 border-b-2 border-gray-300',
        'text-gray-500',
        'dark:text-gray-400',
        'focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors',
        'min-h-[2rem]',
        className
      )}
    >
      {children}
    </p>
  );
}