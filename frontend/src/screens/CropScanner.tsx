import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IChev, ICamera, TopStrip, BottomNav, Eyebrow, ISpark, Icon } from '../components/Shared';

const ILeaf = (p: any) => <Icon {...p} d={<><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>} />;
const IShare = (p: any) => <Icon {...p} d={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>} />;

const crops = ['Wheat', 'Mustard', 'Chickpea', 'Potato'];

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CropScanner() {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [diagnosis, setDiagnosis] = useState('');
    const [severity, setSeverity] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [recommendation, setRecommendation] = useState('');

    if (scanned) {
        return (
            <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
                <TopStrip />
                
                <div style={{ padding: '14px 18px' }}>
                    <button onClick={() => setScanned(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
                        <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Scan Again</span>
                    </button>
                </div>

                {/* Scan result image */}
                <div style={{ margin: '0 18px', borderRadius: 20, height: 200, background: 'linear-gradient(135deg, #8B7355 0%, #A0926B 100%)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ILeaf size={64} stroke="rgba(255,255,255,0.3)" />
                    </div>
                    <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600 }}>
                        Wheat leaf · Analyzed
                    </div>
                </div>

                {/* Diagnosis */}
                <div className="fade-up" style={{ margin: '16px 18px', padding: '18px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <ISpark size={16} stroke="var(--accent)" />
                        <Eyebrow color="var(--accent)">AI Diagnosis</Eyebrow>
                    </div>
                    <h2 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px' }}>{diagnosis}</h2>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
                        Detected on {selectedCrop.toLowerCase()} leaves. Severity: <strong style={{ color: severity === 'High' ? 'var(--danger)' : 'var(--warning)' }}>{severity}</strong>. Needs attention.
                    </p>
                    
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(212,163,71,0.12)', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: severity === 'High' ? 'var(--danger)' : 'var(--warning)', marginTop: 4 }}>{severity}</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(200,213,187,0.4)', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Confidence</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--primary)', marginTop: 4 }}>{confidence}%</div>
                        </div>
                    </div>
                </div>

                {/* Product recommendation */}
                <div className="fade-up" style={{ animationDelay: '100ms', margin: '0 18px 16px', padding: '16px', background: 'var(--primary)', borderRadius: 16, color: 'white' }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>Recommended Product</div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{recommendation}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, opacity: 0.85, marginBottom: 12 }}>Check guidelines and stock</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link to="/chat" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                            Ask AgroPilot
                        </Link>
                        <Link to="/calculator" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                            Yield Impact
                        </Link>
                    </div>
                </div>

                {/* Share */}
                <div style={{ padding: '0 18px 24px' }}>
                    <button style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <IShare size={16} /> Share via WhatsApp
                    </button>
                </div>

                <div style={{ height: 100 }} />
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <TopStrip />
            
            <div style={{ padding: '18px 18px 12px' }}>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Crop Scanner</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>AI-powered disease diagnosis</p>
            </div>

            {/* Crop Selector */}
            <div style={{ padding: '0 18px 20px' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Select Crop</div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {crops.map(c => (
                        <button key={c} onClick={() => setSelectedCrop(c)} style={{
                            flex: 1, padding: '14px 8px', borderRadius: 14,
                            background: selectedCrop === c ? 'var(--primary)' : 'var(--surface)',
                            color: selectedCrop === c ? 'white' : 'var(--ink)',
                            border: selectedCrop === c ? '1px solid var(--primary)' : '1px solid var(--border)',
                            fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            textAlign: 'center',
                        }}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Camera viewfinder — animated scan */}
            <div className="live-camera" style={{ margin: '0 18px', borderRadius: 24, height: 320, background: 'linear-gradient(180deg, #3a4a30 0%, #2c3a22 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>
                {/* Grid overlay */}
                <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12 }}>
                    <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>
                {/* Scan line */}
                <div className="scan-line" style={{ position: 'absolute', left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, transparent, #C9974A, transparent)', boxShadow: '0 0 8px 2px rgba(201,151,74,0.5)', borderRadius: 1 }} />
                <ILeaf size={48} stroke="rgba(255,255,255,0.3)" />
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Point camera at affected leaf
                </div>
            </div>

            {/* Capture button */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0', position: 'relative' }}>
                <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append('image', file);
                            formData.append('crop_type', selectedCrop);
                            
                            setLoading(true);
                            const token = localStorage.getItem('agro_token');
                            
                            // Show loading state, then fetch
                            fetch(`${BASE}/api/scan/analyze`, {
                                method: 'POST',
                                body: formData,
                                headers: token ? { Authorization: `Bearer ${token}` } : {}
                            })
                            .then(res => res.json())
                            .then(data => {
                                // Set your React state variables with the real diagnosis and confidence!
                                setDiagnosis(data.diagnosis);
                                setSeverity(data.severity);
                                setConfidence(data.confidence);
                                setRecommendation(data.recommendation);
                                setScanned(true);
                            })
                            .catch(err => console.error("Scan error", err))
                            .finally(() => setLoading(false));
                        }
                    }}
                    style={{ position: 'absolute', opacity: 0, width: 72, height: 72, cursor: 'pointer', zIndex: 10 }}
                    aria-label="Take a photo"
                    disabled={loading}
                />
                <button disabled={loading} style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                    {loading ? (
                        <div style={{ width: 26, height: 26, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : (
                        <ICamera size={28} stroke="var(--primary)" />
                    )}
                </button>
            </div>

            <div style={{ height: 100 }} />
            <BottomNav />
        </div>
    );
}
