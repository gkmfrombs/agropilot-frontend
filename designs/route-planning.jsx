// Route Planning — Field Rep App (390px mobile)
// Premium Editorial Style

import React, { useState, useEffect } from 'react';

// ===================================================================
// Injected Styles
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes pulseRing {
    0%   { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  .pulse-ring::before {
    content: ''; position: absolute; inset: 0;
    border-radius: 50%; background: inherit;
    animation: pulseRing 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    z-index: -1;
  }

  @keyframes dashMove {
    to { stroke-dashoffset: -20; }
  }
  .route-line {
    stroke-dasharray: 6 6;
    animation: dashMove 1s linear infinite;
  }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IHome = (p) => <Icon {...p} d={<><path d="M3 9.5 12 2l9 7.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></>}/>;
const IMap = (p) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/></>}/>;
const IChat = (p) => <Icon {...p} d={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>}/>;
const ISync = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 14.85-6.85L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-14.85 6.85L3 16"/><path d="M3 21v-5h5"/></>}/>;
const IUser = (p) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const INav = (p) => <Icon {...p} d={<path d="m3 11 19-9-9 19-2-8-8-2z"/>}/>;
const ILayers = (p) => <Icon {...p} d={<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>}/>;
const IDrag = (p) => <Icon {...p} d={<><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></>}/>;
const IAlert = (p) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>;

// ===================================================================
// Components
// ===================================================================
function BottomNav({ activeId }) {
  const items = [
    { id: 'home', label: 'Home', I: IHome, href: 'Morning Briefing.html' },
    { id: 'map', label: 'Map', I: IMap, href: 'route_planning.html' },
    { id: 'chat', label: 'Chat', I: IChat, primary: true, href: 'AI Consultant.html' },
    { id: 'sync', label: 'Sync', I: ISync, href: 'Sync Center.html' },
    { id: 'me', label: 'Profile', I: IUser, href: 'Farmer Profile.html' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 22, paddingTop: 30, paddingLeft: 14, paddingRight: 14,
      background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.92) 30%, var(--bg) 62%)',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 22, border: '1px solid rgba(229,220,201,0.6)',
        boxShadow: '0 2px 4px rgba(20,18,12,0.06), 0 18px 40px rgba(20,18,12,0.14)',
        padding: '10px 6px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', pointerEvents: 'auto',
      }}>
        {items.map(({ id, label, I, primary, href }) => {
          const active = id === activeId;
          return (
            <a key={id} href={href} style={{
              background: 'transparent', border: 'none', padding: '4px 0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600,
              color: active ? 'var(--primary)' : 'var(--ink-soft)',
              cursor: 'pointer', position: 'relative', textDecoration: 'none',
              transform: active ? 'scale(1.04)' : 'scale(1)', transition: 'all 200ms',
            }}>
              {primary ? (
                <div style={{
                  width: 42, height: 42, borderRadius: 14, marginTop: -18,
                  background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(46,74,58,0.32), inset 0 1px 0 rgba(255,255,255,0.18)', color: 'white', border: '3px solid #FAF6EC',
                }}><I size={19} stroke="#fff"/></div>
              ) : <I size={22} stroke={active ? '#2E4A3A' : '#6B6A5F'}/>}
              <span style={{ marginTop: primary ? -2 : 0 }}>{label}</span>
              {active && <span style={{ position: 'absolute', bottom: -4, width: 16, height: 2.5, borderRadius: 99, background: 'var(--primary)' }}/>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

const INITIAL_STOPS = [
  { id: 's1', name: 'Bhatpura Plot 4', type: 'farmer', risk: 'HIGH', x: 80, y: 250, details: 'Wheat blight risk · 3.2 acres', time: '09:00 AM' },
  { id: 's2', name: 'Kisan Store, Sandila', type: 'retailer', risk: 'LOW', x: 280, y: 230, details: 'Routine restock · Syngenta P1', time: '10:15 AM' },
  { id: 's3', name: 'Mallawan Panchayat', type: 'farmer', risk: 'MEDIUM', x: 310, y: 450, details: 'Soil sample collection', time: '12:30 PM' },
  { id: 's4', name: 'Ramesh Singh', type: 'farmer', risk: 'LOW', x: 140, y: 540, details: 'Yield estimate follow-up', time: '02:00 PM' },
  { id: 's5', name: 'Baramati Agro', type: 'retailer', risk: 'HIGH', x: 100, y: 740, details: 'Tilt 25EC critical stockout', time: '04:00 PM' },
];

const getRiskColor = (risk) => {
  if (risk === 'HIGH') return 'var(--danger)';
  if (risk === 'MEDIUM') return 'var(--warning)';
  return 'var(--primary)';
};

// ===================================================================
// Main Component
// ===================================================================
export default function RoutePlanning() {
  const [stops, setStops] = useState(INITIAL_STOPS);
  const [filter, setFilter] = useState('All'); 
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setEmergencyMode(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleReorder = (dragIndex, dropIndex) => {
    if (dragIndex === dropIndex) return;
    const newStops = [...stops];
    const [moved] = newStops.splice(dragIndex, 1);
    newStops.splice(dropIndex, 0, moved);
    setStops(newStops);
  };

  const handleEmergencyReroute = () => {
    setEmergencyMode(false);
    const newStops = [...stops].sort((a, b) => {
      if (a.risk === 'HIGH' && b.risk !== 'HIGH') return -1;
      if (b.risk === 'HIGH' && a.risk !== 'HIGH') return 1;
      return 0;
    });
    setStops(newStops);
    setSheetExpanded(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#B8C1B0', overflow: 'hidden' }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Top Controls */}
      <div style={{
        position: 'absolute', top: 60, left: 18, right: 18, zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          background: 'var(--surface)', padding: 6, borderRadius: 999,
          boxShadow: '0 4px 14px rgba(20,18,12,0.08)', border: '1px solid var(--border)',
        }}>
          {['All', 'Urgent', 'Routine'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 14px', borderRadius: 999, border: 'none',
              background: filter === f ? 'var(--primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--ink-soft)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 200ms ease',
            }}>{f}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{
            width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(20,18,12,0.08)', cursor: 'pointer', color: 'var(--ink)'
          }}><ILayers size={20}/></button>
          <button style={{
            width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(20,18,12,0.08)', cursor: 'pointer', color: '#2F80ED'
          }}><INav size={20}/></button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div style={{
        position: 'absolute', inset: 0, 
        transform: sheetExpanded ? 'scale(0.95) translateY(-5%)' : 'scale(1)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        transformOrigin: 'top center', zIndex: 0,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <path d="M0 0 L390 0 L390 844 L0 844 Z" fill="#D3DAC9" />
          <path d="M-50 100 Q 150 50 250 200 T 450 300 L 450 900 L -50 900 Z" fill="#C2CDb7" />
          <path d="M-20 400 Q 100 350 200 500 T 450 600 L 450 900 L -20 900 Z" fill="#B2C0A5" />
          <path d="M30 0 Q 100 300 80 400 T 150 700 Q 200 800 250 900" fill="none" stroke="#FAF6EC" strokeWidth="6" opacity="0.6"/>
          <path d="M390 200 Q 250 250 280 400 T 150 700" fill="none" stroke="#FAF6EC" strokeWidth="6" opacity="0.6"/>
          
          {stops.length > 1 && (
            <path d={`M ${stops.map(s => `${s.x} ${s.y}`).join(' L ')}`} 
              fill="none" stroke="var(--primary)" strokeWidth="3" className="route-line" />
          )}
        </svg>

        {/* Current Location Dot */}
        <div style={{ position: 'absolute', left: 45, top: 190, width: 14, height: 14, borderRadius: '50%', background: '#2F80ED', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10 }} className="pulse-ring"/>

        {/* Map Pins */}
        {stops.map((stop, i) => (
          <div key={stop.id} style={{
            position: 'absolute', left: stop.x, top: stop.y,
            transform: 'translate(-50%, -50%)', zIndex: 20 + (stops.length - i),
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: getRiskColor(stop.risk), border: '2.5px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(20,18,12,0.18)', cursor: 'pointer',
              color: 'white', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 15
            }}>
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Route Summary Bottom Sheet */}
      <div style={{
        position: 'absolute', bottom: 90, left: 0, right: 0, zIndex: 30,
        background: 'var(--surface)', borderTopLeftRadius: 32, borderTopRightRadius: 32,
        boxShadow: '0 -10px 40px rgba(20,18,12,0.12)',
        height: sheetExpanded ? '75%' : 140,
        transition: 'height 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag Handle */}
        <div onClick={() => setSheetExpanded(!sheetExpanded)} style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px', cursor: 'pointer' }}>
          <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--border)' }}/>
        </div>

        <div style={{ padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 36' }}>
                Today's Route
              </h2>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', marginTop: 4, fontWeight: 500 }}>
                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>2 urgent</span> · 8 stops · 47 km
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 18, color: 'var(--primary)' }}>2h 15m</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drive Time</div>
            </div>
          </div>

          {/* Emergency Alert Button */}
          {emergencyMode && !sheetExpanded && (
            <button onClick={handleEmergencyReroute} className="fade-up" style={{
              width: '100%', padding: '12px', borderRadius: 16, background: 'var(--danger)', color: 'white', border: 'none',
              fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 8, boxShadow: '0 6px 16px rgba(184, 92, 60, 0.25)', cursor: 'pointer',
            }}>
              <IAlert size={18}/> New pest alert! Tap to re-route
            </button>
          )}
        </div>

        {/* Expanded List */}
        <div className="no-scrollbar" style={{
          flex: 1, overflowY: 'auto', padding: '16px 24px 40px',
          opacity: sheetExpanded ? 1 : 0, transition: 'opacity 300ms ease',
          pointerEvents: sheetExpanded ? 'auto' : 'none',
        }}>
          {stops.map((stop, i) => (
            <div key={stop.id} style={{
              display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center',
              padding: '16px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: getRiskColor(stop.risk), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 14 }}>
                {i + 1}
              </div>
              <div style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{stop.name}</span>
                  {stop.risk === 'HIGH' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)' }}/>}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{stop.details}</div>
              </div>
              <button onClick={() => handleReorder(i, i === 0 ? stops.length - 1 : 0)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer' }}>
                <IDrag size={20}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeId="map" />
    </div>
  );
}