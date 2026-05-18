// Territory Heatmap — Manager Console (390px Mobile)
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles for Animations & Map Visuals
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .mono { font-family: 'IBM Plex Mono', monospace; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .fade-in { animation: fadeIn 500ms ease-out both; }

  @keyframes heatmapPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%      { opacity: 0.95; transform: scale(1.08); }
  }
  .heatmap-blob { 
    animation: heatmapPulse 3s ease-in-out infinite; transform-origin: center; 
    filter: blur(40px); border-radius: 50%; position: absolute; mix-blend-mode: multiply; 
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1px solid rgba(229, 220, 201, 0.8);
    box-shadow: 0 12px 32px rgba(20, 18, 12, 0.08), 0 2px 4px rgba(20, 18, 12, 0.03);
  }

  .segment-btn {
    padding: 8px 14px; font-size: 13px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink-soft); transition: all 0.2s;
    border-radius: 99px; cursor: pointer; white-space: nowrap;
    display: flex; align-items: center; gap: 6px; border: none;
  }
  .segment-btn.active {
    background: var(--primary); color: white;
    box-shadow: 0 4px 12px rgba(46,74,58,0.25);
  }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style, strokeWidth="1.75" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IMap = (p) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/></>}/>;
const IBarChart = (p) => <Icon {...p} d={<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>}/>;
const IUsers = (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>;
const IMegaphone = (p) => <Icon {...p} d={<><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>}/>;
const IAlertCircle = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;
const ITrendingUp = (p) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>;

// ===================================================================
// Shared Components
// ===================================================================
function BottomNav({ activeId }) {
  const items = [
    { id: 'dash', label: 'KPIs', I: IBarChart, href: 'revenue_dashboard.html' },
    { id: 'map', label: 'Heatmap', I: IMap, href: '#' },
    { id: 'reps', label: 'Team', I: IUsers, href: '#' },
    { id: 'camp', label: 'Campaigns', I: IMegaphone, href: '#' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingBottom: 22, paddingTop: 30, paddingLeft: 14, paddingRight: 14, background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.92) 30%, var(--bg) 62%)', pointerEvents: 'none' }}>
      <div style={{ background: 'var(--surface)', borderRadius: 22, border: '1px solid rgba(229,220,201,0.6)', boxShadow: '0 2px 4px rgba(20,18,12,0.06), 0 18px 40px rgba(20,18,12,0.14)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
        {items.map(({ id, label, I, href }) => {
          const active = id === activeId;
          return (
            <a key={id} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600, color: active ? 'var(--primary)' : 'var(--ink-soft)', cursor: 'pointer', position: 'relative', textDecoration: 'none', transform: active ? 'scale(1.04)' : 'scale(1)', transition: 'all 200ms' }}>
              <I size={22} stroke={active ? '#2E4A3A' : '#6B6A5F'}/>
              <span>{label}</span>
              {active && <span style={{ position: 'absolute', bottom: -4, width: 16, height: 2.5, borderRadius: 99, background: 'var(--primary)' }}/>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================================
// Data Models (Mobile Adjusted)
// ===================================================================
const LAYERS = {
  'pest': {
    id: 'pest', label: 'Pest Risk', color: '#B85C3C', icon: IAlertCircle,
    blobs: [
      { top: '30%', left: '30%', size: 200, opacity: 0.8 },
      { top: '55%', left: '50%', size: 250, opacity: 0.6 },
      { top: '20%', left: '80%', size: 150, opacity: 0.9 },
    ],
    metrics: [
      { label: 'High Risk Zones', val: '3', unit: 'Clusters' },
      { label: 'Affected Acres', val: '14k', unit: 'Est.' },
      { label: 'Alert Volume', val: '+42%', unit: 'w/w' }
    ],
    regions: [
      { name: 'Sandila Tehsil', stat: 'Critical', sub: 'Wheat Rust', color: 'var(--danger)' },
      { name: 'Baramati Hub', stat: 'Elevated', sub: 'Aphids', color: 'var(--warning)' },
    ]
  },
  'sales': {
    id: 'sales', label: 'Sales Volume', color: '#4A6B5D', icon: ITrendingUp,
    blobs: [
      { top: '45%', left: '25%', size: 280, opacity: 0.7 },
      { top: '65%', left: '75%', size: 220, opacity: 0.8 },
    ],
    metrics: [
      { label: 'MTD Revenue', val: '₹1.8', unit: 'Crore' },
      { label: 'Top Product', val: 'Topik', unit: '15 WP' },
      { label: 'Growth', val: '+12%', unit: 'YoY' }
    ],
    regions: [
      { name: 'Hardoi Center', stat: '₹42L', sub: 'Topik, Score', color: 'var(--primary)' },
      { name: 'Sandila Market', stat: '₹28L', sub: 'Kavach', color: 'var(--primary)' },
    ]
  },
  'campaign': {
    id: 'campaign', label: 'Campaigns', color: '#4A7FB8', icon: IMegaphone,
    blobs: [
      { top: '35%', left: '50%', size: 300, opacity: 0.6 },
      { top: '25%', left: '20%', size: 180, opacity: 0.7 },
    ],
    metrics: [
      { label: 'Total Reach', val: '84k', unit: 'Farmers' },
      { label: 'Engagement', val: '12%', unit: 'CTR' },
      { label: 'Active Reps', val: '18', unit: 'in field' }
    ],
    regions: [
      { name: 'Central Belt', stat: 'High', sub: '45k Impr.', color: '#4A7FB8' },
      { name: 'Southern Dist.', stat: 'Low', sub: 'Needs focus', color: 'var(--warning)' }
    ]
  }
};

// ===================================================================
// Main Mobile Screen
// ===================================================================
export default function TerritoryHeatmapMobile() {
  const [activeLayer, setActiveLayer] = useState('pest');
  const data = LAYERS[activeLayer];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#D3DAC9', position: 'relative' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6, zIndex: 5,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* 1. Map Canvas Area */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        
        {/* Topography Map (Mobile Proportions) */}
        <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <path d="M0 0 L390 0 L390 844 L0 844 Z" fill="#D3DAC9" />
          <path d="M-50 100 Q 150 50 250 200 T 450 300 L 450 900 L -50 900 Z" fill="#C2CDB7" />
          <path d="M-20 400 Q 100 350 200 500 T 450 600 L 450 900 L -20 900 Z" fill="#B2C0A5" />
          <path d="M30 0 Q 100 300 80 400 T 150 700 Q 200 800 250 900" fill="none" stroke="#FAF6EC" strokeWidth="6" opacity="0.6"/>
          <path d="M390 200 Q 250 250 280 400 T 150 700" fill="none" stroke="#FAF6EC" strokeWidth="6" opacity="0.6"/>
        </svg>

        {/* Dynamic Heatmap Layer */}
        <div key={activeLayer} className="fade-in" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {data.blobs.map((blob, i) => (
            <div key={i} className="heatmap-blob" style={{
              top: blob.top, left: blob.left,
              width: blob.size, height: blob.size,
              background: `radial-gradient(circle, ${data.color} 0%, transparent 70%)`,
              marginLeft: -(blob.size/2), marginTop: -(blob.size/2),
              opacity: blob.opacity,
              animationDelay: `${i * 1.2}s`
            }}/>
          ))}
        </div>
      </div>

      {/* 2. Top Header (Glass) */}
      <div style={{ position: 'absolute', top: 56, left: 16, right: 16, zIndex: 20 }}>
        <div className="glass-panel fade-up" style={{ padding: '16px 20px', borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 2px 0', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>
              Territory Map
            </h1>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
              Northern District · Today
            </div>
          </div>

          <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {Object.values(LAYERS).map(l => {
              const isActive = activeLayer === l.id;
              return (
                <button key={l.id} onClick={() => setActiveLayer(l.id)} className={`segment-btn ${isActive ? 'active' : ''}`} style={{
                  background: isActive ? l.color : 'rgba(255,255,255,0.6)', border: isActive ? 'none' : '1px solid var(--border)'
                }}>
                  <l.icon size={14} /> {l.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Data Sheet */}
      <div style={{ position: 'absolute', bottom: 96, left: 16, right: 16, zIndex: 20 }}>
        <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, animationDelay: '100ms' }}>
          
          {/* Horizontal Metrics */}
          <div className="no-scrollbar" style={{ display: 'flex', gap: 24, overflowX: 'auto' }}>
            {data.metrics.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {m.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{m.val}</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(229, 220, 201, 0.6)' }}/>

          {/* Regions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: data.color }}/>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', margin: 0 }}>
                Key Regions
              </h3>
            </div>
            
            {data.regions.map((reg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{reg.name}</div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 500 }}>{reg.sub}</div>
                </div>
                <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: reg.color }}>
                  {reg.stat}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      <BottomNav activeId="map" />

    </div>
  );
}