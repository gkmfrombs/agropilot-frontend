import React, { useState } from 'react'

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' }

const tehsils = [
  { name: 'Sandila', coverage: 92, visits: 18, reps: 2, stockouts: 0, competitor: 1, status: 'good' },
  { name: 'Mallawan', coverage: 78, visits: 12, reps: 1, stockouts: 1, competitor: 3, status: 'good' },
  { name: 'Bhatpura', coverage: 65, visits: 8, reps: 1, stockouts: 2, competitor: 0, status: 'warn' },
  { name: 'Atrauli', coverage: 43, visits: 5, reps: 1, stockouts: 3, competitor: 5, status: 'warn' },
  { name: 'Shahabad', coverage: 28, visits: 3, reps: 1, stockouts: 4, competitor: 2, status: 'danger' },
  { name: 'Bilgram', coverage: 0, visits: 0, reps: 1, stockouts: 6, competitor: 0, status: 'cold' },
  { name: 'Pihani', coverage: 55, visits: 7, reps: 1, stockouts: 1, competitor: 1, status: 'warn' },
  { name: 'Sandi', coverage: 82, visits: 14, reps: 1, stockouts: 0, competitor: 0, status: 'good' },
]

const layers = ['Coverage', 'Demand Signals', 'Competitor Activity', 'Cold Zones']

const coverageColor = (pct: number) =>
  pct >= 75 ? '#2E4A3A' : pct >= 50 ? '#8B7B3B' : pct >= 25 ? '#8B5E3B' : pct > 0 ? '#8B3B3B' : '#B85C3C'

