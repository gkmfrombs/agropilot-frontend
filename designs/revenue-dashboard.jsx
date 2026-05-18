// Revenue & KPI Dashboard — Manager Console (390px Mobile)
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles for Animations & Charts
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .mono { font-family: 'IBM Plex Mono', monospace; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes progressGrow {
    from { width: 0%; }
    to { width: var(--progress); }
  }
  .progress-bar { animation: progressGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes barGrow {
    from { height: 0%; }
    to { height: var(--h); }
  }
  .bar-chart-rect { animation: barGrow 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: bottom; }

  .glass-header {
    background: rgba(245, 241, 232, 0.85);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border-bottom: 1px solid rgba(229, 220, 201, 0.7);
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
const ITrendingUp = (p) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>;

// Manager Bottom Nav
function BottomNav({ activeId }) {
  const items = [
    { id: 'dash', label: 'KPIs', I: IBarChart, href: '#' },
    { id: 'map', label: 'Heatmap', I: IMap, href: 'territory_heatmap.html' },
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
// Dashboard Screen
// ===================================================================
export default function RevenueDashboard() {
  
  // Mock Chart Data
  const chartData = [
    { m: 'May', val: 0.8 }, { m: 'Jun', val: 0.9 },
    { m: 'Jul', val: 1.2 }, { m: 'Aug', val: 1.5 },
    { m: 'Sep', val: 1.3 }, { m: 'Oct', val: 1.8 } // Current
  ];
  const maxVal = 2.0;

  return (
    <div className="no-scrollbar" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', overflowY: 'auto' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Sticky Header */}
      <div className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 52 }}>
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, margin: 0, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>
              Revenue & KPIs
            </h1>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>
              Northern District · October
            </div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(20,18,12,0.04)' }}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: 44, height: 44, borderRadius: '50%' }} />
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '24px 18px 140px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        
        {/* 1. Hero KPI Card */}
        <div className="fade-up" style={{
          background: 'var(--primary)', borderRadius: 28, padding: '28px 24px',
          boxShadow: '0 12px 32px rgba(46,74,58,0.25)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
             <ITrendingUp size={140} stroke="#fff" />
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: 'var(--primary-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              MTD Revenue
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
              <span className="mono" style={{ fontSize: 44, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>₹1.8</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 600, color: '#fff' }}>Crore</span>
            </div>

            {/* Target Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: '#fff', fontWeight: 600 }}>Target: ₹2.1 Cr</span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--primary-soft)', fontWeight: 600 }}>85%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                <div className="progress-bar" style={{ height: '100%', background: 'var(--accent)', '--progress': '85%', borderRadius: 99 }}/>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Monthly Trend Chart */}
        <div className="fade-up" style={{ animationDelay: '100ms' }}>
          <SectionH>Monthly Trend</SectionH>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '24px 20px', boxShadow: '0 4px 16px rgba(20,18,12,0.03)' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 160, gap: 14, marginTop: 10 }}>
              {chartData.map((d, i) => {
                const hPct = `${(d.val / maxVal) * 100}%`;
                const isCurrent = i === chartData.length - 1;
                return (
                  <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div className="mono" style={{ fontSize: 11, color: isCurrent ? 'var(--primary)' : 'var(--ink-soft)', fontWeight: 700, marginBottom: 8, opacity: isCurrent ? 1 : 0 }}>
                      {d.val}
                    </div>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', background: 'var(--surface-warm)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                       <div className="bar-chart-rect" style={{
                         width: '100%', background: isCurrent ? 'var(--primary)' : 'var(--primary-soft)',
                         '--h': hPct, borderRadius: 8
                       }}/>
                    </div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 12 }}>
                      {d.m}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* 3. Top Performers Split */}
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animationDelay: '150ms' }}>
          
          {/* Top Products */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '20px 16px', boxShadow: '0 4px 16px rgba(20,18,12,0.03)' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Top Products</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[ { n: 'Topik 15 WP', v: '₹42L' }, { n: 'Score 250 EC', v: '₹28L' }, { n: 'Actara 25 WG', v: '₹14L' } ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Fraunces', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.n}</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{p.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Reps */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '20px 16px', boxShadow: '0 4px 16px rgba(20,18,12,0.03)' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Top Reps (MTD)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[ { n: 'Amit Singh', v: '92%' }, { n: 'Ravi Kumar', v: '88%' }, { n: 'Pooja V.', v: '81%' } ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{p.n}</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{p.v}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <BottomNav activeId="dash" />

    </div>
  );
}