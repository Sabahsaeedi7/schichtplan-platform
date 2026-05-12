import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from '@/components/ui/toaster'
import { marketingMediaApi } from '@/api/marketing-client'
import { Label } from '@/components/ui/label'

interface MediaUploadFieldProps {
  label: string
  description?: string
  context: string
  value: string | null | undefined
  onChange: (next: string | null) => void
  accept?: string
}

export function MediaUploadField({
  label, description, context, value, onChange, accept = 'image/*',
}: MediaUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = async (file?: File) => {
    if (!file) return
    setUploading(true)
    try {
      const res = await marketingMediaApi.upload(file, context)
      onChange(res.url)
      toast.success('Uploaded.')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed.'
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">{description}</p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt=""
              className="w-16 h-16 rounded-lg object-cover border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-ghost text-xs"
            disabled={uploading}
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </button>
          <input
            type="url"
            placeholder="…or paste a URL"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value || null)}
            className="input text-xs h-8"
          />
        </div>
      </div>
    </div>
  )
}
