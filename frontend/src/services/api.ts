const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Core fetch wrapper. Automatically attaches Authorization header
 * if a JWT token is present in localStorage (set after login).
 * Login endpoint works without a token — header is simply omitted when absent.
 */
async function req<T>(path: string, options?: RequestInit): Promise<T> {
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
  return res.json()
}

export interface GraphResponse {
  rep_id: string
  recommendation: {
    product: string
    product_sku: string
    confidence: number
  }
  nodes: Array<{
    id: string
    label: string
    type: string
    angle: number
    weight: number
    icon_type: string
    facts: [string, string][]
    source: string
  }>
  steps: Array<{
    n: number
    text: string
    src: string
  }>
}

export const api = {
  login: (username: string, password: string) =>
    req<{ token: string; role: string; rep_id: string | null; name: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getBriefing: () => req<any>('/api/briefing'),
  getAlerts: () => req<any>('/api/alerts'),
  getFarmers: () => req<any>('/api/farmers'),
  getFarmer: (id: string) => req<any>(`/api/farmers/${id}`),
  getRetailers: () => req<any>('/api/retailers'),
  getRetailer: (id: string) => req<any>(`/api/retailers/${id}`),
  getRoute: () => req<any>('/api/route'),

  calculateROI: (params: {
    crop: string
    farm_size_acres: number
    disease_severity: string
    product_sku: string
    num_applications: number
  }) =>
    req<any>('/api/calculator/roi', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  chat: (messages: { role: string; content: string }[]) =>
    req<{ response: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  scanDemo: (symptom: string, crop: string) =>
    req<any>('/api/scan/demo', {
      method: 'POST',
      body: JSON.stringify({ symptom, crop }),
    }),

  getManagerKPI: () => req<any>('/api/manager/kpi'),
  getManagerReps: () => req<any>('/api/manager/reps'),
  getManagerTerritory: () => req<any>('/api/manager/territory'),
  getManagerCampaigns: () => req<any>('/api/manager/campaigns'),

  /** Fetch the reasoning graph for a given rep recommendation */
  getGraph: (repId: string) => req<GraphResponse>(`/api/graph/${repId}`),
}
