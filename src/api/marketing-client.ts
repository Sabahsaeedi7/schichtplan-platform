/**
 * Typed HTTP client for the Marketing CMS admin API at
 * `/api/v1/platform/marketing/*`. Returns unwrapped payloads (the `data` key
 * is stripped) so call sites can consume the resource directly.
 */
import { api } from './client'
import type {
  DataEnvelope,
  MarketingBrand,
  MarketingFaq,
  MarketingFeature,
  MarketingFooterGroup,
  MarketingFooterLink,
  MarketingHero,
  MarketingIndustry,
  MarketingLegalDocument,
  MarketingNavLink,
  MarketingPricingFeature,
  MarketingPricingPlan,
  MarketingSection,
  MarketingSeo,
  MarketingStep,
  MarketingTestimonial,
  MediaUploadResponse,
  MessageEnvelope,
} from './marketing-types'

const unwrap = <T>(p: Promise<{ data: DataEnvelope<T> }>): Promise<T> =>
  p.then((r) => r.data.data)

const unwrapList = <T>(p: Promise<{ data: { data: T[] } }>): Promise<T[]> =>
  p.then((r) => r.data.data)

const msg = (p: Promise<{ data: MessageEnvelope }>): Promise<MessageEnvelope> =>
  p.then((r) => r.data)

// ─── Singletons ──────────────────────────────────────────────────────────────

export const seoApi = {
  get: () => unwrap<MarketingSeo>(api.get('/marketing/seo')),
  update: (payload: Partial<MarketingSeo>) =>
    unwrap<MarketingSeo>(api.put('/marketing/seo', payload)),
}

export const brandApi = {
  get: () => unwrap<MarketingBrand>(api.get('/marketing/brand')),
  update: (payload: Partial<MarketingBrand>) =>
    unwrap<MarketingBrand>(api.put('/marketing/brand', payload)),
}

export const heroApi = {
  get: () => unwrap<MarketingHero>(api.get('/marketing/hero')),
  update: (payload: Partial<MarketingHero>) =>
    unwrap<MarketingHero>(api.put('/marketing/hero', payload)),
}

export const sectionsApi = {
  list: () => unwrapList<MarketingSection>(api.get('/marketing/sections')),
  show: (key: string) =>
    unwrap<MarketingSection>(api.get(`/marketing/sections/${key}`)),
  update: (key: string, payload: Partial<MarketingSection>) =>
    unwrap<MarketingSection>(api.put(`/marketing/sections/${key}`, payload)),
}

// ─── Lists factory ───────────────────────────────────────────────────────────

interface ListCrud<T> {
  list: () => Promise<T[]>
  store: (payload: Partial<T>) => Promise<T>
  update: (id: string, payload: Partial<T>) => Promise<T>
  destroy: (id: string) => Promise<MessageEnvelope>
  reorder: (ids: string[]) => Promise<MessageEnvelope>
}

function makeListCrud<T>(basePath: string): ListCrud<T> {
  return {
    list: () => unwrapList<T>(api.get(basePath)),
    store: (payload) => unwrap<T>(api.post(basePath, payload)),
    update: (id, payload) => unwrap<T>(api.put(`${basePath}/${id}`, payload)),
    destroy: (id) => msg(api.delete(`${basePath}/${id}`)),
    reorder: (ids) => msg(api.post(`${basePath}/reorder`, { ids })),
  }
}

export const navLinksApi = makeListCrud<MarketingNavLink>('/marketing/nav-links')
export const industriesApi = makeListCrud<MarketingIndustry>('/marketing/industries')
export const featuresApi = makeListCrud<MarketingFeature>('/marketing/features')
export const stepsApi = makeListCrud<MarketingStep>('/marketing/steps')
export const testimonialsApi = makeListCrud<MarketingTestimonial>('/marketing/testimonials')
export const faqsApi = makeListCrud<MarketingFaq>('/marketing/faqs')
export const pricingPlansApi = makeListCrud<MarketingPricingPlan>('/marketing/pricing-plans')
export const pricingFeaturesApi = makeListCrud<MarketingPricingFeature>('/marketing/pricing-features')
export const footerGroupsApi = makeListCrud<MarketingFooterGroup>('/marketing/footer-groups')
export const footerLinksApi = makeListCrud<MarketingFooterLink>('/marketing/footer-links')

// Legal docs use `show` (not in standard CRUD factory) so we expose it explicitly.
export const legalDocumentsApi = {
  list: () => unwrapList<MarketingLegalDocument>(api.get('/marketing/legal-documents')),
  show: (id: string) =>
    unwrap<MarketingLegalDocument>(api.get(`/marketing/legal-documents/${id}`)),
  store: (payload: Partial<MarketingLegalDocument>) =>
    unwrap<MarketingLegalDocument>(api.post('/marketing/legal-documents', payload)),
  update: (id: string, payload: Partial<MarketingLegalDocument>) =>
    unwrap<MarketingLegalDocument>(api.put(`/marketing/legal-documents/${id}`, payload)),
  destroy: (id: string) => msg(api.delete(`/marketing/legal-documents/${id}`)),
}

// ─── Media ───────────────────────────────────────────────────────────────────

export const marketingMediaApi = {
  upload: async (file: File, context?: string): Promise<MediaUploadResponse> => {
    const fd = new FormData()
    fd.append('file', file)
    if (context) fd.append('context', context)
    const r = await api.post<DataEnvelope<MediaUploadResponse>>('/marketing/media', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return r.data.data
  },
}
