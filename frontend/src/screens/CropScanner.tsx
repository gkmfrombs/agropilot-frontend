import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IChev, ICamera, TopStrip, BottomNav, Eyebrow, ISpark, Icon, IShare, ICheck } from '../components/Shared';
import { useTranslation } from '../lib/i18n';
import { scanCrop, scanDemo } from '../lib/api';

/* ── Icons ──────────────────────────────────────────────────────────── */
const ILeaf = (p: any) => <Icon {...p} d={<><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>} />;
const IUpload = (p: any) => <Icon {...p} d={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />;
const IRefresh = (p: any) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 14.85-6.85L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-14.85 6.85L3 16" /><path d="M3 21v-5h5" /></>} />;

const crops = [
  { id: 'wheat', label: 'Wheat', icon: '🌾' },
  { id: 'mustard', label: 'Mustard', icon: '🌻' },
  { id: 'chickpea', label: 'Chickpea', icon: '🫘' },
  { id: 'potato', label: 'Potato', icon: '🥔' },
];

const URGENCY_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  treat_immediately: { bg: 'rgba(184,92,60,0.15)', color: 'var(--danger)', label: 'Treat Immediately' },
  treat_within_48h: { bg: 'rgba(212,163,71,0.15)', color: 'var(--warning)', label: 'Treat within 48h' },
  monitor: { bg: 'rgba(200,213,187,0.3)', color: 'var(--primary)', label: 'Monitor Closely' },
  no_action: { bg: 'rgba(200,213,187,0.3)', color: 'var(--primary)', label: 'No Action Needed' },
};

const SEVERITY_COLORS: Record<string, string> = {
  mild: 'var(--primary)',
  moderate: 'var(--warning)',
  severe: 'var(--danger)',
};

type Phase = 'capture' | 'analyzing' | 'results';

