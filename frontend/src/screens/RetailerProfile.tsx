import React from 'react';
import { Link } from 'react-router-dom';
import { IChev, IPhone, INav, IStore, TopStrip, BottomNav, VoiceFAB, Eyebrow, Icon } from '../components/Shared';

const stockItems = [
    { sku: 'Topik 15 WP', qty: 0, status: 'OUT', history: [12, 8, 5, 2, 0] },
    { sku: 'Score 250 EC', qty: 4, status: 'LOW', history: [20, 16, 12, 8, 4] },
    { sku: 'Actara 25 WG', qty: 18, status: 'OK', history: [22, 20, 19, 18, 18] },
    { sku: 'Kavach 75 WP', qty: 12, status: 'OK', history: [15, 14, 13, 12, 12] },
];

const statusColors: any = {
    OUT: { bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C' },
    LOW: { bg: 'rgba(212,163,71,0.18)', fg: '#8C6420' },
    OK: { bg: 'rgba(200,213,187,0.5)', fg: '#2E4A3A' },
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data, 1);
    const w = 60, h = 24;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
    return (
        <svg width={w} height={h} style={{ display: 'block' }}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const visits = [
    { date: '14 May 2026', outcome: 'Sale Made', product: 'Score 250EC × 6 units', notes: 'Owner confirmed restock of Topik expected next week.' },
    { date: '7 May 2026', outcome: 'No Purchase', product: 'Pitched Actara 25WG', notes: 'Owner says aphid pressure low. Will reconsider if pest count rises.' },
    { date: '28 Apr 2026', outcome: 'Order Placed', product: 'Topik 15WP × 12 units', notes: 'Bulk order for wheat heading season.' },
];

const competitorLog = [
    { brand: 'Bayer Nativo', date: '14 May', notes: 'Displayed prominently on front shelf' },
    { brand: 'UPL Saaf', date: '7 May', notes: 'New stock arrived this week' },
];

const nearbyFarmers = [
    { name: 'Ramesh Yadav', crop: 'Wheat', stage: 'Flowering' },
    { name: 'Manju Devi', crop: 'Wheat', stage: 'Heading' },
    { name: 'Suresh Verma', crop: 'Wheat', stage: 'Flowering' },
];

export default function RetailerProfile() {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
            <TopStrip />

            {/* Header */}
            <div style={{ padding: '14px 18px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                    <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <IStore size={26} stroke="var(--primary)" />
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Kisan Agri Store</h1>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>Sandila Rd, Hardoi · Owner: Rajesh Kumar</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>Best visit: <strong style={{ color: 'var(--ink)' }}>Tue/Thu mornings</strong> · Avoid Mondays</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,74,58,0.2)' }}>
                        <INav size={16} /> Navigate
                    </button>
                    <Link to="/visit" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', color: 'var(--primary)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}>
                        Visit Copilot
                    </Link>
                </div>
            </div>

            {/* Stock Status with sparklines */}
            <div className="fade-up" style={{ padding: '20px 18px 0' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Current Stock</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {stockItems.map(item => {
                        const st = statusColors[item.status];
                        return (
                            <div key={item.sku} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{item.sku}</div>
                                    <Sparkline data={item.history} color={st.fg} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)' }}>{item.qty}</span>
                                    <span style={{ padding: '3px 8px', borderRadius: 999, background: st.bg, color: st.fg, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700 }}>{item.status === 'OUT' ? 'OUT' : item.status === 'LOW' ? 'LOW' : 'OK'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Competitor products */}
            <div className="fade-up" style={{ animationDelay: '100ms', padding: '20px 18px 0' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Competitor Products</h2>
                {competitorLog.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < competitorLog.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{c.brand}</div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{c.notes}</div>
                        </div>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>{c.date}</span>
                    </div>
                ))}
            </div>

            {/* Nearby Farmers */}
            <div className="fade-up" style={{ animationDelay: '200ms', padding: '20px 18px 0' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Nearby Farmers</h2>
                {nearbyFarmers.map((f, i) => (
                    <Link to="/farmer/1" key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < nearbyFarmers.length - 1 ? '1px solid var(--border)' : 'none', textDecoration: 'none', color: 'inherit' }}>
                        <div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{f.name}</div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{f.crop} · {f.stage}</div>
                        </div>
                        <IChev size={16} stroke="var(--ink-soft)" />
                    </Link>
                ))}
            </div>

            {/* Visit History */}
            <div className="fade-up" style={{ animationDelay: '300ms', padding: '20px 18px' }}>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Visit History</h2>
                <div style={{ position: 'relative', paddingLeft: 16 }}>
                    <div style={{ position: 'absolute', top: 8, bottom: 0, left: 0, width: 2, background: 'var(--border)' }} />
                    {visits.map((v, i) => (
                        <div key={i} style={{ position: 'relative', marginBottom: i < visits.length - 1 ? 18 : 0 }}>
                            <div style={{ position: 'absolute', top: 4, left: -21, width: 12, height: 12, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)' }} />
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>{v.date}</div>
                            <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v.product}</span>
                                    <span style={{ padding: '2px 7px', borderRadius: 999, background: v.outcome === 'Sale Made' ? 'rgba(200,213,187,0.5)' : v.outcome === 'Order Placed' ? 'rgba(201,151,74,0.15)' : 'rgba(184,92,60,0.12)', color: v.outcome === 'Sale Made' ? 'var(--primary)' : v.outcome === 'Order Placed' ? '#8C6420' : '#B85C3C', fontSize: 10, fontWeight: 700 }}>{v.outcome}</span>
                                </div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{v.notes}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: 120 }} />
            <VoiceFAB />
            <BottomNav />
        </div>
    );
}
