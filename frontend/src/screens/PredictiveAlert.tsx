import React from 'react';
import { Link } from 'react-router-dom';
import {
    IChev, ICloudRain, IPhone, INav,
    PulseDot, Eyebrow, BottomNav, VoiceFAB,
    IAlertTriangle
} from '../components/Shared';

const PHOTO_WHEAT = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format&fit=crop';

function AlertHero() {
    return (
        <div className="fade-up" style={{ position: 'relative', minHeight: 280, background: 'var(--ink)' }}>
            <div className="ken-burns" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${PHOTO_WHEAT})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.85) contrast(1.05) brightness(0.78) hue-rotate(-6deg)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,23,0.05) 0%, rgba(26,26,23,0.05) 30%, rgba(26,26,23,0.60) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', background: 'rgba(46,74,58,0.4)' }} />
            
            <div style={{ position: 'relative', zIndex: 2, padding: '20px 18px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 280 }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px 8px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)', color: 'white', textDecoration: 'none', width: 'fit-content', border: '0.5px solid rgba(255,255,255,0.15)' }}>
                    <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back to Briefing</span>
                </Link>
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <PulseDot color="#B85C3C" size={8} />
                        <Eyebrow color="#B85C3C">High Priority Alert</Eyebrow>
                    </div>
                    <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.025em', color: 'white', margin: 0, textShadow: '0 2px 18px rgba(0,0,0,0.5)' }}>
                        Wheat blight risk rising in 3 farms
                    </h1>
                </div>
            </div>
        </div>
    );
}

function AlertDetails() {
    return (
        <div className="fade-up" style={{ animationDelay: '100ms', padding: '24px 18px', background: 'var(--bg)', marginTop: -20, position: 'relative', zIndex: 10, borderRadius: '24px 24px 0 0' }}>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 24px' }}>
                48mm rainfall in Hardoi combined with an 89% humidity spike creates ideal conditions for Septoria blight. Nearby farms at flowering stage are at immediate risk.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', marginBottom: 8 }}>
                        <ICloudRain size={18} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700 }}>WEATHER</span>
                    </div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>48mm</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>Rain past 7 days</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning)', marginBottom: 8 }}>
                        <IAlertTriangle size={18} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700 }}>RISK WINDOW</span>
                    </div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>36h</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>Before spread</div>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button style={{ flex: 1, padding: '15px 16px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)', cursor: 'pointer' }}>
                    Add all to Route
                </button>
                <button style={{ width: 50, height: 50, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', cursor: 'pointer' }}>
                    <IPhone size={20} />
                </button>
            </div>
        </div>
    );
}

function AffectedFarmers() {
    const farmers = [
        { name: 'Ramesh Yadav', village: 'Bhatpura', crop: 'Wheat · 3.2 ac', photo: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&q=80&auto=format&fit=crop' },
        { name: 'Suresh Verma', village: 'Mallawan', crop: 'Wheat · 2.4 ac', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop' },
        { name: 'Manju Devi', village: 'Bhatpura', crop: 'Wheat · 1.8 ac', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80&auto=format&fit=crop' },
    ];
    return (
        <div className="fade-up" style={{ animationDelay: '200ms', padding: '0 18px' }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 19, color: 'var(--ink)', marginBottom: 16 }}>Affected Farms (3)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {farmers.map((farmer, i) => (
                    <Link to="/farmer/1" key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `center/cover url(${farmer.photo})`, flex: 'none' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{farmer.name}</div>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{farmer.village} · {farmer.crop}</div>
                        </div>
                        <IChev size={16} stroke="var(--ink-soft)" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function PredictiveAlert() {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <AlertHero />
            <AlertDetails />
            <AffectedFarmers />
            <div style={{ height: 120 }} />
            <VoiceFAB />
            <BottomNav />
        </div>
    );
}
