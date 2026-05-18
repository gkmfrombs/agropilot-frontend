// Farmer Profile screen — 390px mobile

const useState = React.useState;

// ===================================================================
// Icons (Lucide-style)
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}{extra}
  </svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IChevR = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>}/>;
const IMore = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>;
const IPhone = (p) => <Icon {...p} d={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>}/>;
const IMsg = (p) => <Icon {...p} d={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>}/>;
const INav = (p) => <Icon {...p} d={<path d="m3 11 19-9-9 19-2-8-8-2z"/>}/>;
const IAlert = (p) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>;
const IMic = (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>}/>;
const IPlay = (p) => <Icon {...p} d={<path d="m5 3 14 9-14 9V3z"/>} fill="currentColor"/>;
const ICamera = (p) => <Icon {...p} d={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>}/>;
const IPen = (p) => <Icon {...p} d={<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>}/>;

// Hero photo: Indian farmer in golden hour wheat field
const PHOTO_HERO = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=900&q=80&auto=format&fit=crop';
const PHOTO_WHEAT = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format&fit=crop';
const PHOTO_MUSTARD = 'https://images.unsplash.com/photo-1597474561103-0a82e08fa97c?w=400&q=80&auto=format&fit=crop';

// ===================================================================
// Header — floats over hero
// ===================================================================
function FloatingHeader() {
  const btn = {
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(20,18,12,0.18)',
    color: 'var(--ink)', textDecoration: 'none',
  };
  return (
    <div style={{
      position: 'absolute', top: 60, left: 0, right: 0, zIndex: 30,
      padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <a href="Morning Briefing.html" style={btn}><IChevL size={18}/></a>
      <button style={btn}><IMore size={18}/></button>
    </div>
  );
}

// ===================================================================
// Hero + profile card
// ===================================================================
function Hero() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'relative', height: 280, width: '100%', overflow: 'hidden',
      }}>
        <div className="ken-burns" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${PHOTO_HERO})`,
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'saturate(1.05) contrast(1.04)',
        }}/>
        {/* warm bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(26,26,23,0.18) 0%, rgba(26,26,23,0.0) 25%, rgba(26,26,23,0.0) 55%, rgba(26,26,23,0.45) 100%)',
        }}/>
        {/* warm wash */}
        <div style={{
          position: 'absolute', inset: 0, mixBlendMode: 'multiply',
          background: 'linear-gradient(180deg, rgba(201,151,74,0.10) 0%, rgba(46,74,58,0.10) 100%)',
        }}/>
        {/* tiny eyebrow at top */}
        <div style={{
          position: 'absolute', top: 122, left: 22,
          fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.92)', letterSpacing: '0.18em', textTransform: 'uppercase',
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}>Farmer Profile</div>
      </div>
    </div>
  );
}

function ProfileCard() {
  const iconBtn = {
    width: 44, height: 44, borderRadius: '50%',
    background: 'var(--surface-warm)', border: '1px solid var(--border)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--primary)', cursor: 'pointer',
  };
  const labelStyle = {
    marginTop: 6, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
    color: 'var(--ink-soft)', letterSpacing: '0.02em',
  };
  return (
    <div className="fade-up" style={{
      margin: '-40px 18px 0', position: 'relative', zIndex: 5,
      background: 'var(--surface)', borderRadius: 24,
      boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 14px 36px rgba(20,18,12,0.10)',
      padding: '20px 20px 18px',
      animationDelay: '80ms',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, lineHeight: 1.1,
            letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0,
            fontVariationSettings: '"opsz" 36',
          }}>
            Ramesh <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Kumar</span>
          </h1>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)',
            margin: '6px 0 0', lineHeight: 1.4,
          }}>
            Bhatpura, Block 4 · Member since 2021
          </p>
        </div>
        <span style={{
          flex: 'none',
          padding: '4px 9px', borderRadius: 999,
          background: 'rgba(184,92,60,0.12)', color: '#B85C3C',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10.5,
          letterSpacing: '0.10em',
        }}>HIGH</span>
      </div>

      <div style={{
        marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border)',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {[
          { I: IPhone, label: 'Call' },
          { I: IMsg, label: 'Message' },
          { I: INav, label: 'Navigate' },
        ].map(({ I, label }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={iconBtn}>
              <I size={18} stroke="#2E4A3A"/>
            </button>
            <span style={labelStyle}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Risk summary strip
// ===================================================================
function RiskStrip() {
  return (
    <a href="Predictive Alert.html" className="fade-up" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '14px 18px 0', padding: '12px 14px',
      background: 'var(--surface-warm)', border: '1px solid var(--border)',
      borderRadius: 16, textDecoration: 'none', color: 'inherit',
      animationDelay: '160ms',
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: '50%', flex: 'none',
        background: 'rgba(184,92,60,0.14)', color: '#B85C3C',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <IAlert size={17} stroke="#B85C3C"/>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600,
          color: 'var(--ink)',
        }}>
          1 high risk · 1 medium risk
        </div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)',
          marginTop: 2, letterSpacing: '0.02em',
        }}>
          Updated 2h ago · Tap to review
        </div>
      </div>
      <IChevR size={16} stroke="#6B6A5F"/>
    </a>
  );
}

// ===================================================================
// Tab bar
// ===================================================================
function Tabs({ tab, setTab }) {
  const tabs = ['Overview', 'Crops', 'History', 'Notes'];
  return (
    <div className="fade-up" style={{
      margin: '20px 18px 0',
      padding: 4, borderRadius: 14,
      background: 'rgba(229,220,201,0.55)',
      border: '1px solid rgba(229,220,201,0.7)',
      display: 'grid', gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, gap: 2,
      animationDelay: '220ms',
    }}>
      {tabs.map(t => {
        const on = t === tab;
        return (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 6px', borderRadius: 11, border: 'none', cursor: 'pointer',
            background: on ? 'var(--surface)' : 'transparent',
            boxShadow: on ? '0 1px 2px rgba(20,18,12,0.04), 0 4px 12px rgba(20,18,12,0.06)' : 'none',
            color: on ? 'var(--ink)' : 'var(--ink-soft)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 12.5,
            fontWeight: on ? 700 : 600,
            letterSpacing: '-0.005em',
            transition: 'background 220ms ease, color 220ms ease',
          }}>{t}</button>
        );
      })}
    </div>
  );
}

// ===================================================================
// Section header (small Fraunces)
// ===================================================================
function SectionH({ children, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 12, padding: '0 2px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--accent)' }}/>
        <h2 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, letterSpacing: '-0.005em',
          color: 'var(--ink)', margin: 0,
        }}>{children}</h2>
      </div>
      {right}
    </div>
  );
}

// ===================================================================
// Crop card
// ===================================================================
function CropCard({ photo, name, area, stagePct, stageLabel, footer, accent = 'var(--primary)' }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--surface)', borderRadius: 18,
      boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 20px rgba(20,18,12,0.05)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: 86, backgroundImage: `url(${photo})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(26,26,23,0) 50%, rgba(26,26,23,0.35) 100%)',
        }}/>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 15,
          color: 'var(--ink)', letterSpacing: '-0.005em', lineHeight: 1.2,
        }}>{name}</div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)',
          marginTop: 3,
        }}>{area}</div>
        {stagePct != null && (
          <div style={{ marginTop: 10 }}>
            <div style={{
              height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden',
            }}>
              <div style={{ width: `${stagePct}%`, height: '100%', background: accent, borderRadius: 999 }}/>
            </div>
            <div style={{
              marginTop: 6, display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, color: 'var(--ink-soft)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
            }}>
              <span>{stageLabel}</span>
              <span>{stagePct}%</span>
            </div>
          </div>
        )}
        {footer && (
          <div style={{
            marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }}/>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ===================================================================
// Active risk card
// ===================================================================
function RiskCard() {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 20,
      boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 24px rgba(20,18,12,0.06)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 4, background: 'var(--danger)', borderRadius: 99 }}/>
      <div style={{ padding: '14px 18px 14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span className="pulse-ring-wrap" style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#B85C3C' }}/>
          </span>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
            color: 'var(--danger)', letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>Active Risk</span>
        </div>
        <h3 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
          color: 'var(--ink)', margin: 0, letterSpacing: '-0.005em',
        }}>
          Wheat blight — <span style={{ fontStyle: 'italic', fontWeight: 400 }}>High</span>
        </h3>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)',
          margin: '6px 0 0', lineHeight: 1.45,
        }}>
          Flowering stage + recent rainfall triggers blight watch
        </p>
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(201,151,74,0.16)', color: '#8C6420',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10.5,
          }}>94% confidence</span>
          <a href="Predictive Alert.html" style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700,
            color: 'var(--primary)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            View reasoning <IChevR size={13} stroke="#2E4A3A"/>
          </a>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Last visit card
