// Reasoning Graph screen — 390px mobile
// SVG node-and-edge visualization of why a recommendation was made.

const { useState, useEffect, useRef } = React;

// ===================================================================
// Icons (Lucide-style)
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}{extra}
  </svg>
);
const IX = (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;
const IShare = (p) => <Icon {...p} d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="11.49"/></>}/>;
const IChevR = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>}/>;
const IExt = (p) => <Icon {...p} d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>}/>;
const ISprout = (p) => <Icon {...p} d={<><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></>}/>;
const IUser = (p) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>;
const IWheat = (p) => <Icon {...p} d={<><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></>}/>;
const ICloudRain = (p) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></>}/>;
const IDroplets = (p) => <Icon {...p} d={<><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></>}/>;
const IHistory = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>;
const IPin = (p) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>}/>;

// ===================================================================
// Geometry
// ===================================================================
const VB_W = 390, VB_H = 380;
const CENTER = { x: VB_W / 2, y: VB_H / 2 + 6 };
const RADIUS = 132;
const NODES = [
  // angle in degrees from top (clockwise)
  { id: 'farmer',   label: 'Ramesh',        Icon: IUser,      edge: 'treats',         angle: -90,  type: 'Person',                facts: [['Member', 'Since 2021'], ['Village', 'Bhatpura, Block 4'], ['Last visit', '7 days ago']], source: 'Farmer profile · CRM' },
  { id: 'variety',  label: 'HD-2967',       Icon: IWheat,     edge: 'for',            angle: -30,  type: 'Crop Variety',          facts: [['Susceptibility', 'Moderate to Septoria'], ['Plot size', '3.2 acres'], ['Stage', 'Flowering (BBCH 65)']], source: 'IARI cultivar database' },
  { id: 'rain',     label: '48mm rain',     Icon: ICloudRain, edge: 'triggers',       angle:  30,  type: 'Environmental Signal',  facts: [['Window', 'Mon–Tue, 31h saturation'], ['Source', 'Hardoi block stations'], ['Threshold', 'Exceeded by 12mm']], source: 'IMD station feed' },
  { id: 'humid',    label: '89% humidity',  Icon: IDroplets,  edge: 'amplifies',      angle:  90,  type: 'Environmental Signal',  facts: [['Duration', '18 hours sustained'], ['Canopy wetness', 'Dawn window matched'], ['Spore release', 'Elevated']], source: 'IMD station feed' },
  { id: 'history',  label: '2023 outbreak', Icon: IHistory,   edge: 'matches',        angle:  150, type: 'Historical Match',      facts: [['Panchayat', 'Bhatpura + Mallawan'], ['Loss', '12–22% yield, 14 plots'], ['Pattern overlap', '0.87 cosine']], source: 'Field outbreak ledger' },
  { id: 'stock',    label: 'Stock 5km',     Icon: IPin,       edge: 'available at',   angle:  210, type: 'Logistics Signal',      facts: [['Outlet', 'Kisan Store, Sandila Rd'], ['SKUs', 'Tilt 25EC · 500ml × 14'], ['Drive time', '11 min']], source: 'Retailer inventory · 2h ago' },
];

function polar(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return { x: CENTER.x + Math.cos(rad) * radius, y: CENTER.y + Math.sin(rad) * radius };
}
function midpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function offsetAlong(a, b, distFromA) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  return { x: a.x + (dx / len) * distFromA, y: a.y + (dy / len) * distFromA };
}

// ===================================================================
// Header
// ===================================================================
function Header({ onClose }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(245,241,232,0.85)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      borderBottom: '1px solid rgba(229,220,201,0.7)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center',
        padding: '10px 14px',
      }}>
        <a href="AI Consultant.html" style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--ink)', textDecoration: 'none',
        }}>
          <IX size={17}/>
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
            color: 'var(--ink)', letterSpacing: '-0.005em',
          }}>Why this recommendation?</div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
            color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2,
          }}>Reasoning Graph</div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
          cursor: 'pointer', justifySelf: 'end',
        }}>
          <IShare size={16}/>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Graph canvas
