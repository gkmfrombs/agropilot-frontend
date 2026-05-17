import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { Icon } from '../../components/Shared';

const IMap = (p: any) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14" /><path d="M15 6v14" /></>} />;
const IBarChart = (p: any) => <Icon {...p} d={<><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>} />;
const IUsers = (p: any) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />;
const IBell = (p: any) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />;
const IMegaphone = (p: any) => <Icon {...p} d={<><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>} />;
const ILogOut = (p: any) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />;

const navItems = [
    { path: '/manager', label: 'Heatmap', icon: IMap, exact: true },
    { path: '/manager/kpi', label: 'KPI Dashboard', icon: IBarChart },
    { path: '/manager/reps', label: 'Rep Tracker', icon: IUsers },
    { path: '/manager/alerts', label: 'Alerts', icon: IBell },
    { path: '/manager/campaigns', label: 'Campaigns', icon: IMegaphone },
];

export default function ManagerLayout() {
    const { name, logout } = useAuth();
    const location = useLocation();

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#0F1A14', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{ width: 260, background: 'linear-gradient(180deg, #0F1A14 0%, #162118 100%)', borderRight: '1px solid rgba(200,213,187,0.08)', display: 'flex', flexDirection: 'column', flex: 'none' }}>
                {/* Brand */}
                <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid rgba(200,213,187,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(200,213,187,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8D5BB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: '#E8E2D4', letterSpacing: '-0.02em' }}>AgroPilot</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(201,151,74,0.8)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Manager Console</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(item => {
                        const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12,
                                background: active ? 'rgba(200,213,187,0.1)' : 'transparent',
                                color: active ? '#E8E2D4' : 'rgba(200,213,187,0.4)',
                                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                                transition: 'all 150ms', border: active ? '1px solid rgba(200,213,187,0.08)' : '1px solid transparent',
                            }}>
                                <item.icon size={18} stroke={active ? '#C8D5BB' : 'rgba(200,213,187,0.35)'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(200,213,187,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #a87a35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Fraunces', fontSize: 14, fontWeight: 500 }}>PS</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#E8E2D4' }}>{name || 'Priya Sharma'}</div>
                            <div style={{ fontSize: 11, color: 'rgba(200,213,187,0.4)' }}>Regional Manager</div>
                        </div>
                    </div>
                    <button onClick={logout} style={{
                        width: '100%', padding: '9px 14px', borderRadius: 10,
                        background: 'rgba(184,92,60,0.08)', border: '1px solid rgba(184,92,60,0.15)',
                        color: '#C97050', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                        <ILogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflow: 'auto', background: '#0F1A14' }} className="no-scrollbar">
                <Outlet />
            </main>
        </div>
    );
}
