// Alert Management — Manager Console (iPad Landscape)
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

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .fade-in { animation: fadeIn 400ms ease-out both; }

  @keyframes pulseDot {
    0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(184, 92, 60, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(184, 92, 60, 0); }
    100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(184, 92, 60, 0); }
  }
  .unread-dot { animation: pulseDot 2s infinite; }

  .glass-panel {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1px solid rgba(229, 220, 201, 0.8);
    box-shadow: 0 12px 32px rgba(20, 18, 12, 0.05), 0 2px 4px rgba(20, 18, 12, 0.02);
  }

  .inbox-card {
    padding: 16px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.2s ease;
  }
  .inbox-card:hover { background: rgba(255,255,255,0.4); }
  .inbox-card.selected { background: var(--surface); box-shadow: inset 4px 0 0 var(--primary); }

  .segment-btn {
    padding: 8px 16px; font-size: 13px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink-soft); transition: all 0.2s;
    border-radius: 99px; cursor: pointer; white-space: nowrap; border: none; background: transparent;
  }
  .segment-btn.active {
    background: var(--ink); color: white;
    box-shadow: 0 4px 12px rgba(26,26,23,0.15);
  }

  .styled-select {
    width: 100%; padding: 14px 16px; border-radius: 12px;
    border: 1px solid var(--border); background: var(--surface-warm);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--ink);
    appearance: none; cursor: pointer; outline: none;
  }
  .styled-textarea {
    width: 100%; padding: 14px 16px; border-radius: 12px;
    border: 1px solid var(--border); background: var(--surface-warm);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; color: var(--ink); resize: none; min-height: 80px;
    line-height: 1.5; font-weight: 500; outline: none;
  }
  .styled-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(46,74,58,0.1); }
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
const IBell = (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>}/>;
const IAlertCircle = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;
const ISparkles = (p) => <Icon {...p} d={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M7 5H3"/></>}/>;
const IChevronD = (p) => <Icon {...p} d={<path d="m6 9 6 6 6-6"/>}/>;

// ===================================================================
// Mock Data
// ===================================================================
const MOCK_ALERTS = [
  {
    id: 'a1', status: 'New', type: 'stockout', title: 'Topik 15 WP Critical Low',
    location: 'Baramati Agro Center', time: '10m ago', unread: true, 
    snippet: 'Inventory dropped to 0 units. High local demand predicted.',
    aiRep: 'Amit Singh', aiDistance: '4 km away', aiReason: 'Routing through Baramati at 2 PM today.',
    timeline: [{ label: 'Alert Generated', time: '10:42 AM', done: true }]
  },
  {
    id: 'a2', status: 'New', type: 'pest', title: 'Wheat Rust Spreading',
    location: 'Sandila Tehsil Cluster', time: '1h ago', unread: true,
    snippet: 'Multiple farmers reporting early signs of yellow rust.',
    aiRep: 'Pooja V.', aiDistance: '12 km away', aiReason: 'Specialist in fungal protocols; highest resolution rate for rust.',
    timeline: [{ label: 'Alert Generated', time: '09:15 AM', done: true }]
  },
  {
    id: 'a3', status: 'Assigned', type: 'campaign', title: 'Ad Spend Inefficient',
    location: 'Hardoi Center', time: '2h ago', unread: false,
    snippet: 'CTR dropped below 2% threshold. Field verification required.',
    rep: 'Ravi Kumar',
    timeline: [
      { label: 'Alert Generated', time: '08:30 AM', done: true },
      { label: 'Assigned to Ravi Kumar', time: '09:00 AM', done: true },
      { label: 'Pending Resolution', time: '--', done: false }
    ]
  },
  {
    id: 'a4', status: 'Resolved', type: 'stockout', title: 'Score 250 EC Empty',
    location: 'Kisan Store', time: '1d ago', unread: false,
    snippet: 'Resolved via rep visit. 50 boxes restocked.',
    rep: 'Amit Singh',
    timeline: [
      { label: 'Alert Generated', time: 'Yesterday', done: true },
      { label: 'Assigned to Amit Singh', time: 'Yesterday', done: true },
      { label: 'Resolved (Order Placed)', time: 'Today 08:15 AM', done: true }
    ]
  }
];

const getTypeColor = (type) => {
  if (type === 'stockout') return 'var(--danger)';
  if (type === 'pest') return 'var(--warning)';
  return 'var(--primary)';
};

// ===================================================================
// Main Screen Component
// ===================================================================
export default function AlertManagement() {
  const [filter, setFilter] = useState('New');
  const [selectedId, setSelectedId] = useState('a1');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const filteredAlerts = alerts.filter(a => a.status === filter);
  const activeAlert = alerts.find(a => a.id === selectedId) || null;

  const handleAssign = () => {
    if (!activeAlert) return;
    setAlerts(prev => prev.map(a => 
      a.id === activeAlert.id ? { ...a, status: 'Assigned', rep: a.aiRep, unread: false } : a
    ));
    setFilter('Assigned');
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#D3DAC9', position: 'relative', overflow: 'hidden' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6, zIndex: 5,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* 1. Left Sidebar Navigation */}
      <div style={{
        width: 80, background: 'var(--surface)', borderRight: '1px solid var(--border)', zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 32
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontFamily: 'Fraunces', fontSize: 20 }}>
          A
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}>
          <button style={{ color: 'var(--ink-soft)', background: 'transparent', border: 'none', cursor: 'pointer' }}><IMap size={24} strokeWidth="2"/></button>
          <button style={{ color: 'var(--ink-soft)', background: 'transparent', border: 'none', cursor: 'pointer' }}><IBarChart size={24}/></button>
          <button style={{ color: 'var(--ink-soft)', background: 'transparent', border: 'none', cursor: 'pointer' }}><IUsers size={24}/></button>
          <button style={{ color: 'var(--ink-soft)', background: 'transparent', border: 'none', cursor: 'pointer' }}><IMegaphone size={24}/></button>
          <button style={{ color: 'var(--primary)', position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <IBell size={24}/>
            <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--surface)' }}/>
          </button>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--border)' }} />
        </div>
      </div>

      {/* 2. Inbox Pane (35%) */}
      <div className="glass-panel" style={{ width: 380, display: 'flex', flexDirection: 'column', zIndex: 10, borderTop: 'none', borderBottom: 'none' }}>
        
        <div style={{ padding: '32px 20px 20px' }}>
          <h1 style={{ fontFamily: 'Fraunces', fontSize: 26, fontWeight: 500, color: 'var(--ink)', margin: '0 0 16px 0', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>
            Alert Triage
          </h1>
          
          <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', background: 'rgba(255,255,255,0.4)', padding: 4, borderRadius: 99, border: '1px solid var(--border)' }}>
            {['New', 'Assigned', 'Resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`segment-btn ${filter === f ? 'active' : ''}`} style={{ flex: 1 }}>
                {f} {f === 'New' && <span style={{ opacity: 0.6, marginLeft: 4 }}>(2)</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          {filteredAlerts.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
              <ICheckCircle size={40} strokeWidth="1" style={{ marginBottom: 12, opacity: 0.5 }}/>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>All caught up!</div>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} onClick={() => setSelectedId(alert.id)} className={`inbox-card ${selectedId === alert.id ? 'selected' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {alert.unread && <span className="unread-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', display: 'inline-block' }}/>}
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, color: getTypeColor(alert.type), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {alert.type}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>{alert.time}</span>
                </div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.2 }}>
                  {alert.title}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {alert.location}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Detail Pane (65%) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 10, padding: 32, overflowY: 'auto' }} className="no-scrollbar">
        
        {activeAlert ? (
          <div className="fade-in" key={activeAlert.id} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto', width: '100%' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ padding: '6px 14px', borderRadius: 99, background: activeAlert.status === 'Resolved' ? 'rgba(74, 107, 93, 0.1)' : 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: activeAlert.status === 'Resolved' ? 'var(--success)' : 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status: {activeAlert.status}
                  </span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
                    ID: #{activeAlert.id.toUpperCase()}092
                  </span>
                </div>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 36, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px 0', letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 48' }}>
                  {activeAlert.title}
                </h2>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, color: 'var(--ink-soft)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IMap size={16}/> {activeAlert.location}
                </div>
              </div>
            </div>

            {/* Split Content Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              
              {/* Left Col: Context & Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Context Card */}
                <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 24, animationDelay: '50ms' }}>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Alert Context</h3>
                  <p style={{ fontFamily: 'Fraunces', fontSize: 16, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    {activeAlert.snippet}
                  </p>
                  {/* Simulated Map Snippet */}
                  <div style={{ width: '100%', height: 120, borderRadius: 16, background: '#D3DAC9', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <path d="M0 60 Q 100 20 200 60 T 400 60" fill="none" stroke="#FAF6EC" strokeWidth="6" opacity="0.6"/>
                      <circle cx="200" cy="60" r="8" fill="var(--danger)" stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>

                {/* Resolution Timeline */}
                <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 24, animationDelay: '100ms' }}>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 20px 0' }}>Resolution Timeline</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 11, top: 12, bottom: 12, width: 2, background: 'var(--border)' }}/>
                    
                    {activeAlert.timeline.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                        <div style={{ 
                          width: 24, height: 24, borderRadius: '50%', background: step.done ? 'var(--primary)' : 'var(--surface)', 
                          border: `2px solid ${step.done ? 'var(--primary)' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          {step.done && <ICheckCircle size={14} stroke="white"/>}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: step.done ? 'var(--ink)' : 'var(--ink-soft)' }}>
                            {step.label}
                          </div>
                          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                            {step.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Col: Action & Routing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {activeAlert.status === 'New' && (
                  <>
                    {/* AI Triage Card */}
                    <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 24, background: '#E8F0ED', borderColor: 'rgba(46,74,58,0.2)', animationDelay: '150ms' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', marginBottom: 12 }}>
                        <ISparkles size={18}/>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Suggested Routing</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <img src="https://i.pravatar.cc/150?img=33" alt="Rep Profile" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid white' }}/>
                        <div>
                          <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{activeAlert.aiRep}</div>
                          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{activeAlert.aiDistance}</div>
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: 15, color: 'var(--primary)', margin: 0, lineHeight: 1.4 }}>
                        "{activeAlert.aiReason}"
                      </p>
                    </div>

                    {/* Action Form */}
                    <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 24, animationDelay: '200ms' }}>
                      <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Assign Alert</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                          <select className="styled-select" defaultValue={activeAlert.aiRep}>
                            <option>{activeAlert.aiRep} (Recommended)</option>
                            <option>Ravi Kumar</option>
                            <option>Suresh Patil</option>
                          </select>
                          <IChevronD size={16} stroke="var(--ink-soft)" style={{ position: 'absolute', right: 16, top: 16, pointerEvents: 'none' }}/>
                        </div>

                        <textarea className="styled-textarea" placeholder="Add optional note for the field rep..."></textarea>

                        <button onClick={handleAssign} style={{
                          width: '100%', height: 52, borderRadius: 14, background: 'var(--primary)', color: 'white', border: 'none',
                          fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(46,74,58,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                          transition: 'transform 0.1s'
                        }} onMouseDown={e => e.currentTarget.style.transform='scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>
                          Assign to {activeAlert.aiRep}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeAlert.status !== 'New' && (
                  <div className="glass-panel fade-up" style={{ borderRadius: 24, padding: 32, textAlign: 'center', animationDelay: '150ms' }}>
                    <img src="https://i.pravatar.cc/150?img=33" alt="Assigned Rep Profile" style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid white', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                    <h3 style={{ fontFamily: 'Fraunces', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px 0' }}>
                      Routed to {activeAlert.rep || activeAlert.aiRep}
                    </h3>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', margin: 0 }}>
                      The rep has been notified and the stop has been bumped to the top of their optimized route.
                    </p>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
              <IAlertCircle size={48} stroke="var(--border)" strokeWidth="1" style={{ marginBottom: 16 }}/>
              <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, color: 'var(--ink)' }}>Select an alert</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, marginTop: 8 }}>Choose an alert from the inbox to triage.</div>
            </div>
          )}

        </div>

      </div>
    );
  }

}