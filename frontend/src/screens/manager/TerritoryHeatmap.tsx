import React, { useState } from 'react';

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' };
const tehsils = [
    { name: 'Sandila', coverage: 92, visits: 18, reps: 2, stockouts: 0, competitor: 1, status: 'good' },
    { name: 'Mallawan', coverage: 78, visits: 12, reps: 1, stockouts: 1, competitor: 3, status: 'good' },
    { name: 'Bhatpura', coverage: 65, visits: 8, reps: 1, stockouts: 2, competitor: 0, status: 'warn' },
    { name: 'Atrauli', coverage: 43, visits: 5, reps: 1, stockouts: 3, competitor: 5, status: 'warn' },
    { name: 'Shahabad', coverage: 28, visits: 3, reps: 1, stockouts: 4, competitor: 2, status: 'danger' },
    { name: 'Bilgram', coverage: 0, visits: 0, reps: 1, stockouts: 6, competitor: 0, status: 'cold' },
    { name: 'Pihani', coverage: 55, visits: 7, reps: 1, stockouts: 1, competitor: 1, status: 'warn' },
    { name: 'Sandi', coverage: 82, visits: 14, reps: 1, stockouts: 0, competitor: 0, status: 'good' },
];

const layers = ['Coverage', 'Demand Signals', 'Competitor Activity', 'Cold Zones'];

const coverageColor = (pct: number) => pct >= 75 ? '#2E6B45' : pct >= 50 ? '#8B7B3B' : pct >= 25 ? '#8B5E3B' : pct > 0 ? '#8B3B3B' : '#6B2020';
const statusLabel = (s: string) => s === 'cold' ? { label: 'COLD ZONE', bg: 'rgba(184,92,60,0.2)', fg: '#E87050' } : s === 'danger' ? { label: 'AT RISK', bg: 'rgba(184,92,60,0.15)', fg: '#C97050' } : s === 'warn' ? { label: 'LOW', bg: 'rgba(212,163,71,0.15)', fg: '#C9974A' } : { label: 'HEALTHY', bg: 'rgba(75,140,100,0.15)', fg: '#4B8C64' };

