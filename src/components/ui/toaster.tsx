import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'hsl(222 47% 8%)',
          border: '1px solid hsl(216 34% 14%)',
          color: 'hsl(213 31% 91%)',
        },
      }}
    />
  )
}

export { toast } from 'sonner'
