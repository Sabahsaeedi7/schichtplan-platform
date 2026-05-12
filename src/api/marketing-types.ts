/**
 * Typed shapes for the Marketing CMS API at `/api/v1/platform/marketing/*`.
 *
 * Translatable jsonb fields are returned as `{ de, en }` when the admin API
 * is called without `?locale`. Lists are returned ordered by `sort_order`.
 *
 * Keep in sync with `app/Http/Resources/Marketing/*Resource.php` in
 * schichtplan-api.
 */

export type Locale = 'de' | 'en'

export type Translatable = Partial<Record<Locale, string>> & {
  de?: string
  en?: string
}

export type TranslatableList = Partial<Record<Locale, string[]>> & {
  de?: string[]
  en?: string[]
}

export interface DataEnvelope<T> {
  data: T
}

export interface MessageEnvelope {
  message: string
}

// ─── Singletons ──────────────────────────────────────────────────────────────

export interface MarketingSeo {
  id: string
  title: Translatable
  description: Translatable
  og_title: Translatable
  og_description: Translatable
  og_image_url: string | null
  keywords: TranslatableList
  canonical_url: string | null
  twitter_title: Translatable
  twitter_description: Translatable
  twitter_image_url: string | null
  updated_at: string
}

export interface MarketingBrand {
  id: string
  site_name: string
  logo_aria_label: Translatable
  logo_wordmark_url: string | null
  logo_icon_url: string | null
  favicon_url: string | null
  contact_email: string | null
  sales_email: string | null
  status_url: string | null
  demo_video_url: string | null
  app_url: string | null
  site_url: string | null
  mailto_subjects: Translatable
  made_in_eu_label: Translatable
  gdpr_aligned_label: Translatable
  updated_at: string
}

// Hero has many translatable fields; we type it as an open record for fields,
// while keeping `id` and `updated_at` strict.
export type HeroTranslatableKey =
  | 'eyebrow' | 'headline_part1' | 'headline_emphasis' | 'subheadline'
  | 'primary_cta_label' | 'secondary_cta_label' | 'primary_cta_hint'
  | 'stat_one_value' | 'stat_one_label'
  | 'stat_two_value' | 'stat_two_label'
  | 'stat_three_value' | 'stat_three_label'
  | 'preview_caption' | 'preview_hostname'
  | 'preview_monday' | 'preview_tuesday' | 'preview_wednesday'
  | 'preview_thursday' | 'preview_friday' | 'preview_saturday' | 'preview_sunday'
  | 'preview_shift_morning' | 'preview_shift_late' | 'preview_shift_night'
  | 'preview_ai_pill' | 'preview_ai_caption'
  | 'preview_compliance_pill' | 'preview_compliance_caption'

export type MarketingHero = {
  id: string
  updated_at: string
} & Record<HeroTranslatableKey, Translatable>

export interface MarketingSection {
  id: string
  key: string
  eyebrow: Translatable
  title: Translatable
  subtitle: Translatable
  extra: Translatable | null
  updated_at: string
}

// ─── Lists ───────────────────────────────────────────────────────────────────

export interface MarketingNavLink {
  id: string
  key: string
  label: Translatable
  href: string
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingIndustry {
  id: string
  key: string
  label: Translatable
  icon: string
  sort_order: number
  is_published: boolean
  updated_at: string
}

export type FeatureTint = 'blue' | 'coral' | 'sage'

export interface MarketingFeature {
  id: string
  key: string
  title: Translatable
  description: Translatable
  bullets: TranslatableList
  icon: string
  tint: FeatureTint
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingStep {
  id: string
  key: string
  title: Translatable
  description: Translatable
  icon: string
  step_number: number
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingTestimonial {
  id: string
  key: string
  quote: Translatable
  author: Translatable
  company: Translatable
  industry_key: string | null
  avatar_url: string | null
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingFaq {
  id: string
  key: string
  question: Translatable
  answer: Translatable
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingPricingPlan {
  id: string
  key: string
  name: Translatable
  description: Translatable
  price_monthly_cents: number | null
  price_yearly_cents: number | null
  employee_limit: number | null
  is_highlighted: boolean
  is_contact_sales: boolean
  cta_label_override: Translatable | null
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingPricingFeature {
  id: string
  key: string
  label: Translatable
  included_plans: string[]
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingFooterLink {
  id: string
  group_id: string
  key: string
  label: Translatable
  href: string
  sort_order: number
  is_published: boolean
  updated_at: string
}

export interface MarketingFooterGroup {
  id: string
  key: string
  title: Translatable
  sort_order: number
  is_published: boolean
  links?: MarketingFooterLink[]
  updated_at: string
}

export interface MarketingLegalDocument {
  id: string
  slug: string
  title: Translatable
  body: Translatable
  is_published: boolean
  published_at: string | null
  updated_at: string
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaUploadResponse {
  url: string
  path: string
}