// ===================================================================
function GraphCanvas({ selected, onSelect }) {
  // edges precomputed: from outer node toward center
  const edges = NODES.map((n) => {
    const p = polar(n.angle, RADIUS);
    const a = offsetAlong(p, CENTER, 30);          // start at outer node boundary (~30px from center)
    const b = offsetAlong(CENTER, p, 47);          // end at center node boundary (~47px from CENTER)
    return { id: n.id, from: a, to: b, mid: midpoint(a, b), angle: n.angle, label: n.edge };
  });

  const isDim = (id) => selected && selected !== id;

  return (
    <div style={{
      position: 'relative', height: 380,
      background: 'var(--surface-warm)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* subtle grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="#6B6A5F" fillOpacity="0.18"/>
          </pattern>
          <radialGradient id="canvasGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#C8D5BB" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#C8D5BB" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)"/>
        <rect width="100%" height="100%" fill="url(#canvasGlow)"/>
      </svg>

      {/* SVG graph */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {/* center halo */}
        <circle cx={CENTER.x} cy={CENTER.y} r="64"
          fill="none" stroke="#2E4A3A" strokeOpacity="0.10" strokeWidth="1"/>
        <circle cx={CENTER.x} cy={CENTER.y} r="78"
          fill="none" stroke="#2E4A3A" strokeOpacity="0.06" strokeWidth="1"/>

        {/* edges */}
        {edges.map((e, i) => (
          <g key={e.id} style={{ opacity: isDim(e.id) ? 0.18 : 1, transition: 'opacity 240ms ease' }}>
            <line
              x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
              stroke="#2E4A3A" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round"
              className="edge-draw"
              style={{ animationDelay: `${250 + i * 180}ms` }}
            />
            {/* traveling pulse dot */}
            <circle r="2.6" fill="#C9974A" className="edge-pulse"
              style={{
                offsetPath: `path("M ${e.from.x} ${e.from.y} L ${e.to.x} ${e.to.y}")`,
                animationDelay: `${i * 0.65}s`,
              }}
            />
            {/* edge label */}
            <g transform={`translate(${e.mid.x}, ${e.mid.y})`} className="edge-label" style={{ animationDelay: `${550 + i * 180}ms` }}>
              <rect x="-26" y="-7" width="52" height="14" rx="7"
                fill="#FAF6EC" stroke="#E5DCC9" strokeWidth="0.8"/>
              <text textAnchor="middle" y="3.5"
                style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: 8.5, fontWeight: 600,
                  fill: '#6B6A5F', letterSpacing: '0.04em',
                }}>{e.label}</text>
            </g>
          </g>
        ))}

        {/* outer nodes */}
        {NODES.map((n, i) => {
          const p = polar(n.angle, RADIUS);
          const dim = isDim(n.id);
          const active = selected === n.id;
          return (
            <g key={n.id}
              className="node-in"
              style={{
                animationDelay: `${900 + i * 80}ms`,
                opacity: dim ? 0.28 : 1, transition: 'opacity 240ms ease',
                cursor: 'pointer', transformBox: 'fill-box', transformOrigin: 'center',
              }}
              onClick={() => onSelect(n.id)}
            >
              <circle cx={p.x} cy={p.y} r="32"
                fill="#FFFFFF" stroke={active ? '#2E4A3A' : '#E5DCC9'} strokeWidth={active ? 2 : 1}
                filter="url(#nodeShadow)"
              />
              <circle cx={p.x} cy={p.y} r="32" fill="url(#warmInside)" opacity="0.6"/>
              <foreignObject x={p.x - 30} y={p.y - 26} width="60" height="52">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                  width: 60, height: 52, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  pointerEvents: 'none',
                }}>
                  <n.Icon size={16} stroke="#2E4A3A"/>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
                    color: '#1A1A17', textAlign: 'center', lineHeight: 1.1,
                    letterSpacing: '-0.005em',
                  }}>{n.label}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* center node */}
        <g className="node-in" style={{ animationDelay: '700ms', transformBox: 'fill-box', transformOrigin: 'center' }}>
          {/* glow ring */}
          <circle cx={CENTER.x} cy={CENTER.y} r="48" fill="none"
            stroke="#2E4A3A" strokeOpacity="0.35" strokeWidth="2" className="center-glow"/>
          <circle cx={CENTER.x} cy={CENTER.y} r="45" fill="#2E4A3A"
            filter="url(#centerShadow)"/>
          <circle cx={CENTER.x} cy={CENTER.y} r="45"
            fill="url(#centerSheen)" opacity="0.6"/>
          <foreignObject x={CENTER.x - 42} y={CENTER.y - 36} width="84" height="72">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{
              width: 84, height: 72, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              pointerEvents: 'none',
            }}>
              <ISprout size={18} stroke="#FAF6EC"/>
              <div style={{
                fontFamily: 'Fraunces', fontWeight: 500, fontSize: 13,
                color: '#FAF6EC', textAlign: 'center', lineHeight: 1.05,
                letterSpacing: '-0.005em',
                fontVariationSettings: '"opsz" 14',
              }}>Tilt 25EC</div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 8.5, fontWeight: 700,
                color: 'rgba(245,241,232,0.7)', textAlign: 'center',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>Recommendation</div>
            </div>
          </foreignObject>
        </g>

        <defs>
          <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#141812" floodOpacity="0.10"/>
          </filter>
          <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#2E4A3A" floodOpacity="0.35"/>
          </filter>
          <radialGradient id="warmInside" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FAF6EC" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="centerSheen" cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#7c9784" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#2E4A3A" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>

      {/* legend / hint */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        padding: '4px 10px', borderRadius: 999,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid var(--border)',
        fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
        color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>
        6 signals · 1 outcome
      </div>
      <div style={{
        position: 'absolute', bottom: 12, left: 14,
        fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)',
      }}>
        Tap a node to inspect · Pinch to zoom
      </div>
    </div>
  );
}

