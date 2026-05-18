import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ICloudRain, IChev, INav, IPhone, ICheck, ISpark,
    PulseDot, Eyebrow, WheatStalk, TopStrip, BottomNav, VoiceFAB 
} from '../components/Shared';

const PHOTO_HERO = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop';
const PHOTO_WHEAT = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format&fit=crop';

function Hero() {
    return (
        <div className="fade-up" style={{ animationDelay: '0ms', margin: '14px 18px 0', borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 196, background: '#2E4A3A', boxShadow: '0 1px 2px rgba(20,18,12,0.06), 0 18px 36px rgba(20,18,12,0.14)' }}>
            <div className="ken-burns" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${PHOTO_HERO})`, backgroundSize: 'cover', backgroundPosition: 'center 60%', filter: 'saturate(1.05) contrast(1.02)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,23,0.15) 0%, rgba(26,26,23,0.05) 30%, rgba(26,26,23,0.55) 78%, rgba(26,26,23,0.78) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', background: 'linear-gradient(140deg, rgba(46,74,58,0.18) 0%, rgba(201,151,74,0.18) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 2, color: '#F5F1E8', padding: '18px 20px 18px', display: 'flex', flexDirection: 'column', minHeight: 196 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Eyebrow color="rgba(245,241,232,0.78)">Sat · 17 May · Hardoi</Eyebrow>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 11px 6px 9px', borderRadius: 999, background: 'rgba(245,241,232,0.16)', backdropFilter: 'blur(10px) saturate(160%)', WebkitBackdropFilter: 'blur(10px) saturate(160%)', border: '1px solid rgba(245,241,232,0.22)', color: '#F5F1E8' }}>
                        <ICloudRain size={15} stroke="#F5F1E8" />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12 }}>32° · Rain by 3pm</span>
                    </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 36, lineHeight: 1.02, letterSpacing: '-0.025em', color: '#FAF6EC', margin: 0, fontVariationSettings: '"opsz" 60', textShadow: '0 2px 18px rgba(20,18,12,0.35)' }}>
                        Good morning,<br /><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Arjun.</span>
                    </h1>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 500, color: 'rgba(245,241,232,0.82)', margin: '8px 0 0' }}>5 farms need you before the rain arrives.</p>
                </div>
            </div>
        </div>
    );
}

function StatsRibbon() {
    const stats = [
        { k: 'Visits', v: '12', sub: 'planned' },
        { k: 'Route', v: '18.4', sub: 'km' },
        { k: 'Target', v: '₹47k', sub: 'tilt 25EC' },
    ];
    return (
        <div className="fade-up" style={{ animationDelay: '70ms', margin: '14px 18px 22px', padding: '14px 18px', background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: 18, display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', alignItems: 'center', gap: 0 }}>
            {stats.map((s, i) => (
                <React.Fragment key={s.k}>
                    <div style={{ textAlign: i === 1 ? 'center' : (i === 2 ? 'right' : 'left') }}>
                        <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>{s.v}</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600, color: 'var(--ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: 4 }}>{s.k} · <span style={{ fontWeight: 500, letterSpacing: '0.04em', textTransform: 'none' as const, opacity: 0.85 }}>{s.sub}</span></div>
                    </div>
                    {i < 2 && <div style={{ width: 1, height: 30, background: 'var(--border)', margin: '0 auto' }} />}
                </React.Fragment>
            ))}
        </div>
    );
}

function MiniBars() {
    const days = [4, 8, 6, 14, 28, 38, 48];
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 32 }}>
            {days.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 7, height: Math.max(3, (d / 50) * 30), background: i >= 5 ? 'var(--danger)' : 'rgba(46,74,58,0.32)', borderRadius: 2 }} />
                </div>
            ))}
        </div>
    );
}

function AlertCard() {
    return (
        <div className="fade-up" style={{ animationDelay: '140ms', margin: '0 18px 24px', borderRadius: 20, background: 'var(--surface)', boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 28px rgba(20,18,12,0.07)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--danger)' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 64, height: 64, borderRadius: 14, backgroundImage: `url(${PHOTO_WHEAT})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(160deg, rgba(184,92,60,0.0) 50%, rgba(184,92,60,0.35) 100%)' }} />
            </div>
            <div style={{ padding: '16px 18px 16px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <PulseDot color="#B85C3C" size={6} />
                    <Eyebrow color="var(--danger)">New Predictive Alert</Eyebrow>
                </div>
                <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 21, lineHeight: 1.14, letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0, maxWidth: 240, fontVariationSettings: '"opsz" 30' }}>
                    Wheat blight risk rising in <span style={{ fontStyle: 'italic', fontWeight: 400 }}>3 farms</span>
                </h3>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: '8px 0 0', lineHeight: 1.45 }}>
                    48mm rainfall + humidity spike · <span style={{ color: 'var(--ink)' }}>2h ago</span>
                </p>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <MiniBars />
                        <div>
                            <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 15, color: 'var(--ink)' }}>48<span style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}> mm</span></div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, color: 'var(--ink-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>last 7 days</div>
                        </div>
                    </div>
                    <Link to="/alert" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 10px 8px 14px', borderRadius: 999, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 10px rgba(46,74,58,0.22)', textDecoration: 'none' }}>
                        View <IChev size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SectionHeader() {
    return (
        <div className="fade-up" style={{ animationDelay: '210ms', padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }} />
                <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 19, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0 }}>Today's priority visits</h2>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(201,151,74,0.18)', color: '#8C6420', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11, letterSpacing: '0.04em' }}>5 urgent</span>
        </div>
    );
}

