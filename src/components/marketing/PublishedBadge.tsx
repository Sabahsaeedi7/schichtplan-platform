import { clsx } from 'clsx'

interface PublishedBadgeProps {
  isPublished: boolean
  className?: string
}

export function PublishedBadge({ isPublished, className }: PublishedBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider',
        isPublished
          ? 'bg-green-500/15 text-green-300'
          : 'bg-orange-500/15 text-orange-300',
        className
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          isPublished ? 'bg-green-400' : 'bg-orange-400'
        )}
      />
      {isPublished ? 'Live' : 'Draft'}
    </span>
  )
}
