// AI Consultant chat screen — 390px mobile
// Dynamic chat + in-page reasoning overlay + localStorage persistence + Groq AI

const { useState, useEffect, useRef, useMemo } = React;

// ===================================================================
// Backend API config
// ===================================================================
const API_BASE = window.API_BASE || 'http://localhost:8000';

async function callBackend(userMessage, history) {
  const messages = history
    .filter(m => !m.hero && !m.thinking && m.text)
    .slice(-8)
    .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
  messages.push({ role: 'user', content: userMessage });
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, rep_id: 'REP_0001' }),
    });
    const data = await res.json();
    const raw = data.response || '';
    // Try to parse JSON sections from backend response
    try {
      const parsed = JSON.parse(raw);
      return { text: parsed.text || raw, sections: (parsed.sections || []).map(s => ({ type: 'section', ...s })) };
    } catch (_) {
      return { text: raw, sections: [] };
    }
  } catch (_) {
    return null;
  }
}

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}{extra}
  </svg>
);
const IChevL  = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IChevR  = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>}/>;
const IInfo   = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>}/>;
const ICloud  = (p) => <Icon {...p} d={<path d="M17.5 19a4.5 4.5 0 1 0-1.5-8.75A6 6 0 1 0 6 16"/>}/>;
const IWheat  = (p) => <Icon {...p} d={<><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></>}/>;
const IDb     = (p) => <Icon {...p} d={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></>}/>;
const IBox    = (p) => <Icon {...p} d={<><path d="M21 8 12 13 3 8"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M12 13v9"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;
const IThumbUp = (p) => <Icon {...p} d={<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L15 2h0a3 3 0 0 1 0 3.88Z"/>}/>;
const IThumbDn = (p) => <Icon {...p} d={<path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L9 22h0a3 3 0 0 1 0-3.88Z"/>}/>;
const IMic    = (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>}/>;
const ISend   = (p) => <Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}/>;
const IPin    = (p) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>}/>;
const ISpark  = (p) => <Icon {...p} d={<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>}/>;
const IX      = (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;
const IShare  = (p) => <Icon {...p} d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="11.49"/></>}/>;
const IExt    = (p) => <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>;
const ISprout = (p) => <Icon {...p} d={<><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></>}/>;
const IUser   = (p) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const ICloudRain = (p) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></>}/>;
const IDroplets = (p) => <Icon {...p} d={<><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></>}/>;
const IHistory = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>;

// ===================================================================
// Reasoning Graph — embedded data + components (no page nav needed)
// ===================================================================
const VB_W = 390, VB_H = 380;
const GRAPH_CENTER = { x: VB_W / 2, y: VB_H / 2 + 6 };
const GRAPH_RADIUS = 132;
const GRAPH_NODES = [
  { id: 'farmer',  label: 'Ramesh',       Icon: IUser,      edge: 'treats',       angle: -90,  type: 'Person',              facts: [['Member', 'Since 2021'], ['Village', 'Bhatpura, Block 4'], ['Last visit', '7 days ago']], source: 'Farmer profile · CRM' },
  { id: 'variety', label: 'HD-2967',      Icon: IWheat,     edge: 'for',          angle: -30,  type: 'Crop Variety',        facts: [['Susceptibility', 'Moderate to Septoria'], ['Plot size', '3.2 acres'], ['Stage', 'Flowering (BBCH 65)']], source: 'IARI cultivar database' },
  { id: 'rain',    label: '48mm rain',    Icon: ICloudRain, edge: 'triggers',     angle:  30,  type: 'Environmental Signal',facts: [['Window', 'Mon–Tue, 31h saturation'], ['Source', 'Hardoi block stations'], ['Threshold', 'Exceeded by 12mm']], source: 'IMD station feed' },
  { id: 'humid',   label: '89% humidity', Icon: IDroplets,  edge: 'amplifies',    angle:  90,  type: 'Environmental Signal',facts: [['Duration', '18 hours sustained'], ['Canopy wetness', 'Dawn window matched'], ['Spore release', 'Elevated']], source: 'IMD station feed' },
  { id: 'history', label: '2023 outbreak',Icon: IHistory,   edge: 'matches',      angle:  150, type: 'Historical Match',    facts: [['Panchayat', 'Bhatpura + Mallawan'], ['Loss', '12–22% yield, 14 plots'], ['Pattern overlap', '0.87 cosine']], source: 'Field outbreak ledger' },
  { id: 'stock',   label: 'Stock 5km',    Icon: IPin,       edge: 'available at', angle:  210, type: 'Logistics Signal',    facts: [['Outlet', 'Kisan Store, Sandila Rd'], ['SKUs', 'Tilt 25EC · 500ml × 14'], ['Drive time', '11 min']], source: 'Retailer inventory · 2h ago' },
];
const GRAPH_STEPS = [
  { n: 1, text: 'Detected wheat at flowering stage from farmer profile', src: 'Farmer profile' },
  { n: 2, text: 'Connected rainfall and humidity to fungal risk model',  src: 'IMD + risk engine' },
  { n: 3, text: 'Matched current pattern against 2023 outbreak in same panchayat', src: 'Outbreak ledger' },
  { n: 4, text: 'Filtered Syngenta products for early-stage blight efficacy', src: 'Product catalogue' },
  { n: 5, text: 'Identified in-stock location within 5km radius', src: 'Retailer inventory' },
];

