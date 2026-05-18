import React, { useState } from 'react';

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' };

const weeklyData = [
    { week: 'W14', revenue: 82, coverage: 56, acceptance: 68, conversion: 32 },
    { week: 'W15', revenue: 95, coverage: 61, acceptance: 72, conversion: 38 },
    { week: 'W16', revenue: 88, coverage: 58, acceptance: 75, conversion: 34 },
    { week: 'W17', revenue: 104, coverage: 67, acceptance: 71, conversion: 41 },
    { week: 'W18', revenue: 112, coverage: 72, acceptance: 78, conversion: 44 },
    { week: 'W19', revenue: 98, coverage: 69, acceptance: 76, conversion: 39 },
    { week: 'W20', revenue: 124, coverage: 74, acceptance: 81, conversion: 48 },
    { week: 'W21', revenue: 131, coverage: 78, acceptance: 83, conversion: 52 },
];

const kpis = [
    { label: 'Revenue / Field Day', value: '₹14.2k', delta: '+12%', target: '₹15k', pct: 94.7, color: '#4B8C64' },
    { label: 'Coverage Efficiency', value: '78%', delta: '+6%', target: '80%', pct: 97.5, color: '#5BA3E0' },
    { label: 'AI Acceptance Rate', value: '83%', delta: '+5%', target: '85%', pct: 97.6, color: '#C9974A' },
    { label: 'Visit-to-Sale Conversion', value: '52%', delta: '+8%', target: '60%', pct: 86.7, color: '#9B72CF' },
];

