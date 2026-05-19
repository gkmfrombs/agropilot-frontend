import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IChev, ISettings, ICamera, ICalculator, ISync, IWifi, TopStrip, BottomNav, Eyebrow, Icon } from '../components/Shared';
import { useAuth } from '../components/AuthContext'
import { useTranslation, LANG_OPTIONS } from '../lib/i18n'

const ILogOut = (p: any) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />;

const REP_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop';

const menuItems = [
    { label: 'Crop Scanner', desc: 'AI disease diagnosis', icon: '📸', to: '/scanner' },
    { label: 'Yield Calculator', desc: 'ROI for farmers', icon: '🧮', to: '/calculator' },
    { label: 'Sync Status', desc: '3 items pending', icon: '🔄', to: '#' },
    { label: 'Offline Mode', desc: 'Pre-cached today', icon: '📶', to: '#' },
];

const kpis = [
    { label: 'Visits This Week', value: '18', target: '24' },
    { label: 'Revenue / Field Day', value: '₹12.4k', target: '₹15k' },
    { label: 'AI Accept Rate', value: '78%', target: '85%' },
    { label: 'Coverage', value: '64%', target: '80%' },
];

export default function RepProfile() {
    const { logout } = useAuth()
    const { lang, setLang } = useTranslation()
    
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
            <TopStrip />
            
            {/* Profile Header */}
            <div className="fade-up" style={{ padding: '20px 18px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: `center/cover url(${REP_PHOTO})`, border: '3px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Arjun Mehta</h1>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>Field Sales Representative</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>Hardoi Territory · UP West Region</div>
                    </div>
                </div>
            </div>

            {/* Weekly KPIs */}
            <div className="fade-up" style={{ animationDelay: '80ms', padding: '20px 18px 0' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>This Week's Performance</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {kpis.map(kpi => (
                        <div key={kpi.label} style={{ padding: '14px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{kpi.label}</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>{kpi.value}</div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Target: {kpi.target}</div>
                            {/* Progress bar */}
                            <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'var(--border)' }}>
                                <div style={{ width: `${Math.min(100, (parseFloat(kpi.value.replace(/[₹,%k]/g, '')) / parseFloat(kpi.target.replace(/[₹,%k]/g, ''))) * 100)}%`, height: '100%', borderRadius: 2, background: 'var(--primary)', transition: 'width 600ms ease' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="fade-up" style={{ animationDelay: '160ms', padding: '20px 18px 0' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Tools</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {menuItems.map(item => (
                        <Link to={item.to} key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit' }}>
                            <span style={{ fontSize: 24 }}>{item.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{item.label}</div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{item.desc}</div>
                            </div>
                            <IChev size={16} stroke="var(--ink-soft)" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Settings */}
            <div className="fade-up" style={{ animationDelay: '240ms', padding: '20px 18px' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Settings</h2>
                
                {/* Language */}
                <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Language</span>
                        <select value={lang} onChange={e => setLang(e.target.value as any)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-warm)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)' }}>
                            {LANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Data Saver */}
                <div style={{ padding: '14px 16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Data Saver Mode</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>Reduce image quality & map tiles</div>
                    </div>
                    <div style={{ width: 44, height: 26, borderRadius: 13, background: 'var(--border)', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                    </div>
                </div>

                {/* Sign out */}
                <button onClick={logout} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'rgba(184,92,60,0.08)', border: '1px solid rgba(184,92,60,0.2)', color: 'var(--danger)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <ILogOut size={16} /> Sign Out
                </button>
            </div>

            <div style={{ height: 120 }} />
            <BottomNav />
        </div>
    );
}