// ===================================================================
function Waveform() {
  // static SVG waveform
  const bars = Array.from({ length: 38 }, (_, i) => {
    const base = Math.sin(i * 0.55) * 0.5 + 0.55;
    const jitter = ((i * 13) % 7) / 7 * 0.45;
    return Math.max(0.15, Math.min(1, base + jitter - 0.2));
  });
  return (
    <svg width="170" height="22" viewBox="0 0 170 22" fill="none" style={{ flex: 1 }}>
      {bars.map((h, i) => (
        <rect key={i} x={i * 4.3 + 1} y={(22 - h * 22) / 2}
          width="2.2" height={h * 22} rx="1.1"
          fill={i < 10 ? '#2E4A3A' : 'rgba(46,74,58,0.32)'}
        />
      ))}
    </svg>
  );
}

function LastVisitCard() {
  return (
    <div style={{
      background: 'var(--surface-warm)', borderRadius: 20,
      border: '1px solid var(--border)',
      padding: '14px 16px 14px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)',
      }}>
        <span>9 May 2026 · <span style={{ color: 'var(--ink)', fontWeight: 600 }}>7 days ago</span></span>
        <span style={{
          padding: '3px 8px', borderRadius: 999,
          background: 'rgba(46,74,58,0.10)', color: 'var(--primary)',
          fontWeight: 700, fontSize: 10.5, letterSpacing: '0.08em',
        }}>SALE</span>
      </div>
      <div style={{
        marginTop: 8, fontFamily: 'Fraunces', fontWeight: 400, fontStyle: 'italic',
        fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.45,
        fontVariationSettings: '"opsz" 18',
      }}>
        “Recommended seed treatment — farmer purchased 2 packs of Vibrance Cinta.”
      </div>
      <div style={{
        marginTop: 12, padding: '10px 12px', borderRadius: 14,
        background: 'var(--surface)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: 'none',
        }}>
          <IPlay size={11}/>
        </button>
        <Waveform/>
        <span style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700,
          color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums',
        }}>0:42</span>
      </div>
    </div>
  );
}

