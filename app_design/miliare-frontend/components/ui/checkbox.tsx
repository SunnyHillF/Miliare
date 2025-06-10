import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={clsx('rounded border-gray-300 text-primary focus:ring-primary', className)}
      {...props}
    />
  )
}
