import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-600/15 text-blue-300 border border-blue-600/25',
        secondary: 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]',
        success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
        warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
        destructive: 'bg-red-500/15 text-red-300 border border-red-500/25',
        outline: 'border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
