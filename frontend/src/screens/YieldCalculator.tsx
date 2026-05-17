import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IChev, ICalculator, TopStrip, BottomNav, Eyebrow, IShare } from '../components/Shared';

export default function YieldCalculator() {
    const [farmSize, setFarmSize] = useState('3.2');
    const [cropPrice, setCropPrice] = useState('2275');
    const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');

    const acres = parseFloat(farmSize) || 0;
    const price = parseFloat(cropPrice) || 0;
    const lossRate = severity === 'Mild' ? 0.08 : severity === 'Moderate' ? 0.18 : 0.35;
    const yieldPerAcre = 18; // quintals
    const totalYield = yieldPerAcre * acres;
    const lossWithout = totalYield * lossRate;
    const lossWithProduct = totalYield * lossRate * 0.15; // 85% protection
    const yieldSaved = lossWithout - lossWithProduct;
    const productCost = acres * 450; // ₹450/acre
    const netBenefit = (yieldSaved * price) - productCost;

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
            <TopStrip />
            
            <div style={{ padding: '14px 18px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                    <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back</span>
                </Link>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Yield Loss Calculator</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>Show the farmer the cost of not acting</p>
            </div>

            {/* Inputs */}
            <div className="fade-up" style={{ padding: '0 18px', marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Farm Size (acres)</label>
                        <input value={farmSize} onChange={e => setFarmSize(e.target.value)} type="number" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crop Price (₹/qtl)</label>
                        <input value={cropPrice} onChange={e => setCropPrice(e.target.value)} type="number" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', outline: 'none' }} />
                    </div>
                </div>
            </div>

            {/* Severity */}
            <div className="fade-up" style={{ animationDelay: '80ms', padding: '0 18px', marginBottom: 24 }}>
                <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    {(['Mild', 'Moderate', 'Severe'] as const).map(s => (
                        <button key={s} onClick={() => setSeverity(s)} style={{
                            flex: 1, padding: '12px', borderRadius: 14,
                            background: severity === s ? (s === 'Severe' ? 'var(--danger)' : s === 'Moderate' ? 'var(--warning)' : 'var(--primary)') : 'var(--surface)',
                            color: severity === s ? 'white' : 'var(--ink)',
                            border: severity === s ? 'none' : '1px solid var(--border)',
                            fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                        }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="fade-up" style={{ animationDelay: '160ms', margin: '0 18px', padding: '20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', marginBottom: 16 }}>
                <Eyebrow color="var(--danger)">WITHOUT TREATMENT</Eyebrow>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 4px' }}>
                    <span style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500, color: 'var(--danger)' }}>₹{Math.round(lossWithout * price).toLocaleString()}</span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>potential loss</span>
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>
                    {lossWithout.toFixed(1)} qtl yield loss from {acres} acres
                </div>
            </div>

            <div className="fade-up" style={{ animationDelay: '240ms', margin: '0 18px', padding: '20px', background: 'var(--primary)', borderRadius: 20, color: 'white', marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>WITH TILT 25EC</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500 }}>₹{Math.round(netBenefit).toLocaleString()}</span>
                    <span style={{ fontSize: 13, opacity: 0.8 }}>net benefit</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>
                    {yieldSaved.toFixed(1)} qtl saved · Product cost ₹{productCost.toLocaleString()}
                </div>
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Break-even: only {(productCost / price).toFixed(1)} qtl needed to recover cost</span>
                </div>
            </div>

            <div style={{ padding: '0 18px 24px' }}>
                <button style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <IShare size={16} /> Share with Farmer
                </button>
            </div>

            <div style={{ height: 100 }} />
            <BottomNav />
        </div>
    );
}
