// Rep Performance Tracker — Manager Console
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

  @keyframes expandDown {
    from { opacity: 0; max-height: 0; transform: translateY(-10px); }
    to { opacity: 1; max-height: 500px; transform: translateY(0); }
  }
  .expand-down { animation: expandDown 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; overflow: hidden; }

  @keyframes barGrow {
    from { width: 0%; }
    to { width: var(--w); }
  }
  .bar-grow { animation: barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  .glass-header {
    background: rgba(245, 241, 232, 0.85);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    border-bottom: 1px solid rgba(229, 220, 201, 0.7);
  }

  .segment-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink-soft); transition: all 0.2s;
    border-radius: 99px; white-space: nowrap; background: transparent; border: none; cursor: pointer;
  }
  .segment-btn.active {
    background: var(--primary); color: white;
    box-shadow: 0 4px 12px rgba(46,74,58,0.25);
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

  .stats-grid {
    display: grid; grid-template-columns: 1fr; gap: 12px;
  }
  @media (min-width: 600px) {
    .stats-grid { grid-template-columns: 1fr 1fr; }
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
const ITrophy = (p) => <Icon {...p} d={<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>}/>;

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
const REPS = [
  {
    id: 'r1', name: 'Amit Singh', avatar: 'https://i.pravatar.cc/150?img=33',
    revenue: '42.5', target: '40', winRate: '68%', aiCompliance: '94%',
    visits: 112, topProduct: 'Topik 15 WP', trend: 'up'
  },
  {
    id: 'r2', name: 'Ravi Kumar', avatar: 'https://i.pravatar.cc/150?img=12',
    revenue: '38.2', target: '40', winRate: '62%', aiCompliance: '88%',
    visits: 98, topProduct: 'Score 250 EC', trend: 'up'
  },
  {
    id: 'r3', name: 'Pooja V.', avatar: 'https://i.pravatar.cc/150?img=5',
    revenue: '31.0', target: '35', winRate: '55%', aiCompliance: '96%',
    visits: 104, topProduct: 'Actara 25 WG', trend: 'down'
  },
  {
    id: 'r4', name: 'Suresh Patil', avatar: 'https://i.pravatar.cc/150?img=59',
    revenue: '24.8', target: '35', winRate: '48%', aiCompliance: '72%',
    visits: 82, topProduct: 'Kavach 75 WP', trend: 'down'
  }
];

// ===================================================================
// Main Screen Component
// ===================================================================
export default function RepPerformance() {
  const [timeframe, setTimeframe] = useState('Month');
  const [expandedRep, setExpandedRep] = useState('r1');

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
              Team Performance
            </h1>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 2 }}>
              Northern District · {REPS.length} Reps Active
            </div>
          </div>
        </div>
        
        <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 24px 20px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
          {['Today', 'Week', 'Month', 'Quarter'].map(f => (
            <button key={f} onClick={() => setTimeframe(f)} className={`segment-btn ${timeframe === f ? 'active' : ''}`} style={{
              background: timeframe === f ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
              border: timeframe === f ? '1px solid var(--primary)' : '1px solid var(--border)'
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Fluid Content Wrapper */}
      <div className="content-wrapper">
        
        {/* Top Performer Hero Card */}
        <div className="fade-up" style={{
          background: 'var(--surface)', borderRadius: 28, padding: '28px',
          boxShadow: '0 12px 32px rgba(20,18,12,0.06), 0 2px 4px rgba(20,18,12,0.02)',
          border: '1px solid var(--border)', marginBottom: 32, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, color: 'var(--accent)' }}>
             <ITrophy size={180} stroke="currentColor" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ background: 'var(--accent)', color: 'white', padding: '6px 14px', borderRadius: 99, fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(201,151,74,0.3)' }}>
              Top Performer
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <img src={REPS[0].avatar} alt={REPS[0].name} style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--border)' }}/>
            <div>
              <h2 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px 0' }}>{REPS[0].name}</h2>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', fontWeight: 500 }}>
                <strong style={{ color: 'var(--success)' }}>{REPS[0].winRate}</strong> Win Rate · {REPS[0].visits} Visits
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div style={{ background: 'var(--surface-warm)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Revenue (MTD)</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--primary)' }}>₹{REPS[0].revenue}L</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 6 }}>Target: ₹{REPS[0].target}L</div>
            </div>
            <div style={{ background: 'var(--surface-warm)', borderRadius: 20, padding: '20px', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>AI Compliance</div>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>{REPS[0].aiCompliance}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>Excellent</div>
            </div>
          </div>
        </div>

        {/* Team Leaderboard List */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingLeft: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}/>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Team Ranking</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {REPS.map((rep, idx) => {
            const isExpanded = expandedRep === rep.id;
            const progressPct = Math.min(100, (parseFloat(rep.revenue) / parseFloat(rep.target)) * 100);
            
            return (
              <div key={rep.id} className="fade-up" style={{
                background: 'var(--surface)', border: isExpanded ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: 24, overflow: 'hidden', transition: 'all 0.3s ease',
                boxShadow: isExpanded ? '0 12px 32px rgba(46,74,58,0.12)' : '0 4px 12px rgba(20,18,12,0.04)',
                animationDelay: `${100 + idx * 50}ms`
              }}>
                {/* Collapsed Row */}
                <div onClick={() => setExpandedRep(isExpanded ? null : rep.id)} style={{
                  padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer',
                  background: isExpanded ? 'var(--surface-warm)' : 'transparent'
                }}>
                  <div style={{ width: 28, fontFamily: 'Fraunces', fontSize: 18, fontWeight: 600, color: 'var(--ink-soft)', textAlign: 'center' }}>
                    {idx + 1}
                  </div>
                  <img src={rep.avatar} alt={rep.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '1px solid var(--border)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{rep.name}</div>
                    <div className="mono" style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 600 }}>₹{rep.revenue}L / ₹{rep.target}L</div>
                  </div>
                  <div style={{ color: 'var(--ink-soft)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                    <IChevronD size={24}/>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="expand-down" style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
                    
                    <div style={{ marginTop: 24, marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
                      <span>Target Attainment</span>
                      <span className="mono">{Math.round(progressPct)}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden', marginBottom: 28 }}>
                      <div className="bar-grow" style={{ height: '100%', background: progressPct >= 100 ? 'var(--success)' : 'var(--primary)', '--w': `${progressPct}%`, borderRadius: 99 }}/>
                    </div>

                    <div className="stats-grid">
                      <div style={{ background: 'var(--surface-warm)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Win Rate</div>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{rep.winRate}</div>
                      </div>
                      <div style={{ background: 'var(--surface-warm)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Visits</div>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{rep.visits}</div>
                      </div>
                      <div style={{ background: 'var(--surface-warm)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>AI Compliance</div>
                        <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: parseFloat(rep.aiCompliance) > 85 ? 'var(--success)' : 'var(--danger)' }}>{rep.aiCompliance}</div>
                      </div>
                      <div style={{ background: 'var(--surface-warm)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Top Product</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{rep.topProduct}</div>
                      </div>
                    </div>

                    <button style={{
                      width: '100%', padding: '16px', marginTop: 28, borderRadius: 16,
                      background: 'transparent', border: '1.5px solid var(--primary)', color: 'var(--primary)',
                      fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s ease'
                    }} onMouseOver={e => e.currentTarget.style.background = 'var(--primary-soft)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <IBarChart size={18}/> View Full Report
                    </button>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <BottomNav activeId="reps" />
    </div>
  );
}