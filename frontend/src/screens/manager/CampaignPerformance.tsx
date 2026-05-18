import React, { useState } from 'react';

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' };

const campaigns = [
    {
        id: 'CMP_RABI25_001', crop: 'Wheat', product: 'Topik 15 WP', color: '#4B8C64',
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
];

function TrendChart({ data, dataKey, color, height = 60 }: { data: any[]; dataKey: string; color: string; height?: number }) {
    const values = data.map(d => d[dataKey]);
    const max = Math.max(...values) * 1.15;
    const w = 100;
    const pts = values.map((v: number, i: number) => `${(i / (values.length - 1)) * w},${height - (v / max) * height}`).join(' ');
    const area = `0,${height} ${pts} ${w},${height}`;
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
                <linearGradient id={`cg-${color.replace('#', '')}-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#cg-${color.replace('#', '')}-${dataKey})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 90, ...S, fontSize: 12, color: 'rgba(200,213,187,0.5)', textAlign: 'right' }}>{label}</div>
            <div style={{ flex: 1, height: 18, borderRadius: 4, background: 'rgba(200,213,187,0.04)' }}>
                <div style={{ width: `${(value / max) * 100}%`, height: '100%', borderRadius: 4, background: `${color}55`, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width 600ms ease' }}>
                    <span style={{ ...S, fontSize: 11, fontWeight: 700, color }}>{value.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

export default function CampaignPerformance() {
    const [selected, setSelected] = useState<typeof campaigns[0] | null>(null);

    return (
        <div style={{ padding: '28px 32px', color: '#E8E2D4' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>Campaign Performance</h1>
                    <p style={{ ...S, fontSize: 14, color: 'rgba(200,213,187,0.5)', margin: 0 }}>Digital-to-field attribution · 4 active Rabi campaigns</p>
                </div>
            </div>

            {/* Campaign Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {campaigns.map(c => {
                    const statusColor = c.status === 'strong' ? '#4B8C64' : c.status === 'moderate' ? '#C9974A' : c.status === 'plateau' ? 'rgba(200,213,187,0.4)' : '#E87050';
                    const statusLabel = c.status === 'strong' ? 'Strong' : c.status === 'moderate' ? 'Moderate' : c.status === 'plateau' ? 'Plateauing' : 'Underperforming';
                    return (
                        <button key={c.id} onClick={() => setSelected(c)} style={{
                            padding: '20px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                            background: selected?.id === c.id ? `${c.color}0D` : 'rgba(200,213,187,0.02)',
                            border: selected?.id === c.id ? `1.5px solid ${c.color}44` : '1px solid rgba(200,213,187,0.06)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                                <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.crop}</div>
                            </div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4', marginBottom: 4 }}>{c.product}</div>
                            <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.4)', marginBottom: 12 }}>{c.id}</div>
                            
                            <TrendChart data={c.weeklyTrend} dataKey="visits" color={c.color} height={40} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                                <div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>{c.fieldRate}%</div>
                                    <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Field Rate</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: c.attribution.startsWith('+') ? '#4B8C64' : '#E87050' }}>{c.attribution}</div>
                                    <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Sales ∆</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block', flexShrink: 0 }} />
                                <span style={{ ...S, fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Detail Panel */}
            {selected && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Funnel */}
                    <div style={{ padding: '24px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                        <div style={{ ...S, fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 20 }}>{selected.product} — Digital Funnel</div>
                        <FunnelBar label="Impressions" value={selected.funnel.impressions} max={selected.funnel.impressions} color={selected.color} />
                        <FunnelBar label="Page Visits" value={selected.funnel.pageVisits} max={selected.funnel.impressions} color={selected.color} />
                        <FunnelBar label="Leads" value={selected.funnel.leads} max={selected.funnel.impressions} color={selected.color} />
                        
                        <div style={{ marginTop: 20, padding: '14px', borderRadius: 12, background: 'rgba(200,213,187,0.04)', border: '1px solid rgba(200,213,187,0.06)' }}>
                            <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Conversion Rates</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>{((selected.funnel.pageVisits / selected.funnel.impressions) * 100).toFixed(1)}%</div>
                                    <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Imp → Visit</div>
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>{((selected.funnel.leads / selected.funnel.pageVisits) * 100).toFixed(1)}%</div>
                                    <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Visit → Lead</div>
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>{((selected.funnel.leads / selected.funnel.impressions) * 100).toFixed(2)}%</div>
                                    <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Overall</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Trend */}
                    <div style={{ padding: '24px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                        <div style={{ ...S, fontSize: 14, fontWeight: 700, color: selected.color, marginBottom: 20 }}>Weekly Trends</div>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)', marginBottom: 8 }}>Page Visits</div>
                            <TrendChart data={selected.weeklyTrend} dataKey="visits" color={selected.color} height={50} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)', marginBottom: 8 }}>Leads Generated</div>
                            <TrendChart data={selected.weeklyTrend} dataKey="leads" color={selected.color} height={50} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                            {selected.weeklyTrend.map(w => <span key={w.week} style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.25)' }}>{w.week}</span>)}
                        </div>

                        {/* Field reinforcement */}
                        <div style={{ marginTop: 20, padding: '14px', borderRadius: 12, background: selected.fieldRate >= 60 ? 'rgba(75,140,100,0.06)' : 'rgba(232,112,80,0.06)', border: `1px solid ${selected.fieldRate >= 60 ? 'rgba(75,140,100,0.12)' : 'rgba(232,112,80,0.1)'}` }}>
                            <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Field Reinforcement Rate</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, color: selected.fieldRate >= 60 ? '#4B8C64' : '#E87050' }}>{selected.fieldRate}%</div>
                            <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)', marginTop: 4 }}>
                                {selected.fieldRate >= 60 ? 'Digital & field well coordinated' : 'Reps not visiting high-engagement tehsils'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Underperforming flags */}
            {campaigns.filter(c => c.status === 'underperforming' || c.status === 'plateau').length > 0 && (
                <div style={{ marginTop: 28, padding: '20px', borderRadius: 18, background: 'rgba(232,112,80,0.04)', border: '1px solid rgba(232,112,80,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E87050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        <span style={{ ...S, fontSize: 13, fontWeight: 700, color: '#E87050' }}>Campaign Flags</span>
                    </div>
                    {campaigns.filter(c => c.status === 'underperforming' || c.status === 'plateau').map(c => (
                        <div key={c.id} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(232,112,80,0.04)', border: '1px solid rgba(232,112,80,0.06)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{ ...S, fontSize: 14, fontWeight: 600, color: '#E8E2D4' }}>{c.product}</span>
                                <span style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)', marginLeft: 8 }}>
                                    {c.status === 'underperforming'
                                        ? 'High impressions, low field visits & near-zero leads. Landing page or targeting issue.'
                                        : 'Engagement plateauing. Consider budget reallocation.'}
                                </span>
                            </div>
                            <span style={{ padding: '4px 10px', borderRadius: 999, background: c.status === 'underperforming' ? 'rgba(232,112,80,0.12)' : 'rgba(200,213,187,0.08)', color: c.status === 'underperforming' ? '#E87050' : 'rgba(200,213,187,0.5)', ...S, fontSize: 10, fontWeight: 700 }}>
                                {c.status === 'underperforming' ? 'ACTION NEEDED' : 'MONITOR'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
