const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

export const api = {
  login: (username: string, password: string) =>
    req<{ token: string; role: string; rep_id: string; name: string }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password }),
    }),

  getBriefing: () => req<any>('/api/briefing'),
  getAlerts: () => req<any>('/api/alerts'),
  getFarmers: () => req<any>('/api/farmers'),
  getFarmer: (id: string) => req<any>(`/api/farmers/${id}`),
  getRetailers: () => req<any>('/api/retailers'),
  getRetailer: (id: string) => req<any>(`/api/retailers/${id}`),
  getRoute: () => req<any>('/api/route'),

  calculateROI: (params: { crop: string; farm_size_acres: number; disease_severity: string; product_sku: string; num_applications: number }) =>
    req<any>('/api/calculator/roi', { method: 'POST', body: JSON.stringify(params) }),

  chat: (messages: { role: string; content: string }[]) =>
    req<{ response: string }>('/api/chat', { method: 'POST', body: JSON.stringify({ messages }) }),

  scanDemo: (symptom: string, crop: string) =>
    req<any>('/api/scan/demo', { method: 'POST', body: JSON.stringify({ symptom, crop }) }),

  getManagerKPI: () => req<any>('/api/manager/kpi'),
  getManagerReps: () => req<any>('/api/manager/reps'),
  getManagerTerritory: () => req<any>('/api/manager/territory'),
  getManagerCampaigns: () => req<any>('/api/manager/campaigns'),
}
