import { useState, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { EditorHeader } from './EditorHeader'
import { SortableList } from './SortableList'
import { PublishedBadge } from './PublishedBadge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toaster'
import { extractApiErrors } from '@/lib/marketing-errors'

interface ListEditorApi<T extends { id: string }> {
  list: () => Promise<T[]>
  store: (payload: Partial<T>) => Promise<T>
  update: (id: string, payload: Partial<T>) => Promise<T>
  destroy: (id: string) => Promise<{ message: string }>
  /** Optional — omitted for unordered lists (e.g. legal documents). */
  reorder?: (ids: string[]) => Promise<{ message: string }>
}

export interface ListEditorShellProps<T extends { id: string; is_published?: boolean }> {
  title: string
  description?: string
  icon?: ReactNode
  livePath?: string
  queryKey: readonly unknown[]
  api: ListEditorApi<T>
  emptyForm: () => Partial<T>
  renderRow: (item: T) => ReactNode
  renderForm: (form: Partial<T>, setForm: (next: Partial<T>) => void) => ReactNode
  itemLabel: string
  /** Custom row trailing content (replaces the default Edit / Delete cluster). */
  rowActions?: (item: T) => ReactNode
  /** When true, hides reorder & sort_order management. */
  noReorder?: boolean
  /** Optional override to read the heading for an existing item in dialogs. */
  describeItem?: (item: T) => string
}

/**
 * Reusable shell for "list of translatable rows" editors (features, FAQs,
 * testimonials…). Handles CRUD, dnd-kit reorder, and a create/edit dialog.
 * Each call site supplies its own form body for full control over fields.
 */
export function ListEditorShell<T extends { id: string; is_published?: boolean }>(
  props: ListEditorShellProps<T>,
) {
  const {
    title, description, icon, livePath, queryKey, api, emptyForm,
    renderRow, renderForm, itemLabel, rowActions, noReorder, describeItem,
  } = props

  const qc = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey, queryFn: api.list })

  const [editing, setEditing] = useState<Partial<T> | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const closeDialog = () => {
    setEditing(null)
    setIsCreating(false)
  }

  const storeMut = useMutation({
    mutationFn: (payload: Partial<T>) => api.store(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey })
      toast.success(`${itemLabel} created.`)
      closeDialog()
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<T> }) =>
      api.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey })
      toast.success(`${itemLabel} saved.`)
      closeDialog()
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const destroyMut = useMutation({
    mutationFn: (id: string) => api.destroy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey })
      toast.success(`${itemLabel} deleted.`)
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const reorderMut = useMutation({
    mutationFn: (ids: string[]) => {
      if (!api.reorder) {
        return Promise.resolve({ message: 'noop' })
      }
      return api.reorder(ids)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey })
    },
    onError: (err) => toast.error(extractApiErrors(err).message),
  })

  const items = data ?? []

  const beginCreate = () => {
    setIsCreating(true)
    setEditing(emptyForm())
  }

  const beginEdit = (item: T) => {
    setIsCreating(false)
    setEditing({ ...item })
  }

  const onSave = () => {
    if (!editing) return
    if (isCreating) {
      storeMut.mutate(editing)
    } else {
      const id = (editing as T).id
      updateMut.mutate({ id, payload: editing })
    }
  }

  const isSaving = storeMut.isPending || updateMut.isPending

  return (
    <div className="max-w-4xl space-y-4">
      <EditorHeader
        title={title}
        description={description}
        icon={icon}
        livePath={livePath}
        actions={
          <button onClick={beginCreate} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            New {itemLabel.toLowerCase()}
          </button>
        }
      />

      {isLoading && (
        <div className="card text-sm text-[hsl(var(--muted-foreground))]">Loading…</div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="card text-center py-10 text-[hsl(var(--muted-foreground))] text-sm">
          No {itemLabel.toLowerCase()}s yet. Create the first one to get started.
        </div>
      )}

      {items.length > 0 && (
        noReorder ? (
          <div className="space-y-2">
            {items.map((item) => (
              <ListRow
                key={item.id}
                item={item}
                renderRow={renderRow}
                rowActions={rowActions}
                onEdit={() => beginEdit(item)}
                onDelete={() => {
                  if (confirm(`Delete this ${itemLabel.toLowerCase()}?`)) {
                    destroyMut.mutate(item.id)
                  }
                }}
                deleting={destroyMut.isPending}
              />
            ))}
          </div>
        ) : (
          <SortableList
            items={items}
            onReorder={(ids) => reorderMut.mutate(ids)}
            renderItem={(item) => (
              <ListRow
                item={item}
                renderRow={renderRow}
                rowActions={rowActions}
                onEdit={() => beginEdit(item)}
                onDelete={() => {
                  if (confirm(`Delete this ${itemLabel.toLowerCase()}?`)) {
                    destroyMut.mutate(item.id)
                  }
                }}
                deleting={destroyMut.isPending}
              />
            )}
          />
        )
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating
                ? `New ${itemLabel.toLowerCase()}`
                : editing && describeItem
                ? describeItem(editing as T)
                : `Edit ${itemLabel.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Translatable fields support German and English. Switch with the DE / EN toggle.
            </DialogDescription>
          </DialogHeader>

          {editing && renderForm(editing, (next) => setEditing({ ...editing, ...next }))}

          <div className="flex justify-end gap-2 pt-2 border-t border-[hsl(var(--border))]">
            <button onClick={closeDialog} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="btn-primary text-sm"
            >
              {isSaving ? 'Saving…' : isCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ListRow<T extends { id: string; is_published?: boolean }>({
  item, renderRow, rowActions, onEdit, onDelete, deleting,
}: {
  item: T
  renderRow: (item: T) => ReactNode
  rowActions?: (item: T) => ReactNode
  onEdit: () => void
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="flex-1 min-w-0">{renderRow(item)}</div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {item.is_published !== undefined && (
          <PublishedBadge isPublished={item.is_published} className="mr-2" />
        )}
        {rowActions ? (
          rowActions(item)
        ) : (
          <>
            <button onClick={onEdit} className="btn-ghost !p-2" title="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="btn-ghost !p-2 hover:bg-red-500/10 hover:text-red-300"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
