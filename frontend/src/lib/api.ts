const BASE = (import.meta.env.VITE_API_URL as string) || ''

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('agro_token')
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json() as Promise<T>
}

export const REP_ID = 'REP_0001'

/** Upload a real image for AI crop diagnosis */
export async function scanCrop(image: Blob, crop: string, repId: string = REP_ID, farmSize: number = 1.0) {
  const form = new FormData()
  form.append('image', image, 'scan.jpg')
  form.append('crop_hint', crop)
  form.append('rep_id', repId)
  form.append('farm_size_acres', String(farmSize))

  const token = localStorage.getItem('agro_token')
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  const res = await fetch(`${BASE}/api/scan`, { method: 'POST', body: form, headers })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

/** Text-based demo scan (no image required) */
export async function scanDemo(symptom: string, crop: string, farmSize: number = 1.0) {
  return apiFetch<any>('/api/scan/demo', {
    method: 'POST',
    body: JSON.stringify({ symptom, crop, farm_size_acres: farmSize, rep_id: REP_ID }),
  })
}

