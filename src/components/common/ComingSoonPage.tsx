import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ComingSoonPageProps {
  title: string
  description?: string
  upcoming?: string[]
}

export function ComingSoonPage({ title, description, upcoming = [] }: ComingSoonPageProps) {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <Construction className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-0.5">Coming soon</CardDescription>
            </div>
          </div>
          {description && <CardDescription className="mt-2">{description}</CardDescription>}
        </CardHeader>
        {upcoming.length > 0 && (
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
              Planned features
            </p>
            <ul className="space-y-2">
              {upcoming.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
