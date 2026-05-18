import React, { useState } from 'react';

const S: React.CSSProperties = { fontFamily: 'Plus Jakarta Sans' };

const alerts = [
    { id: 1, type: 'stockout', severity: 'HIGH', title: 'Topik 15WP cluster stockout — Sandila', desc: '3 retailers out of stock in Sandila tehsil. 8 farmers at heading stage.', rep: 'Arjun Mehta', time: '2h ago', resolved: false, escalated: true },
    { id: 2, type: 'demand', severity: 'HIGH', title: 'Score 250EC demand spike — Mallawan', desc: 'Weekly POS sales 3x average. Possible early fungal outbreak.', rep: 'Rahul Singh', time: '5h ago', resolved: false, escalated: false },
    { id: 3, type: 'competitor', severity: 'MEDIUM', title: 'Bayer Nativo push — Atrauli cluster', desc: '5 retailer sightings this week. Possible pricing campaign.', rep: 'Sunita Devi', time: '1d ago', resolved: false, escalated: false },
    { id: 4, type: 'weather', severity: 'MEDIUM', title: 'Heavy rain forecast — Hardoi district', desc: '48mm forecast Thu-Fri. Advance fungicide recommendations.', rep: 'All reps', time: '6h ago', resolved: false, escalated: false },
    { id: 5, type: 'campaign', severity: 'LOW', title: 'Wheat campaign surge — Baramati', desc: 'Landing page visits up 240%. Digital demand warming.', rep: 'Prachi Verma', time: '1d ago', resolved: true, escalated: false },
    { id: 6, type: 'stockout', severity: 'HIGH', title: 'Actara 25WG critical — Shahabad', desc: 'Zero stock at all 4 retailers. No field visit in 14 days.', rep: 'Mohan Kumar', time: '3d ago', resolved: false, escalated: true },
    { id: 7, type: 'competitor', severity: 'LOW', title: 'UPL Saaf spotted — Sandi tehsil', desc: 'New competitor product at 2 retailers. Monitor only.', rep: 'Arjun Mehta', time: '4d ago', resolved: true, escalated: false },
];

const tabs = ['All', 'Escalated', 'Unresolved', 'Stockouts', 'Competitor', 'Resolved'];
const sevColors: any = {
    HIGH: { bg: 'rgba(232,112,80,0.12)', fg: '#E87050', border: '#E87050' },
    MEDIUM: { bg: 'rgba(201,151,74,0.12)', fg: '#C9974A', border: '#C9974A' },
    LOW: { bg: 'rgba(200,213,187,0.08)', fg: 'rgba(200,213,187,0.5)', border: 'rgba(200,213,187,0.2)' },
};
const typeIconPaths: any = {
    stockout: 'm2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20',
    demand: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
    competitor: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10',
    weather: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6M8 14v6M12 16v6',
    campaign: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
};

