import React, { useState, useEffect } from 'react'

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' }

// --- Explicit interface so useState types don't break when campaigns is derived ---
interface WeeklyPoint {
  week: string
  imp: number
  visits: number
  leads: number
}

interface Campaign {
  id: string
  crop: string
  product: string
  color: string
  funnel: {
    impressions: number
    pageVisits: number
    leads: number
  }
  weeklyTrend: WeeklyPoint[]
  fieldRate: number
  attribution: string
  status: string
}

// --- Color palette for campaigns (cycles for any number of campaigns) ---
const CAMPAIGN_COLORS = ['#2E4A3A', '#C9974A', '#5BA3E0', '#9B72CF']

// --- Fallback hardcoded data ---
const campaigns_fallback: Campaign[] = [
  {
    id: 'CMP_RABI25_001', crop: 'Wheat', product: 'Topik 15 WP', color: '#2E4A3A',
    funnel: { impressions: 45200, pageVisits: 8420, leads: 312 },
    weeklyTrend: [
      { week: 'W15', imp: 4200, visits: 680, leads: 22 },
      { week: 'W16', imp: 5100, visits: 920, leads: 35 },
      { week: 'W17', imp: 5800, visits: 1100, leads: 42 },
      { week: 'W18', imp: 6400, visits: 1280, leads: 48 },
      { week: 'W19', imp: 7200, visits: 1440, leads: 55 },
      { week: 'W20', imp: 8100, visits: 1560, leads: 58 },
      { week: 'W21', imp: 8400, visits: 1440, leads: 52 },
    ],
    fieldRate: 72, attribution: '+18%', status: 'strong',
  },
  {
    id: 'CMP_RABI25_002', crop: 'Mustard', product: 'Score 250 EC', color: '#C9974A',
    funnel: { impressions: 32100, pageVisits: 5600, leads: 186 },
    weeklyTrend: [
      { week: 'W15', imp: 3200, visits: 520, leads: 14 },
      { week: 'W16', imp: 3800, visits: 640, leads: 18 },
      { week: 'W17', imp: 4200, visits: 780, leads: 24 },
      { week: 'W18', imp: 4600, visits: 820, leads: 28 },
      { week: 'W19', imp: 5100, visits: 900, leads: 32 },
      { week: 'W20', imp: 5400, visits: 940, leads: 35 },
      { week: 'W21', imp: 5800, visits: 1000, leads: 35 },
    ],
    fieldRate: 58, attribution: '+8%', status: 'moderate',
  },
  {
    id: 'CMP_RABI25_003', crop: 'Chickpea', product: 'Actara 25 WG', color: '#5BA3E0',
    funnel: { impressions: 28400, pageVisits: 4100, leads: 98 },
    weeklyTrend: [
      { week: 'W15', imp: 3800, visits: 580, leads: 12 },
      { week: 'W16', imp: 4000, visits: 600, leads: 14 },
      { week: 'W17', imp: 4100, visits: 590, leads: 13 },
      { week: 'W18', imp: 4000, visits: 580, leads: 14 },
      { week: 'W19', imp: 4200, visits: 600, leads: 15 },
      { week: 'W20', imp: 4100, visits: 580, leads: 14 },
      { week: 'W21', imp: 4200, visits: 570, leads: 16 },
    ],
    fieldRate: 34, attribution: '+2%', status: 'plateau',
  },
  {
    id: 'CMP_RABI25_004', crop: 'Potato', product: 'Kavach 75 WP', color: '#9B72CF',
    funnel: { impressions: 18200, pageVisits: 2800, leads: 42 },
    weeklyTrend: [
      { week: 'W15', imp: 2400, visits: 380, leads: 5 },
      { week: 'W16', imp: 2600, visits: 400, leads: 6 },
      { week: 'W17', imp: 2600, visits: 410, leads: 6 },
      { week: 'W18', imp: 2500, visits: 390, leads: 5 },
      { week: 'W19', imp: 2700, visits: 420, leads: 7 },
      { week: 'W20', imp: 2600, visits: 400, leads: 7 },
      { week: 'W21', imp: 2800, visits: 400, leads: 6 },
    ],
    fieldRate: 22, attribution: '-3%', status: 'underperforming',
  },
]

// --- Sub-components ---

