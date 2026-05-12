import { Link } from 'react-router-dom'
import {
  Megaphone, Sparkles, Search, Palette, Layers, Compass,
  Building2, ListChecks, MessageSquareQuote, HelpCircle, CreditCard,
  TableProperties, PanelBottom, Scale, ExternalLink, ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const editors: Array<{
  to: string
  icon: LucideIcon
  label: string
  description: string
  group: 'Brand & SEO' | 'Above the fold' | 'Sections' | 'Lists' | 'Pricing' | 'Footer & Legal'
}> = [
  // Brand & SEO
  { to: '/marketing/seo', icon: Search, label: 'SEO', description: 'Meta titles, descriptions, social cards, hreflang.', group: 'Brand & SEO' },
  { to: '/marketing/brand', icon: Palette, label: 'Brand', description: 'Logos, contact emails, app links, EU/GDPR labels.', group: 'Brand & SEO' },

  // Above the fold
  { to: '/marketing/hero', icon: Sparkles, label: 'Hero', description: 'Headline, sub-head, CTAs, stats, app preview labels.', group: 'Above the fold' },
  { to: '/marketing/nav-links', icon: Compass, label: 'Nav links', description: 'Top navigation labels and targets.', group: 'Above the fold' },

  // Sections (headings)
  { to: '/marketing/sections', icon: Layers, label: 'Section headings', description: 'Eyebrows and titles for every block (Features, Pricing, FAQ…).', group: 'Sections' },

  // Lists
  { to: '/marketing/industries', icon: Building2, label: 'Industries', description: 'Industries shown in the social-proof strip.', group: 'Lists' },
  { to: '/marketing/features', icon: ListChecks, label: 'Features', description: 'The six feature cards with bullets and tints.', group: 'Lists' },
  { to: '/marketing/steps', icon: TableProperties, label: 'How it works', description: 'Three onboarding steps shown after the hero.', group: 'Lists' },
  { to: '/marketing/testimonials', icon: MessageSquareQuote, label: 'Testimonials', description: 'Customer quotes, authors, avatars.', group: 'Lists' },
  { to: '/marketing/faqs', icon: HelpCircle, label: 'FAQs', description: 'Question / answer pairs in the FAQ section.', group: 'Lists' },

  // Pricing
  { to: '/marketing/pricing-plans', icon: CreditCard, label: 'Pricing plans', description: 'Plan cards: name, prices, limits, highlight.', group: 'Pricing' },
  { to: '/marketing/pricing-features', icon: ListChecks, label: 'Pricing feature matrix', description: 'Feature rows and which plans include them.', group: 'Pricing' },

  // Footer & legal
  { to: '/marketing/footer', icon: PanelBottom, label: 'Footer', description: 'Footer column groups and their links.', group: 'Footer & Legal' },
  { to: '/marketing/legal', icon: Scale, label: 'Legal documents', description: 'Impressum, Datenschutz, AGB (Markdown).', group: 'Footer & Legal' },
]

const GROUPS = [
  'Brand & SEO', 'Above the fold', 'Sections', 'Lists', 'Pricing', 'Footer & Legal',
] as const

export default function MarketingIndex() {
  const siteUrl =
    (import.meta.env.VITE_MARKETING_SITE_URL as string | undefined) ?? 'https://schichtio.com'

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-600/25 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Marketing site</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-2xl mt-1">
              Everything on{' '}
              <code className="text-blue-400">{siteUrl.replace(/^https?:\/\//, '')}</code>{' '}
              is editable from here. Changes are live within ~60 seconds — the public API
              invalidates its cache whenever you save.
            </p>
          </div>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-sm"
        >
          Open site
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {GROUPS.map((group) => {
        const items = editors.filter((e) => e.group === group)
        if (items.length === 0) return null
        return (
          <section key={group}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
              {group}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(({ to, icon: Icon, label, description }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex flex-col gap-3 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/15 group-hover:border-blue-600/25 transition-colors">
                      <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">{label}</h3>
                        <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