function gPolar(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return { x: GRAPH_CENTER.x + Math.cos(rad) * radius, y: GRAPH_CENTER.y + Math.sin(rad) * radius };
}
function gMid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function gOffset(a, b, d) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  return { x: a.x + (dx / len) * d, y: a.y + (dy / len) * d };
}

function GraphCanvas({ nodes = GRAPH_NODES, selected, onSelect }) {
  const edges = nodes.map((n) => {
    const p = gPolar(n.angle, GRAPH_RADIUS);
    const a = gOffset(p, GRAPH_CENTER, 30);
    const b = gOffset(GRAPH_CENTER, p, 47);
    return { id: n.id, from: a, to: b, mid: gMid(a, b), label: n.edge };
  });
  const isDim = (id) => selected && selected !== id;
  return (
    <div style={{ position: 'relative', height: 380, background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="dotgrid2" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="#6B6A5F" fillOpacity="0.18"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid2)"/>
      </svg>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {edges.map((e, i) => (
          <g key={e.id} style={{ opacity: isDim(e.id) ? 0.18 : 1, transition: 'opacity 240ms ease' }}>
            <line x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
              stroke="#2E4A3A" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round"
              className="edge-draw" style={{ animationDelay: `${250 + i * 180}ms` }}/>
            <g transform={`translate(${e.mid.x}, ${e.mid.y})`} className="edge-label" style={{ animationDelay: `${550 + i * 180}ms` }}>
              <rect x="-26" y="-7" width="52" height="14" rx="7" fill="#FAF6EC" stroke="#E5DCC9" strokeWidth="0.8"/>
              <text textAnchor="middle" y="3.5" style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 8.5, fontWeight: 600, fill: '#6B6A5F', letterSpacing: '0.04em' }}>{e.label}</text>
            </g>
          </g>
        ))}
        {nodes.map((n, i) => {
          const p = gPolar(n.angle, GRAPH_RADIUS);
          const dim = isDim(n.id);
          const active = selected === n.id;
          return (
            <g key={n.id} className="node-in" style={{ animationDelay: `${900 + i * 80}ms`, opacity: dim ? 0.28 : 1, transition: 'opacity 240ms ease', cursor: 'pointer', transformBox: 'fill-box', transformOrigin: 'center' }} onClick={() => onSelect(n.id)}>
              <circle cx={p.x} cy={p.y} r="32" fill="#FFFFFF" stroke={active ? '#2E4A3A' : '#E5DCC9'} strokeWidth={active ? 2 : 1}/>
              <foreignObject x={p.x - 30} y={p.y - 26} width="60" height="52">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: 60, height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, pointerEvents: 'none' }}>
                  <n.Icon size={16} stroke="#2E4A3A"/>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: '#1A1A17', textAlign: 'center', lineHeight: 1.1 }}>{n.label}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
        <g className="node-in" style={{ animationDelay: '700ms', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={GRAPH_CENTER.x} cy={GRAPH_CENTER.y} r="48" fill="none" stroke="#2E4A3A" strokeOpacity="0.35" strokeWidth="2" className="center-glow"/>
          <circle cx={GRAPH_CENTER.x} cy={GRAPH_CENTER.y} r="45" fill="#2E4A3A"/>
          <foreignObject x={GRAPH_CENTER.x - 42} y={GRAPH_CENTER.y - 36} width="84" height="72">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: 84, height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, pointerEvents: 'none' }}>
              <ISprout size={18} stroke="#FAF6EC"/>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 13, color: '#FAF6EC', textAlign: 'center', lineHeight: 1.05, fontVariationSettings: '"opsz" 14' }}>Tilt 25EC</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 8.5, fontWeight: 700, color: 'rgba(245,241,232,0.7)', textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Recommendation</div>
            </div>
          </foreignObject>
        </g>
        <defs>
          <radialGradient id="warmInside2" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FAF6EC" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
        6 signals · 1 outcome
      </div>
    </div>
  );
}

