import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PanelBottom, Plus, Pencil, Trash2, FolderPlus, LinkIcon } from 'lucide-react'
import { footerGroupsApi, footerLinksApi } from '@/api/marketing-client'
import type { MarketingFooterGroup, MarketingFooterLink } from '@/api/marketing-types'
import { EditorHeader } from '@/components/marketing/EditorHeader'
import { BilingualField } from '@/components/marketing/BilingualField'
import { PublishedRow } from '@/components/marketing/PublishedRow'
import { PublishedBadge } from '@/components/marketing/PublishedBadge'
import { SortableList } from '@/components/marketing/SortableList'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

const GROUPS_QK = ['platform', 'marketing', 'footer-groups'] as const
const LINKS_QK = ['platform', 'marketing', 'footer-links'] as const

export default function FooterEditor() {
  const qc = useQueryClient()

  const { data: groupsRaw } = useQuery({
    queryKey: GROUPS_QK, queryFn: footerGroupsApi.list,
  })
  const { data: linksRaw } = useQuery({
    queryKey: LINKS_QK, queryFn: footerLinksApi.list,
  })

  const [groupForm, setGroupForm] = useState<Partial<MarketingFooterGroup> | null>(null)
  const [groupIsCreating, setGroupIsCreating] = useState(false)
  const [linkForm, setLinkForm] = useState<Partial<MarketingFooterLink> | null>(null)
  const [linkIsCreating, setLinkIsCreating] = useState(false)

  const groupStore = useMutation({
    mutationFn: (payload: Partial<MarketingFooterGroup>) => footerGroupsApi.store(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROUPS_QK })
      toast.success('Footer group created.')
      setGroupForm(null); setGroupIsCreating(false)
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const groupUpdate = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MarketingFooterGroup> }) =>
      footerGroupsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROUPS_QK })
      toast.success('Footer group saved.')
      setGroupForm(null); setGroupIsCreating(false)
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const groupDelete = useMutation({
    mutationFn: (id: string) => footerGroupsApi.destroy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROUPS_QK })
      qc.invalidateQueries({ queryKey: LINKS_QK })
      toast.success('Footer group deleted.')
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const groupReorder = useMutation({
    mutationFn: (ids: string[]) => footerGroupsApi.reorder(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: GROUPS_QK }),
  })

  const linkStore = useMutation({
    mutationFn: (payload: Partial<MarketingFooterLink>) => footerLinksApi.store(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LINKS_QK })
      toast.success('Footer link created.')
      setLinkForm(null); setLinkIsCreating(false)
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const linkUpdate = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MarketingFooterLink> }) =>
      footerLinksApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LINKS_QK })
      toast.success('Footer link saved.')
      setLinkForm(null); setLinkIsCreating(false)
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const linkDelete = useMutation({
    mutationFn: (id: string) => footerLinksApi.destroy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LINKS_QK })
      toast.success('Footer link deleted.')
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const linkReorder = useMutation({
    mutationFn: (ids: string[]) => footerLinksApi.reorder(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: LINKS_QK }),
  })

  const groups = groupsRaw ?? []
  const links = linksRaw ?? []

  const openGroup = (group?: MarketingFooterGroup) => {
    setGroupIsCreating(!group)
    setGroupForm(
      group ?? { key: '', title: { de: '', en: '' }, is_published: true, sort_order: 0 }
    )
  }

  const openLink = (groupId: string, link?: MarketingFooterLink) => {
    setLinkIsCreating(!link)
    setLinkForm(
      link ?? {
        group_id: groupId,
        key: '',
        href: '',
        label: { de: '', en: '' },
        is_published: true,
        sort_order: 0,
      }
    )
  }

  const saveGroup = () => {
    if (!groupForm) return
    if (groupIsCreating) groupStore.mutate(groupForm)
    else if (groupForm.id) groupUpdate.mutate({ id: groupForm.id, payload: groupForm })
  }

  const saveLink = () => {
    if (!linkForm) return
    if (linkIsCreating) linkStore.mutate(linkForm)
    else if (linkForm.id) linkUpdate.mutate({ id: linkForm.id, payload: linkForm })
  }

  return (
    <div className="max-w-5xl space-y-4">
      <EditorHeader
        title="Footer"
        description="Footer is organised into column groups, each containing a list of links. Drag to reorder."
        icon={<PanelBottom className="w-5 h-5 text-blue-400" />}
        livePath="/#footer"
        actions={
          <button onClick={() => openGroup()} className="btn-primary text-sm">
            <FolderPlus className="w-4 h-4" />
            New group
          </button>
        }
      />

      {groups.length === 0 ? (
        <div className="card text-center py-10 text-[hsl(var(--muted-foreground))] text-sm">
          No footer groups yet. Add one to start building columns.
        </div>
      ) : (
        <SortableList
          items={groups}
          onReorder={(ids) => groupReorder.mutate(ids)}
          renderItem={(group) => {
            const groupLinks = links.filter((l) => l.group_id === group.id)
            return (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {group.title?.de ?? group.title?.en ?? group.key}
                      </h3>
                      <PublishedBadge isPublished={group.is_published} />
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] font-mono mt-0.5">
                      {group.key} · {groupLinks.length} link(s)
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openGroup(group)} className="btn-ghost !p-2" title="Edit group">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${group.title?.de ?? group.key}" and all its links?`)) {
                          groupDelete.mutate(group.id)
                        }
                      }}
                      className="btn-ghost !p-2 hover:bg-red-500/10 hover:text-red-300"
                      title="Delete group"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pl-3 border-l border-[hsl(var(--border))] space-y-1.5">
                  {groupLinks.length === 0 ? (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">No links yet.</p>
                  ) : (
                    <SortableList
                      items={groupLinks}
                      onReorder={(ids) => linkReorder.mutate(ids)}
                      renderItem={(link) => (
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[hsl(var(--accent))] group">
                          <LinkIcon className="w-3 h-3 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                          <div className="text-xs text-white truncate flex-1">
                            {link.label?.de ?? link.label?.en ?? link.key}
                          </div>
                          <code className="text-xs text-[hsl(var(--muted-foreground))] truncate hidden sm:inline">
                            {link.href}
                          </code>
                          <PublishedBadge isPublished={link.is_published} />
                          <button
                            onClick={() => openLink(group.id, link)}
                            className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit link"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this footer link?')) linkDelete.mutate(link.id)
                            }}
                            className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-300"
                            title="Delete link"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    />
                  )}

                  <button
                    onClick={() => openLink(group.id)}
                    className="btn-ghost text-xs mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add link
                  </button>
                </div>
              </div>
            )
          }}
        />
      )}

      {/* Group dialog */}
      <Dialog open={groupForm !== null} onOpenChange={(open) => !open && setGroupForm(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {groupIsCreating ? 'New footer group' : `Edit "${groupForm?.title?.de ?? groupForm?.key ?? ''}"`}
            </DialogTitle>
            <DialogDescription>Column header rendered above its links in the footer.</DialogDescription>
          </DialogHeader>
          {groupForm && (
            <div className="space-y-4">
              <div>
                <Label>Key</Label>
                <Input
                  value={groupForm.key ?? ''}
                  onChange={(e) => setGroupForm({ ...groupForm, key: e.target.value })}
                  placeholder="product"
                  className="mt-1"
                />
              </div>
              <BilingualField
                label="Title"
                required
                maxLength={120}
                value={groupForm.title}
                onChange={(v) => setGroupForm({ ...groupForm, title: v })}
              />
              <PublishedRow
                value={!!groupForm.is_published}
                onChange={(v) => setGroupForm({ ...groupForm, is_published: v })}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t border-[hsl(var(--border))]">
            <button onClick={() => setGroupForm(null)} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={saveGroup}
              disabled={groupStore.isPending || groupUpdate.isPending}
              className="btn-primary text-sm"
            >
              {groupStore.isPending || groupUpdate.isPending
                ? 'Saving…'
                : groupIsCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link dialog */}
      <Dialog open={linkForm !== null} onOpenChange={(open) => !open && setLinkForm(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {linkIsCreating ? 'New footer link' : `Edit "${linkForm?.label?.de ?? linkForm?.key ?? ''}"`}
            </DialogTitle>
            <DialogDescription>
              Links can be relative (e.g. <code>#features</code>), absolute, or mailto:.
            </DialogDescription>
          </DialogHeader>
          {linkForm && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Key</Label>
                  <Input
                    value={linkForm.key ?? ''}
                    onChange={(e) => setLinkForm({ ...linkForm, key: e.target.value })}
                    placeholder="changelog"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Href</Label>
                  <Input
                    value={linkForm.href ?? ''}
                    onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })}
                    placeholder="/changelog"
                    className="mt-1"
                  />
                </div>
              </div>
              <BilingualField
                label="Label"
                required
                maxLength={120}
                value={linkForm.label}
                onChange={(v) => setLinkForm({ ...linkForm, label: v })}
              />
              <PublishedRow
                value={!!linkForm.is_published}
                onChange={(v) => setLinkForm({ ...linkForm, is_published: v })}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2 border-t border-[hsl(var(--border))]">
            <button onClick={() => setLinkForm(null)} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={saveLink}
              disabled={linkStore.isPending || linkUpdate.isPending}
              className="btn-primary text-sm"
            >
              {linkStore.isPending || linkUpdate.isPending
                ? 'Saving…'
                : linkIsCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