function MiniChart({ data, color, height = 64 }: { data: number[]; color: string; height?: number }) {
    const max = Math.max(...data) * 1.15;
    const w = 100;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - (v / max) * height}`).join(' ');
    const areaPoints = `0,${height} ${points} ${w},${height}`;
    return (
        <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
                <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#g-${color.replace('#','')})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const repBreakdown = [
    { name: 'Arjun Mehta', territory: 'Hardoi', revenue: '₹14.2k', coverage: '78%', acceptance: '83%' },
    { name: 'Prachi Verma', territory: 'Sandila', revenue: '₹16.8k', coverage: '85%', acceptance: '88%' },
    { name: 'Rahul Singh', territory: 'Mallawan', revenue: '₹11.3k', coverage: '62%', acceptance: '71%' },
    { name: 'Sunita Devi', territory: 'Atrauli', revenue: '₹9.7k', coverage: '55%', acceptance: '65%' },
    { name: 'Mohan Kumar', territory: 'Shahabad', revenue: '₹7.2k', coverage: '42%', acceptance: '58%' },
];

const digitalField = [
    { tehsil: 'Sandila', digitalHeat: 'High', repVisit: true, linked: true },
    { tehsil: 'Mallawan', digitalHeat: 'High', repVisit: false, linked: false },
    { tehsil: 'Bhatpura', digitalHeat: 'Medium', repVisit: true, linked: true },
    { tehsil: 'Atrauli', digitalHeat: 'Low', repVisit: false, linked: false },
];

export default function KPIDashboard() {
    const [period, setPeriod] = useState('This Week');

    return (
        <div style={{ padding: '28px 32px', color: '#E8E2D4' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>Revenue & KPI Dashboard</h1>
                    <p style={{ ...S, fontSize: 14, color: 'rgba(200,213,187,0.5)', margin: 0 }}>All metrics with week-on-week trends</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['This Week', '4 Weeks', '8 Weeks'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{
                            padding: '8px 16px', borderRadius: 999,
                            background: period === p ? 'rgba(200,213,187,0.12)' : 'transparent',
                            border: period === p ? '1px solid rgba(200,213,187,0.2)' : '1px solid rgba(200,213,187,0.08)',
                            color: period === p ? '#E8E2D4' : 'rgba(200,213,187,0.4)',
                            ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>{p}</button>
                    ))}
                    <button style={{ padding: '8px 16px', borderRadius: 999, background: 'rgba(200,213,187,0.06)', border: '1px solid rgba(200,213,187,0.08)', color: 'rgba(200,213,187,0.5)', ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📤 Export CSV</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {kpis.map(kpi => (
                    <div key={kpi.label} style={{ padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                        <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{kpi.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontFamily: 'Fraunces', fontSize: 30, fontWeight: 500, color: '#E8E2D4' }}>{kpi.value}</span>
                            <span style={{ ...S, fontSize: 13, fontWeight: 700, color: '#4B8C64' }}>{kpi.delta}</span>
                        </div>
                        <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)', marginBottom: 12 }}>Target: {kpi.target}</div>
                        {/* Progress */}
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(200,213,187,0.06)' }}>
                            <div style={{ width: `${Math.min(100, kpi.pct)}%`, height: '100%', borderRadius: 2, background: kpi.color, transition: 'width 800ms ease' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Trend Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                    <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'rgba(200,213,187,0.5)', marginBottom: 16 }}>Revenue Trend (₹k/day)</div>
                    <MiniChart data={weeklyData.map(w => w.revenue)} color="#4B8C64" height={80} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        {weeklyData.map(w => <span key={w.week} style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>{w.week}</span>)}
                    </div>
                </div>
                <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                    <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'rgba(200,213,187,0.5)', marginBottom: 16 }}>AI Acceptance Rate (%)</div>
                    <MiniChart data={weeklyData.map(w => w.acceptance)} color="#C9974A" height={80} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        {weeklyData.map(w => <span key={w.week} style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>{w.week}</span>)}
                    </div>
                </div>
            </div>

            {/* Rep Breakdown Table */}
            <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)', marginBottom: 28 }}>
                <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'rgba(200,213,187,0.5)', marginBottom: 16 }}>Breakdown by Rep</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Rep', 'Territory', 'Rev/Day', 'Coverage', 'AI Accept'].map(h => (
                                <th key={h} style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0 12px', textAlign: 'left', borderBottom: '1px solid rgba(200,213,187,0.06)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {repBreakdown.map((r, i) => (
                            <tr key={r.name}>
                                <td style={{ ...S, fontSize: 14, fontWeight: 600, color: '#E8E2D4', padding: '12px 0', borderBottom: i < repBreakdown.length - 1 ? '1px solid rgba(200,213,187,0.04)' : 'none' }}>{r.name}</td>
                                <td style={{ ...S, fontSize: 13, color: 'rgba(200,213,187,0.5)', padding: '12px 0', borderBottom: i < repBreakdown.length - 1 ? '1px solid rgba(200,213,187,0.04)' : 'none' }}>{r.territory}</td>
                                <td style={{ fontFamily: 'Fraunces', fontSize: 16, fontWeight: 500, color: '#E8E2D4', padding: '12px 0', borderBottom: i < repBreakdown.length - 1 ? '1px solid rgba(200,213,187,0.04)' : 'none' }}>{r.revenue}</td>
                                <td style={{ ...S, fontSize: 14, fontWeight: 600, color: parseInt(r.coverage) >= 75 ? '#4B8C64' : parseInt(r.coverage) >= 50 ? '#C9974A' : '#E87050', padding: '12px 0', borderBottom: i < repBreakdown.length - 1 ? '1px solid rgba(200,213,187,0.04)' : 'none' }}>{r.coverage}</td>
                                <td style={{ ...S, fontSize: 14, fontWeight: 600, color: parseInt(r.acceptance) >= 80 ? '#4B8C64' : parseInt(r.acceptance) >= 65 ? '#C9974A' : '#E87050', padding: '12px 0', borderBottom: i < repBreakdown.length - 1 ? '1px solid rgba(200,213,187,0.04)' : 'none' }}>{r.acceptance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Digital-to-Field Linkage */}
            <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'rgba(200,213,187,0.5)', marginBottom: 16 }}>Digital-to-Field Funnel Linkage</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {digitalField.map(d => (
                        <div key={d.tehsil} style={{ padding: '14px', borderRadius: 14, background: d.linked ? 'rgba(75,140,100,0.06)' : 'rgba(184,92,60,0.06)', border: `1px solid ${d.linked ? 'rgba(75,140,100,0.12)' : 'rgba(184,92,60,0.1)'}` }}>
                            <div style={{ ...S, fontSize: 14, fontWeight: 600, color: '#E8E2D4', marginBottom: 8 }}>{d.tehsil}</div>
                            <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.5)', marginBottom: 4 }}>Digital: <span style={{ color: d.digitalHeat === 'High' ? '#4B8C64' : d.digitalHeat === 'Medium' ? '#C9974A' : 'rgba(200,213,187,0.4)', fontWeight: 700 }}>{d.digitalHeat}</span></div>
                            <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.5)' }}>Field Visit: <span style={{ color: d.repVisit ? '#4B8C64' : '#E87050', fontWeight: 700 }}>{d.repVisit ? 'Yes' : 'No'}</span></div>
                            {!d.linked && (
                                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E87050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                    <span style={{ ...S, fontSize: 10, color: '#E87050', fontWeight: 600 }}>Gap detected</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
