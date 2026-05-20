import React, { useState } from 'react'

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' }

const alerts = [
  { id: 1, type: 'stockout', severity: 'HIGH', title: 'Topik 15WP cluster stockout — Sandila', desc: '3 retailers out of stock in Sandila tehsil. 8 farmers at heading stage.', rep: 'Arjun Mehta', time: '2h ago', resolved: false, escalated: true },
  { id: 2, type: 'demand', severity: 'HIGH', title: 'Score 250EC demand spike — Mallawan', desc: 'Weekly POS sales 3x average. Possible early fungal outbreak.', rep: 'Rahul Singh', time: '5h ago', resolved: false, escalated: false },
  { id: 3, type: 'competitor', severity: 'MEDIUM', title: 'Bayer Nativo push — Atrauli cluster', desc: '5 retailer sightings this week. Possible pricing campaign.', rep: 'Sunita Devi', time: '1d ago', resolved: false, escalated: false },
  { id: 4, type: 'weather', severity: 'MEDIUM', title: 'Heavy rain forecast — Hardoi district', desc: '48mm forecast Thu-Fri. Advance fungicide recommendations.', rep: 'All reps', time: '6h ago', resolved: false, escalated: false },
  { id: 5, type: 'campaign', severity: 'LOW', title: 'Wheat campaign surge — Baramati', desc: 'Landing page visits up 240%. Digital demand warming.', rep: 'Prachi Verma', time: '1d ago', resolved: true, escalated: false },
  { id: 6, type: 'stockout', severity: 'HIGH', title: 'Actara 25WG critical — Shahabad', desc: 'Zero stock at all 4 retailers. No field visit in 14 days.', rep: 'Mohan Kumar', time: '3d ago', resolved: false, escalated: true },
  { id: 7, type: 'competitor', severity: 'LOW', title: 'UPL Saaf spotted — Sandi tehsil', desc: 'New competitor product at 2 retailers. Monitor only.', rep: 'Arjun Mehta', time: '4d ago', resolved: true, escalated: false },
]

const tabs = ['All', 'Escalated', 'Unresolved', 'Stockouts', 'Competitor', 'Resolved']

const sevColors: Record<string, { bg: string; fg: string; border: string }> = {
  HIGH: { bg: 'rgba(184,92,60,0.1)', fg: 'var(--danger)', border: 'var(--danger)' },
  MEDIUM: { bg: 'rgba(212,163,71,0.12)', fg: '#8C6420', border: 'var(--warning)' },
  LOW: { bg: 'rgba(107,106,95,0.08)', fg: 'var(--ink-soft)', border: 'var(--border)' },
}

const typeIcons: Record<string, string> = {
  stockout: '📦', demand: '📈', competitor: '⚔️', weather: '🌧️', campaign: '🔥',
}

const css = `
  .alert-screen {
    padding: 28px 32px;
    color: var(--ink);
  }
  .alert-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }
  .alert-stats {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
  .alert-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  .alert-actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }
  .alert-comp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 767px) {
    .alert-screen { padding: 16px; }
    .alert-header { flex-direction: column; margin-bottom: 16px; }
    .alert-stats { width: 100%; }
    .alert-stats > div { flex: 1; }
    .alert-comp-grid { grid-template-columns: 1fr !important; }
    .alert-actions { margin-left: 0; margin-top: 8px; }
  }
`