// ===================================================================
// "Why this visit today" card
// ===================================================================
function WhyToday() {
  return (
    <div style={{
      background: 'var(--primary-soft)', borderRadius: 20,
      padding: '16px 18px 16px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(20,18,12,0.03), 0 10px 26px rgba(46,74,58,0.10)',
    }}>
      {/* faint wheat stalk */}
      <svg width="120" height="160" viewBox="0 0 64 88" fill="none" style={{
        position: 'absolute', top: -10, right: -14, opacity: 0.13, transform: 'rotate(14deg)',
      }}>
        <line x1="32" y1="6" x2="32" y2="84" stroke="#2E4A3A" strokeWidth="1.1" strokeLinecap="round"/>
        {[0,1,2,3,4,5,6,7].map(i => (
          <g key={i} transform={`translate(32, ${12 + i * 8.5})`}>
            <path d="M0 0 Q -7 -3 -11 -10" stroke="#2E4A3A" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
            <path d="M0 0 Q  7 -3  11 -10" stroke="#2E4A3A" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
            <ellipse cx="-8" cy="-6" rx="3.4" ry="1.6" stroke="#2E4A3A" strokeWidth="1" fill="none" transform="rotate(-30 -8 -6)"/>
            <ellipse cx="8"  cy="-6" rx="3.4" ry="1.6" stroke="#2E4A3A" strokeWidth="1" fill="none" transform="rotate(30 8 -6)"/>
          </g>
        ))}
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
          color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>Today's Context</div>
        <p style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, lineHeight: 1.4,
          color: 'var(--ink)', margin: '8px 0 0', maxWidth: 290,
          fontVariationSettings: '"opsz" 18', textWrap: 'pretty',
        }}>
          Wheat at flowering + 48mm rain flagged Ramesh as high blight risk.
          <span style={{ color: 'var(--primary)', fontWeight: 500 }}> Stock available 5km away.</span>
        </p>
      </div>
    </div>
  );
}

