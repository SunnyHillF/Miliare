'use client'
import type {
  ControllerProps,
  FieldPath,
  FieldValues
} from 'react-hook-form'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import type { HTMLAttributes, LabelHTMLAttributes } from 'react'
import clsx from 'clsx'

export const Form = FormProvider

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}

export function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('grid gap-2', className)} {...props} />
}

export function FormLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx('text-sm font-medium', className)} {...props} />
}

export function FormControl({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className)} {...props} />
}

export function FormMessage({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { formState } = useFormContext()
  if (!children && !formState.errors) return null
  return (
    <p className={clsx('text-sm text-red-600', className)} {...props}>
      {children}
    </p>
  )
}
