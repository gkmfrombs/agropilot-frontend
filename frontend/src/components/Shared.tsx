import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// ===================================================================
// Icons (Lucide-style: stroke 1.5, round caps/joins, fill none, viewBox 0 0 24 24)
// ===================================================================
interface IconProps { size?: number; stroke?: string; fill?: string; style?: React.CSSProperties; }
export const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }: any) => (
    <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
export const IBell = (p: IconProps) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />;
export const ICloudRain = (p: IconProps) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></>} />;
export const IChev = (p: IconProps) => <Icon {...p} d={<path d="m9 18 6-6-6-6" />} />;
export const IChevDown = (p: IconProps) => <Icon {...p} d={<path d="m6 9 6 6 6-6" />} />;
export const INav = (p: IconProps) => <Icon {...p} d={<path d="m3 11 19-9-9 19-2-8-8-2z" />} />;
export const IPhone = (p: IconProps) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />} />;
export const IMic = (p: IconProps) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></>} />;
export const IHome = (p: IconProps) => <Icon {...p} d={<><path d="M3 9.5 12 2l9 7.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" /></>} />;
export const IMap = (p: IconProps) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14" /><path d="M15 6v14" /></>} />;
export const IChat = (p: IconProps) => <Icon {...p} d={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />} />;
export const ISync = (p: IconProps) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 14.85-6.85L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-14.85 6.85L3 16" /><path d="M3 21v-5h5" /></>} />;
export const IUser = (p: IconProps) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
export const ICheck = (p: IconProps) => <Icon {...p} d={<path d="M20 6 9 17l-5-5" />} />;
export const ISpark = (p: IconProps) => <Icon {...p} d={<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />} />;
export const ICamera = (p: IconProps) => <Icon {...p} d={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>} />;
export const IAlertTriangle = (p: IconProps) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>} />;
export const IStore = (p: IconProps) => <Icon {...p} d={<><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></>} />;
export const ICalculator = (p: IconProps) => <Icon {...p} d={<><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></>} />;
export const IClipboard = (p: IconProps) => <Icon {...p} d={<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /></>} />;
export const IWifi = (p: IconProps) => <Icon {...p} d={<><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>} />;
export const ISettings = (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>} />;
export const ISend = (p: IconProps) => <Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>} />;
export const IClose = (p: IconProps) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />;
export const ICalendar = (p: IconProps) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>} />;
export const IShare = (p: IconProps) => <Icon {...p} d={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>} />;
export const ITarget = (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>} />;
export const IBarChart = (p: IconProps) => <Icon {...p} d={<><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>} />;

// ===================================================================
// Common UI Patterns
// ===================================================================
export const PulseDot = ({ color = '#B85C3C', size = 6 }) => (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <span className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
        <span style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: color }} />
    </span>
);

export const Eyebrow = ({ children, color = 'var(--ink-soft)' }: any) => (
    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>{children}</span>
);

export const WheatStalk = ({ size = 64, color = '#1A1A17', opacity = 0.14, style }: any) => (
    <svg width={size} height={size * 1.4} viewBox="0 0 64 88" fill="none" style={{ opacity, ...style }}>
        <line x1="32" y1="6" x2="32" y2="84" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <g key={i} transform={`translate(32, ${12 + i * 8.5})`}>
                <path d="M0 0 Q -7 -3 -11 -10" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
                <path d="M0 0 Q  7 -3  11 -10" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
                <ellipse cx="-8" cy="-6" rx="3.4" ry="1.6" stroke={color} strokeWidth="1" fill="none" transform="rotate(-30 -8 -6)" />
                <ellipse cx="8" cy="-6" rx="3.4" ry="1.6" stroke={color} strokeWidth="1" fill="none" transform="rotate(30 8 -6)" />
            </g>
        ))}
    </svg>
);

export function TopStrip() {
    return (
        <div style={{
            position: 'sticky', top: 0, zIndex: 30, background: 'rgba(245,241,232,0.78)',
            backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            borderBottom: '1px solid rgba(229,220,201,0.7)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px 5px 10px', borderRadius: 999, background: 'var(--primary-soft)', color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600 }}>
                        <PulseDot color="#2E4A3A" size={6} /> Offline
                    </div>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>3 actions queued</span>
                </div>
                <Link to="/alerts" style={{ position: 'relative', width: 36, height: 36, borderRadius: 12, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', textDecoration: 'none' }}>
                    <IBell size={20} />
                    <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--accent)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2.5px rgba(245,241,232,0.95)' }}>2</span>
                </Link>
            </div>
        </div>
    );
}

export function BottomNav() {
    const location = useLocation();
    const items = [
        { id: 'home', label: 'Home', I: IHome, to: '/' },
        { id: 'route', label: 'Route', I: IMap, to: '/route' },
        { id: 'chat', label: 'Chat', I: IChat, primary: true, to: '/chat' },
        { id: 'alerts', label: 'Alerts', I: IBell, to: '/alerts' },
        { id: 'me', label: 'Profile', I: IUser, to: '/me' },
    ];
    return (
        <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 40, paddingBottom: 12, paddingTop: 14, paddingLeft: 14, paddingRight: 14, background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 40%, var(--bg) 100%)' }}>
            <div style={{ background: 'var(--surface)', borderRadius: 22, boxShadow: '0 2px 4px rgba(20,18,12,0.06), 0 18px 40px rgba(20,18,12,0.14)', padding: '10px 6px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', border: '1px solid rgba(229,220,201,0.6)' }}>
                {items.map(({ id, label, I, primary, to }) => {
                    const active = location.pathname === to || (to === '/' && location.pathname === '/');
                    return (
                        <Link key={id} to={to} style={{ background: 'transparent', border: 'none', padding: '4px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600, color: active ? 'var(--primary)' : 'var(--ink-soft)', cursor: 'pointer', position: 'relative', textDecoration: 'none', transition: 'transform 150ms ease', transform: active ? 'scale(1.04)' : 'scale(1)' }}>
                            {primary ? (
                                <div style={{ width: 42, height: 42, borderRadius: 14, marginTop: -18, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(46,74,58,0.32), inset 0 1px 0 rgba(255,255,255,0.18)', color: 'white', border: '3px solid #FAF6EC' }}><I size={19} stroke="#fff" /></div>
                            ) : <I size={22} stroke={active ? '#2E4A3A' : '#6B6A5F'} />}
                            <span style={{ marginTop: primary ? -2 : 0 }}>{label}</span>
                            {active && !primary && <span style={{ position: 'absolute', bottom: -4, width: 16, height: 2.5, borderRadius: 99, background: 'var(--primary)' }} />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export function VoiceFAB() {
    return (
        <Link to="/chat" style={{ position: 'fixed', right: 22, bottom: 108, zIndex: 50, width: 60, height: 60, textDecoration: 'none' }}>
            {[0, 0.6].map((delay, i) => <span key={i} className="fab-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2E4A3A', animationDelay: `${delay}s` }} />)}
            <div className="fab-breathe" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 26px rgba(46,74,58,0.42), inset 0 1px 0 rgba(255,255,255,0.22)', color: 'white' }}>
                <IMic size={22} stroke="#fff" />
            </div>
        </Link>
    );
}

/** Screen wrapper — handles the parchment bg, grain texture, bottom padding for nav */
export function ScreenShell({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            {/* Paper grain */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.45, zIndex: 0, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
            <div style={{ position: 'relative', zIndex: 1, paddingTop: noPad ? 0 : 48 }}>
                {children}
            </div>
        </div>
    );
}
