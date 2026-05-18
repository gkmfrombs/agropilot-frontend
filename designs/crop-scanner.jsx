// Crop Scanner + Disease Diagnosis — 390px mobile
// Premium Editorial Style

import React, { useState, useEffect } from 'react';

// ===================================================================
// Injected Styles for Animations
// ===================================================================
const injectedStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .fade-in { animation: fadeIn 300ms ease-out both; }

  @keyframes scanLine {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  .scan-line { animation: scanLine 2s cubic-bezier(0.45, 0, 0.55, 1) infinite; }

  @keyframes slightBreathe {
    0%, 100% { transform: scale(1.02); }
    50% { transform: scale(1.05); }
  }
  .live-camera { animation: slightBreathe 8s ease-in-out infinite; transform-origin: center; }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IImage = (p) => <Icon {...p} d={<><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}/>;
const ILightning = (p) => <Icon {...p} d={<><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></>}/>;
const IAlertCircle = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;

// ===================================================================
// Main Component
// ===================================================================
export default function CropScanner() {
  // States: 'viewfinder' | 'scanning' | 'results'
  const [state, setState] = useState('viewfinder');

  const triggerScan = () => {
    setState('scanning');
    setTimeout(() => {
      setState('results');
    }, 2500); // 2.5s scanning simulation
  };

  const resetScan = () => setState('viewfinder');

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: '#000' }}>
      <style>{injectedStyles}</style>
      
      {/* Live Camera Feed (Simulated via Image) */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1582214955357-19e09d17d598?q=80&w=800&auto=format&fit=crop" 
          alt="Leaf" 
          className={state === 'viewfinder' ? 'live-camera' : ''}
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover',
            filter: state === 'results' ? 'blur(8px) brightness(0.6)' : 'brightness(0.9)',
            transition: 'filter 0.5s ease'
          }} 
        />
      </div>

      {/* Viewfinder Cutout Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: state === 'results' ? 'rgba(0,0,0,0.4)' : 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 80%)',
        transition: 'background 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {state !== 'results' && (
          <div className="fade-in" style={{
            width: 260, height: 360, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 24, position: 'relative',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)' // Cutout trick
          }}>
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #fff', borderLeft: '4px solid #fff', borderTopLeftRadius: 24 }}/>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #fff', borderRight: '4px solid #fff', borderTopRightRadius: 24 }}/>
            <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #fff', borderLeft: '4px solid #fff', borderBottomLeftRadius: 24 }}/>
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #fff', borderRight: '4px solid #fff', borderBottomRightRadius: 24 }}/>

            {/* Scanning Laser */}
            {state === 'scanning' && (
              <div className="scan-line" style={{
                position: 'absolute', left: 0, right: 0, height: 4, background: '#25D366',
                boxShadow: '0 0 20px 4px rgba(37,211,102,0.6)', borderRadius: 2, zIndex: 11
              }}/>
            )}
          </div>
        )}
      </div>

      {/* Top Header */}
      <div style={{ position: 'absolute', top: 56, left: 16, right: 16, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={resetScan} style={{ 
          width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <IChevL size={20} />
        </button>
        
        <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: 99, color: '#fff', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
          {state === 'scanning' ? 'Analyzing...' : 'Align leaf in frame'}
        </div>
        
        <button style={{ 
          width: 40, height: 40, borderRadius: 14, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <ILightning size={18} />
        </button>
      </div>

      {/* Bottom Camera Controls */}
      {state !== 'results' && (
        <div className="fade-in" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, zIndex: 20,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 20
        }}>
          <button style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IImage size={20}/></div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600 }}>Gallery</span>
          </button>

          <button onClick={triggerScan} disabled={state === 'scanning'} style={{ 
            width: 76, height: 76, borderRadius: '50%', border: '4px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4,
            transition: 'transform 0.1s'
          }} onMouseDown={e => e.currentTarget.style.transform='scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
            <div style={{ 
              width: '100%', height: '100%', borderRadius: '50%', background: state === 'scanning' ? '#25D366' : '#fff',
              transition: 'background 0.3s'
            }}/>
          </button>

          <div style={{ width: 44 }} /> {/* spacer */}
        </div>
      )}

      {/* Results Bottom Sheet */}
      {state === 'results' && (
        <div className="fade-up" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
          background: 'var(--bg)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', paddingBottom: 34 // Safe area
        }}>
          {/* Paper Grain Overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
          }}/>

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Handle */}
            <div onClick={resetScan} style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 10px', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 5, borderRadius: 99, background: 'var(--border)' }}/>
            </div>

            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ICheckCircle size={12} strokeWidth={2.5}/> 94% Match
                </div>
                <div style={{ background: 'rgba(184, 92, 60, 0.1)', color: 'var(--danger)', padding: '4px 10px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Moderate Risk
                </div>
              </div>

              <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 28, color: 'var(--ink)', margin: '0 0 4px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Wheat Stripe Rust
              </h2>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
                Puccinia striiformis f. sp. tritici
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '16px', marginTop: 24, boxShadow: '0 4px 12px rgba(20,18,12,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}/>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Treatment Plan</h3>
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Apply <strong style={{ color: 'var(--primary)' }}>Tilt 25 EC</strong> or <strong style={{ color: 'var(--primary)' }}>Amistar</strong> immediately at 200ml per acre to prevent spread to upper canopy.
                </p>
                
                <button style={{
                  width: '100%', height: 48, borderRadius: 14, background: 'var(--surface-warm)', border: '1px solid var(--border)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer'
                }}>
                  View Full Protocol & ROI
                </button>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button style={{
                  flex: 1, height: 56, borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, boxShadow: '0 8px 20px rgba(46,74,58,0.25), inset 0 1px 0 rgba(255,255,255,0.18)', cursor: 'pointer'
                }}>
                  Pitch Solution
                </button>
                <button style={{
                  width: 56, height: 56, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,18,12,0.04)'
                }}>
                  <IAlertCircle size={22} stroke="var(--danger)"/>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}