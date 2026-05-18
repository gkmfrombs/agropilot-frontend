// Morning Briefing — refined organic-modern field-rep home
// 390px mobile  ·  premium editorial pass
//
// Visual moves vs v1:
//  · Cinematic photo hero behind greeting (golden-hour wheat), warm mask
//  · Editorial stats ribbon (visits · km · target) with hairline rules
//  · Alert card now layered: mini rainfall bars + corner wheat thumb + italic Fraunces accent
//  · Farmer cards: left-edge risk rule, 52px avatar, italic Fraunces note, action chip
//  · Refined section dividers with a single ornamental dot
//  · Voice FAB with concentric rings + soft golden inner glow
//  · Bottom nav polished, primary action elevated

const useState = React.useState;

// ===================================================================
// Icons (Lucide-style, 1.5 stroke, rounded)
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}{extra}
  </svg>
);
const IBell = (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />;
const ICloudRain = (p) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></>} />;
const IChev = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>} />;
const INav = (p) => <Icon {...p} d={<path d="m3 11 19-9-9 19-2-8-8-2z"/>} />;
const IPhone = (p) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>} />;
const IMic = (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>} />;
const IHome = (p) => <Icon {...p} d={<><path d="M3 9.5 12 2l9 7.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></>} />;
const IMap = (p) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/></>} />;
const IChat = (p) => <Icon {...p} d={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>} />;
const ISync = (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 14.85-6.85L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-14.85 6.85L3 16"/><path d="M3 21v-5h5"/></>} />;
const IUser = (p) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
const ICheck = (p) => <Icon {...p} d={<path d="M20 6 9 17l-5-5"/>} />;
const ISpark = (p) => <Icon {...p} d={<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>} />;

// ===================================================================
// Tokens
// ===================================================================
const PHOTO_HERO = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop';
const PHOTO_WHEAT = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format&fit=crop';

// ===================================================================
// Reusable bits
// ===================================================================
const PulseDot = ({ color = '#B85C3C', size = 6 }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <span className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    <span style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: color }}/>
  </span>
);

// Editorial small-caps eyebrow
const Eyebrow = ({ children, color = 'var(--ink-soft)' }) => (
  <span style={{
    fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
    color, letterSpacing: '0.18em', textTransform: 'uppercase',
  }}>{children}</span>
);

// Decorative wheat stalk (fine line)
const WheatStalk = ({ size = 64, color = '#1A1A17', opacity = 0.14, style }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 64 88" fill="none" style={{ opacity, ...style }}>
    <line x1="32" y1="6" x2="32" y2="84" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
    {[0,1,2,3,4,5,6,7].map(i => (
      <g key={i} transform={`translate(32, ${12 + i * 8.5})`}>
        <path d="M0 0 Q -7 -3 -11 -10" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <path d="M0 0 Q  7 -3  11 -10" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <ellipse cx="-8" cy="-6" rx="3.4" ry="1.6" stroke={color} strokeWidth="1" fill="none" transform="rotate(-30 -8 -6)"/>
        <ellipse cx="8"  cy="-6" rx="3.4" ry="1.6" stroke={color} strokeWidth="1" fill="none" transform="rotate(30 8 -6)"/>
      </g>
    ))}
  </svg>
);

// ===================================================================
// Top status strip (offline + bell)
// ===================================================================
function TopStrip() {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(245,241,232,0.78)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      borderBottom: '1px solid rgba(229,220,201,0.7)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 11px 5px 10px', borderRadius: 999,
            background: 'var(--primary-soft)', color: 'var(--primary)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600,
          }}>
            <PulseDot color="#2E4A3A" size={6}/>
            Offline
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>
            3 actions queued
          </span>
        </div>
        <button style={{
          position: 'relative', width: 36, height: 36, borderRadius: 12,
          background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)',
        }}>
          <IBell size={20}/>
          <span style={{
            position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16,
            padding: '0 4px', borderRadius: 999,
            background: 'var(--accent)', color: 'white',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 2.5px rgba(245,241,232,0.95)',
          }}>2</span>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Cinematic hero — greeting laid over a wheat-at-golden-hour photo
