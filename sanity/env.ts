export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Using fallback values to prevent startup errors
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'dev'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oauuua7l'

// Helper function for required values (kept for future use)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
