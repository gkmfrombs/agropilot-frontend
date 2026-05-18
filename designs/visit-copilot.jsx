// Visit Copilot — Field Rep App (390px mobile)
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes kenBurns {
    0% { transform: scale(1.02) translate(0, 0); }
    100% { transform: scale(1.10) translate(-1%, -1%); }
  }
  .ken-burns { animation: kenBurns 16s ease-out both; transform-origin: center; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  /* Custom Toggle Switch */
  .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border); transition: .3s; border-radius: 24px; }
  .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  input:checked + .toggle-slider { background-color: var(--primary); }
  input:checked + .toggle-slider:before { transform: translateX(20px); }

  .styled-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-warm); font-family: 'Plus Jakarta Sans'; font-size: 14px; color: var(--ink); transition: border-color 0.2s; }
  .styled-input:focus { border-color: var(--primary); outline: none; }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IMore = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>;
const IEye = (p) => <Icon {...p} d={<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>}/>;
const ISparkles = (p) => <Icon {...p} d={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></>}/>;
const IPhone = (p) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>}/>;
const INav = (p) => <Icon {...p} d={<><polygon points="3 11 22 2 13 21 11 13 3 11"/></>}/>;
const IMessage = (p) => <Icon {...p} d={<><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>}/>;

// ===================================================================
// Main Component
// ===================================================================
export default function VisitCopilot() {
  const [sawCompetitor, setSawCompetitor] = useState(false);
  
  const stockData = [
    { name: 'Topik 15 WP', qty: '12 units', status: 'success' },
    { name: 'Score 250 EC', qty: '0 units', status: 'danger' },
    { name: 'Actara 25 WG', qty: '3 units', status: 'warning' },
    { name: 'Kavach 75 WP', qty: '8 units', status: 'success' },
  ];

  return (
    <div className="no-scrollbar" style={{ width: '100%', height: '100%', overflowY: 'auto', position: 'relative', paddingBottom: 100, background: 'var(--bg)' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Image */}
        <div style={{ position: 'relative', height: 180, width: '100%', overflow: 'hidden' }}>
          <div className="ken-burns" style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=800&auto=format&fit=crop")',
            backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(1.05) contrast(1.04)'
          }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,23,0.18) 0%, rgba(26,26,23,0) 25%, rgba(26,26,23,0.3) 100%)' }}/>
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', background: 'linear-gradient(180deg, rgba(201,151,74,0.10) 0%, rgba(46,74,58,0.10) 100%)' }}/>
        </div>

        {/* Floating Header Actions */}
        <div style={{ position: 'absolute', top: 60, left: 18, right: 18, zIndex: 30, display: 'flex', justifyContent: 'space-between' }}>
          <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(20,18,12,0.18)', color: 'var(--ink)', cursor: 'pointer' }}><IChevL size={18}/></button>
          <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(20,18,12,0.18)', color: 'var(--ink)', cursor: 'pointer' }}><IMore size={18}/></button>
        </div>

        {/* Profile Card */}
        <div className="fade-up" style={{
          margin: '-40px 18px 0', position: 'relative', zIndex: 5, background: 'var(--surface)', borderRadius: 24,
          boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 14px 36px rgba(20,18,12,0.10)', padding: '20px 20px 18px', animationDelay: '80ms',
        }}>
          <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0, fontVariationSettings: '"opsz" 36' }}>
            Baramati <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Agro</span>
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: '6px 0 0', lineHeight: 1.4 }}>Owner: Ramesh Kumar · Sandila Tehsil</p>
          
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-around' }}>
            {[ { I: IPhone, label: 'Call' }, { I: IMessage, label: 'Chat' }, { I: INav, label: 'Navigate' } ].map(({ I, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-warm)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer' }}><I size={18}/></button>
                <span style={{ marginTop: 6, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Previous Visit */}
          <div className="fade-up" style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, animationDelay: '150ms' }}>
            <div style={{ color: 'var(--ink-soft)', marginTop: 2 }}><IEye size={18}/></div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Last visited 7 days ago</div>
              <div style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 15, color: 'var(--ink)', lineHeight: 1.4 }}>Pitched Topik 15WP · Order placed: 5 bags</div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="fade-up" style={{
            background: '#E8F0ED', borderRadius: 20, padding: '18px', border: '1px solid rgba(46,74,58,0.15)', animationDelay: '200ms', boxShadow: '0 8px 24px rgba(46,74,58,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--primary)' }}>
              <ISparkles size={18}/>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommendation</span>
            </div>
            <p style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 17, color: 'var(--primary)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              Based on current stock, crop stage & weather, lead with Topik 15WP. Heading stage opens in 3 days in this tehsil.
            </p>
            <span style={{ display: 'inline-block', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: 'var(--primary)', textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer' }}>Why this recommendation?</span>
          </div>

          {/* Live Stock */}
          <div className="fade-up" style={{ animationDelay: '250ms' }}>
            <h3 style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500, color: 'var(--ink)', margin: '0 0 12px 4px' }}>Live Stock Status</h3>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, margin: '0 -18px', paddingLeft: 18, paddingRight: 18 }}>
              {stockData.map((item, idx) => (
                <div key={idx} style={{ background: `var(--${item.status}-bg)`, border: `1px solid rgba(0,0,0,0.05)`, padding: '12px 16px', borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{item.name}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: `var(--${item.status})`, marginTop: 2, fontWeight: 700 }}>{item.qty}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--${item.status})` }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Talking Points */}
          <div className="fade-up" style={{ animationDelay: '300ms' }}>
            <h3 style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500, color: 'var(--ink)', margin: '0 0 12px 4px' }}>Talking Points</h3>
            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                "Heading stage fungicide window opens in 3 days — apply Topik before first rainfall.",
                "Highlight 12-unit Topik stock to clear inventory quickly during this peak.",
                "Ask about Score 250 EC stockout; offer expedited restock."
              ].map((point, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -21, top: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }}/>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)', lineHeight: 1.45 }}>{point}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Toggle */}
          <div className="fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '16px 20px', animationDelay: '350ms', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Saw competitor products?</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={sawCompetitor} onChange={(e) => setSawCompetitor(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {sawCompetitor && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <input type="text" placeholder="Competitor Brand (e.g., Bayer)" className="styled-input" />
                <input type="text" placeholder="Product Name / Segment" className="styled-input" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingTop: 24, paddingBottom: 24, paddingLeft: 18, paddingRight: 18, background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <button style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.005em', cursor: 'pointer' }}>
            Log Visit Outcome
          </button>
        </div>
      </div>
    </div>
  );
}