// ===================================================================
// Tab content (Overview shown, others placeholder)
// ===================================================================
function OverviewContent() {
  return (
    <div className="fade-up" key="overview" style={{ animationDelay: '0ms' }}>
      <div style={{ padding: '24px 18px 0' }}>
        <SectionH>Current crops</SectionH>
        <div style={{ display: 'flex', gap: 12 }}>
          <CropCard
            photo={PHOTO_WHEAT}
            name="Wheat — HD-2967"
            area="3.2 acres"
            stagePct={60}
            stageLabel="Flowering"
            accent="var(--accent)"
          />
          <CropCard
            photo={PHOTO_MUSTARD}
            name="Mustard — Pusa-30"
            area="0.8 acres"
            stagePct={88}
            stageLabel="Maturity"
            footer="Harvest in 12 days"
            accent="var(--primary)"
          />
        </div>
      </div>

      <div style={{ padding: '22px 18px 0' }}>
        <SectionH right={<span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>2 active</span>}>Active risks</SectionH>
        <RiskCard/>
      </div>

      <div style={{ padding: '22px 18px 0' }}>
        <SectionH>Last visit</SectionH>
        <LastVisitCard/>
      </div>

      <div style={{ padding: '22px 18px 0' }}>
        <WhyToday/>
      </div>
    </div>
  );
}

function PlaceholderTab({ name }) {
  return (
    <div className="fade-up" key={name} style={{
      margin: '24px 18px 0', padding: '32px 20px',
      background: 'var(--surface-warm)', border: '1px dashed var(--border)',
      borderRadius: 20, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, color: 'var(--ink)',
      }}>{name}</div>
      <div style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6,
      }}>This tab is in design — preview the Overview tab.</div>
    </div>
  );
}

// ===================================================================
// Sticky action row
// ===================================================================
function StickyActions() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingTop: 28, paddingBottom: 20, paddingLeft: 18, paddingRight: 18,
      background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
      pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12,
        }}>
          <button style={ghostBtn}>
            <IPen size={13} stroke="#2E4A3A"/>
            Log visit
          </button>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }}/>
          <button style={ghostBtn}>
            <ICamera size={13} stroke="#2E4A3A"/>
            Add photo
          </button>
        </div>
        <a href="AI Consultant.html" style={{
          width: '100%', height: 56, borderRadius: 14,
          background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15,
          boxShadow: '0 6px 18px rgba(46,74,58,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none',
        }}>
          Start consultation
        </a>
      </div>
    </div>
  );
}
const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 0', background: 'transparent', border: 'none',
  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5,
  color: 'var(--primary)', cursor: 'pointer',
};

// ===================================================================
// Screen
// ===================================================================
function FarmerProfile() {
  const [tab, setTab] = useState('Overview');
  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>
      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 170 }}>
        <Hero/>
        <FloatingHeader/>
        <ProfileCard/>
        <RiskStrip/>
        <Tabs tab={tab} setTab={setTab}/>
        {tab === 'Overview' && <OverviewContent/>}
        {tab !== 'Overview' && <PlaceholderTab name={tab}/>}
      </div>
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
        <FarmerProfile/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
