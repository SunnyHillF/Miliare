'use client'
import clsx from 'clsx'
import { createContext, useContext, useEffect, useRef, useState, type HTMLAttributes } from 'react'

interface DropdownState { open: boolean; setOpen: (v: boolean) => void }
const DropdownContext = createContext<DropdownState | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className }: HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('DropdownMenuTrigger must be inside DropdownMenu')
  return (
    <button onClick={() => ctx.setOpen(!ctx.open)} className={clsx(className)}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DropdownContext)!
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ctx.open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ctx])
  if (!ctx.open) return null
  return (
    <div ref={ref} className={clsx('absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md py-1', className)}>
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onSelect, className }: { children: React.ReactNode; onSelect?: () => void; className?: string }) {
  const ctx = useContext(DropdownContext)
  return (
    <div
      onClick={() => {
        onSelect?.()
        ctx?.setOpen(false)
      }}
      className={clsx('cursor-pointer px-3 py-2 text-sm hover:bg-gray-100', className)}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('px-3 py-2 text-xs font-medium text-gray-500', className)}>{children}</div>
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={clsx('my-1 h-px bg-gray-200', className)} />
}
