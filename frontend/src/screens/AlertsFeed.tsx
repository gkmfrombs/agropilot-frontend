import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { api } from '../services/api';
import { PulseDot, IBell, TopStrip, BottomNav, VoiceFAB, IChev, IAlertTriangle, ICloudRain, Icon } from '../components/Shared';

const IBox = (p: any) => <Icon {...p} d={<><path d="M21 8 12 13 3 8" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="M12 13v9" /></>} />;
const ITrend = (p: any) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>} />;
const IFire = (p: any) => <Icon {...p} d={<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />} />;
const IShield = (p: any) => <Icon {...p} d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>} />;
const IScan = (p: any) => <Icon {...p} d={<><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></>} />;

const ALERT_ICONS: Record<string, (p: any) => React.ReactNode> = {
    stockout: IBox,
    demand: ITrend,
    campaign: IFire,
    weather: ICloudRain,
    competitor: IShield,
    scan: IScan,
};

const alerts = [
    { id: 1, type: 'stockout', title: 'Topik 15WP stockout cluster', desc: '3 retailers in Sandila tehsil are out of stock. 8 farmers at risk.', time: '2h ago', severity: 'HIGH' },
    { id: 2, type: 'demand', title: 'Score 250EC demand spike', desc: 'Weekly sales 3x average in Mallawan. Possible fungal outbreak.', time: '5h ago', severity: 'HIGH' },
    { id: 3, type: 'campaign', title: 'Wheat campaign heat in Baramati', desc: 'Landing page visits up 240% — reinforce with field visits this week.', time: '1d ago', severity: 'MEDIUM' },
    { id: 4, type: 'weather', title: 'Heavy rain forecast — Hardoi', desc: '48mm expected Thu-Fri. Advance fungicide recommendations.', time: '6h ago', severity: 'MEDIUM' },
    { id: 5, type: 'competitor', title: 'Competitor push — Bayer Nativo', desc: 'Spotted at 5 retailers in Atrauli this week. Possible pricing campaign.', time: '2d ago', severity: 'LOW' },
    { id: 6, type: 'scan', title: 'Farmer scan spike — Actara 25WG', desc: '12 farmers scanned Actara in Bhatpura. Strong purchase intent signal.', time: '3d ago', severity: 'LOW' },
];

const TAB_KEYS = ['alerts.tab.all', 'alerts.tab.urgent', 'alerts.tab.opportunities', 'alerts.tab.campaigns', 'alerts.tab.competitor'];
const RISK: any = {
    HIGH: { bg: 'rgba(184,92,60,0.10)', fg: '#B85C3C', border: '#B85C3C' },
    MEDIUM: { bg: 'rgba(212,163,71,0.12)', fg: '#8C6420', border: '#D4A347' },
    LOW: { bg: 'rgba(200,213,187,0.3)', fg: '#2E4A3A', border: '#7B9C6A' },
};

export default function AlertsFeed() {
    const { t } = useTranslation();
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const [liveAlerts, setLiveAlerts] = useState(alerts);

    useEffect(() => {
        api.getAlerts().then((data: any) => {
            if (data?.alerts?.length) setLiveAlerts(data.alerts.map((a: any) => ({
                id: a.alert_id || a.id,
                type: a.alert_type || a.type || 'stockout',
                title: a.title,
                desc: a.description || a.action || '',
                time: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'recent',
                severity: (a.severity || 'LOW').toUpperCase(),
            })));
        }).catch(() => null);
    }, []);

    const filtered = activeTabIdx === 0 ? liveAlerts :
        activeTabIdx === 1 ? liveAlerts.filter((a: any) => a.severity === 'HIGH') :
        activeTabIdx === 2 ? liveAlerts.filter((a: any) => ['demand', 'scan'].includes(a.type)) :
        activeTabIdx === 3 ? liveAlerts.filter((a: any) => a.type === 'campaign') :
        liveAlerts.filter((a: any) => a.type === 'competitor');

    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <TopStrip />

            <div style={{ padding: '18px 18px 0' }}>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>{t('alerts.title')}</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 16px' }}>{t('alerts.subtitle')}</p>
            </div>

            {/* Filter tabs */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px 16px' }}>
                {TAB_KEYS.map((key, i) => (
                    <button key={key} onClick={() => setActiveTabIdx(i)} className="press-scale" style={{
                        flex: 'none', padding: '8px 14px', borderRadius: 999,
                        background: activeTabIdx === i ? 'var(--primary)' : 'var(--surface)',
                        color: activeTabIdx === i ? 'white' : 'var(--ink)',
                        border: activeTabIdx === i ? '1px solid var(--primary)' : '1px solid var(--border)',
                        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                        {t(key)}
                    </button>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="fade-up" style={{ padding: '52px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 68, height: 68, borderRadius: 22, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(20,18,12,0.05)' }}>
                        <IBell size={30} stroke="var(--border)" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{t('alerts.empty_title')}</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t('alerts.empty_desc')}</div>
                    </div>
                </div>
            )}

            {/* Alert cards */}
            <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((alert, i) => {
                    const r = RISK[alert.severity];
                    return (
                        <Link to={alert.id === 1 ? "/alert" : "#"} key={alert.id} onClick={alert.id !== 1 ? (e) => e.preventDefault() : undefined} className={`fade-up card-hover`} style={{ animationDelay: `${i * 60}ms`, background: 'var(--surface)', borderRadius: 20, padding: '16px 18px', borderLeft: `4px solid ${r.border}`, boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 20px rgba(20,18,12,0.06)', textDecoration: 'none', color: 'inherit', cursor: alert.id === 1 ? 'pointer' : 'default' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                {(() => { const AI = ALERT_ICONS[alert.type] || IAlertTriangle; return <span style={{ width: 38, height: 38, borderRadius: 11, background: r.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><AI size={18} stroke={r.fg} /></span>; })()}
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
