// Predictive Alert Detail screen — 390px mobile
// Linked from home (alert card → View)

const useState = React.useState;

// ===================================================================
// Icons (Lucide-style, 1.5 stroke)
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d}{extra}
  </svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IChevR = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>}/>;
const IChevD = (p) => <Icon {...p} d={<path d="m6 9 6 6 6-6"/>}/>;
const IMore = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>;
const IAlert = (p) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>;
const IPin = (p) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>}/>;
const ICloudRain = (p) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></>}/>;
const IDroplets = (p) => <Icon {...p} d={<><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></>}/>;
const IWheat = (p) => <Icon {...p} d={<><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 9 18 7"/><path d="m17 12-2-2"/><path d="m14 15-2-2"/><path d="m20 15-2-2"/></>}/>;
const ICalClock = (p) => <Icon {...p} d={<><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></>}/>;
const IUsers = (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;
const IBell = (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>}/>;
const IX = (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>;

const PHOTO_HERO = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop';

// ===================================================================
// Header
// ===================================================================
function Header() {
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
        <a href="Morning Briefing.html" style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--ink)', textDecoration: 'none',
        }}>
          <IChevL size={18}/>
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
            color: 'var(--ink)', letterSpacing: '-0.005em',
          }}>Predictive Alert</div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 600,
            color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2,
          }}>ID · PA-2147</div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
          cursor: 'pointer', justifySelf: 'end',
        }}>
          <IMore size={18}/>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Hero image + title card (overlapping)
