import React from 'react';
import { Link } from 'react-router-dom';
import { IChev, IPhone, INav, TopStrip, BottomNav, VoiceFAB, ICalendar, Eyebrow } from '../components/Shared';

const PHOTO_FARMER = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&q=80&auto=format&fit=crop';

function ProfileHeader() {
    return (
        <div className="fade-up" style={{ padding: '14px 18px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundImage: `url(${PHOTO_FARMER})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', border: '3px solid var(--primary-soft)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', flex: 'none' }} />
                <div style={{ paddingTop: 4 }}>
                    <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Ramesh Yadav</h1>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>Bhatpura, Hardoi · 42 yrs</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 3 }}>Wheat (HD-2967) · 3.2 acres</div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,74,58,0.2)' }}>
                    <IPhone size={16} /> Call
                </button>
                <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', color: 'var(--primary)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                    <INav size={16} /> Navigate
                </button>
                <Link to="/chat" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', color: 'var(--primary)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    Ask AI
                </Link>
            </div>
        </div>
    );
}

function FarmStats() {
    const stats = [
        { label: 'Farm Size', value: '3.2', unit: 'acres' },
        { label: 'Last Visit', value: '7', unit: 'days ago' },
        { label: 'Purchases', value: '₹24k', unit: 'this season' },
        { label: 'Risk Level', value: 'HIGH', unit: '', color: '#B85C3C' },
    ];
    return (
        <div className="fade-up" style={{ animationDelay: '80ms', padding: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {stats.map(s => (
                <div key={s.label} style={{ padding: '14px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: s.color || 'var(--ink)' }}>{s.value} {s.unit && <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'Plus Jakarta Sans' }}>{s.unit}</span>}</div>
                </div>
            ))}
        </div>
    );
}

function CropCalendar() {
    const stages = [
        { label: 'Sowing', date: 'Nov 15', done: true },
        { label: 'Tillering', date: 'Dec 20', done: true },
        { label: 'Heading', date: 'Feb 10', done: true },
        { label: 'Flowering', date: 'Mar 5', active: true },
        { label: 'Grain Fill', date: 'Apr 1', done: false },
        { label: 'Harvest', date: 'Apr 20', done: false },
    ];
    return (
        <div className="fade-up" style={{ animationDelay: '160ms', padding: '20px 18px 0' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ICalendar size={18} stroke="var(--primary)" /> Crop Calendar
            </h2>
            <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '16px', position: 'relative' }}>
                {/* Timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', paddingBottom: 8 }}>
                    <div style={{ position: 'absolute', top: 8, left: 20, right: 20, height: 2, background: 'var(--border)', zIndex: 0 }}>
                        <div style={{ width: '60%', height: '100%', background: 'var(--primary)' }} />
                    </div>
                    {stages.map((s, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1, flex: 1 }}>
                            <div style={{ width: s.active ? 16 : 10, height: s.active ? 16 : 10, borderRadius: '50%', background: s.active ? 'var(--primary)' : s.done ? 'var(--primary-soft)' : 'var(--border)', border: s.active ? '3px solid var(--surface)' : 'none', boxShadow: s.active ? '0 0 0 2px var(--primary)' : 'none' }} />
                            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 9, fontWeight: s.active ? 700 : 600, color: s.active ? 'var(--primary)' : 'var(--ink-soft)', textAlign: 'center' }}>{s.label}</span>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(212,163,71,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--warning)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>Critical: Fungicide window closes in 36 hours</span>
                </div>
            </div>
        </div>
    );
}

function PurchaseHistory() {
    const purchases = [
        { date: '7 May', product: 'Topik 15WP', qty: '2 units', amount: '₹1,240' },
        { date: '22 Apr', product: 'Score 250EC', qty: '1 unit', amount: '₹680' },
        { date: '5 Mar', product: 'Kavach 75WP', qty: '3 units', amount: '₹2,100' },
    ];
    return (
        <div className="fade-up" style={{ animationDelay: '240ms', padding: '20px 18px 0' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Purchase History</h2>
            <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                {purchases.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: i < purchases.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.product}</div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{p.date} · {p.qty}</div>
                        </div>
                        <span style={{ fontFamily: 'Fraunces', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{p.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VisitLog() {
    const visits = [
        { date: '10 May 2026', title: 'Pitched Actara 25WG', outcome: 'no_purchase', notes: 'Farmer wants to see pest count increase before spraying.' },
        { date: '22 Apr 2026', title: 'Bought Topik 15WP', outcome: 'sale', notes: 'Purchased 2 units from Kisan Store.' },
        { date: '5 Apr 2026', title: 'Crop assessment', outcome: 'follow_up', notes: 'Early tillering. Scheduled follow-up for heading stage.' },
    ];
    const outcomeColors: any = { sale: { bg: 'rgba(200,213,187,0.5)', fg: 'var(--primary)', label: 'SALE' }, no_purchase: { bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', label: 'NO SALE' }, follow_up: { bg: 'rgba(212,163,71,0.15)', fg: '#8C6420', label: 'FOLLOW-UP' } };

    return (
        <div className="fade-up" style={{ animationDelay: '320ms', padding: '20px 18px' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>Visit History</h2>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
                <div style={{ position: 'absolute', top: 8, bottom: 0, left: 0, width: 2, background: 'var(--border)' }} />
                {visits.map((v, i) => {
                    const oc = outcomeColors[v.outcome];
                    return (
                        <div key={i} style={{ position: 'relative', marginBottom: i < visits.length - 1 ? 18 : 0 }}>
                            <div style={{ position: 'absolute', top: 4, left: -21, width: 12, height: 12, borderRadius: '50%', background: 'var(--surface)', border: `2px solid ${oc.fg}` }} />
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>{v.date}</div>
                            <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v.title}</span>
                                    <span style={{ padding: '2px 6px', borderRadius: 999, background: oc.bg, color: oc.fg, fontSize: 9, fontWeight: 700 }}>{oc.label}</span>
                                </div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{v.notes}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function FarmerProfile() {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
            <TopStrip />
            <ProfileHeader />
            <FarmStats />
            <CropCalendar />
            <PurchaseHistory />
            <VisitLog />
            <div style={{ height: 120 }} />
            <VoiceFAB />
            <BottomNav />
        </div>
    );
}
