// Campaign Performance — Manager Console
// Responsive/Fluid Layout
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles
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

  .glass-header {
    background: rgba(245, 241, 232, 0.85);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    border-bottom: 1px solid rgba(229, 220, 201, 0.7);
  }

  .app-container {
    width: 100vw; height: 100vh; height: 100dvh;
    background: var(--bg); position: relative;
    display: flex; flex-direction: column;
    overflow-y: auto; overflow-x: hidden;
  }
  
  .content-wrapper {
    width: 100%; max-width: 800px; margin: 0 auto;
    padding: 24px 16px 140px; position: relative; z-index: 2;
  }

  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .funnel-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
  
  @media (min-width: 600px) {
    .kpi-grid { grid-template-columns: 1fr 1fr 1fr 1fr; }
    .funnel-grid { grid-template-columns: repeat(5, 1fr); gap: 12px; }
    
    .funnel-arrow-mobile { display: none; }
    .funnel-arrow-desktop { display: block; }
  }
  @media (max-width: 599px) {
    .funnel-arrow-mobile { display: flex; justify-content: center; margin: -4px 0; position: relative; z-index: 2; }
    .funnel-arrow-desktop { display: none; }
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
const IChevronD = (p) => <Icon {...p} d={<path d="m6 9 6 6 6-6"/>}/>;
const ISparkles = (p) => <Icon {...p} d={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></>}/>;

// ===================================================================
// Floating Bottom Nav
// ===================================================================
function BottomNav({ activeId }) {
  const items = [
    { id: 'dash', label: 'KPIs', I: IBarChart, href: '#' },
    { id: 'map', label: 'Heatmap', I: IMap, href: '#' },
    { id: 'reps', label: 'Team', I: IUsers, href: '#' },
    { id: 'camp', label: 'Campaigns', I: IMegaphone, href: '#' },
  ];
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, padding: '0 16px 24px', pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 40%, var(--bg) 100%)', zIndex: -1 }}/>
      <div style={{ background: 'var(--surface)', borderRadius: 24, border: '1px solid rgba(229,220,201,0.8)', boxShadow: '0 12px 32px rgba(20,18,12,0.1), 0 2px 8px rgba(20,18,12,0.04)', padding: '10px 24px', display: 'flex', gap: 32, alignItems: 'center', pointerEvents: 'auto', width: '100%', maxWidth: 480, justifyContent: 'space-between' }}>
        {items.map(({ id, label, I, href }) => {
          const active = id === activeId;
          return (
            <a key={id} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: active ? 'var(--primary)' : 'var(--ink-soft)', cursor: 'pointer', position: 'relative', textDecoration: 'none', transform: active ? 'scale(1.05)' : 'scale(1)', transition: 'all 200ms' }}>
              <I size={24} stroke={active ? '#2E4A3A' : '#6B6A5F'}/>
              <span>{label}</span>
              {active && <span style={{ position: 'absolute', bottom: -6, width: 18, height: 3, borderRadius: 99, background: 'var(--primary)' }}/>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================================
// Mock Data
// ===================================================================
const FUNNEL_STAGES = [
  { label: 'Impressions', val: '150k', conv: null },
  { label: 'Clicks', val: '18k', conv: '12%' },
  { label: 'App Opens', val: '4k', conv: '22%' },
  { label: 'Field Visits', val: '850', conv: '21%' },
  { label: 'Orders', val: '320', conv: '38%' }
];

const REGIONS = [
  { name: 'Sandila', reach: '45k', visits: 120, conv: '4.2%', status: 'Low Visits' },
  { name: 'Hardoi', reach: '38k', visits: 410, conv: '12.8%', status: 'Optimal' },
  { name: 'Baramati', reach: '22k', visits: 180, conv: '8.5%', status: 'Optimal' },
  { name: 'Mallawan', reach: '45k', visits: 140, conv: '5.1%', status: 'Low Visits' },
];

// ===================================================================
// Main Screen
// ===================================================================
export default function CampaignPerformance() {
  const [campaign, setCampaign] = useState('Kharif Prep 2026');

  return (
    <div className="app-container no-scrollbar">
      <style>{injectedStyles}</style>

      {/* Paper Grain Overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Sticky Header */}
      <div className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <div>
            <h1 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, margin: 0, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>
              Campaigns
            </h1>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 2 }}>
              Digital-to-Field Attribution
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <select style={{
              appearance: 'none', background: 'var(--surface)', border: '1px solid var(--border)',
              padding: '10px 36px 10px 16px', borderRadius: 14, fontFamily: 'Plus Jakarta Sans',
              fontSize: 13, fontWeight: 700, color: 'var(--ink)', boxShadow: '0 2px 8px rgba(20,18,12,0.04)',
              cursor: 'pointer'
            }} value={campaign} onChange={e => setCampaign(e.target.value)}>
              <option>Kharif Prep 2026</option>
              <option>Rabi Rust Alert</option>
              <option>Topik Push</option>
            </select>
            <IChevronD size={16} stroke="var(--ink)" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none' }}/>
          </div>
        </div>
      </div>

      {/* Fluid Content Wrapper */}
      <div className="content-wrapper">
        
        {/* Top KPIs */}
        <div className="kpi-grid fade-up" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Reach', val: '150k', sub: '+12% w/w' },
            { label: 'Engagement', val: '12%', sub: 'Avg 4.2%' },
            { label: 'Field Conv.', val: '38%', sub: 'Visit to Order' },
            { label: 'Net ROI', val: '4.2x', sub: 'Spend vs Sales' }
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '16px 20px', boxShadow: '0 4px 12px rgba(20,18,12,0.03)' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{kpi.label}</div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: i === 3 ? 'var(--primary)' : 'var(--ink)' }}>{kpi.val}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: i === 1 ? 'var(--success)' : 'var(--ink-soft)', marginTop: 4 }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* AI Insights Block */}
        <div className="fade-up" style={{ background: '#E8F0ED', border: '1px solid rgba(46,74,58,0.2)', borderRadius: 24, padding: '24px', marginBottom: 32, animationDelay: '100ms', boxShadow: '0 8px 24px rgba(46,74,58,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', marginBottom: 12 }}>
            <ISparkles size={18}/>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Campaign Insight</span>
          </div>
          <p style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 17, color: 'var(--primary)', margin: 0, lineHeight: 1.45 }}>
            Combining digital ads with rep visits increases order probability by <strong>4.2x</strong>. Focus rep visits in Sandila and Mallawan where digital engagement is high, but field visits are severely lagging.
          </p>
        </div>

        {/* Digital-to-Field Funnel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingLeft: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}/>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Digital-to-Field Funnel</h3>
        </div>

        <div className="funnel-grid fade-up" style={{ marginBottom: 36, animationDelay: '150ms' }}>
          {FUNNEL_STAGES.map((stage, idx) => (
            <React.Fragment key={idx}>
              {/* Mobile Converter Badge */}
              {idx > 0 && (
                <div className="funnel-arrow-mobile">
                  <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>
                    ↓ {stage.conv} Conversion
                  </div>
                </div>
              )}
              
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                boxShadow: '0 4px 12px rgba(20,18,12,0.03)', position: 'relative'
              }}>
                {/* Desktop Converter Badge */}
                {idx > 0 && (
                  <div className="funnel-arrow-desktop" style={{ position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                    <div style={{ background: 'var(--surface-warm)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      {stage.conv}
                    </div>
                  </div>
                )}

                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: idx >= 3 ? 'var(--primary)' : 'var(--ink)', marginBottom: 6 }}>{stage.val}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.label}</div>
                {idx >= 3 && <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}/>}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Regional Breakdown Table */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingLeft: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}/>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Regional Breakdown</h3>
        </div>

        <div className="fade-up" style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(20,18,12,0.03)', animationDelay: '200ms'
        }}>
          <div className="no-scrollbar" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Region</th>
                  <th style={{ padding: '16px 24px', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Digi Reach</th>
                  <th style={{ padding: '16px 24px', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Field Visits</th>
                  <th style={{ padding: '16px 24px', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Conv.</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map((reg, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== REGIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{reg.name}</div>
                      <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 99, background: reg.status === 'Optimal' ? 'rgba(74, 107, 93, 0.1)' : 'rgba(184, 92, 60, 0.1)', color: reg.status === 'Optimal' ? 'var(--success)' : 'var(--danger)', fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {reg.status}
                      </div>
                    </td>
                    <td className="mono" style={{ padding: '20px 24px', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{reg.reach}</td>
                    <td className="mono" style={{ padding: '20px 24px', fontSize: 16, fontWeight: 600, color: reg.status === 'Low Visits' ? 'var(--danger)' : 'var(--ink)' }}>{reg.visits}</td>
                    <td className="mono" style={{ padding: '20px 24px', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{reg.conv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <BottomNav activeId="camp" />
    </div>
  );
}