import React from 'react';
import { cn } from '../../utils/cn';

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn('rounded border-gray-300 text-primary focus:ring-primary', className)}
      {...props}
    />
  );
}