const statCard = {
  padding: '8px 16px',
  borderRadius: 10,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

export default function AlertManagement() {
  const [tab, setTab] = useState('All')

  const filtered =
    tab === 'All' ? alerts :
    tab === 'Escalated' ? alerts.filter(a => a.escalated) :
    tab === 'Unresolved' ? alerts.filter(a => !a.resolved) :
    tab === 'Stockouts' ? alerts.filter(a => a.type === 'stockout') :
    tab === 'Competitor' ? alerts.filter(a => a.type === 'competitor') :
    alerts.filter(a => a.resolved)

  const unresolved = alerts.filter(a => !a.resolved).length
  const escalated = alerts.filter(a => a.escalated).length
  const resRate = Math.round((alerts.filter(a => a.resolved).length / alerts.length) * 100)

  return (
    <>
      <style>{css}</style>
      <div className="alert-screen">
        <div className="alert-header">
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px', color: 'var(--ink)' }}>Alert Management</h1>
            <p style={{ ...S, fontSize: 14, color: 'var(--ink-soft)', margin: 0 }}>Cross-territory anomaly & escalation feed</p>
          </div>
          <div className="alert-stats">
            <div style={{ ...statCard, background: 'rgba(184,92,60,0.06)', border: '1px solid rgba(184,92,60,0.18)' }}>
              <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Escalated</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--danger)' }}>{escalated}</div>
            </div>
            <div style={{ ...statCard, background: 'rgba(212,163,71,0.08)', border: '1px solid rgba(212,163,71,0.2)' }}>
              <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unresolved</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--accent)' }}>{unresolved}</div>
            </div>
            <div style={{ ...statCard, background: 'rgba(46,74,58,0.06)', border: '1px solid rgba(46,74,58,0.15)' }}>
              <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resolution Rate</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--primary)' }}>{resRate}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="alert-tabs">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 16px', borderRadius: 999,
                background: tab === t ? 'var(--primary-soft)' : 'transparent',
                border: tab === t ? '1px solid var(--primary-soft)' : '1px solid var(--border)',
                color: tab === t ? 'var(--primary)' : 'var(--ink-soft)',
                ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {t}{t === 'Escalated' ? ` (${escalated})` : t === 'Unresolved' ? ` (${unresolved})` : ''}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(alert => {
            const sev = sevColors[alert.severity]
            return (
              <div
                key={alert.id}
                style={{
                  padding: '16px 18px', borderRadius: 16,
                  background: 'var(--surface)',
                  border: `1px solid ${alert.escalated ? 'rgba(184,92,60,0.25)' : 'var(--border)'}`,
                  borderLeft: `4px solid ${sev.border}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  opacity: alert.resolved ? 0.55 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{typeIcons[alert.type]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 999, background: sev.bg, color: sev.fg, ...S, fontSize: 10, fontWeight: 700 }}>{alert.severity}</span>
                      {alert.escalated && <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(184,92,60,0.1)', color: 'var(--danger)', ...S, fontSize: 10, fontWeight: 700 }}>🚨 ESCALATED</span>}
                      {alert.resolved && <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(46,74,58,0.1)', color: 'var(--primary)', ...S, fontSize: 10, fontWeight: 700 }}>✓ RESOLVED</span>}
                      <span style={{ ...S, fontSize: 11, color: 'var(--ink-soft)' }}>{alert.time}</span>
                    </div>
                    <div style={{ ...S, fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{alert.title}</div>
                    <div style={{ ...S, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.4, marginBottom: 10 }}>{alert.desc}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                      <span style={{ ...S, fontSize: 12, color: 'var(--ink-soft)' }}>
                        Rep: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{alert.rep}</span>
                      </span>
                      {!alert.resolved && (
                        <div className="alert-actions">
                          <button style={{ padding: '5px 12px', borderRadius: 8, background: 'var(--surface-warm)', border: '1px solid var(--border)', color: 'var(--ink-soft)', ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Assign</button>
                          <button style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(46,74,58,0.08)', border: '1px solid rgba(46,74,58,0.18)', color: 'var(--primary)', ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Competitor Summary */}
        <div style={{ marginTop: 28, padding: '20px', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 16 }}>Competitor Intelligence Summary</div>
          <div className="alert-comp-grid">
            {[
              { brand: 'Bayer Nativo', sightings: 12, trend: 'Rising', tehsils: 'Atrauli, Sandila' },
              { brand: 'UPL Saaf', sightings: 5, trend: 'Stable', tehsils: 'Sandi, Pihani' },
              { brand: 'BASF Merivon', sightings: 2, trend: 'New', tehsils: 'Mallawan' },
            ].map(c => (
              <div key={c.brand} style={{ padding: '14px', borderRadius: 14, background: 'var(--surface-warm)', border: '1px solid var(--border)' }}>
                <div style={{ ...S, fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.brand}</div>
                <div style={{ ...S, fontSize: 12, color: 'var(--ink-soft)' }}>
                  {c.sightings} sightings · <span style={{ color: c.trend === 'Rising' ? 'var(--danger)' : c.trend === 'New' ? 'var(--accent)' : '#2E7D52', fontWeight: 700 }}>{c.trend}</span>
                </div>
                <div style={{ ...S, fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, opacity: 0.7 }}>{c.tehsils}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
