import React, { useState, useEffect } from 'react'

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' }

// --- Explicit interface so useState types don't break when reps is derived ---
interface Rep {
  name: string
  territory: string
  photo: string
  visits: number
  target: number
  revenue: number
  revTarget: number
  coverage: number
  coverTarget: number
  acceptance: number
  aiUsage: number
  quality: number
  emergency: string
  issues: string[]
  trend: number[]
}

// --- Fallback hardcoded data ---
const reps_fallback: Rep[] = [
  { name: 'Prachi Verma', territory: 'Sandila', photo: 'PV', visits: 22, target: 24, revenue: 16.8, revTarget: 15, coverage: 85, coverTarget: 80, acceptance: 88, aiUsage: 92, quality: 91, emergency: '2h', issues: [], trend: [12, 14, 15, 16, 16.8] },
  { name: 'Arjun Mehta', territory: 'Hardoi', photo: 'AM', visits: 18, target: 24, revenue: 14.2, revTarget: 15, coverage: 78, coverTarget: 80, acceptance: 83, aiUsage: 85, quality: 78, emergency: '4h', issues: [], trend: [10, 11, 12, 13, 14.2] },
  { name: 'Rahul Singh', territory: 'Mallawan', photo: 'RS', visits: 15, target: 24, revenue: 11.3, revTarget: 15, coverage: 62, coverTarget: 80, acceptance: 71, aiUsage: 68, quality: 65, emergency: '8h', issues: ['Low coverage in west tehsils'], trend: [9, 10, 10.5, 11, 11.3] },
  { name: 'Sunita Devi', territory: 'Atrauli', photo: 'SD', visits: 12, target: 24, revenue: 9.7, revTarget: 15, coverage: 55, coverTarget: 80, acceptance: 65, aiUsage: 52, quality: 58, emergency: '12h', issues: ['Ignoring 3 urgent alerts', 'Low AI usage'], trend: [7, 8, 8.5, 9, 9.7] },
  { name: 'Mohan Kumar', territory: 'Shahabad', photo: 'MK', visits: 8, target: 24, revenue: 7.2, revTarget: 15, coverage: 42, coverTarget: 80, acceptance: 58, aiUsage: 35, quality: 42, emergency: '24h+', issues: ['Cold zone unvisited 2+ weeks', 'Not logging outcomes', 'Low AI acceptance'], trend: [5, 6, 6.5, 7, 7.2] },
]

const sortOptions = ['Revenue', 'Coverage', 'AI Acceptance', 'Quality Score']

const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 5, borderRadius: 3, background: 'var(--border)', width: '100%' }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 600ms ease' }} />
    </div>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data) * 1.1
  const h = 32, w = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const css = `
  .rp-screen {
    padding: 28px 32px;
    color: var(--ink);
  }
  .rp-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }
  .rp-sort-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .rp-body {
    display: grid;
    gap: 24px;
  }
  .rp-body.with-panel {
    grid-template-columns: 1fr 380px;
  }
  .rp-card-metrics {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .rp-detail {
    background: var(--surface);
    border-radius: 20px;
    border: 1px solid var(--border);
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .rp-card-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border-radius: 18px;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }

  @media (max-width: 767px) {
    .rp-screen { padding: 16px; }
    .rp-header { flex-direction: column; margin-bottom: 16px; }
    .rp-sort-row { width: 100%; }
    .rp-body.with-panel { grid-template-columns: 1fr; }
    .rp-card-metrics { display: none; }
    .rp-card-btn { padding: 14px 16px; }
  }
`

const BASE = 'http://localhost:8000'

