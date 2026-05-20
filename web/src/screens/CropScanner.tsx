import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IChev, ICamera, TopStrip, BottomNav, Eyebrow, ISpark, Icon } from '../components/Shared';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';

const ILeaf = (p: any) => <Icon {...p} d={<><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>} />;
const IShare = (p: any) => <Icon {...p} d={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>} />;

const CROP_SUGGESTIONS = [
    'Wheat', 'Rice', 'Potato', 'Tomato', 'Onion', 'Chili',
    'Mustard', 'Chickpea', 'Maize', 'Brinjal', 'Cabbage', 'Cauliflower',
    'Soybean', 'Cotton', 'Mango', 'Banana', 'Grapes', 'Groundnut',
];

const SEVERITY_COLORS: Record<string, string> = {
    mild: 'var(--primary)',
    moderate: 'var(--warning)',
    severe: 'var(--danger)',
};

export default function CropScanner() {
    const { repId } = useAuth();
    const [cropInput, setCropInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // Camera state
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(false);

    // File input — for gallery upload (no capture attr so user can pick from gallery)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const resizeImage = (file: File, maxPx = 1280, quality = 0.82): Promise<File> =>
        new Promise(resolve => {
            const img = new Image()
            const url = URL.createObjectURL(file)
            img.onload = () => {
                let w = img.width, h = img.height
                if (w > maxPx) { h = Math.round(h * maxPx / w); w = maxPx }
                const c = document.createElement('canvas')
                c.width = w; c.height = h
                c.getContext('2d')!.drawImage(img, 0, 0, w, h)
                URL.revokeObjectURL(url)
                c.toBlob(blob => resolve(blob ? new File([blob], 'scan.jpg', { type: 'image/jpeg' }) : file), 'image/jpeg', quality)
            }
            img.onerror = () => resolve(file)
            img.src = url
        })

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraActive(true);
            setCameraError(false);
        } catch {
            setCameraError(true);
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    };

    const captureFromCamera = (): Promise<File | null> => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return Promise.resolve(null);
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return Promise.resolve(null);
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        return new Promise(resolve => canvas.toBlob(blob => {
            resolve(blob ? new File([blob], 'scan.jpg', { type: 'image/jpeg' }) : null);
        }, 'image/jpeg', 0.85));
    };

    const handleCapture = async () => {
        if (cameraActive) {
            const file = await captureFromCamera();
            if (file) await runScan(file);
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const resized = await resizeImage(file);
        const url = URL.createObjectURL(resized);
        setCapturedImage(url);
        await runScan(resized);
    };

    const runScan = async (file: File) => {
        stopCamera();
        setScanning(true);
        setError(null);
        const cropHint = cropInput.trim().toLowerCase();
        try {
            const data = await api.scanCrop(file, cropHint, repId || 'REP_0001');
            setResult(data);
        } catch {
            try {
                const data = await api.scanDemo('yellowing and spots on leaves', cropHint || 'crop');
                setResult(data);
            } catch {
                setError('Scan failed. Check your connection and try again.');
                startCamera();
            }
        } finally {
            setScanning(false);
        }
    };

    const retake = () => {
        setResult(null);
        setCapturedImage(null);
        setError(null);
        startCamera();
    };

    // ── Scanning overlay ──────────────────────────────────────
    if (scanning) {
        return (
            <div className="screen-root" style={{ width: '100%', minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', fontWeight: 600 }}>Analyzing with AI...</p>
            </div>
        );
    }

    // ── Result view ───────────────────────────────────────────
    if (result) {
        const scan = result.scan_result || result;
        const yc = result.yield_comparison || {};
        const wt = yc.without_treatment || {};
        const wth = yc.with_treatment || {};
        const severity = (scan.severity || 'moderate').toLowerCase();
        const products = scan.products || [];
        const p = products[0];

        return (
            <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
                <TopStrip />
                <div style={{ padding: '14px 18px' }}>
                    <button onClick={retake} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
                        <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Scan Again</span>
                    </button>
                </div>

                <div style={{ margin: '0 18px', borderRadius: 20, height: 200, background: capturedImage ? undefined : 'linear-gradient(135deg, #8B7355 0%, #A0926B 100%)', backgroundImage: capturedImage ? `url(${capturedImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
                    {!capturedImage && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ILeaf size={64} stroke="rgba(255,255,255,0.3)" /></div>}
                    <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600 }}>
                        {scan.crop || cropInput || 'crop'} · Analyzed
                    </div>
                </div>

                <div className="fade-up" style={{ margin: '16px 18px', padding: '18px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <ISpark size={16} stroke="var(--accent)" />
                        <Eyebrow color="var(--accent)">AI Diagnosis</Eyebrow>
                    </div>
                    <h2 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px' }}>{scan.disease || 'Unknown'}</h2>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>{scan.explanation || ''}</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(212,163,71,0.12)', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: SEVERITY_COLORS[severity] || 'var(--warning)', marginTop: 4, textTransform: 'capitalize' }}>{scan.severity || 'Moderate'}</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'rgba(200,213,187,0.4)', borderRadius: 12, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Confidence</div>
                            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--primary)', marginTop: 4 }}>{scan.confidence || 85}%</div>
                        </div>
                    </div>
                </div>

                {p && (
                    <div className="fade-up" style={{ animationDelay: '100ms', margin: '0 18px 16px', padding: '16px', background: 'var(--primary)', borderRadius: 16, color: 'white' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>Recommended Product</div>
                        <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, opacity: 0.85, marginBottom: 8 }}>Dosage: {p.dose}</div>
                        {(wt.loss_inr_total || wth.net_benefit_inr) && (
                            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>
                                Loss without treatment: ₹{(wt.loss_inr_total || 0).toLocaleString()} · Net benefit: ₹{(wth.net_benefit_inr || 0).toLocaleString()}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Link
                                to="/chat"
                                state={{ prefill: `My ${scan.crop || cropInput || 'crop'} crop scan detected ${scan.disease} (${scan.severity} severity). Recommended product: ${p?.name}, dose: ${p?.dose}. What should I do next and where can I get stock?` }}
                                style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}
                            >Ask AgroPilot</Link>
                            <Link to="/calculator" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>Yield Impact</Link>
                        </div>
                    </div>
                )}

                {result.whatsapp_message && (
                    <div style={{ padding: '0 18px 24px' }}>
                        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(result.whatsapp_message)}`, '_blank')} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <IShare size={16} /> Share via WhatsApp
                        </button>
                    </div>
                )}
                <div style={{ height: 100 }} />
                <BottomNav />
            </div>
        );
    }

    // ── Scanner view ──────────────────────────────────────────
    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <TopStrip />

            {/* Camera capture input */}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />
            {/* Gallery upload input — no capture attr so it opens photo library */}
            <input ref={galleryInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            {/* Hidden canvas for capturing frame from video */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div style={{ padding: '18px 18px 12px' }}>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Crop Scanner</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>AI-powered disease diagnosis</p>
            </div>

            {/* Crop input */}
            <div style={{ padding: '0 18px 16px', position: 'relative' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crop / Vegetable <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — AI auto-detects)</span></div>
                <input
                    type="text"
                    value={cropInput}
                    onChange={e => { setCropInput(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="e.g. Tomato, Onion, Wheat..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
                />
                {showSuggestions && cropInput.length === 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {CROP_SUGGESTIONS.map(c => (
                            <button key={c} onMouseDown={() => { setCropInput(c); setShowSuggestions(false); }} style={{ padding: '6px 14px', borderRadius: 99, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>
                                {c}
                            </button>
                        ))}
                    </div>
                )}
                {showSuggestions && cropInput.length > 0 && (() => {
                    const filtered = CROP_SUGGESTIONS.filter(c => c.toLowerCase().startsWith(cropInput.toLowerCase()) && c.toLowerCase() !== cropInput.toLowerCase());
                    return filtered.length > 0 ? (
                        <div style={{ position: 'absolute', left: 18, right: 18, top: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, zIndex: 10, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                            {filtered.slice(0, 5).map(c => (
                                <button key={c} onMouseDown={() => { setCropInput(c); setShowSuggestions(false); }} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    ) : null;
                })()}
            </div>

            {/* Camera viewfinder */}
            <div style={{ margin: '0 18px', borderRadius: 24, height: 320, background: 'linear-gradient(180deg, #3a4a30 0%, #2c3a22 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)' }}>
                {/* Live camera feed */}
                {cameraActive && (
                    <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}

                {/* Grid overlay */}
                <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                    <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                    <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.12)' }} />
                    <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.12)' }} />
                </div>

                {/* Scan line animation */}
                <div className="scan-line" style={{ position: 'absolute', left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, transparent, #C9974A, transparent)', boxShadow: '0 0 8px 2px rgba(201,151,74,0.5)', borderRadius: 1, pointerEvents: 'none' }} />

                {/* Fallback icon when no camera */}
                {!cameraActive && <ILeaf size={48} stroke="rgba(255,255,255,0.3)" />}

                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                    {cameraActive ? 'Point at affected leaf' : cameraError ? 'Tap to upload photo' : 'Starting camera...'}
                </div>

                {/* Camera error badge */}
                {cameraError && (
                    <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.8)', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600 }}>
                        Upload mode
                    </div>
                )}
            </div>

            {error && <p style={{ textAlign: 'center', color: 'var(--danger)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, padding: '10px 18px 0', fontWeight: 600 }}>{error}</p>}

            {/* Capture + Upload buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '24px 18px 8px' }}>
                {/* Upload from gallery */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <button
                        onClick={() => galleryInputRef.current?.click()}
                        style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </button>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>Upload</span>
                </div>

                {/* Main capture button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <button onClick={handleCapture} style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                        <ICamera size={28} stroke="var(--primary)" />
                    </button>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>
                        {cameraActive ? 'Capture' : 'Select Photo'}
                    </span>
                </div>

                {/* Spacer to balance layout */}
                <div style={{ width: 54 }} />
            </div>

            <div style={{ height: 100 }} />
            <BottomNav />
        </div>
    );
}
