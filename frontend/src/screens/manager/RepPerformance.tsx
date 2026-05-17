import React, { useState } from 'react';

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' };

const reps = [
    { name: 'Prachi Verma', territory: 'Sandila', photo: 'PV', visits: 22, target: 24, revenue: 16.8, revTarget: 15, coverage: 85, coverTarget: 80, acceptance: 88, aiUsage: 92, quality: 91, emergency: '2h', issues: [], trend: [12, 14, 15, 16, 16.8] },
    { name: 'Arjun Mehta', territory: 'Hardoi', photo: 'AM', visits: 18, target: 24, revenue: 14.2, revTarget: 15, coverage: 78, coverTarget: 80, acceptance: 83, aiUsage: 85, quality: 78, emergency: '4h', issues: [], trend: [10, 11, 12, 13, 14.2] },
    { name: 'Rahul Singh', territory: 'Mallawan', photo: 'RS', visits: 15, target: 24, revenue: 11.3, revTarget: 15, coverage: 62, coverTarget: 80, acceptance: 71, aiUsage: 68, quality: 65, emergency: '8h', issues: ['Low coverage in west tehsils'], trend: [9, 10, 10.5, 11, 11.3] },
    { name: 'Sunita Devi', territory: 'Atrauli', photo: 'SD', visits: 12, target: 24, revenue: 9.7, revTarget: 15, coverage: 55, coverTarget: 80, acceptance: 65, aiUsage: 52, quality: 58, emergency: '12h', issues: ['Ignoring 3 urgent alerts', 'Low AI usage'], trend: [7, 8, 8.5, 9, 9.7] },
    { name: 'Mohan Kumar', territory: 'Shahabad', photo: 'MK', visits: 8, target: 24, revenue: 7.2, revTarget: 15, coverage: 42, coverTarget: 80, acceptance: 58, aiUsage: 35, quality: 42, emergency: '24h+', issues: ['Cold zone unvisited 2+ weeks', 'Not logging outcomes', 'Low AI acceptance'], trend: [5, 6, 6.5, 7, 7.2] },
];