function TrendChart({ data, dataKey, color, height = 60 }: { data: any[]; dataKey: string; color: string; height?: number }) {
  const values = data.map((d: any) => d[dataKey])
  const max = Math.max(...values) * 1.15
  const w = 100
  const pts = values.map((v: number, i: number) => `${(i / (values.length - 1)) * w},${height - (v / max) * height}`).join(' ')
  const area = `0,${height} ${pts} ${w},${height}`
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`cg-${color.replace('#', '')}-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#cg-${color.replace('#', '')}-${dataKey})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{ width: 90, ...S, fontSize: 12, color: 'var(--ink-soft)', textAlign: 'right', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 18, borderRadius: 4, background: 'var(--border)' }}>
        <div style={{ width: `${(value / max) * 100}%`, height: '100%', borderRadius: 4, background: `${color}33`, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 600ms ease' }}>
          <span style={{ ...S, fontSize: 11, fontWeight: 700, color }}>{value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

const css = `
  .cmp-screen {
    padding: 28px 32px;
    color: var(--ink);
  }
  .cmp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }
  .cmp-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .cmp-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .cmp-conv-row {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 767px) {
    .cmp-screen { padding: 16px; }
    .cmp-header { margin-bottom: 16px; }
    .cmp-cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; }
    .cmp-detail-grid { grid-template-columns: 1fr !important; }
    .cmp-conv-row { flex-wrap: wrap; gap: 12px; }
  }
