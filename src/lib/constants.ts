// Shared application constants and authorization helpers

export const ADMIN_EMAILS = [
  'ahhbrothers.developers@gmail.com',
  'naqeebkns@gmail.com'
]

/**
 * Helper to check if a given email is a pre-approved administrator email.
 */
export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false
  const lower = email.toLowerCase().trim()
  
  const envAdmin = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  if (envAdmin && lower === envAdmin) return true
  
  return ADMIN_EMAILS.includes(lower)
}
