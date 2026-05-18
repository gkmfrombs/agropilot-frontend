// Retailer Profile screen — 390px mobile
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles for Animations
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .mono { font-family: 'IBM Plex Mono', monospace; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes kenBurns {
    0% { transform: scale(1.02) translate(0, 0); }
    100% { transform: scale(1.10) translate(-1%, -1%); }
  }
  .ken-burns { animation: kenBurns 20s ease-out both; transform-origin: center; }

  .glass-header {
    background: rgba(245, 241, 232, 0.85);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border-bottom: 1px solid rgba(229, 220, 201, 0.7);
  }

  .tab-btn {
    padding: 10px 16px; font-size: 13.5px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink-soft); white-space: nowrap; transition: color 0.2s;
    position: relative; background: transparent; border: none; cursor: pointer;
  }
  .tab-btn.active { color: var(--ink); }
  .tab-btn.active::after {
    content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
    height: 3px; background: var(--primary); border-top-left-radius: 3px; border-top-right-radius: 3px;
  }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style, strokeWidth = "1.75" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IMore = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>;
const IPhone = (p) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>}/>;
const IMessage = (p) => <Icon {...p} d={<><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>}/>;
const INav = (p) => <Icon {...p} d={<><polygon points="3 11 22 2 13 21 11 13 3 11"/></>}/>;
const IStore = (p) => <Icon {...p} d={<><path d="m2 7 4.04-4.04c.59-.59 1.62-.59 2.22 0l3.05 3.05c.59.59 1.62.59 2.22 0l3.05-3.05c.59-.59 1.62-.59 2.22 0L22 7"/><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M12 22V10"/><path d="M7 22v-6h10v6"/></>}/>;
const ISparkles = (p) => <Icon {...p} d={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></>}/>;
const ITrendingUp = (p) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>;

// ===================================================================
// Shared Components
// ===================================================================
function SectionH({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16, padding: '0 2px' }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }}/>
      <h2 style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0, fontVariationSettings: '"opsz" 18' }}>
        {children}
      </h2>
    </div>
  );
}