const sortOptions = ['Revenue', 'Coverage', 'AI Acceptance', 'Quality Score'];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    return (
        <div style={{ height: 5, borderRadius: 3, background: 'rgba(200,213,187,0.06)', width: '100%' }}>
            <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 600ms ease' }} />
        </div>
    );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data) * 1.1;
    const h = 32, w = 80;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
    return (
        <svg width={w} height={h} style={{ display: 'block' }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function RepPerformance() {
    const [sortBy, setSortBy] = useState('Revenue');
    const [selectedRep, setSelectedRep] = useState<typeof reps[0] | null>(null);

    const sorted = [...reps].sort((a, b) => {
        if (sortBy === 'Revenue') return b.revenue - a.revenue;
        if (sortBy === 'Coverage') return b.coverage - a.coverage;
        if (sortBy === 'AI Acceptance') return b.acceptance - a.acceptance;
        return b.quality - a.quality;
    });

    return (
        <div style={{ padding: '28px 32px', color: '#E8E2D4' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>Rep Performance Tracker</h1>
                    <p style={{ ...S, fontSize: 14, color: 'rgba(200,213,187,0.5)', margin: 0 }}>Individual scorecards & leaderboard</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)' }}>Sort by:</span>
                    {sortOptions.map(o => (
                        <button key={o} onClick={() => setSortBy(o)} style={{
                            padding: '7px 14px', borderRadius: 999,
                            background: sortBy === o ? 'rgba(200,213,187,0.12)' : 'transparent',
                            border: sortBy === o ? '1px solid rgba(200,213,187,0.2)' : '1px solid rgba(200,213,187,0.08)',
                            color: sortBy === o ? '#E8E2D4' : 'rgba(200,213,187,0.4)',
                            ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>{o}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedRep ? '1fr 380px' : '1fr', gap: 24 }}>
                {/* Leaderboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sorted.map((rep, i) => {
                        const hasIssues = rep.issues.length > 0;
                        return (
                            <button key={rep.name} onClick={() => setSelectedRep(rep)} style={{
                                display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                                background: selectedRep?.name === rep.name ? 'rgba(200,213,187,0.06)' : 'rgba(200,213,187,0.02)',
                                border: hasIssues ? '1px solid rgba(184,92,60,0.2)' : selectedRep?.name === rep.name ? '1px solid rgba(200,213,187,0.15)' : '1px solid rgba(200,213,187,0.05)',
                            }}>
                                {/* Rank */}
                                <div style={{ width: 32, fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: i === 0 ? '#C9974A' : i === 1 ? '#8B9AAE' : i === 2 ? '#A07850' : 'rgba(200,213,187,0.3)', textAlign: 'center', flex: 'none' }}>
                                    {i + 1}
                                </div>
                                {/* Avatar */}
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: hasIssues ? 'rgba(184,92,60,0.15)' : 'rgba(200,213,187,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasIssues ? '#E87050' : '#E8E2D4', fontSize: 14, fontWeight: 700, flex: 'none' }}>{rep.photo}</div>
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ ...S, fontSize: 15, fontWeight: 600, color: '#E8E2D4' }}>{rep.name}</div>
                                    <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)' }}>{rep.territory}</div>
                                </div>
                                {/* Metrics */}
                                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>₹{rep.revenue}k</div>
                                        <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Rev/Day</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: rep.coverage >= 75 ? '#4B8C64' : rep.coverage >= 50 ? '#C9974A' : '#E87050' }}>{rep.coverage}%</div>
                                        <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>Coverage</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4' }}>{rep.acceptance}%</div>
                                        <div style={{ ...S, fontSize: 10, color: 'rgba(200,213,187,0.3)' }}>AI Accept</div>
                                    </div>
                                    <Sparkline data={rep.trend} color={rep.trend[rep.trend.length - 1] > rep.trend[0] ? '#4B8C64' : '#E87050'} />
                                </div>
                                {hasIssues && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E87050', flex: 'none' }} />}
                            </button>
                        );
                    })}
                </div>

                {/* Detail Panel */}
                {selectedRep && (
                    <div style={{ background: 'rgba(200,213,187,0.03)', borderRadius: 20, border: '1px solid rgba(200,213,187,0.06)', padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(200,213,187,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#E8E2D4' }}>{selectedRep.photo}</div>
                                <div>
                                    <div style={{ ...S, fontSize: 18, fontWeight: 600, color: '#E8E2D4' }}>{selectedRep.name}</div>
                                    <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)' }}>{selectedRep.territory} Territory</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedRep(null)} style={{ background: 'none', border: 'none', color: 'rgba(200,213,187,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
                        </div>

                        {/* Scorecard */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                            {[
                                { label: 'Visits Completed', val: selectedRep.visits, tgt: selectedRep.target, unit: '', color: '#5BA3E0' },
                                { label: 'Revenue / Field Day', val: selectedRep.revenue, tgt: selectedRep.revTarget, unit: '₹k', color: '#4B8C64' },
                                { label: 'Coverage', val: selectedRep.coverage, tgt: selectedRep.coverTarget, unit: '%', color: '#5BA3E0' },
                                { label: 'AI Acceptance', val: selectedRep.acceptance, tgt: 85, unit: '%', color: '#C9974A' },
                                { label: 'AI Usage Rate', val: selectedRep.aiUsage, tgt: 90, unit: '%', color: '#9B72CF' },
                                { label: 'Visit Quality Score', val: selectedRep.quality, tgt: 80, unit: '', color: '#5BA3E0' },
                            ].map(m => (
                                <div key={m.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ ...S, fontSize: 12, fontWeight: 600, color: 'rgba(200,213,187,0.5)' }}>{m.label}</span>
                                        <span style={{ ...S, fontSize: 13, fontWeight: 700, color: '#E8E2D4' }}>{m.unit === '₹k' ? `₹${m.val}k` : `${m.val}${m.unit}`} <span style={{ color: 'rgba(200,213,187,0.3)', fontWeight: 400 }}>/ {m.unit === '₹k' ? `₹${m.tgt}k` : `${m.tgt}${m.unit}`}</span></span>
                                    </div>
                                    <ProgressBar value={m.val} max={m.tgt} color={m.color} />
                                </div>
                            ))}
                        </div>

                        {/* Emergency Response */}
                        <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(200,213,187,0.04)', border: '1px solid rgba(200,213,187,0.06)', marginBottom: 16 }}>
                            <div style={{ ...S, fontSize: 11, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Emergency Response</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: selectedRep.emergency.includes('24') ? '#E87050' : selectedRep.emergency.includes('12') ? '#C9974A' : '#4B8C64', marginTop: 4 }}>{selectedRep.emergency}</div>
                        </div>

                        {/* AI Flags */}
                        {selectedRep.issues.length > 0 && (
                            <div>
                                <div style={{ ...S, fontSize: 11, fontWeight: 700, color: '#E87050', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>⚠ AI-Flagged Issues</div>
                                {selectedRep.issues.map((issue, i) => (
                                    <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(184,92,60,0.06)', border: '1px solid rgba(184,92,60,0.1)', marginBottom: 6, ...S, fontSize: 13, color: '#E87050' }}>
                                        {issue}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