function NodeFlyout({ nodeId, nodes: flyoutNodes = GRAPH_NODES, onClose }) {
  const node = flyoutNodes.find(n => n.id === nodeId);
  if (!node) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,23,0.36)', backdropFilter: 'blur(2px)', zIndex: 160 }}/>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 170, background: 'var(--surface)', borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: '0 -16px 40px rgba(20,18,12,0.28)', padding: '12px 22px 26px', animation: 'flyoutIn 380ms cubic-bezier(0.16,1,0.3,1) both' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{node.type}</div>
            <h3 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, lineHeight: 1.15, color: 'var(--ink)', margin: '4px 0 0', fontVariationSettings: '"opsz" 24' }}>{node.label}</h3>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-warm)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IX size={14}/></button>
        </div>
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border)' }}>
          {node.facts.map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', columnGap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase', paddingTop: 2 }}>{k}</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700, color: 'var(--primary)' }}>
          Source · {node.source}<IExt size={12} stroke="#2E4A3A"/>
        </div>
      </div>
    </>
  );
}

const NODE_ICON_MAP = { farmer: IUser, crop: IWheat, variety: IWheat, rain: ICloudRain, humidity: IDroplets, history: IHistory, stock: IPin };

function ReasoningOverlay({ onClose }) {
  const [selected, setSelected] = useState(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/graph?rep_id=REP_0001`)
      .then(r => r.json())
      .then(d => setGraphData(d))
      .catch(() => {});
  }, []);

  // Merge live backend data with local icon map; fall back to hardcoded if fetch fails
  const liveNodes = graphData
    ? graphData.nodes.map(n => ({ ...n, Icon: NODE_ICON_MAP[n.id] || ISpark }))
    : GRAPH_NODES;
  const liveSteps = graphData ? graphData.steps : GRAPH_STEPS;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, display: 'flex', flexDirection: 'column', background: 'var(--bg)', animation: 'slideUpFull 400ms cubic-bezier(0.16,1,0.3,1) both' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(245,241,232,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(229,220,201,0.7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '10px 14px' }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer' }}>
            <IX size={17}/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.005em' }}>Why this recommendation?</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Reasoning Graph</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', justifySelf: 'end' }}>
            <IShare size={16}/>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }} className="no-scrollbar">
        <GraphCanvas nodes={liveNodes} selected={selected} onSelect={(id) => setSelected(id === selected ? null : id)}/>

        {/* Reasoning trail */}
        <div style={{ background: 'var(--surface)', borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: '0 -10px 30px rgba(20,18,12,0.10)', padding: '10px 20px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0 10px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0 }}>Reasoning trail</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)', margin: '3px 0 0' }}>How we connected the dots</p>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>5 steps</span>
          </div>
          <div style={{ marginTop: 14 }}>
            {liveSteps.map((s, i) => (
              <div key={s.n} className="fade-up" style={{ display: 'grid', gridTemplateColumns: '32px 1fr 18px', columnGap: 12, alignItems: 'flex-start', padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)', animationDelay: `${200 + i * 70}ms` }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces', fontWeight: 500, fontSize: 13 }}>{s.n}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.42, paddingTop: 4 }}>
                  {s.text}
                  <div style={{ marginTop: 3, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>{s.src}</div>
                </div>
                <IChevR size={15} stroke="#6B6A5F" style={{ marginTop: 8 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50, paddingTop: 16, paddingBottom: 18, paddingLeft: 18, paddingRight: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, #FFFFFF 65%)', borderTop: '1px solid var(--border)' }}>
        <button onClick={onClose} style={{ width: '100%', height: 52, borderRadius: 14, background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14.5, boxShadow: '0 6px 16px rgba(46,74,58,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Use this answer
        </button>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button onClick={onClose} style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer' }}>Ask follow-up →</button>
        </div>
      </div>

      {selected && <NodeFlyout nodeId={selected} nodes={liveNodes} onClose={() => setSelected(null)}/>}
    </div>
  );
}

// ===================================================================
// Chat header
// ===================================================================
function Header() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(245,241,232,0.85)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)', borderBottom: '1px solid rgba(229,220,201,0.7)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '10px 14px' }}>
        <a href="Farmer Profile.html" style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', textDecoration: 'none' }}>
          <IChevL size={18}/>
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#7B9C6A', boxShadow: '0 0 0 2.5px rgba(123,156,106,0.18)', display: 'inline-block' }}/>
            AI Consultant
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 500, color: 'var(--ink-soft)', marginTop: 2 }}>Ramesh's Field</div>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', justifySelf: 'end' }}>
          <IInfo size={18}/>
        </button>
      </div>
    </div>
  );
}

function ContextChips() {
  const chips = [{ label: 'Wheat' }, { label: 'Block 4' }, { label: 'Flowering' }, { label: 'Cached ✓', dot: true }];
  return (
    <div style={{ padding: '12px 18px', background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)' }}>
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {chips.map((c) => (
          <span key={c.label} style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'var(--bg)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)', letterSpacing: '0.01em' }}>
            {c.dot && <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }}/>}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Typewriter
// ===================================================================
function useTypewriter(text, delayPerChar = 30, start = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let iv;
    const t0 = setTimeout(() => {
      let i = 0;
      iv = setInterval(() => { i += 1; setN(i); if (i >= text.length) clearInterval(iv); }, delayPerChar);
    }, start);
    return () => { clearTimeout(t0); clearInterval(iv); };
  }, [text, delayPerChar, start]);
  return [text.slice(0, n), n >= text.length];
}

// ===================================================================
// Voice waveform
// ===================================================================
function MiniWave({ color = '#6B6A5F' }) {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.5, 0.7, 0.4, 0.6];
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
      {bars.map((h, i) => (
        <rect key={i} x={i * 5 + 1} y={(12 - h * 12) / 2} width="2.2" height={h * 12} rx="1" fill={color}/>
      ))}
    </svg>
  );
}

// ===================================================================
// Inline bold markdown renderer
// ===================================================================
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.slice(2, -2)}</strong>
      : p
  );
}

// ===================================================================
// Hero AI response (first, animated)
// ===================================================================
const HEADLINE = 'Apply Syngenta Fungicide X within 48 hours';
const RESPONSE_SECTIONS = [
  { type: 'paragraph', content: '**Diagnosis:** Early Septoria leaf blotch confirmed — symptom pattern, spore colour, and crop stage all match.' },
  { type: 'section', heading: 'Recommended Action', bullets: ['Apply **Tilt 25EC** (propiconazole) immediately', 'Mix rate: **1 ml / litre** — cover both leaf surfaces evenly', 'Skip spray if rain expected within **4 hours**'] },
  { type: 'section', heading: 'Why Urgent?', bullets: ['Flowering stage is the **last effective** spray window', '48 mm recent rainfall accelerates spore spread significantly', 'Each 24h delay raises infection risk by **~18%**'] },
];
const iconRoundBtn = { width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

function AIResponse({ onShowReasoning }) {
  const [typed, done] = useTypewriter(HEADLINE, 28, 350);
  const [visibleSections, setVisibleSections] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!done) return;
    let i = 0;
    const iv = setInterval(() => { i += 1; setVisibleSections(i); if (i >= RESPONSE_SECTIONS.length) clearInterval(iv); }, 320);
    return () => clearInterval(iv);
  }, [done]);

  useEffect(() => { if (done) setTimeout(() => setBarWidth(94), 1200); }, [done]);

  const sources = [{ I: ICloud, label: 'Weather' }, { I: IWheat, label: 'Crop' }, { I: IDb, label: 'Disease DB' }, { I: IBox, label: 'Product' }];

  return (
    <div className="fade-up" style={{ maxWidth: '92%', alignSelf: 'flex-start', background: 'var(--surface)', borderRadius: '20px 20px 20px 8px', boxShadow: '0 1px 3px rgba(20,18,12,0.06), 0 18px 42px rgba(20,18,12,0.12)', overflow: 'hidden', animationDelay: '320ms' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, #2E4A3A 0%, #5a8a6a 45%, #C9974A 100%)' }}/>
      <div style={{ padding: '16px 18px 14px' }}>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <ISpark size={12} stroke="#fff"/>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>AI Recommendation</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(123,156,106,0.14)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10, color: '#2E4A3A' }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: '#7B9C6A' }}/>Live
          </span>
        </div>
        {/* Typewriter headline */}
        <h3 style={{ margin: '0 0 8px', fontFamily: 'Fraunces', fontWeight: 500, fontSize: 19, lineHeight: 1.22, letterSpacing: '-0.01em', color: 'var(--ink)', fontVariationSettings: '"opsz" 24' }}>
          {typed}{!done && <span className="caret"/>}
        </h3>
        {done && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(184,92,60,0.10)', border: '1px solid rgba(184,92,60,0.20)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11, color: '#B85C3C', marginBottom: 2 }}>
            Act within 48h
          </div>
        )}
        <div style={{ height: 1, background: 'var(--border)', margin: '14px -2px 16px' }}/>
        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {RESPONSE_SECTIONS.map((sec, si) => (
            <div key={si} className={si < visibleSections ? 'fade-up' : ''} style={{ opacity: si < visibleSections ? 1 : 0, transition: 'opacity 240ms ease' }}>
              {sec.type === 'paragraph' && (
                <p style={{ margin: 0, fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.60 }}>{renderInline(sec.content)}</p>
              )}
              {sec.type === 'section' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ width: 3, height: 16, borderRadius: 99, background: 'var(--primary)', flex: 'none' }}/>
                    <span style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{sec.heading}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingLeft: 4 }}>
                    {sec.bullets.map((b, bi) => (
                      <div key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--primary)', opacity: 0.45, flex: 'none', marginTop: 7 }}/>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55 }}>{renderInline(b)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: 'var(--border)', margin: '18px -2px 12px' }}/>
        {/* Sources */}
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Sources</div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {sources.map((s, i) => (
              <span key={s.label} className="slide-in-l" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999, background: 'var(--surface-warm)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', animationDelay: `${done ? 800 + i * 60 : 1400 + i * 60}ms` }}>
                <s.I size={11} stroke="#6B6A5F"/>{s.label}
              </span>
            ))}
          </div>
        </div>
        {/* Stock card */}
        <div style={{ marginTop: 14, borderRadius: 14, background: 'linear-gradient(135deg, #2E4A3A 0%, #3d5e4a 100%)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(46,74,58,0.22)' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <ICheckCircle size={16} stroke="#fff"/>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.25 }}>In stock — <span style={{ fontWeight: 500, opacity: 0.88 }}>Kisan Store</span></div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 3, fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600, color: 'rgba(245,241,232,0.78)' }}>
              <IPin size={10} stroke="rgba(245,241,232,0.78)"/>5 km away · View map
            </div>
          </div>
        </div>
        {/* Confidence bar */}
        <div style={{ marginTop: 12, background: 'var(--surface-warm)', borderRadius: 12, padding: '10px 12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Confidence</span>
            <span style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, color: 'var(--primary)', letterSpacing: '-0.02em' }}>94%</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, width: `${barWidth}%`, background: 'linear-gradient(90deg, #2E4A3A, #7B9C6A)', transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}/>
          </div>
        </div>
        {/* Footer */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onShowReasoning} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Show reasoning
          </button>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={iconRoundBtn} aria-label="Helpful"><IThumbUp size={14} stroke="#6B6A5F"/></button>
            <button style={iconRoundBtn} aria-label="Not helpful"><IThumbDn size={14} stroke="#6B6A5F"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Simple user bubble
// ===================================================================
function UserBubble({ text, time, voice }) {
  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
      <div style={{ maxWidth: '80%', background: 'var(--primary)', color: 'white', padding: '13px 16px', borderRadius: '20px 20px 8px 20px', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, lineHeight: 1.45, boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(46,74,58,0.18)' }}>
        {text}
      </div>
      {voice && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 4px', fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.02em' }}>
          <MiniWave/> voice · 8s · {time}
        </div>
      )}
      {!voice && time && (
        <div style={{ padding: '0 4px', fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>{time}</div>
      )}
    </div>
  );
}

// ===================================================================
// Simple AI reply bubble (for follow-up messages)
// ===================================================================
function AIBubble({ text, sections, thinking }) {
  return (
    <div className="fade-up" style={{ maxWidth: '92%', alignSelf: 'flex-start', background: 'var(--surface)', borderRadius: '20px 20px 20px 8px', boxShadow: '0 1px 3px rgba(20,18,12,0.06), 0 10px 28px rgba(20,18,12,0.09)', overflow: 'hidden' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, #2E4A3A 0%, #5a8a6a 45%, #C9974A 100%)' }}/>
      <div style={{ padding: '14px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <ISpark size={10} stroke="#fff"/>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 9.5, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>AI Response</span>
          {thinking && <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, color: 'var(--ink-soft)' }}>Thinking<span style={{ animation: 'caretBlink 0.9s steps(1) infinite' }}>...</span></span>}
        </div>
        {thinking ? (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--primary)', opacity: 0.5, animation: `caretBlink 1.1s ${i * 0.18}s steps(1) infinite` }}/>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {text && <p style={{ margin: 0, fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.60 }}>{renderInline(text)}</p>}
            {sections && sections.map((sec, si) => (
              <div key={si}>
                {sec.type === 'section' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
                      <span style={{ width: 3, height: 14, borderRadius: 99, background: 'var(--primary)', flex: 'none' }}/>
                      <span style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>{sec.heading}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 4 }}>
                      {sec.bullets.map((b, bi) => (
                        <div key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                          <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--primary)', opacity: 0.4, flex: 'none', marginTop: 7 }}/>
                          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)', lineHeight: 1.55 }}>{renderInline(b)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================================================================
// Simulated AI replies for common follow-up topics
// ===================================================================
function simulateAIReply(question) {
  const q = question.toLowerCase();
  if (q.includes('dosage') || q.includes('dose') || q.includes('how much')) {
    return {
      text: '**Tilt 25EC dosage for Septoria blight** on wheat at flowering stage:',
      sections: [
        { type: 'section', heading: 'Mixing Guide', bullets: ['**1 ml Tilt 25EC** per litre of water', 'Spray volume: **200–300 litres/hectare**', 'For Ramesh\'s **3.2 acres** (1.3 ha): ~260–390 litres total'] },
        { type: 'section', heading: 'Application Tips', bullets: ['Spray in **morning or evening** — avoid midday heat', 'Target both **upper and lower** leaf surfaces', 'Do NOT apply if rain forecast within **4 hours**'] },
      ],
    };
  }
  if (q.includes('safety') || q.includes('precaution') || q.includes('protect')) {
    return {
      text: '**Safety precautions for Tilt 25EC** (propiconazole):',
      sections: [
        { type: 'section', heading: 'Personal Protection', bullets: ['Wear **gloves + mask** during mixing and spraying', 'Avoid spraying in **windy conditions** (drift risk)', 'Wash hands and face after application'] },
        { type: 'section', heading: 'Field Re-entry', bullets: ['Wait **24 hours** before entering sprayed fields', 'Pre-harvest interval (PHI): **21 days**', 'Keep children and livestock away during application'] },
      ],
    };
  }
  if (q.includes('alternative') || q.includes('stock') || q.includes('substitute')) {
    return {
      text: '**Alternatives if Tilt 25EC is unavailable:**',
      sections: [
        { type: 'section', heading: 'First Choice', bullets: ['**Score 250 EC** (difenoconazole) — same triazole group', 'Dose: **0.5 ml/litre**, similar efficacy against Septoria', 'Available at Baramati Agro (8 km away)'] },
        { type: 'section', heading: 'Second Choice', bullets: ['**Dithane M-45** (mancozeb) — contact fungicide', 'Less systemic — requires more frequent sprays', 'Use only if neither triazole is available'] },
      ],
    };
  }
  if (q.includes('weather') || q.includes('rain') || q.includes('forecast')) {
    return {
      text: '**Current weather outlook for Hardoi block:**',
      sections: [
        { type: 'section', heading: 'Next 48 Hours', bullets: ['Today evening: **Clear — ideal spray window**', 'Tomorrow: 60% rain probability after 3 PM', '**Spray today morning** is strongly recommended'] },
        { type: 'section', heading: 'Disease Risk Factors', bullets: ['48mm cumulative rainfall this week **exceeded threshold**', 'Humidity sustained at **89%** — spore release elevated', 'Temperature range 22–28°C favours Septoria spread'] },
      ],
    };
  }
  // Generic fallback
  return {
    text: `**Based on Ramesh's field data and current conditions**, here is my assessment:`,
    sections: [
      { type: 'section', heading: 'Key Insight', bullets: ['Septoria infection risk remains **HIGH** at flowering stage', 'Immediate fungicide application is the priority action', 'Monitor response after 5 days — follow up if symptoms spread'] },
      { type: 'section', heading: 'Recommended Next Step', bullets: ['Confirm Tilt 25EC availability at Kisan Store', 'Schedule spray for **today or tomorrow morning**', 'Log this visit outcome after application'] },
    ],
  };
}