// ===================================================================
// Reasoning trail (steps)
// ===================================================================
const STEPS = [
  { n: 1, text: 'Detected wheat at flowering stage from farmer profile',          src: 'Farmer profile' },
  { n: 2, text: 'Connected rainfall and humidity to fungal risk model',           src: 'IMD + risk engine' },
  { n: 3, text: 'Matched current pattern against 2023 outbreak in same panchayat', src: 'Outbreak ledger' },
  { n: 4, text: 'Filtered Syngenta products for early-stage blight efficacy',     src: 'Product catalogue' },
  { n: 5, text: 'Identified in-stock location within 5km radius',                 src: 'Retailer inventory' },
];

function ReasoningTrail() {
  return (
    <div style={{
      background: 'var(--surface)',
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      boxShadow: '0 -10px 30px rgba(20,18,12,0.10)',
      padding: '10px 20px 18px',
      position: 'relative',
    }}>
      {/* handle */}
      <div style={{
        display: 'flex', justifyContent: 'center', padding: '2px 0 10px',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }}/>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em',
            color: 'var(--ink)', margin: 0,
          }}>Reasoning trail</h2>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)',
            margin: '3px 0 0',
          }}>How we connected the dots</p>
        </div>
        <span style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
          color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>5 steps</span>
      </div>

      <div style={{ marginTop: 14 }}>
        {STEPS.map((s, i) => (
          <div key={s.n} className="fade-up" style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 18px', columnGap: 12, alignItems: 'flex-start',
            padding: '8px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--border)',
            animationDelay: `${1400 + i * 70}ms`,
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces', fontWeight: 500, fontSize: 13,
                fontVariationSettings: '"opsz" 14',
              }}>{s.n}</div>
            </div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)',
              lineHeight: 1.42, paddingTop: 4, textWrap: 'pretty',
            }}>
              {s.text}
              <div style={{
                marginTop: 3, fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600,
                letterSpacing: '0.02em',
              }}>{s.src}</div>
            </div>
            <IChevR size={15} stroke="#6B6A5F" style={{ marginTop: 8 }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Node detail flyout
// ===================================================================
function NodeFlyout({ nodeId, onClose }) {
  const node = NODES.find(n => n.id === nodeId);
  if (!node) return null;
  return (
    <>
      <div onClick={onClose} className="scrim" style={{
        position: 'absolute', inset: 0, background: 'rgba(26,26,23,0.36)',
        backdropFilter: 'blur(2px)', zIndex: 60,
      }}/>
      <div className="flyout-in" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 70,
        background: 'var(--surface)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: '0 -16px 40px rgba(20,18,12,0.28)',
        padding: '12px 22px 26px',
        maxHeight: '70%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
              color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>{node.type}</div>
            <h3 style={{
              fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, lineHeight: 1.15,
              letterSpacing: '-0.01em', color: 'var(--ink)', margin: '4px 0 0',
              fontVariationSettings: '"opsz" 24',
            }}>{node.label}</h3>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--surface-warm)', border: '1px solid var(--border)',
            color: 'var(--ink)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><IX size={14}/></button>
        </div>

        <div style={{
          marginTop: 14, padding: '4px 0',
          borderTop: '1px solid var(--border)',
        }}>
          {node.facts.map(([k, v]) => (
            <div key={k} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr', columnGap: 14,
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700,
                color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase',
                paddingTop: 2,
              }}>{k}</span>
              <span style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)',
                fontWeight: 500,
              }}>{v}</span>
            </div>
          ))}
        </div>

        <a href="#" style={{
          marginTop: 12,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700,
          color: 'var(--primary)', textDecoration: 'none',
        }}>
          Source · {node.source}
          <IExt size={12} stroke="#2E4A3A"/>
        </a>
      </div>
    </>
  );
}

// ===================================================================
// Sticky action row
// ===================================================================
function StickyActions() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
      paddingTop: 16, paddingBottom: 18, paddingLeft: 18, paddingRight: 18,
      background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, #FFFFFF 65%)',
      borderTop: '1px solid var(--border)',
      pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <a href="AI Consultant.html" style={{
          width: '100%', height: 52, borderRadius: 14,
          background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14.5,
          boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', letterSpacing: '-0.005em',
        }}>
          Use this answer
        </a>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <a href="AI Consultant.html" style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700,
            color: 'var(--ink-soft)', textDecoration: 'none',
          }}>Ask follow-up →</a>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Screen
// ===================================================================
function ReasoningGraph() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
      paddingTop: 48,
    }}>
      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 120 }}>
        <Header/>
        <GraphCanvas selected={selected} onSelect={(id) => setSelected(id)}/>
        <ReasoningTrail/>
      </div>
      {selected && <NodeFlyout nodeId={selected} onClose={() => setSelected(null)}/>}
      <StickyActions/>
    </div>
  );
}

// ===================================================================
// Mount
// ===================================================================
function App() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32,
      background: 'radial-gradient(at 28% 14%, #586b3f 0%, #3f5230 50%, #2c3a22 100%)',
    }}>
      <IOSDevice width={390} height={844}>
        <ReasoningGraph/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
