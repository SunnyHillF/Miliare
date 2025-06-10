import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

type DropdownState = { open: boolean; setOpen: (v: boolean) => void };
const DropdownContext = createContext<DropdownState | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, className }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenuTrigger must be inside DropdownMenu');
  return (
    <button onClick={() => ctx.setOpen(!ctx.open)} className={cn(className)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DropdownContext)!;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ctx.open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ctx]);
  if (!ctx.open) return null;
  return (
    <div ref={ref} className={cn('absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md py-1', className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onSelect, className }: { children: React.ReactNode; onSelect?: () => void; className?: string }) {
  const ctx = useContext(DropdownContext);
  return (
    <div
      onClick={() => {
        onSelect?.();
        ctx?.setOpen(false);
      }}
      className={cn('cursor-pointer px-3 py-2 text-sm hover:bg-gray-100', className)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-3 py-2 text-xs font-medium text-gray-500', className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-gray-200', className)} />;
}