// ===================================================================
function HeroAndTitle() {
  return (
    <div style={{ position: 'relative', marginBottom: -30 + 30 /* visual marker */ }}>
      {/* photo */}
      <div style={{
        position: 'relative', height: 200, width: '100%', overflow: 'hidden',
      }}>
        <div className="ken-burns" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${PHOTO_HERO})`,
          backgroundSize: 'cover', backgroundPosition: 'center 55%',
          filter: 'saturate(0.85) contrast(1.05) brightness(0.78) hue-rotate(-6deg)',
        }}/>
        {/* warm dark gradient from bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(26,26,23,0.05) 0%, rgba(26,26,23,0.05) 30%, rgba(26,26,23,0.6) 100%)',
        }}/>
        {/* moody storm tint */}
        <div style={{
          position: 'absolute', inset: 0, mixBlendMode: 'multiply',
          background: 'linear-gradient(160deg, rgba(46,74,58,0.25) 0%, rgba(26,26,23,0.10) 100%)',
        }}/>
        {/* high risk pill */}
        <div style={{
          position: 'absolute', left: 20, bottom: 50,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 11px 6px 9px', borderRadius: 999,
          background: '#B85C3C', color: 'white',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.12em',
          boxShadow: '0 6px 14px rgba(184,92,60,0.35)',
        }}>
          <IAlert size={13} stroke="#FFFFFF"/>
          HIGH RISK
        </div>
        {/* timestamp */}
        <div style={{
          position: 'absolute', right: 20, bottom: 52,
          fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
          color: 'rgba(245,241,232,0.85)', letterSpacing: '0.06em',
        }}>
          Detected 16:42 · 2h ago
        </div>
      </div>

      {/* Title card overlapping */}
      <div className="fade-up" style={{
        margin: '-30px 18px 0', position: 'relative',
        background: 'var(--surface)', borderRadius: 20,
        boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 14px 36px rgba(20,18,12,0.10)',
        padding: '20px 20px 18px',
        animationDelay: '120ms',
      }}>
        <h1 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, lineHeight: 1.16,
          letterSpacing: '-0.015em', color: 'var(--ink)', margin: 0,
          fontVariationSettings: '"opsz" 36', textWrap: 'pretty',
        }}>
          Wheat blight risk rising in <span style={{ fontStyle: 'italic', fontWeight: 400 }}>3 farms</span>
        </h1>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)',
          margin: '8px 0 14px', lineHeight: 1.45,
        }}>
          Based on 5 connected signals · Detected 2h ago
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          paddingTop: 12, borderTop: '1px dashed var(--border)',
          fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)',
        }}>
          <IPin size={14} stroke="#6B6A5F"/>
          <span><strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Hardoi District</strong> · 3 farms within 8km</span>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Signal timeline
// ===================================================================
const SIGNALS = [
  { id: 's1', Icon: ICloudRain, title: 'Heavy rainfall', sub: '48mm over Mon–Tue', detail: 'Rainfall measured at Hardoi block stations between 14 May 06:00 and 15 May 22:00. Soil saturation exceeded field capacity for 31 hours — the threshold for blight conidia germination.' },
  { id: 's2', Icon: IDroplets, title: 'Humidity spike', sub: '89% sustained for 18 hours', detail: 'Relative humidity stayed above 85% from 15 May 21:00 to 16 May 15:00 — overlapping with the dawn canopy-wetness window. Spore release peaks under these conditions.' },
  { id: 's3', Icon: IWheat, title: 'Crop stage critical', sub: 'Wheat at flowering, peak susceptibility', detail: 'GDD-based phenology model places HD-2967 plots in the late flowering / early milk stage. Flag-leaf protection window closes within 36 hours.' },
  { id: 's4', Icon: ICalClock, title: 'Historical match', sub: '2023 outbreak in same panchayat', detail: 'May 2023 saw a Septoria outbreak in Bhatpura and Mallawan after a similar rainfall + humidity sequence. 14 plots lost 12–22% yield. Strong analogue to current conditions.' },
  { id: 's5', Icon: IUsers, title: 'Susceptible variety', sub: '3 farmers grow HD-2967', detail: 'HD-2967 is the dominant local cultivar but shows moderate susceptibility to Septoria tritici. All three flagged farmers planted it this rabi season.' },
];

function SignalRow({ s, i, isLast, open, onToggle }) {
  return (
    <div className="fade-up" style={{ position: 'relative', animationDelay: `${250 + i * 80}ms` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', columnGap: 14, alignItems: 'flex-start' }}>
        {/* icon column with connector */}
        <div style={{ position: 'relative', height: '100%', minHeight: 36, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--primary-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', flex: 'none',
            border: '1px solid rgba(46,74,58,0.10)',
            boxShadow: 'inset 0 0 0 3px #FAF6EC',
            zIndex: 2, position: 'relative',
          }}>
            <s.Icon size={17} stroke="#2E4A3A"/>
          </div>
          {!isLast && (
            <div style={{
              position: 'absolute', top: 36, bottom: -16, left: '50%',
              width: 1, background: 'var(--border)', transform: 'translateX(-0.5px)',
            }}/>
          )}
        </div>
        {/* content */}
        <button onClick={onToggle} style={{
          background: 'transparent', border: 'none', textAlign: 'left',
          padding: '2px 0 16px', cursor: 'pointer', width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600,
                color: 'var(--ink)', letterSpacing: '-0.005em',
              }}>{s.title}</div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 13,
                color: 'var(--ink-soft)', marginTop: 2,
              }}>{s.sub}</div>
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 10,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-warm)', border: '1px solid var(--border)',
              color: 'var(--ink-soft)', flex: 'none',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 220ms ease',
            }}>
              <IChevD size={15}/>
            </div>
          </div>
          {open && (
            <div className="fade-up" style={{
              marginTop: 10, padding: '12px 14px', borderRadius: 14,
              background: 'var(--surface-warm)', border: '1px solid var(--border)',
              fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400, fontSize: 13.5,
              color: 'var(--ink)', lineHeight: 1.5,
              fontVariationSettings: '"opsz" 14', textWrap: 'pretty',
            }}>
              {s.detail}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function SignalTimeline() {
  const [open, setOpen] = useState({ s1: true });
  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));
  return (
    <div style={{ padding: '36px 20px 12px' }}>
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, animationDelay: '220ms' }}>
        <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }}/>
        <h2 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em',
          color: 'var(--ink)', margin: 0,
        }}>What we're seeing</h2>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
          color: 'var(--ink-soft)', letterSpacing: '0.06em',
        }}>5 signals</span>
      </div>
      <div>
        {SIGNALS.map((s, i) => (
          <SignalRow key={s.id} s={s} i={i} isLast={i === SIGNALS.length - 1}
            open={!!open[s.id]} onToggle={() => toggle(s.id)} />
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Affected farmers carousel
// ===================================================================
const FARMERS = [
  { id: 'f1', name: 'Ramesh Yadav', village: 'Bhatpura', dist: '4.2 km',
    photo: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80&auto=format&fit=crop',
    field: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&auto=format&fit=crop' },
  { id: 'f2', name: 'Suresh Verma', village: 'Mallawan', dist: '6.8 km',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop',
    field: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80&auto=format&fit=crop' },
  { id: 'f3', name: 'Bal Kishore', village: 'Sandila', dist: '9.1 km',
    photo: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&q=80&auto=format&fit=crop',
    field: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80&auto=format&fit=crop' },
];

function FarmersCarousel() {
  return (
    <div className="fade-up" style={{ padding: '24px 0 0', animationDelay: '600ms' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
        <h2 style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em',
          color: 'var(--ink)', margin: 0,
        }}>
          Affected farmers <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(3)</span>
        </h2>
        <span style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600, color: 'var(--primary)',
        }}>See all →</span>
      </div>
      <div className="no-scrollbar" style={{
        display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 20px 8px',
        scrollSnapType: 'x mandatory',
      }}>
        {FARMERS.map((f) => (
          <a key={f.id} href="Farmer Profile.html" style={{
            flex: 'none', width: 220,
            background: 'var(--surface)', borderRadius: 20,
            boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 10px 26px rgba(20,18,12,0.07)',
            overflow: 'hidden', scrollSnapAlign: 'start',
            textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{
              position: 'relative', height: 96,
              backgroundImage: `url(${f.field})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(26,26,23,0) 40%, rgba(26,26,23,0.45) 100%)',
              }}/>
              <div style={{
                position: 'absolute', bottom: -18, left: 14,
                width: 42, height: 42, borderRadius: '50%',
                backgroundImage: `url(${f.photo})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: '3px solid var(--surface)',
                boxShadow: '0 4px 10px rgba(20,18,12,0.18)',
              }}/>
              <span style={{
                position: 'absolute', top: 10, right: 10,
                padding: '3px 8px', borderRadius: 999,
                background: 'rgba(184,92,60,0.95)', color: 'white',
                fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.10em',
              }}>HIGH</span>
            </div>
            <div style={{ padding: '26px 14px 14px' }}>
              <div style={{
                fontFamily: 'Fraunces', fontWeight: 500, fontSize: 15,
                color: 'var(--ink)', letterSpacing: '-0.005em',
              }}>{f.name}</div>
              <div style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)',
                marginTop: 2,
              }}>{f.village} · {f.dist}</div>
              <div style={{
                marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
                  color: 'var(--ink-soft)',
                }}>Wheat · HD-2967</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 12.5,
                  color: 'var(--primary)',
                }}>View <IChevR size={13} stroke="#2E4A3A"/></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Recommended intervention
// ===================================================================
function Intervention() {
  return (
    <div className="fade-up" style={{ padding: '24px 18px 0', animationDelay: '680ms' }}>
      <div style={{
        background: 'var(--primary-soft)',
        borderRadius: 20,
        padding: '18px 18px 16px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(20,18,12,0.03), 0 10px 28px rgba(46,74,58,0.10)',
      }}>
        {/* faint paper ornament */}
        <svg width="140" height="140" viewBox="0 0 64 88" fill="none" style={{
          position: 'absolute', top: -16, right: -22, opacity: 0.12, transform: 'rotate(18deg)',
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
          }}>Recommended Intervention</div>
          <h3 style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 19, lineHeight: 1.2,
            letterSpacing: '-0.01em', color: 'var(--ink)', margin: '6px 0 0',
            fontVariationSettings: '"opsz" 28',
          }}>
            Syngenta <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Tilt 25EC</span> fungicide
          </h3>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)',
            margin: '6px 0 0', lineHeight: 1.45, opacity: 0.78, maxWidth: 280,
          }}>
            Targets early-stage Septoria. Safe at flowering — won't affect grain set.
          </p>

          <div style={{
            marginTop: 14, padding: '10px 12px 10px 10px',
            background: 'rgba(245,241,232,0.6)', borderRadius: 14,
            border: '1px solid rgba(46,74,58,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 8,
                background: 'rgba(201,151,74,0.20)', color: '#8C6420',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ICheckCircle size={14} stroke="#8C6420"/>
              </span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700, color: '#8C6420' }}>
                  In stock
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>
                  Kisan Store · 5 km
                </div>
              </div>
            </div>
            <span style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 12,
              color: 'var(--primary)',
            }}>View product →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Footer link
// ===================================================================
function ReasoningLink() {
  return (
    <div className="fade-up" style={{ padding: '20px 20px 4px', textAlign: 'center', animationDelay: '760ms' }}>
      <a href="Reasoning Graph.html" style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700,
        color: 'var(--primary)', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        See full reasoning graph
        <IChevR size={13} stroke="#2E4A3A"/>
      </a>
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
      paddingTop: 24, paddingBottom: 20, paddingLeft: 18, paddingRight: 18,
      background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
      pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <button style={{
          width: '100%', padding: '15px 16px', borderRadius: 16,
          background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14.5,
          boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          letterSpacing: '-0.005em',
        }}>
          Add 3 farms to today's visits
        </button>
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          <button style={textBtn}>
            <IBell size={14} stroke="#6B6A5F"/>
            Set reminder
          </button>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--border)' }}/>
          <button style={textBtn}>
            <IX size={14} stroke="#6B6A5F"/>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
const textBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 6px', background: 'transparent', border: 'none',
  fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5,
  color: 'var(--ink-soft)', cursor: 'pointer',
};

// ===================================================================
// Screen
// ===================================================================
function AlertDetail() {
  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
      paddingTop: 48, // iOS status bar
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>
      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 160 }}>
        <Header/>
        <HeroAndTitle/>
        <SignalTimeline/>
        <FarmersCarousel/>
        <Intervention/>
        <ReasoningLink/>
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
        <AlertDetail/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