// ===================================================================
// Main Component
// ===================================================================
export default function RetailerProfile() {
  const [activeTab, setActiveTab] = useState('Overview');

  const INVENTORY = [
    { name: 'Topik 15 WP', qty: '24 boxes', status: 'success' },
    { name: 'Score 250 EC', qty: 'Out of Stock', status: 'danger' },
    { name: 'Actara 25 WG', qty: '4 boxes', status: 'warning' },
    { name: 'Kavach 75 WP', qty: '18 boxes', status: 'success' },
  ];

  return (
    <div className="no-scrollbar" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', overflowY: 'auto' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Hero Banner */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260, zIndex: 1, overflow: 'hidden', background: '#2c3a22' }}>
        <div className="ken-burns" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=800&auto=format&fit=crop")', // Retail/warehouse vibe
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(1.1) brightness(0.95)'
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,23,0.3) 0%, rgba(26,26,23,0) 40%, rgba(245,241,232,1) 100%)' }}/>
      </div>

      {/* Floating Header Actions */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 56, paddingLeft: 18, paddingRight: 18, display: 'flex', justifyContent: 'space-between', paddingBottom: 16 }}>
        <button style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(229,220,201,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(20,18,12,0.1)', color: 'var(--ink)', cursor: 'pointer' }}><IChevL size={20}/></button>
        <button style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(229,220,201,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(20,18,12,0.1)', color: 'var(--ink)', cursor: 'pointer' }}><IMore size={20}/></button>
      </div>

      <div style={{ position: 'relative', zIndex: 2, paddingTop: 40, paddingBottom: 140 }}>
        
        {/* Main Profile Card */}
        <div className="fade-up" style={{ padding: '0 18px', animationDelay: '50ms' }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 28, padding: '24px 24px 20px',
            boxShadow: '0 12px 32px rgba(20,18,12,0.06), 0 1px 2px rgba(20,18,12,0.04)',
            position: 'relative'
          }}>
            {/* Category Badge */}
            <div style={{ position: 'absolute', top: -14, right: 24, background: 'var(--accent)', color: '#fff', padding: '6px 14px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(201,151,74,0.3)' }}>
              Category A
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--primary)', marginBottom: 8 }}>
              <IStore size={18} strokeWidth={2}/>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key Retailer</span>
            </div>
            
            <h1 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 6px 0', fontVariationSettings: '"opsz" 36' }}>
              Kisan Agro Center
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', margin: 0, fontWeight: 500 }}>
              Prop. Rajesh Patil · Sandila Market
            </p>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-around' }}>
              {[ { I: IPhone, label: 'Call' }, { I: IMessage, label: 'Message' }, { I: INav, label: 'Navigate' } ].map(({ I, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--surface-warm)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: 'inset 0 2px 4px rgba(20,18,12,0.02)' }}><I size={20}/></div>
                  <span style={{ marginTop: 8, fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Tabs */}
        <div className="glass-header no-scrollbar" style={{ position: 'sticky', top: 104, zIndex: 40, display: 'flex', gap: 8, overflowX: 'auto', padding: '0 8px', marginTop: 16 }}>
          {['Overview', 'Inventory', 'Orders', 'Credit'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* AI Recommendation */}
            <div className="fade-up" style={{
              background: '#E8F0ED', borderRadius: 24, padding: '20px', border: '1px solid rgba(46,74,58,0.15)',
              boxShadow: '0 8px 24px rgba(46,74,58,0.06)', animationDelay: '100ms'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--primary)' }}>
                <ISparkles size={18}/>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Restock Alert</span>
              </div>
              <p style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 17, color: 'var(--primary)', lineHeight: 1.45, margin: '0 0 14px 0' }}>
                Score 250 EC is stocked out. High demand predicted due to wheat rust outbreak in Sandila. Recommend pitching 20 boxes today.
              </p>
              <button style={{ padding: '10px 16px', borderRadius: 12, background: 'var(--primary)', color: '#fff', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(46,74,58,0.2)' }}>
                Add to Order Draft
              </button>
            </div>

            {/* Business Health */}
            <div className="fade-up" style={{ animationDelay: '150ms' }}>
              <SectionH>Business Health</SectionH>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '16px', boxShadow: '0 2px 8px rgba(20,18,12,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YTD Sales</div>
                    <ITrendingUp size={16} stroke="var(--success)"/>
                  </div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>₹12.4<span style={{ fontSize: 14 }}>L</span></div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>+14% vs last yr</div>
                </div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '16px', boxShadow: '0 2px 8px rgba(20,18,12,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Credit</div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', marginTop: 4 }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>₹1.8<span style={{ fontSize: 14 }}>L</span></div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500, marginTop: 4 }}>of ₹5.0L Limit</div>
                </div>
              </div>
            </div>

            {/* Key Inventory */}
            <div className="fade-up" style={{ animationDelay: '200ms' }}>
              <SectionH>Key SKUs</SectionH>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '8px 16px', boxShadow: '0 2px 8px rgba(20,18,12,0.02)' }}>
                {INVENTORY.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 0', borderBottom: idx !== INVENTORY.length - 1 ? '1px solid var(--border)' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: `var(--${item.status})` }}/>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{item.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: item.status === 'danger' ? 'var(--danger)' : 'var(--ink-soft)' }}>
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab !== 'Overview' && (
          <div className="fade-up" style={{ padding: '40px 18px', textAlign: 'center', color: 'var(--ink-soft)' }}>
            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500 }}>{activeTab} Module</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, marginTop: 6 }}>Detailed view coming soon.</div>
          </div>
        )}

      </div>

      {/* Sticky Action Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
        padding: '24px 18px 32px', display: 'flex', gap: 12, pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 12, width: '100%' }}>
          <button style={{
            flex: 1, height: 60, borderRadius: 18,
            background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(46,74,58,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Log Retailer Visit
          </button>
        </div>
      </div>

    </div>
  );
}