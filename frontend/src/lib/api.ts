const BASE = (import.meta.env.VITE_API_URL as string) || ''

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json() as Promise<T>
}

export const REP_ID = 'REP_0001'