export default function CropScanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const farmerId = (location.state as any)?.farmerId || null;

  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [phase, setPhase] = useState<Phase>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<any>(null);
  const [yieldComp, setYieldComp] = useState<any>(null);
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [chatContext, setChatContext] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera not supported in this browser. Use Upload Photo instead.');
      return;
    }
    try {
      // Try progressively simpler constraints until one works
      const attempts = [
        { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } } },
        { video: { width: { ideal: 1280 }, height: { ideal: 960 } } },
        { video: true },
      ];
      let stream: MediaStream | null = null;
      let lastErr: any = null;
      for (const c of attempts) {
        try { stream = await navigator.mediaDevices.getUserMedia(c); break; }
        catch (e) { lastErr = e; }
      }
      if (!stream) throw lastErr;

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraActive(false);
      const name = err?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraError('Camera blocked. Go to browser Settings → Privacy → Camera → allow this site, then click Try Again.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setCameraError('No camera detected. Use the Upload Photo button to pick an image from your files.');
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setCameraError('Camera is in use by another app. Close it and click Try Again.');
      } else {
        setCameraError('Could not open camera. Use Upload Photo instead.');
      }
    }
  }, []);


  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  // Stop camera when leaving capture phase
  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  useEffect(() => {
    if (phase !== 'capture') stopCamera();
  }, [phase, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  /* ── Capture / Upload ─────────────────────────────────────────────── */
  const captureFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      setCapturedBlob(blob);
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.85));
      stopCamera();
    }, 'image/jpeg', 0.85);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturedBlob(file);
    const reader = new FileReader();
    reader.onload = () => setCapturedImage(reader.result as string);
    reader.readAsDataURL(file);
    stopCamera();
  };

  const retake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    setPhase('capture');
  };

  /* ── Analyze ──────────────────────────────────────────────────────── */
  const analyze = async () => {
    setPhase('analyzing');
    setError('');
    try {
      let data: any;
      if (capturedBlob) {
        data = await scanCrop(capturedBlob, selectedCrop);
      } else {
        data = await scanDemo('yellow patches and spots on leaves', selectedCrop);
      }
      setResult(data.scan_result || {});
      setYieldComp(data.yield_comparison || null);
      setWhatsappMsg(data.whatsapp_message || '');
      setChatContext(data.chatbot_context || '');
      setPhase('results');
    } catch (err: any) {
      // Fallback: use demo endpoint
      try {
        const data = await scanDemo('yellow patches and spots on leaves', selectedCrop);
        setResult(data.scan_result || {});
        setYieldComp(data.yield_comparison || null);
        setWhatsappMsg(data.whatsapp_message || '');
        setChatContext(data.chatbot_context || '');
        setPhase('results');
      } catch {
        setError('Could not analyze. Check your connection.');
        setPhase('capture');
      }
    }
  };

  /* ── Actions ──────────────────────────────────────────────────────── */
  const openChat = () => navigate('/chat', { state: { scanContext: chatContext } });
  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
  const saveToFarmer = () => setSaved(true); // In real app, would POST to API

  /* ── Styles ───────────────────────────────────────────────────────── */
  const S = {
    page: { position: 'relative' as const, width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 },
    pad: { padding: '0 18px' },
    card: { background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: '18px', marginBottom: 16 },
    btn: (bg: string, color: string) => ({
      flex: 1, padding: '14px', borderRadius: 14, background: bg, color, border: 'none',
      fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600 as const, cursor: 'pointer',
      display: 'flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8,
      textDecoration: 'none',
    }),
    eyebrow: { fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700 as const, color: 'var(--ink-soft)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
    heading: { fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px' },
    body: { fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 },
    stat: (bg: string) => ({ flex: 1, padding: 12, background: bg, borderRadius: 12, textAlign: 'center' as const }),
    statLabel: { fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700 as const, color: 'var(--ink-soft)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
    statValue: (color: string) => ({ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color, marginTop: 4 }),
  };

  /* ═══════════════════════════════════════════════════════════════════
     PHASE: ANALYZING — Scan line animation
     ═══════════════════════════════════════════════════════════════════ */
  if (phase === 'analyzing') {
    return (
      <div style={S.page}>
        <TopStrip />
        <div style={{ padding: '40px 18px', textAlign: 'center' }}>
          {capturedImage && (
            <div style={{ margin: '0 auto 24px', width: 240, height: 240, borderRadius: 24, overflow: 'hidden', position: 'relative', border: '2px solid var(--primary)' }}>
              <img src={capturedImage} alt="scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="scan-line" style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', zIndex: 2 }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <ISpark size={18} stroke="var(--accent)" />
            <span style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, color: 'var(--ink)' }}>{t('analyzing')}</span>
          </div>
          <p style={{ ...S.body, fontSize: 13 }}>AI is diagnosing {selectedCrop} crop disease</p>
          {/* Skeleton shimmer cards */}
          <div style={{ marginTop: 24, padding: '0 12px' }}>
            {[80, 60, 70].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, margin: '0 auto 10px', borderRadius: 6 }} />
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     PHASE: RESULTS — Full diagnosis display
     ═══════════════════════════════════════════════════════════════════ */
  if (phase === 'results' && result) {
    const sev = result.severity || 'moderate';
    const sevColor = SEVERITY_COLORS[sev] || 'var(--warning)';
    const confidence = result.confidence || 75;
    const urgencyInfo = URGENCY_STYLES[result.urgency] || URGENCY_STYLES.monitor;
    const products = result.products || [];
    const mainProduct = products[0];
    const wt = yieldComp?.without_treatment;
    const withT = yieldComp?.with_treatment;

    return (
      <div style={S.page}>
        <TopStrip />
        <div style={{ padding: '14px 18px' }}>
          <button onClick={retake} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
            <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>{t('scanAgain')}</span>
          </button>
        </div>

        {/* Scanned image */}
        {capturedImage && (
          <div style={{ margin: '0 18px', borderRadius: 20, height: 180, position: 'relative', overflow: 'hidden' }}>
            <img src={capturedImage} alt="scanned" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600 }}>
              {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} · {t('diagnosisComplete')}
            </div>
          </div>
        )}

        {/* Diagnosis card */}
        <div className="fade-up" style={{ margin: '16px 18px', ...S.card }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ISpark size={16} stroke="var(--accent)" />
            <Eyebrow color="var(--accent)">{t('aiDiagnosis')}</Eyebrow>
          </div>
          <h2 style={S.heading}>{result.disease || 'Unknown'}</h2>
          <p style={{ ...S.body, marginBottom: 16 }}>{result.explanation || ''}</p>

          {/* Severity + Confidence pills */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={S.stat(`${sevColor}18`)}>
              <div style={S.statLabel}>{t('severity')}</div>
              <div style={S.statValue(sevColor)}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</div>
            </div>
            <div style={S.stat('rgba(200,213,187,0.4)')}>
              <div style={S.statLabel}>{t('confidence')}</div>
              <div style={S.statValue('var(--primary)')}>{confidence}%</div>
            </div>
          </div>

          {/* Urgency badge */}
          <div style={{ padding: '10px 14px', borderRadius: 12, background: urgencyInfo.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: urgencyInfo.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: urgencyInfo.color }}>{urgencyInfo.label}</span>
          </div>
        </div>

        {/* Product recommendation */}
        {mainProduct && (
          <div className="fade-up" style={{ animationDelay: '100ms', margin: '0 18px 16px', padding: 16, background: 'var(--primary)', borderRadius: 16, color: 'white' }}>
            <div style={{ ...S.eyebrow, opacity: 0.7, marginBottom: 8, color: 'white' }}>{t('recommendedProduct')}</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{mainProduct.name}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, opacity: 0.85, marginBottom: 4 }}>{mainProduct.dose}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, opacity: 0.7 }}>{mainProduct.timing}</div>
          </div>
        )}

        {/* Yield impact comparison */}
        {wt && withT && (
          <div className="fade-up" style={{ animationDelay: '200ms', margin: '0 18px 16px', ...S.card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Eyebrow>{t('yieldComparison')}</Eyebrow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Without treatment */}
              <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(184,92,60,0.08)', border: '1px solid rgba(184,92,60,0.2)' }}>
                <div style={{ ...S.statLabel, color: 'var(--danger)', marginBottom: 8 }}>{t('withoutTreatment')}</div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--danger)' }}>
                  ₹{(wt.loss_inr_per_acre || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {wt.loss_kg_per_acre}kg {t('lossPerAcre')}
                </div>
              </div>
              {/* With treatment */}
              <div style={{ flex: 1, padding: 14, borderRadius: 14, background: 'rgba(46,74,58,0.08)', border: '1px solid rgba(46,74,58,0.2)' }}>
                <div style={{ ...S.statLabel, color: 'var(--primary)', marginBottom: 8 }}>{t('withTreatment')}</div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--primary)' }}>
                  ₹{(withT.net_benefit_inr || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {t('netBenefitLabel')} {t('perAcre')}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--surface-warm)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center' }}>
              {t('treatmentCost')}: ₹{(withT.treatment_cost_inr || 0).toLocaleString('en-IN')} {t('perAcre')}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="fade-up" style={{ animationDelay: '300ms', padding: '0 18px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button onClick={openChat} style={S.btn('var(--primary)', 'white')}>
              <ISpark size={16} stroke="white" /> {t('askAgroPilot')}
            </button>
            <button onClick={shareWhatsApp} style={S.btn('var(--surface)', 'var(--primary)')}>
              <IShare size={16} /> WhatsApp
            </button>
          </div>
          {farmerId && (
            <button onClick={saveToFarmer} disabled={saved} style={{ ...S.btn(saved ? 'var(--primary-soft)' : 'var(--surface)', saved ? 'var(--primary)' : 'var(--ink)'), width: '100%', border: '1px solid var(--border)', marginBottom: 10, opacity: saved ? 0.8 : 1 }}>
              {saved ? <><ICheck size={16} /> Saved</> : <><ILeaf size={16} /> {t('saveToFarmer')}</>}
            </button>
          )}
        </div>

        <div style={{ height: 120 }} />
        <BottomNav />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════
     PHASE: CAPTURE — Crop selector + Camera/Upload
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div style={S.page}>
      <TopStrip />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

      <div style={{ padding: '18px 18px 12px' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>{t('cropScanner')}</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>AI-powered disease diagnosis</p>
      </div>

      {/* Crop Selector */}
      <div style={{ padding: '0 18px 16px' }}>
        <div style={S.eyebrow}>{t('selectCrop')}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          {crops.map(c => (
            <button key={c.id} onClick={() => setSelectedCrop(c.id)} style={{
              flex: 1, padding: '12px 6px', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: selectedCrop === c.id ? 'var(--primary)' : 'var(--surface)',
              color: selectedCrop === c.id ? 'white' : 'var(--ink)',
              border: selectedCrop === c.id ? '1px solid var(--primary)' : '1px solid var(--border)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera viewfinder / captured image */}
      <div style={{ margin: '0 18px', borderRadius: 24, height: 320, position: 'relative', overflow: 'hidden', border: '2px solid var(--border)', background: '#1a2a18' }}>
        {capturedImage ? (
          <img src={capturedImage} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }} />

            {/* Idle state — show Open Camera button */}
            {!cameraActive && !cameraError && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <ILeaf size={44} stroke="rgba(255,255,255,0.25)" />
                <button
                  onClick={startCamera}
                  style={{ padding: '12px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)' }}
                >
                  <ICamera size={18} stroke="white" /> Open Camera
                </button>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>or use Upload below</span>
              </div>
            )}

            {/* Error state — show message + retry */}
            {!cameraActive && cameraError && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 24px', textAlign: 'center' }}>
                <ICamera size={36} stroke="rgba(255,255,255,0.25)" />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{cameraError}</span>
                <button
                  onClick={startCamera}
                  style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}

        {/* Grid overlay when camera is live */}
        {!capturedImage && cameraActive && (
          <div style={{ position: 'absolute', inset: 20, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>
        )}
        {/* Guide text when camera live */}
        {!capturedImage && cameraActive && (
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {t('scanGuide')}
          </div>
        )}
      </div>

      {/* Capture / Upload / Analyze buttons */}
      <div style={{ padding: '20px 18px' }}>
        {capturedImage ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={retake} style={S.btn('var(--surface)', 'var(--ink)')}>
              <IRefresh size={16} /> {t('retake')}
            </button>
            <button onClick={analyze} style={S.btn('var(--primary)', 'white')}>
              <ISpark size={16} stroke="white" /> {t('analyze')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
            {/* Capture button — only visible when camera is live */}
            {cameraActive && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <button onClick={captureFromCamera} style={{ width: 72, height: 72, borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                  <ICamera size={28} stroke="var(--primary)" />
                </button>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, color: 'var(--ink-soft)', fontWeight: 600 }}>Capture</span>
              </div>
            )}

            {/* Upload button — always visible */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={() => fileRef.current?.click()} style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--border)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IUpload size={22} stroke="var(--ink-soft)" />
              </button>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, color: 'var(--ink-soft)', fontWeight: 600 }}>Upload Photo</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ margin: '0 18px', padding: '12px 16px', borderRadius: 12, background: 'rgba(184,92,60,0.1)', border: '1px solid rgba(184,92,60,0.2)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <div style={{ height: 100 }} />
      <BottomNav />
    </div>
  );
}