export default function TerritoryHeatmap() {
    const [activeLayers, setActiveLayers] = useState<string[]>(['Coverage']);
    const [selectedTehsil, setSelectedTehsil] = useState<typeof tehsils[0] | null>(null);

    const toggle = (l: string) => setActiveLayers(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

    const coldZones = tehsils.filter(t => t.coverage === 0).length;
    const avgCoverage = Math.round(tehsils.reduce((a, t) => a + t.coverage, 0) / tehsils.length);

    return (
        <div style={{ padding: '28px 32px', color: '#E8E2D4' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px', color: '#E8E2D4' }}>Territory Heatmap</h1>
                    <p style={{ ...S, fontSize: 14, color: 'rgba(200,213,187,0.5)', margin: 0 }}>UP West Region · Week 20, May 2026</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(200,213,187,0.06)', border: '1px solid rgba(200,213,187,0.08)' }}>
                        <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg Coverage</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: '#E8E2D4' }}>{avgCoverage}%</div>
                    </div>
                    <div style={{ padding: '8px 16px', borderRadius: 10, background: coldZones > 0 ? 'rgba(184,92,60,0.1)' : 'rgba(200,213,187,0.06)', border: `1px solid ${coldZones > 0 ? 'rgba(184,92,60,0.2)' : 'rgba(200,213,187,0.08)'}` }}>
                        <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cold Zones</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: coldZones > 0 ? '#E87050' : '#E8E2D4' }}>{coldZones}</div>
                    </div>
                </div>
            </div>

            {/* Layer toggles */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {layers.map(l => (
                    <button key={l} onClick={() => toggle(l)} style={{
                        padding: '8px 16px', borderRadius: 999,
                        background: activeLayers.includes(l) ? 'rgba(200,213,187,0.12)' : 'transparent',
                        border: activeLayers.includes(l) ? '1px solid rgba(200,213,187,0.2)' : '1px solid rgba(200,213,187,0.08)',
                        color: activeLayers.includes(l) ? '#E8E2D4' : 'rgba(200,213,187,0.4)',
                        ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>
                        {l}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedTehsil ? '1fr 360px' : '1fr', gap: 24 }}>
                {/* Map area */}
                <div style={{ background: 'rgba(200,213,187,0.03)', borderRadius: 20, border: '1px solid rgba(200,213,187,0.06)', padding: 24, minHeight: 480 }}>
                    {/* Grid-based heatmap */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {tehsils.map(t => {
                            const st = statusLabel(t.status);
                            return (
                                <button key={t.name} onClick={() => setSelectedTehsil(t)} style={{
                                    padding: '20px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                                    background: `linear-gradient(135deg, ${coverageColor(t.coverage)}33 0%, ${coverageColor(t.coverage)}11 100%)`,
                                    border: selectedTehsil?.name === t.name ? '2px solid rgba(200,213,187,0.4)' : '1px solid rgba(200,213,187,0.06)',
                                    position: 'relative', overflow: 'hidden', transition: 'all 200ms',
                                }}>
                                    {t.status === 'cold' && <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#E87050' }} className="pulse-ring" />}
                                    <div style={{ ...S, fontSize: 14, fontWeight: 700, color: '#E8E2D4', marginBottom: 8 }}>{t.name}</div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, color: '#E8E2D4', marginBottom: 4 }}>{t.coverage}%</div>
                                    <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.45)' }}>{t.visits} visits · {t.reps} rep{t.reps > 1 ? 's' : ''}</div>
                                    <div style={{ marginTop: 8 }}>
                                        <span style={{ padding: '3px 8px', borderRadius: 999, background: st.bg, color: st.fg, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }}>{st.label}</span>
                                    </div>
                                    {activeLayers.includes('Demand Signals') && t.stockouts > 0 && (
                                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#E87050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M2 7h20" /></svg>
                                            <span style={{ ...S, fontSize: 10, color: '#E87050', fontWeight: 600 }}>{t.stockouts} stockout{t.stockouts > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    {activeLayers.includes('Competitor Activity') && t.competitor > 0 && (
                                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#C9974A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                            <span style={{ ...S, fontSize: 10, color: '#C9974A', fontWeight: 600 }}>{t.competitor} competitor sighting{t.competitor > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.4)' }}>Coverage:</span>
                        {[{ l: '75%+', c: '#2E6B45' }, { l: '50-74%', c: '#8B7B3B' }, { l: '25-49%', c: '#8B5E3B' }, { l: '1-24%', c: '#8B3B3B' }, { l: '0%', c: '#6B2020' }].map(x => (
                            <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 3, background: x.c + '66' }} />
                                <span style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.4)' }}>{x.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail panel */}
                {selectedTehsil && (
                    <div style={{ background: 'rgba(200,213,187,0.03)', borderRadius: 20, border: '1px solid rgba(200,213,187,0.06)', padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, margin: 0, color: '#E8E2D4' }}>{selectedTehsil.name}</h3>
                            <button onClick={() => setSelectedTehsil(null)} style={{ background: 'none', border: 'none', color: 'rgba(200,213,187,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                            {[
                                { label: 'Coverage', value: `${selectedTehsil.coverage}%` },
                                { label: 'Visits', value: `${selectedTehsil.visits}` },
                                { label: 'Stockouts', value: `${selectedTehsil.stockouts}` },
                                { label: 'Competitor', value: `${selectedTehsil.competitor}` },
                            ].map(m => (
                                <div key={m.label} style={{ padding: '12px', borderRadius: 12, background: 'rgba(200,213,187,0.04)', border: '1px solid rgba(200,213,187,0.06)' }}>
                                    <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: '#E8E2D4', marginTop: 4 }}>{m.value}</div>
                                </div>
                            ))}
                        </div>

                        <h4 style={{ ...S, fontSize: 12, fontWeight: 700, color: 'rgba(200,213,187,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Retailers</h4>
                        {['Kisan Agri Store', 'Sharma Seeds', 'Green Valley Inputs'].map((r, i) => (
                            <div key={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(200,213,187,0.06)' : 'none' }}>
                                <span style={{ ...S, fontSize: 13, color: '#E8E2D4' }}>{r}</span>
                                <span style={{ ...S, fontSize: 11, color: i === 0 ? '#E87050' : '#4B8C64', fontWeight: 600 }}>{i === 0 ? 'Stockout' : 'OK'}</span>
                            </div>
                        ))}

                        <h4 style={{ ...S, fontSize: 12, fontWeight: 700, color: 'rgba(200,213,187,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 20, marginBottom: 12 }}>Rep Assigned</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 12, background: 'rgba(200,213,187,0.04)', border: '1px solid rgba(200,213,187,0.06)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>AM</div>
                            <div>
                                <div style={{ ...S, fontSize: 13, fontWeight: 600, color: '#E8E2D4' }}>Arjun Mehta</div>
                                <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.4)' }}>Last visit: 2 days ago</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