export default function RepPerformance() {
  const [sortBy, setSortBy] = useState('Revenue')
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null)
  const [repsData, setRepsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('agro_token')
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) h['Authorization'] = `Bearer ${token}`

    fetch(`${BASE}/api/manager/reps`, { headers: h })
      .then(r => r.json())
      .then(d => { setRepsData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Map API response to the shape the UI expects; fall back when unavailable
  const reps: Rep[] = repsData?.reps?.length
    ? repsData.reps.map((r: any) => ({
        name: r.rep_id,
        territory: r.territory || r.district,
        photo: r.rep_id.slice(-2),
        visits: r.visits_total,
        target: 24,
        revenue: r.revenue_lakh,
        revTarget: 15,
        coverage: r.coverage_pct,
        coverTarget: 80,
        acceptance: r.ai_accept_rate_pct,
        aiUsage: r.ai_accept_rate_pct - 5,
        quality: Math.round((r.coverage_pct + r.ai_accept_rate_pct) / 2),
        emergency: r.coverage_pct > 70 ? '2h' : r.coverage_pct > 50 ? '6h' : '12h+',
        issues: r.coverage_pct < 50 ? ['Low coverage'] : [],
        trend: [
          r.revenue_lakh * 0.6,
          r.revenue_lakh * 0.7,
          r.revenue_lakh * 0.8,
          r.revenue_lakh * 0.9,
          r.revenue_lakh,
        ],
      }))
    : reps_fallback

  const sorted = [...reps].sort((a, b) => {
    if (sortBy === 'Revenue') return b.revenue - a.revenue
    if (sortBy === 'Coverage') return b.coverage - a.coverage
    if (sortBy === 'AI Acceptance') return b.acceptance - a.acceptance
    return b.quality - a.quality
  })

  return (
    <>
      <style>{css}</style>
      <div className="rp-screen">
        <div className="rp-header">
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px', color: 'var(--ink)' }}>Rep Performance Tracker</h1>
            <p style={{ ...S, fontSize: 14, color: 'var(--ink-soft)', margin: 0 }}>
              {loading ? 'Loading reps…' : 'Individual scorecards & leaderboard'}
            </p>
          </div>
          <div className="rp-sort-row">
            <span style={{ ...S, fontSize: 12, color: 'var(--ink-soft)' }}>Sort by:</span>
            {sortOptions.map(o => (
              <button
                key={o}
                onClick={() => setSortBy(o)}
                style={{
                  padding: '7px 14px', borderRadius: 999,
                  background: sortBy === o ? 'var(--primary-soft)' : 'transparent',
                  border: sortBy === o ? '1px solid var(--primary-soft)' : '1px solid var(--border)',
                  color: sortBy === o ? 'var(--primary)' : 'var(--ink-soft)',
                  ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{o}</button>
            ))}
          </div>
        </div>

        <div className={`rp-body${selectedRep ? ' with-panel' : ''}`}>
          {/* Leaderboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((rep, i) => {
              const hasIssues = rep.issues.length > 0
              return (
                <button
                  key={rep.name}
                  onClick={() => setSelectedRep(rep)}
                  className="rp-card-btn"
                  style={{
                    ...card,
                    borderRadius: 18,
                    background: selectedRep?.name === rep.name ? 'rgba(46,74,58,0.05)' : 'var(--surface)',
                    borderLeft: hasIssues ? '3px solid var(--danger)' : selectedRep?.name === rep.name ? '3px solid var(--primary)' : '1px solid var(--border)',
                  }}
                >
                  {/* Rank */}
                  <div style={{ width: 28, fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: i === 0 ? 'var(--accent)' : i === 1 ? '#8B9AAE' : i === 2 ? '#A07850' : 'var(--ink-soft)', textAlign: 'center', flex: 'none' }}>
                    {i + 1}
                  </div>
                  {/* Avatar */}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: hasIssues ? 'rgba(184,92,60,0.1)' : 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasIssues ? 'var(--danger)' : 'var(--primary)', fontSize: 13, fontWeight: 700, flex: 'none' }}>{rep.photo}</div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...S, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{rep.name}</div>
                    <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)' }}>{rep.territory}</div>
                    {hasIssues && (
                      <div style={{ ...S, fontSize: 11, color: 'var(--danger)', marginTop: 2, fontWeight: 600 }}>
                        {rep.issues.length} issue{rep.issues.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  {/* Metrics — hidden on mobile */}
                  <div className="rp-card-metrics">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>₹{rep.revenue}k</div>
                      <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Rev/Day</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: rep.coverage >= 75 ? '#2E7D52' : rep.coverage >= 50 ? 'var(--accent)' : 'var(--danger)' }}>{rep.coverage}%</div>
                      <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>Coverage</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{rep.acceptance}%</div>
                      <div style={{ ...S, fontSize: 10, color: 'var(--ink-soft)' }}>AI Accept</div>
                    </div>
                    <Sparkline data={rep.trend} color={rep.trend[rep.trend.length - 1] > rep.trend[0] ? '#2E7D52' : 'var(--danger)'} />
                  </div>
                  {hasIssues && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', flex: 'none' }} />}
                </button>
              )
            })}
          </div>

          {/* Detail Panel */}
          {selectedRep && (
            <div className="rp-detail">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}>{selectedRep.photo}</div>
                  <div>
                    <div style={{ ...S, fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{selectedRep.name}</div>
                    <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)' }}>{selectedRep.territory} Territory</div>
                  </div>
                </div>
                <button onClick={() => setSelectedRep(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>

              {/* Scorecard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Visits Completed', val: selectedRep.visits, tgt: selectedRep.target, unit: '', color: '#5BA3E0' },
                  { label: 'Revenue / Field Day', val: selectedRep.revenue, tgt: selectedRep.revTarget, unit: '₹k', color: '#2E7D52' },
                  { label: 'Coverage', val: selectedRep.coverage, tgt: selectedRep.coverTarget, unit: '%', color: '#5BA3E0' },
                  { label: 'AI Acceptance', val: selectedRep.acceptance, tgt: 85, unit: '%', color: 'var(--accent)' },
                  { label: 'AI Usage Rate', val: selectedRep.aiUsage, tgt: 90, unit: '%', color: '#9B72CF' },
                  { label: 'Visit Quality Score', val: selectedRep.quality, tgt: 80, unit: '', color: '#5BA3E0' },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ ...S, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>{m.label}</span>
                      <span style={{ ...S, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                        {m.unit === '₹k' ? `₹${m.val}k` : `${m.val}${m.unit}`}
                        {' '}<span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>/ {m.unit === '₹k' ? `₹${m.tgt}k` : `${m.tgt}${m.unit}`}</span>
                      </span>
                    </div>
                    <ProgressBar value={m.val} max={m.tgt} color={m.color} />
                  </div>
                ))}
              </div>

              {/* Emergency Response */}
              <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)', marginBottom: 16 }}>
                <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Emergency Response</div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: selectedRep.emergency.includes('24') ? 'var(--danger)' : selectedRep.emergency.includes('12') ? 'var(--accent)' : '#2E7D52', marginTop: 4 }}>{selectedRep.emergency}</div>
              </div>

              {/* AI Flags */}
              {selectedRep.issues.length > 0 && (
                <div>
                  <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>⚠ AI-Flagged Issues</div>
                  {selectedRep.issues.map((issue, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(184,92,60,0.06)', border: '1px solid rgba(184,92,60,0.15)', marginBottom: 6, ...S, fontSize: 13, color: 'var(--danger)' }}>
                      {issue}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
