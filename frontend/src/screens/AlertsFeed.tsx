import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PulseDot, Eyebrow, TopStrip, BottomNav, VoiceFAB, IChev, IAlertTriangle, ICloudRain, Icon } from '../components/Shared';

const ITrend = (p: any) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>} />;

const alerts = [
    { id: 1, type: 'stockout', title: 'Topik 15WP stockout cluster', desc: '3 retailers in Sandila tehsil are out of stock. 8 farmers at risk.', time: '2h ago', severity: 'HIGH' },
    { id: 2, type: 'demand', title: 'Score 250EC demand spike', desc: 'Weekly sales 3x average in Mallawan. Possible fungal outbreak.', time: '5h ago', severity: 'HIGH' },
    { id: 3, type: 'campaign', title: 'Wheat campaign heat in Baramati', desc: 'Landing page visits up 240% — reinforce with field visits this week.', time: '1d ago', severity: 'MEDIUM' },
    { id: 4, type: 'weather', title: 'Heavy rain forecast — Hardoi', desc: '48mm expected Thu-Fri. Advance fungicide recommendations.', time: '6h ago', severity: 'MEDIUM' },
    { id: 5, type: 'competitor', title: 'Competitor push — Bayer Nativo', desc: 'Spotted at 5 retailers in Atrauli this week. Possible pricing campaign.', time: '2d ago', severity: 'LOW' },
    { id: 6, type: 'scan', title: 'Farmer scan spike — Actara 25WG', desc: '12 farmers scanned Actara in Bhatpura. Strong purchase intent signal.', time: '3d ago', severity: 'LOW' },
];

const typeIconPath: any = {
    stockout: 'm2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20',
    demand: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
    campaign: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
    weather: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6M8 14v6M12 16v6',
    competitor: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10',
    scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 12h8M12 8v8',
};

const tabs = ['All', 'Urgent', 'Opportunities', 'Campaigns', 'Competitor'];
const RISK: any = {
    HIGH: { bg: 'rgba(184,92,60,0.10)', fg: '#B85C3C', border: '#B85C3C' },
    MEDIUM: { bg: 'rgba(212,163,71,0.12)', fg: '#8C6420', border: '#D4A347' },
    LOW: { bg: 'rgba(200,213,187,0.3)', fg: '#2E4A3A', border: '#7B9C6A' },
};

export default function AlertsFeed() {
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All' ? alerts :
        activeTab === 'Urgent' ? alerts.filter(a => a.severity === 'HIGH') :
        activeTab === 'Opportunities' ? alerts.filter(a => ['demand', 'scan'].includes(a.type)) :
        activeTab === 'Campaigns' ? alerts.filter(a => a.type === 'campaign') :
        alerts.filter(a => a.type === 'competitor');

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
            <TopStrip />
            
            <div style={{ padding: '18px 18px 0' }}>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Alerts</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 16px' }}>Proactive anomaly & opportunity detection</p>
            </div>

            {/* Filter tabs */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px 16px' }}>
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 'none', padding: '8px 14px', borderRadius: 999,
                        background: activeTab === tab ? 'var(--primary)' : 'var(--surface)',
                        color: activeTab === tab ? 'white' : 'var(--ink)',
                        border: activeTab === tab ? '1px solid var(--primary)' : '1px solid var(--border)',
                        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Alert cards */}
            <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((alert, i) => {
                    const r = RISK[alert.severity];
                    return (
                        <Link to="/alert" key={alert.id} className="fade-up" style={{ animationDelay: `${i * 60}ms`, background: 'var(--surface)', borderRadius: 20, padding: '16px 18px', borderLeft: `4px solid ${r.border}`, boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 20px rgba(20,18,12,0.06)', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 11, background: r.bg, border: `1px solid ${r.border}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={typeIconPath[alert.type]} />
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        {alert.severity === 'HIGH' && <PulseDot color="#B85C3C" size={6} />}
                                        <span style={{ padding: '2px 7px', borderRadius: 999, background: r.bg, color: r.fg, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700 }}>{alert.severity}</span>
                                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>{alert.time}</span>
                                    </div>
                                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>{alert.title}</h3>
                                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.4 }}>{alert.desc}</p>
                                </div>
                                <IChev size={16} stroke="var(--ink-soft)" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div style={{ height: 120 }} />
            <VoiceFAB />
            <BottomNav />
        </div>
    );
}