const statusLabel = (s: string) =>
  s === 'cold'
    ? { label: 'COLD ZONE', bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C' }
    : s === 'danger'
    ? { label: 'AT RISK', bg: 'rgba(184,92,60,0.1)', fg: '#C97050' }
    : s === 'warn'
    ? { label: 'LOW', bg: 'rgba(212,163,71,0.15)', fg: '#8C6420' }
    : { label: 'HEALTHY', bg: 'rgba(46,74,58,0.1)', fg: '#2E4A3A' }

const css = `
  .hm-screen {
    padding: 28px 32px;
    color: var(--ink);
  }
  .hm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
  }
  .hm-stats {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
  .hm-layers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  .hm-body {
    display: grid;
    gap: 24px;
  }
  .hm-body.with-panel {
    grid-template-columns: 1fr 360px;
  }
  .hm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .hm-detail {
    background: var(--surface);
    border-radius: 20px;
    border: 1px solid var(--border);
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  @media (max-width: 767px) {
    .hm-screen { padding: 16px; }
    .hm-header { flex-direction: column; align-items: flex-start; margin-bottom: 16px; }
    .hm-stats { width: 100%; }
    .hm-stats > div { flex: 1; }
    .hm-body.with-panel { grid-template-columns: 1fr; }
    .hm-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`

export default function TerritoryHeatmap() {
  const [activeLayers, setActiveLayers] = useState<string[]>(['Coverage'])
  const [selectedTehsil, setSelectedTehsil] = useState<typeof tehsils[0] | null>(null)

  const toggle = (l: string) =>
    setActiveLayers(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])

  const coldZones = tehsils.filter(t => t.coverage === 0).length
  const avgCoverage = Math.round(tehsils.reduce((a, t) => a + t.coverage, 0) / tehsils.length)

  return (
    <>
      <style>{css}</style>
      <div className="hm-screen">
        {/* Header */}
        <div className="hm-header">
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px', color: 'var(--ink)' }}>Territory Heatmap</h1>
            <p style={{ ...S, fontSize: 14, color: 'var(--ink-soft)', margin: 0 }}>UP West Region · Week 20, May 2026</p>
          </div>
          <div className="hm-stats">
            <div style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg Coverage</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>{avgCoverage}%</div>
            </div>
            <div style={{
              padding: '8px 16px', borderRadius: 10,
              background: coldZones > 0 ? 'rgba(184,92,60,0.08)' : 'var(--surface)',
              border: `1px solid ${coldZones > 0 ? 'rgba(184,92,60,0.2)' : 'var(--border)'}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cold Zones</div>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: coldZones > 0 ? 'var(--danger)' : 'var(--ink)' }}>{coldZones}</div>
            </div>
          </div>
        </div>

        {/* Layer toggles */}
        <div className="hm-layers">
          {layers.map(l => (
            <button
              key={l}
              onClick={() => toggle(l)}
              style={{
                padding: '7px 16px', borderRadius: 999,
                background: activeLayers.includes(l) ? 'var(--primary-soft)' : 'transparent',
                border: activeLayers.includes(l) ? '1px solid var(--primary-soft)' : '1px solid var(--border)',
                color: activeLayers.includes(l) ? 'var(--primary)' : 'var(--ink-soft)',
                ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className={`hm-body${selectedTehsil ? ' with-panel' : ''}`}>
          {/* Map area */}
          <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, minHeight: 480, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div className="hm-grid">
              {tehsils.map(t => {
                const st = statusLabel(t.status)
                return (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTehsil(t)}
                    style={{
                      padding: '18px 14px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                      background: `linear-gradient(135deg, ${coverageColor(t.coverage)}18 0%, ${coverageColor(t.coverage)}08 100%)`,
                      border: selectedTehsil?.name === t.name ? `2px solid ${coverageColor(t.coverage)}` : '1px solid var(--border)',
                      position: 'relative', overflow: 'hidden', transition: 'all 200ms',
                    }}
                  >
                    {t.status === 'cold' && (
                      <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} className="pulse-ring" />
                    )}
                    <div style={{ ...S, fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{t.name}</div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, color: coverageColor(t.coverage), marginBottom: 4 }}>{t.coverage}%</div>
                    <div style={{ ...S, fontSize: 11, color: 'var(--ink-soft)' }}>{t.visits} visits · {t.reps} rep{t.reps > 1 ? 's' : ''}</div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ padding: '3px 8px', borderRadius: 999, background: st.bg, color: st.fg, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>{st.label}</span>
                    </div>
                    {activeLayers.includes('Demand Signals') && t.stockouts > 0 && (
                      <div style={{ marginTop: 6, ...S, fontSize: 10, color: 'var(--danger)', fontWeight: 600 }}>📦 {t.stockouts} stockout{t.stockouts > 1 ? 's' : ''}</div>
                    )}
                    {activeLayers.includes('Competitor Activity') && t.competitor > 0 && (
                      <div style={{ marginTop: 4, ...S, fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>⚔️ {t.competitor} sighting{t.competitor > 1 ? 's' : ''}</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
              <span style={{ ...S, fontSize: 11, color: 'var(--ink-soft)' }}>Coverage:</span>
              {[
                { l: '75%+', c: '#2E4A3A' },
                { l: '50-74%', c: '#8B7B3B' },
                { l: '25-49%', c: '#8B5E3B' },
                { l: '1-24%', c: '#8B3B3B' },
                { l: '0%', c: '#B85C3C' },
              ].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: x.c + '44' }} />
                  <span style={{ ...S, fontSize: 11, color: 'var(--ink-soft)' }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selectedTehsil && (
            <div className="hm-detail">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>{selectedTehsil.name}</h3>
                <button onClick={() => setSelectedTehsil(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Coverage', value: `${selectedTehsil.coverage}%` },
                  { label: 'Visits', value: `${selectedTehsil.visits}` },
                  { label: 'Stockouts', value: `${selectedTehsil.stockouts}` },
                  { label: 'Competitor', value: `${selectedTehsil.competitor}` },
                ].map(m => (
                  <div key={m.label} style={{ padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)' }}>
                    <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <h4 style={{ ...S, fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Retailers</h4>
              {['Kisan Agri Store', 'Sharma Seeds', 'Green Valley Inputs'].map((r, i) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ ...S, fontSize: 13, color: 'var(--ink)' }}>{r}</span>
                  <span style={{ ...S, fontSize: 11, color: i === 0 ? 'var(--danger)' : 'var(--primary)', fontWeight: 600 }}>{i === 0 ? 'Stockout' : 'OK'}</span>
                </div>
              ))}

              <h4 style={{ ...S, fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 20, marginBottom: 12 }}>Rep Assigned</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>AM</div>
                <div>
                  <div style={{ ...S, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Arjun Mehta</div>
                  <div style={{ ...S, fontSize: 11, color: 'var(--ink-soft)' }}>Last visit: 2 days ago</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
