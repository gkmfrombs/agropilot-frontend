import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IChev, INav, IPhone, ISpark, TopStrip, BottomNav, Eyebrow, Icon } from '../components/Shared'

const IPackage = (p: any) => <Icon {...p} d={<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>} />

// Fallback static data shown when the API call fails
const FALLBACK_STOCK = [
  { sku: 'Topik 15 WP', qty: 0, status: 'OUT' as const },
  { sku: 'Score 250 EC', qty: 4, status: 'LOW' as const },
  { sku: 'Actara 25 WG', qty: 18, status: 'OK' as const },
  { sku: 'Kavach 75 WP', qty: 12, status: 'OK' as const },
]

const FALLBACK_TALKING_POINTS = [
  { text: 'HD-2967 wheat at BBCH 65 (flowering) — ideal 48h window for Tilt 25EC application before rain arrives Thursday.', src: 'Crop stage data' },
  { text: '48mm rainfall forecast Thu-Fri creates Septoria infection window. Fungicide application today closes the risk.', src: 'IMD forecast' },
  { text: 'Actara 25WG demand spiking in Bhatpura — 12 farmers scanned. Strong cross-sell signal for nearby potato growers.', src: 'Regional demand signal' },
]

const FALLBACK_FARMERS = [
  { name: 'Ramesh Yadav', crop: 'Wheat', stage: 'Flowering', dist: '2.1km' },
  { name: 'Manju Devi', crop: 'Wheat', stage: 'Heading', dist: '3.4km' },
  { name: 'Suresh Verma', crop: 'Wheat', stage: 'Flowering', dist: '4.8km' },
]

