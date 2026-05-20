import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IChev, ICalculator, TopStrip, BottomNav, Eyebrow, IShare } from '../components/Shared';
import { api } from '../services/api';

const CROPS = ['wheat', 'mustard', 'chickpea', 'potato', 'rice'];
const PRODUCTS = [
    { label: 'Tilt 250 EC', sku: 'SY_TILT_250EC' },
    { label: 'Score 250 EC', sku: 'SY_SCO_250EC' },
    { label: 'Topik 15 WP', sku: 'SY_TOP_15WP' },
    { label: 'Actara 25 WG', sku: 'SY_ACT_25WG' },
    { label: 'Kavach 75 WP', sku: 'SY_KAV_75WP' },
];

export default function YieldCalculator() {
    const [farmSize, setFarmSize] = useState('3.2');
    const [crop, setCrop] = useState('wheat');
    const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
    const [productSku, setProductSku] = useState('SY_TILT_250EC');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculate = async () => {
        setLoading(true); setError(null);
        try {
            const data = await api.calculateROI({ crop, farm_size_acres: parseFloat(farmSize) || 1, disease_severity: severity, product_sku: productSku, num_applications: 1 });
            setResult(data);
        } catch {
            setError('Backend not reachable — start uvicorn first.');
        } finally { setLoading(false); }
    };

    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <TopStrip />

            <div style={{ padding: '14px 18px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                    <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back</span>
                </Link>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Yield Loss Calculator</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>Show the farmer the cost of not acting</p>
            </div>

            {/* Farm size */}
            <div className="fade-up" style={{ padding: '0 18px', marginBottom: 20 }}>
                <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Farm Size (acres)</label>
                <input value={farmSize} onChange={e => setFarmSize(e.target.value)} type="number" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', outline: 'none' }} />
            </div>

            {/* Crop */}
            <div className="fade-up" style={{ animationDelay: '40ms', padding: '0 18px', marginBottom: 20 }}>
                <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crop</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {CROPS.map(c => (
                        <button key={c} onClick={() => setCrop(c)} style={{ padding: '10px 16px', borderRadius: 12, background: crop === c ? 'var(--primary)' : 'var(--surface)', color: crop === c ? 'white' : 'var(--ink)', border: crop === c ? '1px solid var(--primary)' : '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Severity */}
            <div className="fade-up" style={{ animationDelay: '80ms', padding: '0 18px', marginBottom: 20 }}>
                <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</label>
                <div style={{ display: 'flex', gap: 10 }}>
                    {(['mild', 'moderate', 'severe'] as const).map(s => (
                        <button key={s} onClick={() => setSeverity(s)} style={{ flex: 1, padding: '12px', borderRadius: 14, background: severity === s ? (s === 'severe' ? 'var(--danger)' : s === 'moderate' ? 'var(--warning)' : 'var(--primary)') : 'var(--surface)', color: severity === s ? 'white' : 'var(--ink)', border: severity === s ? 'none' : '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product */}
            <div className="fade-up" style={{ animationDelay: '120ms', padding: '0 18px', marginBottom: 24 }}>
                <label style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {PRODUCTS.map(p => (
                        <button key={p.sku} onClick={() => setProductSku(p.sku)} style={{ padding: '12px 16px', borderRadius: 12, background: productSku === p.sku ? 'rgba(46,74,58,0.06)' : 'var(--surface)', color: 'var(--ink)', border: productSku === p.sku ? '1.5px solid var(--primary)' : '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: productSku === p.sku ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calculate button */}
            <div style={{ padding: '0 18px', marginBottom: 20 }}>
                <button onClick={calculate} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', boxShadow: '0 6px 16px rgba(46,74,58,0.28)' }}>
                    {loading ? 'Calculating...' : 'Calculate ROI'}
                </button>
                {error && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--danger)', marginTop: 8 }}>{error}</p>}
            </div>

            {/* Results */}
            {result && (
                <>
                    <div className="fade-up" style={{ margin: '0 18px', padding: '20px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', marginBottom: 16 }}>
                        <Eyebrow color="var(--danger)">WITHOUT TREATMENT</Eyebrow>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 4px' }}>
                            <span style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500, color: 'var(--danger)' }}>₹{(result.yield_loss_without_treatment_inr || 0).toLocaleString()}</span>
                            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>potential loss</span>
                        </div>
                    </div>

                    <div className="fade-up" style={{ animationDelay: '80ms', margin: '0 18px', padding: '20px', background: 'var(--primary)', borderRadius: 20, color: 'white', marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>WITH {PRODUCTS.find(p => p.sku === productSku)?.label?.toUpperCase()}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500 }}>₹{(result.net_roi_inr || 0).toLocaleString()}</span>
                            <span style={{ fontSize: 13, opacity: 0.8 }}>net benefit</span>
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
                            Treatment cost ₹{(result.treatment_cost_inr || 0).toLocaleString()} · ROI {result.roi_ratio?.toFixed(1)}x
                        </div>
                        {result.recommendation && (
                            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 10 }}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{result.recommendation}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '0 18px 24px' }}>
                        <button style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <IShare size={16} /> Share with Farmer
                        </button>
                    </div>
                </>
            )}

            <div style={{ height: 100 }} />
            <BottomNav />
        </div>
    );
}
