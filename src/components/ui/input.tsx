import * as React from 'react'
import { cn } from '@/lib/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-lg bg-[hsl(var(--input))] border border-[hsl(var(--border))] px-3 py-2 text-sm text-[hsl(var(--foreground))]',
        'placeholder:text-[hsl(var(--muted-foreground))] transition-colors',
        'focus:outline-none focus:border-[hsl(var(--ring))] focus:ring-1 focus:ring-[hsl(var(--ring))]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
