import { Link } from 'react-router-dom'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

interface EditorHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  backTo?: string
  livePath?: string
  actions?: ReactNode
}

/**
 * Shared page header for every marketing editor.
 *
 * Renders a back link to the marketing hub, the editor title, an optional
 * description, and right-aligned action buttons (typically Save/Preview).
 * The `livePath` opens the corresponding section on schichtio.com in a new
 * tab so editors can verify their change.
 */
export function EditorHeader({
  title, description, icon, backTo = '/marketing', livePath, actions,
}: EditorHeaderProps) {
  const siteUrl =
    (import.meta.env.VITE_MARKETING_SITE_URL as string | undefined) ?? 'https://schichtio.com'
  const liveHref = livePath ? `${siteUrl.replace(/\/$/, '')}${livePath}` : null

  return (
    <div className="flex flex-col gap-2 mb-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-blue-400 transition-colors w-fit"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to Marketing
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-600/25 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xl mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
              title="Open live section"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live
            </a>
          )}
          {actions}
        </div>
      </div>
    </div>
  )
}