// ===================================================================
function Hero() {
  return (
    <div className="fade-up" style={{ animationDelay: '0ms',
        margin: '14px 18px 0', borderRadius: 24, overflow: 'hidden',
        position: 'relative', minHeight: 196,
        background: '#2E4A3A',
        boxShadow: '0 1px 2px rgba(20,18,12,0.06), 0 18px 36px rgba(20,18,12,0.14)',
      }}
    >
      {/* photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${PHOTO_HERO})`,
        backgroundSize: 'cover', backgroundPosition: 'center 60%',
        filter: 'saturate(1.05) contrast(1.02)',
      }}/>
      {/* warm duotone overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(26,26,23,0.15) 0%, rgba(26,26,23,0.05) 30%, rgba(26,26,23,0.55) 78%, rgba(26,26,23,0.78) 100%)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0, mixBlendMode: 'multiply',
        background: 'linear-gradient(140deg, rgba(46,74,58,0.18) 0%, rgba(201,151,74,0.18) 100%)',
      }}/>

      {/* content */}
      <div style={{
        position: 'relative', zIndex: 2, color: '#F5F1E8',
        padding: '18px 20px 18px', display: 'flex', flexDirection: 'column', minHeight: 196,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Eyebrow color="rgba(245,241,232,0.78)">Tue · 16 May · Hardoi</Eyebrow>
          {/* weather glass chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 11px 6px 9px', borderRadius: 999,
            background: 'rgba(245,241,232,0.16)',
            backdropFilter: 'blur(10px) saturate(160%)',
            WebkitBackdropFilter: 'blur(10px) saturate(160%)',
            border: '1px solid rgba(245,241,232,0.22)',
            color: '#F5F1E8',
          }}>
            <ICloudRain size={15} stroke="#F5F1E8"/>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12 }}>32° · Rain by 3pm</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <h1 style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 36, lineHeight: 1.02,
            letterSpacing: '-0.025em', color: '#FAF6EC', margin: 0,
            fontVariationSettings: '"opsz" 60',
            textShadow: '0 2px 18px rgba(20,18,12,0.35)',
          }}>
            Good morning,<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Arjun.</span>
          </h1>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 500,
            color: 'rgba(245,241,232,0.82)',
            margin: '8px 0 0',
          }}>
            5 farms need you before the rain arrives.
          </p>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Editorial stats ribbon
// ===================================================================
function StatsRibbon() {
  const stats = [
    { k: 'Visits', v: '12', sub: 'planned' },
    { k: 'Route', v: '18.4', sub: 'km' },
    { k: 'Target', v: '₹47k', sub: 'tilt 25EC' },
  ];
  return (
    <div className="fade-up" style={{ animationDelay: '70ms',
        margin: '14px 18px 22px', padding: '14px 18px',
        background: 'var(--surface-warm)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', alignItems: 'center', gap: 0,
      }}
    >
      {stats.map((s, i) => (
        <React.Fragment key={s.k}>
          <div style={{ textAlign: i === 1 ? 'center' : (i === 2 ? 'right' : 'left') }}>
            <div style={{
              fontFamily: 'Fraunces', fontWeight: 500, fontSize: 22, lineHeight: 1,
              color: 'var(--ink)', letterSpacing: '-0.02em',
              fontVariationSettings: '"opsz" 36',
            }}>{s.v}</div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600,
              color: 'var(--ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginTop: 4,
            }}>{s.k} · <span style={{ fontWeight: 500, letterSpacing: '0.04em', textTransform: 'none', opacity: 0.85 }}>{s.sub}</span></div>
          </div>
          {i < 2 && <div style={{ width: 1, height: 30, background: 'var(--border)', margin: '0 auto' }}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ===================================================================
// Alert card — editorial, with mini rainfall + corner thumb
// ===================================================================
function MiniBars() {
  const days = [4, 8, 6, 14, 28, 38, 48];
  const max = 50;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 32 }}>
      {days.map((d, i) => {
        const tall = i >= 5;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: 7, height: Math.max(3, (d / max) * 30),
              background: tall ? 'var(--danger)' : 'rgba(46,74,58,0.32)',
              borderRadius: 2,
            }}/>
          </div>
        );
      })}
    </div>
  );
}

function AlertCard() {
  return (
    <div className="fade-up" style={{ animationDelay: '140ms',
        margin: '0 18px 24px', borderRadius: 20,
        background: 'var(--surface)',
        boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 28px rgba(20,18,12,0.07)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* left risk rule */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--danger)' }}/>
      {/* corner photo thumb */}
      <div style={{
        position: 'absolute', top: 12, right: 12, width: 64, height: 64, borderRadius: 14,
        backgroundImage: `url(${PHOTO_WHEAT})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid var(--border)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: 'linear-gradient(160deg, rgba(184,92,60,0.0) 50%, rgba(184,92,60,0.35) 100%)',
        }}/>
      </div>

      <div style={{ padding: '16px 18px 16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <PulseDot color="#B85C3C" size={6}/>
          <Eyebrow color="var(--danger)">New Predictive Alert</Eyebrow>
        </div>
        <h3 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 21, lineHeight: 1.14,
          letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0,
          maxWidth: 240, textWrap: 'pretty',
          fontVariationSettings: '"opsz" 30',
        }}>
          Wheat blight risk rising in <span style={{ fontStyle: 'italic', fontWeight: 400 }}>3 farms</span>
        </h3>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)',
          margin: '8px 0 0', lineHeight: 1.45,
        }}>
          48mm rainfall + humidity spike · <span style={{ color: 'var(--ink)' }}>2h ago</span>
        </p>

        {/* mini chart */}
        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MiniBars/>
            <div>
              <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 15, color: 'var(--ink)' }}>
                48<span style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}> mm</span>
              </div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, color: 'var(--ink-soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                last 7 days
              </div>
            </div>
          </div>
          <a href="Predictive Alert.html" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '8px 10px 8px 14px', borderRadius: 999,
            background: 'var(--primary)', color: 'white', border: 'none',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(46,74,58,0.22)',
            textDecoration: 'none',
          }}>
            View <IChev size={15}/>
          </a>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Section heading w/ ornamental dot
// ===================================================================
function SectionHeader() {
  return (
    <div className="fade-up" style={{ animationDelay: '210ms',
        padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }}/>
        <h2 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 19, letterSpacing: '-0.01em',
          color: 'var(--ink)', margin: 0,
        }}>Today's priority visits</h2>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 11px', borderRadius: 999,
        background: 'rgba(201,151,74,0.18)', color: '#8C6420',
        fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11,
        letterSpacing: '0.04em',
      }}>5 urgent</span>
    </div>
  );
}

// ===================================================================
// Filter chips
// ===================================================================
function FilterChips() {
  const [active, setActive] = useState('High Risk (5)');
  const chips = [
    { label: 'All', count: 12 },
    { label: 'High Risk', count: 5 },
    { label: 'Medium', count: 4 },
    { label: 'Low', count: 3 },
    { label: 'Routine', count: null },
  ];
  return (
    <div className="fade-up" style={{ animationDelay: '270ms',
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '2px 18px 6px', marginBottom: 14,
        scrollbarWidth: 'none',
      }}
      className="no-scrollbar"
    >
      {chips.map(c => {
        const key = c.count != null ? `${c.label} (${c.count})` : c.label;
        const on = key === active;
        return (
          <button key={c.label}
            onClick={() => setActive(key)}
            style={{
              flex: 'none',
              padding: '8px 14px', borderRadius: 999,
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5,
              background: on ? 'var(--primary)' : 'var(--surface)',
              color: on ? 'white' : 'var(--ink)',
              border: on ? '1px solid var(--primary)' : '1px solid var(--border)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: on ? '0 4px 14px rgba(46,74,58,0.18)' : 'none',
              transition: 'background 200ms ease, color 200ms ease',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {c.label}
            {c.count != null && (
              <span style={{
                fontWeight: 700, fontSize: 11,
                color: on ? 'rgba(255,255,255,0.78)' : 'var(--ink-soft)',
              }}>{c.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ===================================================================
// Farmer cards
// ===================================================================
const RISK = {
  HIGH:   { rule: '#B85C3C', bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', label: 'HIGH' },
  MEDIUM: { rule: '#D4A347', bg: 'rgba(212,163,71,0.20)', fg: '#8C6420', label: 'MED' },
  LOW:    { rule: '#7B9C6A', bg: 'rgba(200,213,187,0.6)', fg: '#2E4A3A', label: 'LOW' },
};

function FarmerCard({ farmer, index }) {
  const r = RISK[farmer.risk];
  return (
    <div className="fade-up" style={{ animationDelay: `${330 + index * 60}ms`,
        background: 'var(--surface)', borderRadius: 20,
        boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 28px rgba(20,18,12,0.06)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* left risk rule */}
      <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, background: r.rule, borderRadius: 99 }}/>

      <div style={{ padding: '16px 18px 14px 20px' }}>
        {farmer.cached && (
          <div style={{
            position: 'absolute', top: 12, right: 14,
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 600,
            color: 'var(--ink-soft)',
          }}>
            <ICheck size={11} stroke="#6B6A5F"/> Cached
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', flex: 'none',
            background: farmer.photo
              ? `center/cover url(${farmer.photo})`
              : 'var(--primary-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18,
            border: '1px solid var(--border)',
            boxShadow: 'inset 0 0 0 2px #FFF, 0 2px 8px rgba(20,18,12,0.08)',
          }}>
            {!farmer.photo && farmer.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17,
              color: 'var(--ink)', letterSpacing: '-0.005em',
            }}>{farmer.name}</div>
            <div style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: 12.5,
              color: 'var(--ink-soft)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6,
              flexWrap: 'wrap',
            }}>
              <span>{farmer.village}</span>
              <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }}/>
              <span>{farmer.dist}km</span>
              <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }}/>
              <span>{farmer.crop}</span>
            </div>
          </div>
          <span style={{
            padding: '4px 8px', borderRadius: 999,
            background: r.bg, color: r.fg,
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10.5,
            letterSpacing: '0.10em',
          }}>{r.label}</span>
        </div>

        {/* italic note in fraunces */}
        <div style={{
          marginTop: 12, paddingLeft: 0,
          fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400, fontSize: 14,
          color: 'var(--ink)', lineHeight: 1.42,
          fontVariationSettings: '"opsz" 14',
          textWrap: 'pretty', opacity: 0.85,
        }}>
          “{farmer.reason}”
        </div>

        <div style={{
          marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 9px 5px 8px', borderRadius: 999,
              background: 'rgba(201,151,74,0.14)', color: '#8C6420',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11,
            }}>
              <ISpark size={11} stroke="#C9974A"/>
              {farmer.confidence}%
            </span>
            <span style={{
              fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)',
            }}>
              Recommend <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{farmer.product}</span>
            </span>
          </div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <button style={ghostBtnDark}>
            <INav size={13} stroke="#FFFFFF"/>
            Navigate
          </button>
          <button style={ghostBtn}>
            <IPhone size={13} stroke="#2E4A3A"/>
            Call
          </button>
          <a href="Farmer Profile.html" style={{ ...ghostBtn, marginLeft: 'auto', textDecoration: 'none' }}>
            Details
            <IChev size={13} stroke="#2E4A3A"/>
          </a>
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '7px 11px', borderRadius: 12,
  background: 'var(--surface-warm)', border: '1px solid var(--border)',
  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12,
  color: 'var(--primary)', cursor: 'pointer',
};
const ghostBtnDark = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '7px 11px', borderRadius: 12,
  background: 'var(--primary)', border: '1px solid var(--primary)',
  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12,
  color: '#FFF', cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(46,74,58,0.20)',
};

// ===================================================================
// Bottom nav (5 items, primary action elevated)
// ===================================================================
function BottomNav() {
  const items = [
    { id: 'home', label: 'Home', I: IHome, active: true, href: '#' },
    { id: 'map', label: 'Map', I: IMap, href: '#' },
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
        background: 'var(--surface)',
        borderRadius: 22,
        boxShadow: '0 2px 4px rgba(20,18,12,0.06), 0 18px 40px rgba(20,18,12,0.14)',
        padding: '10px 6px',
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center',
        border: '1px solid rgba(229,220,201,0.6)',
        pointerEvents: 'auto',
      }}>
        {items.map(({ id, label, I, active, primary, href }) => (
          <a key={id} href={href} style={{
            background: 'transparent', border: 'none', padding: '4px 0',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 600,
            color: active ? 'var(--primary)' : 'var(--ink-soft)',
            cursor: 'pointer', position: 'relative', textDecoration: 'none',
            transform: active ? 'scale(1.04)' : 'scale(1)',
          }}>
            {primary ? (
              <div style={{
                width: 42, height: 42, borderRadius: 14, marginTop: -18,
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 18px rgba(46,74,58,0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
                color: 'white', border: '3px solid #FAF6EC',
              }}>
                <I size={19} stroke="#fff"/>
              </div>
            ) : (
              <I size={22} stroke={active ? '#2E4A3A' : '#6B6A5F'}/>
            )}
            <span style={{ marginTop: primary ? -2 : 0 }}>{label}</span>
            {active && (
              <span style={{
                position: 'absolute', bottom: -4, width: 16, height: 2.5, borderRadius: 99,
                background: 'var(--primary)',
              }}/>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Floating voice button
// ===================================================================
function VoiceFAB() {
  return (
    <div style={{
      position: 'absolute', right: 22, bottom: 108, zIndex: 50,
      width: 60, height: 60,
    }}>
      {[0, 0.6].map((delay, i) => (
        <span key={i}
          className="fab-ring"
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: '#2E4A3A',
            animationDelay: `${delay}s`,
          }}
        />
      ))}
      <button
        className="fab-breathe"
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 26px rgba(46,74,58,0.42), inset 0 1px 0 rgba(255,255,255,0.22), 0 0 0 1px rgba(20,18,12,0.04)',
          color: 'white',
        }}
      >
        {/* golden inner glow */}
        <span style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,151,74,0.16) 0%, rgba(201,151,74,0) 70%)',
        }}/>
        <IMic size={22} stroke="#fff"/>
      </button>
    </div>
  );
}

// ===================================================================
// Screen
// ===================================================================
function MorningBriefing() {
  const farmers = [
    {
      name: 'Ramesh Yadav', initials: 'RY', risk: 'HIGH', confidence: 94,
      village: 'Bhatpura', dist: '4.2', crop: 'Wheat · 3.2 ac',
      reason: 'Blight risk after 48mm rain at flowering — foliar window closes in 36h.',
      product: 'Tilt 25EC',
      photo: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&q=80&auto=format&fit=crop',
      cached: true,
    },
    {
      name: 'Suresh Verma', initials: 'SV', risk: 'HIGH', confidence: 91,
      village: 'Mallawan', dist: '6.8', crop: 'Wheat · 2.4 ac',
      reason: 'Yellow rust on neighbouring plots; humidity favours spread by Thursday.',
      product: 'Nativo 75WG',
      photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop',
      cached: true,
    },
    {
      name: 'Bal Kishore Singh', initials: 'BK', risk: 'HIGH', confidence: 88,
      village: 'Sandila', dist: '9.1', crop: 'Wheat + Mustard',
      reason: 'Bought trichoderma 11 days ago — flagged for follow-up before next spray.',
      product: 'Score 250EC',
      photo: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=200&q=80&auto=format&fit=crop',
      cached: false,
    },
    {
      name: 'Manju Devi', initials: 'MD', risk: 'MEDIUM', confidence: 76,
      village: 'Bhatpura', dist: '4.5', crop: 'Wheat · 1.8 ac',
      reason: 'Soil moisture above threshold; preventive note pending farmer consent.',
      product: 'Amistar Top',
      photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80&auto=format&fit=crop',
      cached: true,
    },
    {
      name: 'Vikram Pal', initials: 'VP', risk: 'LOW', confidence: 82,
      village: 'Atrauli', dist: '11.3', crop: 'Wheat · 5.0 ac',
      reason: 'Routine seed enquiry — new rabi cultivar ready to demo at field edge.',
      product: 'Seedcare Demo',
      photo: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=200&q=80&auto=format&fit=crop',
      cached: false,
    },
  ];

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
      paddingTop: 48, // iOS status bar
    }}>
      {/* warm paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>
      {/* decorative wheat — top right above status, very subtle */}
      <div style={{ position: 'absolute', top: 360, right: -22, zIndex: 1, pointerEvents: 'none' }}>
        <WheatStalk size={130} opacity={0.06}/>
      </div>
      <div style={{ position: 'absolute', top: 920, left: -28, zIndex: 1, pointerEvents: 'none', transform: 'rotate(18deg)' }}>
        <WheatStalk size={150} opacity={0.05}/>
      </div>

      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 150 }}>
        <TopStrip/>
        <Hero/>
        <StatsRibbon/>
        <AlertCard/>
        <SectionHeader/>
        <FilterChips/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 18px' }}>
          {farmers.map((f, i) => <FarmerCard key={f.name} farmer={f} index={i}/>)}
        </div>
        <div style={{ height: 40 }}/>
      </div>

      <VoiceFAB/>
      <BottomNav/>
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
        <MorningBriefing/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