function FilterChips() {
    const [active, setActive] = useState('High Risk (5)');
    const chips = [{ label: 'All', count: 12 }, { label: 'High Risk', count: 5 }, { label: 'Medium', count: 4 }, { label: 'Low', count: 3 }, { label: 'Routine', count: null }];
    return (
        <div className="fade-up no-scrollbar" style={{ animationDelay: '270ms', display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 18px 6px', marginBottom: 14 }}>
            {chips.map(c => {
                const key = c.count != null ? `${c.label} (${c.count})` : c.label;
                const on = key === active;
                return (
                    <button key={c.label} onClick={() => setActive(key)} style={{ flex: 'none', padding: '8px 14px', borderRadius: 999, fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5, background: on ? 'var(--primary)' : 'var(--surface)', color: on ? 'white' : 'var(--ink)', border: on ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: on ? '0 4px 14px rgba(46,74,58,0.18)' : 'none', transition: 'background 200ms ease, color 200ms ease', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {c.label}
                        {c.count != null && <span style={{ fontWeight: 700, fontSize: 11, color: on ? 'rgba(255,255,255,0.78)' : 'var(--ink-soft)' }}>{c.count}</span>}
                    </button>
                );
            })}
        </div>
    );
}

const RISK: any = {
    HIGH: { rule: '#B85C3C', bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', label: 'HIGH' },
    MEDIUM: { rule: '#D4A347', bg: 'rgba(212,163,71,0.20)', fg: '#8C6420', label: 'MED' },
    LOW: { rule: '#7B9C6A', bg: 'rgba(200,213,187,0.6)', fg: '#2E4A3A', label: 'LOW' },
};

function VisitCard({ farmer, index }: any) {
    const r = RISK[farmer.risk];
    const ghostBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: 'var(--primary)', cursor: 'pointer', textDecoration: 'none' };
    const ghostBtnDark: React.CSSProperties = { ...ghostBtn, background: 'var(--primary)', border: '1px solid var(--primary)', color: '#FFF', boxShadow: '0 4px 10px rgba(46,74,58,0.20)' };

    const detailLink = farmer.type === 'retailer' ? '/retailer/1' : '/farmer/1';
    
    return (
        <div className="fade-up" style={{ animationDelay: `${330 + index * 60}ms`, background: 'var(--surface)', borderRadius: 20, boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 28px rgba(20,18,12,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, background: r.rule, borderRadius: 99 }} />
            <div style={{ padding: '16px 18px 14px 20px' }}>
                {farmer.cached && (
                    <div style={{ position: 'absolute', top: 12, right: 14, display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 600, color: 'var(--ink-soft)' }}><ICheck size={11} stroke="#6B6A5F" /> Cached</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', flex: 'none', background: farmer.photo ? `center/cover url(${farmer.photo})` : 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, border: '1px solid var(--border)', boxShadow: 'inset 0 0 0 2px #FFF, 0 2px 8px rgba(20,18,12,0.08)' }}>{!farmer.photo && farmer.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.005em' }}>{farmer.name}</span>
                            {farmer.type === 'retailer' && <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 999, background: 'rgba(201,151,74,0.15)', color: '#8C6420', fontWeight: 700 }}>RETAILER</span>}
                        </div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span>{farmer.village}</span><span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }} /><span>{farmer.dist}km</span><span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }} /><span>{farmer.crop}</span>
                        </div>
                    </div>
                    <span style={{ padding: '4px 8px', borderRadius: 999, background: r.bg, color: r.fg, fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.10em' }}>{r.label}</span>
                </div>
                <div style={{ marginTop: 12, fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400, fontSize: 14, color: 'var(--ink)', lineHeight: 1.42, fontVariationSettings: '"opsz" 14', opacity: 0.85 }}>"{farmer.reason}"</div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px 5px 8px', borderRadius: 999, background: 'rgba(201,151,74,0.14)', color: '#8C6420', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11 }}><ISpark size={11} stroke="#C9974A" />{farmer.confidence}%</span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>Recommend <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{farmer.product}</span></span>
                    </div>
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button style={ghostBtnDark}><INav size={13} stroke="#FFFFFF" /> Navigate</button>
                    <button style={ghostBtn}><IPhone size={13} stroke="#2E4A3A" /> Call</button>
                    <Link to={detailLink} style={{ ...ghostBtn, marginLeft: 'auto' }}>Details <IChev size={13} stroke="#2E4A3A" /></Link>
                </div>
            </div>
        </div>
    );
}

export default function MorningBriefing() {
    const [refreshing, setRefreshing] = React.useState(false)
    const touchStartY = React.useRef(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        const delta = e.changedTouches[0].clientY - touchStartY.current
        if (delta > 72 && window.scrollY <= 0 && !refreshing) {
            setRefreshing(true)
            setTimeout(() => setRefreshing(false), 1400)
        }
    }

    const visits = [
        { name: 'Kisan Agri Store', initials: 'KA', risk: 'HIGH', confidence: 96, village: 'Sandila', dist: '2.1', crop: 'Topik OOS', reason: 'Topik 15WP out of stock — 4 farmers at heading stage need restock urgently.', product: 'Topik 15WP', photo: '', cached: true, type: 'retailer' },
        { name: 'Ramesh Yadav', initials: 'RY', risk: 'HIGH', confidence: 94, village: 'Bhatpura', dist: '4.2', crop: 'Wheat · 3.2 ac', reason: 'Blight risk after 48mm rain at flowering — foliar window closes in 36h.', product: 'Tilt 25EC', photo: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&q=80&auto=format&fit=crop', cached: true, type: 'farmer' },
        { name: 'Suresh Verma', initials: 'SV', risk: 'HIGH', confidence: 91, village: 'Mallawan', dist: '6.8', crop: 'Wheat · 2.4 ac', reason: 'Yellow rust on neighbouring plots; humidity favours spread by Thursday.', product: 'Nativo 75WG', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop', cached: true, type: 'farmer' },
        { name: 'Sharma Seeds', initials: 'SS', risk: 'MEDIUM', confidence: 82, village: 'Atrauli', dist: '8.3', crop: 'Score low', reason: 'Score 250EC at 4 units — drawdown rate suggests stockout by Friday.', product: 'Score 250EC', photo: '', cached: false, type: 'retailer' },
        { name: 'Manju Devi', initials: 'MD', risk: 'MEDIUM', confidence: 76, village: 'Bhatpura', dist: '4.5', crop: 'Wheat · 1.8 ac', reason: 'Soil moisture above threshold; preventive note pending farmer consent.', product: 'Amistar Top', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80&auto=format&fit=crop', cached: true, type: 'farmer' },
        { name: 'Vikram Pal', initials: 'VP', risk: 'LOW', confidence: 82, village: 'Atrauli', dist: '11.3', crop: 'Wheat · 5.0 ac', reason: 'Routine seed enquiry — new rabi cultivar ready to demo at field edge.', product: 'Seedcare Demo', photo: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=200&q=80&auto=format&fit=crop', cached: false, type: 'farmer' },
    ];

    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* Pull-to-refresh indicator */}
            {refreshing && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)' }}>
                    <span className="ptr-spinner" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--primary)', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Refreshing…</span>
                </div>
            )}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45, zIndex: 0, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }} />
            <div style={{ position: 'absolute', top: 360, right: -22, zIndex: 0, pointerEvents: 'none' }}><WheatStalk size={130} opacity={0.06} /></div>
            <div style={{ position: 'absolute', top: 920, left: -28, zIndex: 0, pointerEvents: 'none', transform: 'rotate(18deg)' }}><WheatStalk size={150} opacity={0.05} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <TopStrip />
                <Hero />
                <StatsRibbon />
                <AlertCard />
                <SectionHeader />
                <FilterChips />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 18px' }}>
                    {visits.map((f, i) => <VisitCard key={f.name} farmer={f} index={i} />)}
                </div>
                <div style={{ height: 120 }} />
            </div>
            <VoiceFAB />
            <BottomNav />
        </div>
    );
}