export default function AlertManagement() {
    const [tab, setTab] = useState('All');

    const filtered = tab === 'All' ? alerts :
        tab === 'Escalated' ? alerts.filter(a => a.escalated) :
        tab === 'Unresolved' ? alerts.filter(a => !a.resolved) :
        tab === 'Stockouts' ? alerts.filter(a => a.type === 'stockout') :
        tab === 'Competitor' ? alerts.filter(a => a.type === 'competitor') :
        alerts.filter(a => a.resolved);

    const unresolved = alerts.filter(a => !a.resolved).length;
    const escalated = alerts.filter(a => a.escalated).length;
    const resRate = Math.round((alerts.filter(a => a.resolved).length / alerts.length) * 100);

    return (
        <div style={{ padding: '28px 32px', color: '#E8E2D4' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>Alert Management</h1>
                    <p style={{ ...S, fontSize: 14, color: 'rgba(200,213,187,0.5)', margin: 0 }}>Cross-territory anomaly & escalation feed</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(232,112,80,0.08)', border: '1px solid rgba(232,112,80,0.15)' }}>
                        <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(232,112,80,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Escalated</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: '#E87050' }}>{escalated}</div>
                    </div>
                    <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(200,213,187,0.04)', border: '1px solid rgba(200,213,187,0.08)' }}>
                        <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(200,213,187,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unresolved</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: '#C9974A' }}>{unresolved}</div>
                    </div>
                    <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(75,140,100,0.06)', border: '1px solid rgba(75,140,100,0.12)' }}>
                        <div style={{ ...S, fontSize: 10, fontWeight: 700, color: 'rgba(75,140,100,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resolution Rate</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: '#4B8C64' }}>{resRate}%</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '8px 16px', borderRadius: 999,
                        background: tab === t ? 'rgba(200,213,187,0.12)' : 'transparent',
                        border: tab === t ? '1px solid rgba(200,213,187,0.2)' : '1px solid rgba(200,213,187,0.08)',
                        color: tab === t ? '#E8E2D4' : 'rgba(200,213,187,0.4)',
                        ...S, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>{t} {t === 'Escalated' ? `(${escalated})` : t === 'Unresolved' ? `(${unresolved})` : ''}</button>
                ))}
            </div>

            {/* Alert list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(alert => {
                    const sev = sevColors[alert.severity];
                    return (
                        <div key={alert.id} style={{
                            padding: '18px 20px', borderRadius: 18,
                            background: 'rgba(200,213,187,0.02)', border: `1px solid ${alert.escalated ? 'rgba(232,112,80,0.2)' : 'rgba(200,213,187,0.06)'}`,
                            borderLeft: `4px solid ${sev.border}`,
                            opacity: alert.resolved ? 0.5 : 1,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: sev.bg, border: `1px solid ${sev.border}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sev.fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={typeIconPaths[alert.type]} />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ padding: '2px 8px', borderRadius: 999, background: sev.bg, color: sev.fg, ...S, fontSize: 10, fontWeight: 700 }}>{alert.severity}</span>
                                        {alert.escalated && (
                                            <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(232,112,80,0.15)', color: '#E87050', ...S, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#E87050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                                ESCALATED
                                            </span>
                                        )}
                                        {alert.resolved && (
                                            <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(75,140,100,0.12)', color: '#4B8C64', ...S, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4B8C64" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                                RESOLVED
                                            </span>
                                        )}
                                        <span style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.3)' }}>{alert.time}</span>
                                    </div>
                                    <div style={{ ...S, fontSize: 15, fontWeight: 600, color: '#E8E2D4', marginBottom: 4 }}>{alert.title}</div>
                                    <div style={{ ...S, fontSize: 13, color: 'rgba(200,213,187,0.5)', lineHeight: 1.4, marginBottom: 10 }}>{alert.desc}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)' }}>Rep: <span style={{ color: '#E8E2D4', fontWeight: 600 }}>{alert.rep}</span></span>
                                        {!alert.resolved && (
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                                <button style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(200,213,187,0.06)', border: '1px solid rgba(200,213,187,0.08)', color: '#E8E2D4', ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Assign</button>
                                                <button style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(75,140,100,0.08)', border: '1px solid rgba(75,140,100,0.15)', color: '#4B8C64', ...S, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Competitor Summary */}
            <div style={{ marginTop: 28, padding: '20px', borderRadius: 18, background: 'rgba(200,213,187,0.03)', border: '1px solid rgba(200,213,187,0.06)' }}>
                <div style={{ ...S, fontSize: 13, fontWeight: 700, color: 'rgba(200,213,187,0.5)', marginBottom: 16 }}>Competitor Intelligence Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                        { brand: 'Bayer Nativo', sightings: 12, trend: 'Rising', tehsils: 'Atrauli, Sandila' },
                        { brand: 'UPL Saaf', sightings: 5, trend: 'Stable', tehsils: 'Sandi, Pihani' },
                        { brand: 'BASF Merivon', sightings: 2, trend: 'New', tehsils: 'Mallawan' },
                    ].map(c => (
                        <div key={c.brand} style={{ padding: '14px', borderRadius: 14, background: 'rgba(200,213,187,0.02)', border: '1px solid rgba(200,213,187,0.06)' }}>
                            <div style={{ ...S, fontSize: 14, fontWeight: 600, color: '#E8E2D4', marginBottom: 4 }}>{c.brand}</div>
                            <div style={{ ...S, fontSize: 12, color: 'rgba(200,213,187,0.4)' }}>{c.sightings} sightings · <span style={{ color: c.trend === 'Rising' ? '#E87050' : c.trend === 'New' ? '#C9974A' : '#4B8C64', fontWeight: 600 }}>{c.trend}</span></div>
                            <div style={{ ...S, fontSize: 11, color: 'rgba(200,213,187,0.3)', marginTop: 4 }}>{c.tehsils}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