const statusColors: Record<'OUT' | 'LOW' | 'OK', { bg: string; fg: string; label: string }> = {
  OUT: { bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', label: 'OUT OF STOCK' },
  LOW: { bg: 'rgba(212,163,71,0.18)', fg: '#8C6420', label: 'LOW STOCK' },
  OK: { bg: 'rgba(200,213,187,0.5)', fg: '#2E4A3A', label: 'IN STOCK' },
}

// Maps API status strings to the display status keys used by statusColors
const statusMap: Record<string, 'OUT' | 'LOW' | 'OK'> = {
  out_of_stock: 'OUT',
  low: 'LOW',
  healthy: 'OK',
}

// Maps API urgency strings to badge labels
const urgencyMap: Record<string, string> = {
  high: 'URGENT',
  medium: 'MEDIUM',
  low: 'ROUTINE',
}

export default function VisitCopilot() {
  const [showCompetitor, setShowCompetitor] = useState(false)
  const [copilotData, setCopilotData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // In production, retailerId would come from route state or params
  const retailerId = 'RTL_00001'
  const repId = 'REP_0001'

  useEffect(() => {
    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const token = localStorage.getItem('agro_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    fetch(`${BASE}/api/copilot/${retailerId}?rep_id=${repId}`, { headers })
      .then(r => r.json())
      .then(data => { setCopilotData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Derive display data from API response, falling back to static data on failure
  const stockItems = copilotData?.stock_status?.map((s: any) => ({
    sku: s.sku_name,
    qty: s.qty,
    status: statusMap[s.status] ?? 'OK',
  })) ?? FALLBACK_STOCK

  const talkingPoints = copilotData?.talking_points?.map((t: string) => ({
    text: t,
    src: 'AI analysis · Live data',
  })) ?? FALLBACK_TALKING_POINTS

  // Distance is not in the API response — approximate from index position
  const nearbyFarmers = copilotData?.nearby_growers?.map((g: any, i: number) => ({
    name: g.grower_id,
    crop: g.crop ? g.crop.charAt(0).toUpperCase() + g.crop.slice(1) : '',
    stage: g.current_stage ? g.current_stage.charAt(0).toUpperCase() + g.current_stage.slice(1) : '',
    dist: `${((i + 1) * 1.6 + 0.8).toFixed(1)}km`,
  })) ?? FALLBACK_FARMERS

  const retailerName = copilotData?.retailer?.retailer_id ?? 'Kisan Agri Store'
  const retailerSub = copilotData
    ? `${copilotData.retailer?.tehsil ?? ''}, ${copilotData.retailer?.district ?? ''}`
    : 'Sandila Rd, Hardoi · Owner: Rajesh Kumar'

  const aiProduct = copilotData?.ai_recommendation?.product ?? 'Topik 15WP'
  const aiReason = copilotData?.ai_recommendation?.reason
    ?? 'Lead with Topik 15WP — this retailer is out of stock and 4 nearby farmers have wheat at heading stage. Restock urgency is high before the rain window Thursday.'

  const urgencyLabel = copilotData?.ai_recommendation?.urgency
    ? urgencyMap[copilotData.ai_recommendation.urgency] ?? 'URGENT'
    : 'URGENT'

  return (
    <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
      <TopStrip />

      {/* Header */}
      <div style={{ padding: '14px 18px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Link to="/route" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
          <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back to Route</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>{retailerName}</h1>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{retailerSub}</div>
          </div>
          <div style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(184,92,60,0.12)', color: '#B85C3C', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700 }}>{urgencyLabel}</div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="fade-up" style={{ margin: '16px 18px', padding: '18px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 28px rgba(20,18,12,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <ISpark size={16} stroke="var(--accent)" />
          <Eyebrow color="var(--accent)">AI Recommendation</Eyebrow>
        </div>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 12px' }}>
          Lead with <strong>{aiProduct}</strong> — {aiReason}
        </p>
        <Link to="/chat" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: 'var(--primary)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 10px rgba(46,74,58,0.22)' }}>
          Ask follow-up <IChev size={14} />
        </Link>
      </div>

      {/* Dynamic sections: show loading state while fetch is in flight */}
      {loading ? (
        <div style={{ padding: '40px 18px', textAlign: 'center', fontFamily: 'Plus Jakarta Sans', color: 'var(--ink-soft)' }}>
          Loading visit data...
        </div>
      ) : (
        <>
          {/* Stock Status */}
          <div className="fade-up" style={{ animationDelay: '100ms', margin: '0 18px 16px' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IPackage size={18} stroke="var(--primary)" /> Live Stock Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stockItems.map((item: { sku: string; qty: number; status: 'OUT' | 'LOW' | 'OK' }) => {
                const st = statusColors[item.status]
                return (
                  <div key={item.sku} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{item.sku}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{item.qty}</span>
                      <span style={{ padding: '3px 8px', borderRadius: 999, background: st.bg, color: st.fg, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700 }}>{st.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Talking Points */}
          <div className="fade-up" style={{ animationDelay: '200ms', margin: '0 18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', margin: 0 }}>Agronomic Talking Points</h2>
            </div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Generated from Ramesh's profile + weather data</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {talkingPoints.map((tp: { text: string; src: string }, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', background: 'var(--surface-warm)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, flex: 'none' }}>{i + 1}</span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)', lineHeight: 1.45 }}>{tp.text}</span>
                  </div>
                  <span style={{ alignSelf: 'flex-start', marginLeft: 30, padding: '2px 9px', borderRadius: 999, background: 'var(--bg)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600, color: 'var(--ink-soft)' }}>{tp.src}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Farmers */}
          <div className="fade-up" style={{ animationDelay: '300ms', margin: '0 18px 16px' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 12 }}>Nearby Farmers</h2>
            {nearbyFarmers.map((f: { name: string; crop: string; stage: string; dist: string }, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < nearbyFarmers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{f.name}</div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{f.crop} · {f.stage}</div>
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{f.dist}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Competitor Section */}
      <div style={{ margin: '0 18px 16px' }}>
        <button onClick={() => setShowCompetitor(!showCompetitor)} style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Log Competitor Products
          <IChev size={16} style={{ transform: showCompetitor ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
        </button>
        {showCompetitor && (
          <div className="fade-up" style={{ marginTop: 8, padding: '14px', background: 'var(--surface-warm)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <input placeholder="Enter competitor product name..." style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)', outline: 'none' }} />
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 18px 24px' }}>
        <Link to="/log-visit" style={{ display: 'flex', width: '100%', padding: '15px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
          Log Visit Outcome
        </Link>
      </div>

      <div style={{ height: 100 }} />
      <BottomNav />
    </div>
  )
}
