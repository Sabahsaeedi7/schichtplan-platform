import { HelpCircle } from 'lucide-react'
import { faqsApi } from '@/api/marketing-client'
import type { MarketingFaq } from '@/api/marketing-types'
import { ListEditorShell } from '@/components/marketing/ListEditorShell'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const QK = ['platform', 'marketing', 'faqs'] as const

export default function FaqsEditor() {
  return (
    <ListEditorShell<MarketingFaq>
      title="FAQs"
      description="Frequently-asked questions and answers shown in the FAQ section."
      icon={<HelpCircle className="w-5 h-5 text-blue-400" />}
      livePath="/#faq"
      queryKey={QK}
      api={faqsApi}
      itemLabel="FAQ"
      emptyForm={() => ({
        key: '',
        question: { de: '', en: '' },
        answer: { de: '', en: '' },
        is_published: true,
      })}
      describeItem={(item) => `Edit FAQ "${item.question?.de ?? item.question?.en ?? item.key}"`}
      renderRow={(item) => (
        <div>
          <div className="text-sm font-medium text-white truncate">
            {item.question?.de ?? item.question?.en ?? item.key}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] truncate max-w-prose">
            {item.answer?.de ?? item.answer?.en ?? ''}
          </div>
        </div>
      )}
      renderForm={(form, setForm) => (
        <div className="space-y-4">
          <div>
            <Label>Key</Label>
            <Input
              value={form.key ?? ''}
              onChange={(e) => setForm({ key: e.target.value })}
              placeholder="pricing-trial"
              className="mt-1"
            />
          </div>
          <BilingualField
            label="Question"
            required
            maxLength={300}
            value={form.question}
            onChange={(v) => setForm({ question: v })}
          />
          <BilingualField
            label="Answer"
            required
            multiline
            rows={5}
            maxLength={1500}
            value={form.answer}
            onChange={(v) => setForm({ answer: v })}
          />
          <PublishedRow value={!!form.is_published} onChange={(v) => setForm({ is_published: v })} />
        </div>
      )}
    />
  )
}
