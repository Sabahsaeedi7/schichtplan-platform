import axios from 'axios'

interface NormalizedError {
  message: string
  fieldErrors: Record<string, string[]>
}

/**
 * Convert a thrown axios/Laravel error into something we can show in a toast
 * and (optionally) bind to individual form fields.
 *
 * Laravel returns:
 *   422 { message: 'The given data was invalid.', errors: { 'title.de': ['…'] } }
 *   500 { message: 'Server Error' }
 */
export function extractApiErrors(err: unknown): NormalizedError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined

    const fieldErrors = data?.errors ?? {}
    const firstField = Object.keys(fieldErrors)[0]
    const firstFieldMsg = firstField ? fieldErrors[firstField]?.[0] : undefined

    return {
      message: data?.message
        ? firstFieldMsg
          ? `${data.message} — ${firstFieldMsg}`
          : data.message
        : err.message,
      fieldErrors,
    }
  }

  if (err instanceof Error) return { message: err.message, fieldErrors: {} }
  return { message: 'Unknown error.', fieldErrors: {} }
}