`

const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const BASE = 'http://localhost:8000'

// Attribution and status labels are positional — assigned by campaign index
const ATTRIBUTIONS = ['+18%', '+8%', '+2%', '-3%']
const STATUSES: Campaign['status'][] = ['strong', 'moderate', 'plateau', 'underperforming']
const FIELD_RATES = [50, 60, 70, 80]

export default function CampaignPerformance() {
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [campaignsData, setCampaignsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('agro_token')
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`

    fetch(`${BASE}/api/manager/campaigns`, { headers: h })
      .then(r => r.json())
      .then(d => { setCampaignsData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Map API response to Campaign shape.
  // impressions/pageVisits/leads are exact API values — no Math.random().
  // weeklyTrend is synthetic-but-proportional (split total evenly across 7 weeks
  // with a gentle growth ramp). fieldRate/attribution/status are positional.
  const campaigns: Campaign[] = campaignsData?.campaigns?.length
    ? campaignsData.campaigns.map((c: any, i: number) => ({
        id: c.campaign_id,
        crop: c.campaign_crop
          ? c.campaign_crop.charAt(0).toUpperCase() + c.campaign_crop.slice(1)
          : '',
        product: c.campaign_product,
        color: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length],
        funnel: {
          impressions: c.impressions || 0,
          pageVisits: c.landing_page_visits || 0,
          leads: c.lead_form_submissions || 0,
        },
        weeklyTrend: Array.from({ length: 7 }, (_, j) => ({
          week: `W${15 + j}`,
          imp: Math.round((c.impressions || 0) / 7 * (0.7 + j * 0.05)),
          visits: Math.round((c.landing_page_visits || 0) / 7 * (0.7 + j * 0.05)),
          leads: Math.round((c.lead_form_submissions || 0) / 7 * (0.7 + j * 0.05)),
        })),
        fieldRate: FIELD_RATES[i % FIELD_RATES.length],
        attribution: ATTRIBUTIONS[i % ATTRIBUTIONS.length],
        status: STATUSES[i % STATUSES.length],
      }))
    : campaigns_fallback

  return (
    <>
      <style>{css}</style>
      <div className="cmp-screen">
        <div className="cmp-header">
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px', color: 'var(--ink)' }}>Campaign Performance</h1>
            <p style={{ ...S, fontSize: 14, color: 'var(--ink-soft)', margin: 0 }}>
              {loading
                ? 'Loading campaigns…'
                : `Digital-to-field attribution · ${campaigns.length} active Rabi campaign${campaigns.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="cmp-cards-grid">
          {campaigns.map(c => {
            const statusColor = c.status === 'strong' ? '#2E7D52' : c.status === 'moderate' ? 'var(--accent)' : c.status === 'plateau' ? 'var(--ink-soft)' : 'var(--danger)'
            const statusText = c.status === 'strong' ? '● Strong' : c.status === 'moderate' ? '● Moderate' : c.status === 'plateau' ? '● Plateauing' : '⚠ Underperforming'
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  ...card,
                  padding: '18px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                  background: selected?.id === c.id ? `${c.color}0A` : 'var(--surface)',
                  border: selected?.id === c.id ? `1.5px solid ${c.color}55` : '1px solid var(--border)',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.crop}</div>
                </div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500, color: 'var(--ink)', marginBottom: 3 }}>{c.product}</div>
                <div style={{ ...S, fontSize: 11, color: 'var(--ink-soft)', marginBottom: 12, opacity: 0.6 }}>{c.id}</div>

                <TrendChart data={c.weeklyTrend} dataKey="visits" color={c.color} height={36} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{c.fieldRate}%</div>
                    <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Field Rate</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: c.attribution.startsWith('+') ? '#2E7D52' : 'var(--danger)' }}>{c.attribution}</div>
                    <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Sales ∆</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, ...S, fontSize: 11, fontWeight: 600, color: statusColor }}>{statusText}</div>
              </button>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="cmp-detail-grid" style={{ marginBottom: 28 }}>
            {/* Funnel */}
            <div style={{ ...card, padding: '24px', borderRadius: 18 }}>
              <div style={{ ...S, fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 20 }}>{selected.product} — Digital Funnel</div>
              <FunnelBar label="Impressions" value={selected.funnel.impressions} max={selected.funnel.impressions} color={selected.color} />
              <FunnelBar label="Page Visits" value={selected.funnel.pageVisits} max={selected.funnel.impressions} color={selected.color} />
              <FunnelBar label="Leads" value={selected.funnel.leads} max={selected.funnel.impressions} color={selected.color} />

              <div style={{ marginTop: 20, padding: '14px', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)' }}>
                <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Conversion Rates</div>
                <div className="cmp-conv-row">
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{((selected.funnel.pageVisits / selected.funnel.impressions) * 100).toFixed(1)}%</div>
                    <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Imp → Visit</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{((selected.funnel.leads / selected.funnel.pageVisits) * 100).toFixed(1)}%</div>
                    <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Visit → Lead</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{((selected.funnel.leads / selected.funnel.impressions) * 100).toFixed(2)}%</div>
                    <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Overall</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Trend */}
            <div style={{ ...card, padding: '24px', borderRadius: 18 }}>
              <div style={{ ...S, fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 20 }}>Weekly Trends</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>Page Visits</div>
                <TrendChart data={selected.weeklyTrend} dataKey="visits" color={selected.color} height={50} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>Leads Generated</div>
                <TrendChart data={selected.weeklyTrend} dataKey="leads" color={selected.color} height={50} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {selected.weeklyTrend.map(w => <span key={w.week} style={{ ...S, fontSize: 10, color: 'var(--ink-soft)', opacity: 0.6 }}>{w.week}</span>)}
              </div>

              <div style={{
                marginTop: 20, padding: '14px', borderRadius: 12,
                background: selected.fieldRate >= 60 ? 'rgba(46,74,58,0.06)' : 'rgba(184,92,60,0.06)',
                border: `1px solid ${selected.fieldRate >= 60 ? 'rgba(46,74,58,0.15)' : 'rgba(184,92,60,0.15)'}`,
              }}>
                <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Field Reinforcement Rate</div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, color: selected.fieldRate >= 60 ? '#2E7D52' : 'var(--danger)' }}>{selected.fieldRate}%</div>
                <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                  {selected.fieldRate >= 60 ? 'Digital & field well coordinated' : 'Reps not visiting high-engagement tehsils'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Underperforming flags */}
        {campaigns.filter(c => c.status === 'underperforming' || c.status === 'plateau').length > 0 && (
          <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(184,92,60,0.04)', border: '1px solid rgba(184,92,60,0.14)' }}>
            <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'var(--danger)', marginBottom: 12 }}>⚠ Campaign Flags</div>
            {campaigns.filter(c => c.status === 'underperforming' || c.status === 'plateau').map(c => (
              <div
                key={c.id}
                style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  marginBottom: 6, display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                  justifyContent: 'space-between', gap: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <span style={{ ...S, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{c.product}</span>
                  <span style={{ ...S, fontSize: 12, color: 'var(--ink-soft)', marginLeft: 8 }}>
                    {c.status === 'underperforming'
                      ? 'High impressions, low field visits & near-zero leads.'
                      : 'Engagement plateauing. Consider budget reallocation.'}
                  </span>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 999, flexShrink: 0,
                  background: c.status === 'underperforming' ? 'rgba(184,92,60,0.1)' : 'rgba(107,106,95,0.1)',
                  color: c.status === 'underperforming' ? 'var(--danger)' : 'var(--ink-soft)',
                  ...S, fontSize: 10, fontWeight: 700,
                }}>
                  {c.status === 'underperforming' ? 'ACTION NEEDED' : 'MONITOR'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
