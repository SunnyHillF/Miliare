// Dynamically import to keep the bundle small as noted in AGENTS.md
import type { fetchAuthSession as fetchAuthSessionType } from 'aws-amplify/auth'

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { fetchAuthSession } = await import('aws-amplify/auth')
  const { tokens } = await (fetchAuthSession as typeof fetchAuthSessionType)()
  const token = tokens?.accessToken?.toString()

  const baseUrl = process.env.API_BASE_URL || ''

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`)
  }

  return res.json() as Promise<T>
}