// ===================================================================
// Follow-up suggestions
// ===================================================================
function FollowUps({ onSend, suggestions }) {
  return (
    <div style={{ padding: '12px 18px 12px', background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, var(--bg) 50%)' }}>
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {suggestions.map((t, i) => (
          <button key={t} onClick={() => onSend(t)} className="slide-in-l" style={{ flex: 'none', padding: '8px 13px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', animationDelay: `${i * 60}ms`, boxShadow: '0 1px 2px rgba(20,18,12,0.04)' }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Input row
// ===================================================================
function InputRow({ onSend }) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const inputRef = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div style={{ padding: '8px 18px 20px', background: 'var(--bg)', borderTop: '1px solid rgba(229,220,201,0.7)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, padding: '6px 6px 6px 18px', boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(20,18,12,0.06)' }}>
        <input
          ref={inputRef}
          placeholder="Ask anything..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          style={{ flex: 1, minWidth: 0, height: 36, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)' }}
        />
        <button onClick={() => setRecording(r => !r)} className={recording ? 'fab-pulse' : 'fab-breathe-mic'} style={{ width: 44, height: 44, borderRadius: '50%', background: 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', flex: 'none', boxShadow: '0 6px 14px rgba(46,74,58,0.30), inset 0 1px 0 rgba(255,255,255,0.18)' }} aria-label="Voice">
          <IMic size={18} stroke="#fff"/>
        </button>
        <button onClick={submit} style={{ width: 44, height: 44, borderRadius: '50%', background: text.trim() ? 'var(--primary)' : 'var(--surface-warm)', border: '1px solid var(--border)', color: text.trim() ? 'white' : 'var(--ink-soft)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transition: 'all 200ms' }} aria-label="Send">
          <ISend size={17} stroke={text.trim() ? '#fff' : '#6B6A5F'}/>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Chat screen — dynamic with localStorage persistence
// ===================================================================
const STORAGE_KEY = 'agropilot_chat_v1';
const FOLLOW_UP_POOL = ['What dosage?', 'Any safety precautions?', 'Alternative if out of stock?', 'Check weather?', 'When to spray?'];

const INITIAL_MESSAGES = [
  { id: 'u0', role: 'user', text: "Ramesh's wheat is showing early signs of blight — what should I recommend?", time: '11:42 AM', voice: true },
  { id: 'a0', role: 'ai', hero: true },
];

function ChatScreen() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_MESSAGES;
  });
  const [showReasoning, setShowReasoning] = useState(false);
  const [followUps, setFollowUps] = useState(FOLLOW_UP_POOL.slice(0, 3));
  const bottomRef = useRef(null);

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch (_) {}
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const thinkingId = 'think' + Date.now();

    setMessages(prev => [
      ...prev,
      { id: 'u' + Date.now(), role: 'user', text, time: now, voice: false },
      { id: thinkingId, role: 'ai', thinking: true },
    ]);

    setFollowUps(FOLLOW_UP_POOL.filter(f => f !== text).slice(0, 3));

    // Try backend first, fall back to local simulation
    const backendReply = await callBackend(text, messages);
    const reply = backendReply || simulateAIReply(text);

    setMessages(prev => [
      ...prev.filter(m => m.id !== thinkingId),
      { id: 'a' + Date.now(), role: 'ai', ...reply },
    ]);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg)', paddingTop: 48, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Paper grain */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }}/>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Header/>
        <ContextChips/>

        {/* Messages */}
        <div className="no-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '18px 18px 8px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {messages.map((msg) => {
            if (msg.role === 'user') {
              return <UserBubble key={msg.id} text={msg.text} time={msg.time} voice={msg.voice}/>;
            }
            if (msg.hero) {
              return <AIResponse key={msg.id} onShowReasoning={() => setShowReasoning(true)}/>;
            }
            return <AIBubble key={msg.id} text={msg.text} sections={msg.sections} thinking={msg.thinking}/>;
          })}
          <div ref={bottomRef}/>
        </div>

        <FollowUps suggestions={followUps} onSend={sendMessage}/>
        <InputRow onSend={sendMessage}/>
      </div>

      {/* Reasoning overlay — slides in, no page nav, state preserved */}
      {showReasoning && <ReasoningOverlay onClose={() => setShowReasoning(false)}/>}
    </div>
  );
}

// ===================================================================
// Mount
// ===================================================================
function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'radial-gradient(at 28% 14%, #586b3f 0%, #3f5230 50%, #2c3a22 100%)' }}>
      <IOSDevice width={390} height={844}>
        <ChatScreen/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
