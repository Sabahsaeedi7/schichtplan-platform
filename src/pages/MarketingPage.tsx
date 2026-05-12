import { Link } from 'react-router-dom'
import {
  Megaphone,
  ImageIcon,
  ListChecks,
  ArrowRight,
  Sparkles,
  CreditCard,
  MessageSquareQuote,
  HelpCircle,
  Layers,
  Scale,
  Search,
} from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const upcomingSections = [
  { icon: Sparkles, label: 'Hero', description: 'Headline, sub-headline, CTAs, stats' },
  { icon: ListChecks, label: 'Features', description: 'Six feature cards with icons, titles, bullets' },
  { icon: Layers, label: 'How it works', description: 'Three onboarding steps' },
  { icon: CreditCard, label: 'Pricing', description: 'Plans, prices, feature matrix' },
  { icon: MessageSquareQuote, label: 'Testimonials', description: 'Customer quotes & avatars' },
  { icon: HelpCircle, label: 'FAQ', description: 'Q&A pairs' },
  { icon: ImageIcon, label: 'Footer & Social proof', description: 'Footer columns, industries' },
  { icon: Scale, label: 'Legal', description: 'Impressum, Datenschutz, AGB (Markdown)' },
  { icon: Search, label: 'SEO', description: 'Meta title, description, OG image, hreflang' },
]

export default function MarketingPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-600/25 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Marketing site</h1>
            <Badge variant="warning">Foundation only</Badge>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-2xl">
            Full content management for <code className="text-blue-400">schichtio.com</code> ships in the next
            two PRs. Today the marketing site reads from compiled config files; once the CMS API and editors are in,
            every section below becomes editable here with live updates within ~60 seconds.
          </p>
        </div>
        <a
          href="https://schichtio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-400 hover:bg-blue-600/10 transition-colors"
        >
          Open live site
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
        Sections you will be able to edit
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {upcomingSections.map(({ icon: Icon, label, description }) => (
          <Card
            key={label}
            className="opacity-60 hover:opacity-80 transition-opacity cursor-not-allowed"
            title="Coming in the next PR"
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-sm">{label}</CardTitle>
                  <CardDescription className="text-xs mt-1">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-[hsl(var(--border))] p-4 bg-[hsl(var(--card))]/40">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          <strong className="text-[hsl(var(--foreground))]">For now</strong> — content edits still happen by
          updating <code className="text-blue-400">src/content/*.ts</code> and{' '}
          <code className="text-blue-400">src/locales/*.json</code> in the{' '}
          <Link to="https://github.com/Sabahsaeedi7/schichtio-web" className="text-blue-400 hover:underline">
            schichtio-web
          </Link>{' '}
          repo and redeploying. Track the rollout in the Marketing CMS issues on{' '}
          <a
            href="https://github.com/Sabahsaeedi7/schichtio-web/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  )
}
