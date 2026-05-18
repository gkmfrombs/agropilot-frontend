// Sync Center — 390px mobile
// States: ready → syncing → synced (loops back via Reset)
// Bonus: a small chip toggles into offline state for the demo.

const { useState, useEffect, useRef } = React;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', extra = null, style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke}
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}{extra}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const ISettings = (p) => <Icon {...p} d={<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>}/>;
const ICheck = (p) => <Icon {...p} d={<path d="M20 6 9 17l-5-5"/>}/>;
const IWifiOff = (p) => <Icon {...p} d={<><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><line x1="12" y1="20" x2="12.01" y2="20"/></>}/>;
const IFile = (p) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}/>;
const IMic = (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>}/>;
const IImage = (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}/>;
const IClipboard = (p) => <Icon {...p} d={<><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></>}/>;
const IHardDrive = (p) => <Icon {...p} d={<><path d="M22 12A10 10 0 0 0 12 2v10z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><circle cx="12" cy="12" r="3"/></>}/>;
const IArrowD = (p) => <Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}/>;

// ===================================================================
// Header
// ===================================================================
function Header() {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(245,241,232,0.85)',
      backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      borderBottom: '1px solid rgba(229,220,201,0.7)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center',
        padding: '10px 14px',
      }}>
        <a href="Morning Briefing.html" style={hdrBtn}><IChevL size={18}/></a>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
            color: 'var(--ink)', letterSpacing: '-0.005em',
          }}>Sync Center</div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
            color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2,
          }}>Field Bridge · v1.4</div>
        </div>
        <button style={{ ...hdrBtn, justifySelf: 'end' }}><ISettings size={17}/></button>
      </div>
    </div>
  );
}
const hdrBtn = {
  width: 36, height: 36, borderRadius: 12,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--ink)', cursor: 'pointer', textDecoration: 'none',
};

// ===================================================================
// Hero ring
// ===================================================================
const R = 78;            // ring radius in 180-viewbox
const CIRC = 2 * Math.PI * R;

function HeroRing({ state, progress }) {
  // states: 'ready' | 'syncing' | 'synced' | 'offline'
  const offline = state === 'offline';
  const syncing = state === 'syncing';
  const synced = state === 'synced';

  return (
    <div style={{
      position: 'relative', width: 180, height: 180,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 'none',
    }}>
      {/* outer subtle halo */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(46,74,58,0.10) 0%, rgba(46,74,58,0) 65%)',
      }}/>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E4A3A"/>
            <stop offset="100%" stopColor="#7c9784"/>
          </linearGradient>
        </defs>
        {/* track */}
        <circle cx="90" cy="90" r={R}
          fill="none"
          stroke="#E5DCC9"
          strokeWidth="6"
          strokeDasharray={offline ? '6 8' : '0'}
        />
        {/* progress */}
        {(syncing || synced) && (
          <circle cx="90" cy="90" r={R}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 380ms cubic-bezier(0.16,1,0.3,1)' }}
          />
        )}
        {/* moving arc when syncing */}
        {syncing && (
          <g className="ring-spin" style={{ transformOrigin: '90px 90px' }}>
            <circle cx="90" cy="90" r={R}
              fill="none"
              stroke="#C9974A"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${CIRC * 0.16} ${CIRC}`}
              transform="rotate(-90 90 90)"
              opacity="0.85"
            />
          </g>
        )}
        {/* ready: slow gentle arc */}
        {state === 'ready' && (
          <g className="ring-spin-slow" style={{ transformOrigin: '90px 90px' }}>
            <circle cx="90" cy="90" r={R}
              fill="none"
              stroke="#2E4A3A"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${CIRC * 0.08} ${CIRC}`}
              transform="rotate(-90 90 90)"
              opacity="0.5"
            />
          </g>
        )}
      </svg>

      {/* center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: 24, textAlign: 'center',
      }}>
        {/* status glyph */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: synced ? 'var(--primary)' : (offline ? 'rgba(184,92,60,0.14)' : 'rgba(46,74,58,0.10)'),
          color: synced ? '#FAF6EC' : (offline ? '#B85C3C' : 'var(--primary)'),
          transition: 'background 240ms ease',
        }}>
          {synced && <span className="check-pop"><ICheck size={20} stroke="#FAF6EC"/></span>}
          {offline && <IWifiOff size={18} stroke="#B85C3C"/>}
          {(state === 'ready' || syncing) && (
            <span className={syncing ? 'arrow-bounce' : ''}><IArrowD size={18} stroke="#2E4A3A"/></span>
          )}
        </div>
        <div style={{
          fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, lineHeight: 1,
          color: 'var(--ink)', letterSpacing: '-0.015em',
          fontVariationSettings: '"opsz" 22',
        }}>
          {state === 'ready'   && 'Ready to sync'}
          {state === 'syncing' && 'Syncing…'}
          {state === 'synced'  && 'Back online'}
          {state === 'offline' && 'Offline'}
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Pending upload row
// ===================================================================
const ITEMS = [
  { id: 'i1', I: IFile,      title: 'Visit log — Ramesh Kumar',           time: 'Today 11:42 AM', size: '2 KB' },
  { id: 'i2', I: IMic,       title: 'Voice note — Bhatpura field',         time: 'Today 11:38 AM', size: '340 KB' },
  { id: 'i3', I: IImage,     title: 'Photo — wheat blight sample',         time: 'Today 11:36 AM', size: '1.2 MB' },
  { id: 'i4', I: IClipboard, title: 'Outcome — Fungicide X recommended',   time: 'Today 11:42 AM', size: '1 KB' },
];

function UploadRow({ item, status, index }) {
  // status: 'queued' | 'progress' | 'done'
  const done = status === 'done';
  const progress = status === 'progress';
  return (
    <div className={done ? '' : 'fade-up upload-row'} style={{
      display: 'grid', gridTemplateColumns: '36px 1fr auto', columnGap: 12, alignItems: 'center',
      padding: '12px 14px',
      background: 'var(--surface)',
      borderRadius: 16,
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(20,18,12,0.03)',
      opacity: done ? 0 : 1,
      transform: done ? 'translateX(36px) scale(0.96)' : 'translateX(0) scale(1)',
      transition: 'opacity 360ms cubic-bezier(0.4,0,0.2,1), transform 360ms cubic-bezier(0.4,0,0.2,1)',
      animationDelay: `${1100 + index * 60}ms`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: progress ? 'var(--primary-soft)' : 'var(--surface-warm)',
        color: 'var(--primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--border)',
        position: 'relative',
        transition: 'background 240ms ease',
      }}>
        <item.I size={16} stroke="#2E4A3A"/>
        {progress && (
          <span className="row-check" style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            border: '2px solid var(--primary)',
          }}/>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600,
          color: 'var(--ink)', letterSpacing: '-0.005em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.title}</div>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)',
          marginTop: 2,
        }}>{item.time}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)',
          fontVariantNumeric: 'tabular-nums',
        }}>{item.size}</span>
        <span style={{
          width: 7, height: 7, borderRadius: 99,
          background: progress ? 'var(--accent)' : 'var(--warning)',
          boxShadow: progress ? '0 0 0 3px rgba(201,151,74,0.18)' : 'none',
          transition: 'background 240ms ease, box-shadow 240ms ease',
        }}/>
      </div>
    </div>
  );
}

// ===================================================================
// Pending download list
// ===================================================================
function DownloadRow({ title, sub, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 16px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          width: 7, height: 7, borderRadius: 99, background: 'var(--primary-soft)',
          boxShadow: '0 0 0 3px rgba(200,213,187,0.4)',
        }}/>
        <div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)',
          }}>{title}</div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)',
            marginTop: 2,
          }}>{sub}</div>
        </div>
      </div>
      <IArrowD size={14} stroke="#6B6A5F" style={{ transform: 'rotate(-90deg)' }}/>
    </div>
  );
}

// ===================================================================
// Stats row
// ===================================================================
function Stat({ value, label }) {
  return (
    <div style={{
      flex: 1, padding: '14px 12px',
      background: 'var(--surface)', borderRadius: 16,
      border: '1px solid var(--border)',
      boxShadow: '0 1px 2px rgba(20,18,12,0.03)',
    }}>
      <div style={{
        fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, lineHeight: 1,
        letterSpacing: '-0.02em', color: 'var(--ink)',
        fontVariationSettings: '"opsz" 36', fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <div style={{
        marginTop: 6,
        fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
        color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ===================================================================
// Main screen
// ===================================================================
function SyncCenter() {
  const [state, setState] = useState('ready'); // ready | syncing | synced | offline
  const [statuses, setStatuses] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 'queued'])));
  const [queued, setQueued] = useState(7);
  const [synced, setSynced] = useState(23);
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const [autoWifi, setAutoWifi] = useState(true);
  const timers = useRef([]);

  const cancelTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => cancelTimers(), []);

  const startSync = () => {
    if (state === 'syncing' || state === 'offline') return;
    cancelTimers();
    setState('syncing');
    setProgress(0);

    const perItem = 700;
    // animate progress smoothly
    const tickStart = Date.now();
    const total = ITEMS.length * perItem + 500;
    const iv = setInterval(() => {
      const p = Math.min(1, (Date.now() - tickStart) / total);
      setProgress(p);
      if (p >= 1) clearInterval(iv);
    }, 60);
    timers.current.push(iv);

    ITEMS.forEach((it, i) => {
      // mark in-progress
      timers.current.push(setTimeout(() => {
        setStatuses(prev => ({ ...prev, [it.id]: 'progress' }));
      }, i * perItem + 100));
      // mark done + tick counters
      timers.current.push(setTimeout(() => {
        setStatuses(prev => ({ ...prev, [it.id]: 'done' }));
        setQueued(q => Math.max(0, q - 1));
        setSynced(s => s + 1);
      }, i * perItem + perItem));
    });
    // 3 remaining ghost items also tick down (we only show 4 rows but counter is 7)
    [1, 2, 3].forEach((step, idx) => {
      timers.current.push(setTimeout(() => {
        setQueued(q => Math.max(0, q - 1));
        setSynced(s => s + 1);
      }, ITEMS.length * perItem + 200 + idx * 200));
    });

    timers.current.push(setTimeout(() => {
      setState('synced');
      setFlash(true);
      timers.current.push(setTimeout(() => setFlash(false), 220));
    }, ITEMS.length * perItem + 1100));
  };

  const resetDemo = () => {
    cancelTimers();
    setState('ready');
    setStatuses(Object.fromEntries(ITEMS.map(i => [i.id, 'queued'])));
    setQueued(7);
    setSynced(23);
    setProgress(0);
  };

  const cycleOffline = () => {
    cancelTimers();
    if (state === 'offline') {
      setState('ready');
    } else {
      resetDemo();
      setTimeout(() => setState('offline'), 0);
    }
  };

  const subtitle = {
    ready:   `${queued} items queued · Will sync on tap`,
    syncing: `Uploading ${ITEMS.length} items · ${Math.max(0, Math.ceil((1 - progress) * 12))}s remaining`,
    synced:  'All caught up · Last sync just now',
    offline: 'Will auto-sync when network returns',
  }[state];

  const buttonDisabled = state === 'offline' || state === 'syncing';
  const buttonLabel = {
    ready: 'Sync now',
    syncing: 'Syncing…',
    synced: 'Reset demo',
    offline: 'Sync unavailable',
  }[state];

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
      paddingTop: 48,
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* haptic flash */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 80,
        background: 'var(--primary-soft)',
        opacity: flash ? 0.6 : 0,
        transition: 'opacity 220ms ease',
      }}/>

      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 160 }}>
        <Header/>

        {/* HERO */}
        <div style={{
          background: 'var(--surface-warm)',
          borderBottom: '1px solid var(--border)',
          padding: '36px 20px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* offline mode demo chip */}
          <button onClick={cycleOffline} style={{
            position: 'absolute', top: 16, right: 16,
            padding: '5px 10px', borderRadius: 999,
            background: state === 'offline' ? 'var(--ink)' : 'var(--surface)',
            color: state === 'offline' ? 'var(--bg)' : 'var(--ink-soft)',
            border: '1px solid var(--border)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.10em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {state === 'offline' ? '● Offline' : 'Demo offline'}
          </button>

          <HeroRing state={state} progress={progress}/>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13.5,
            color: 'var(--ink-soft)', textAlign: 'center', maxWidth: 280,
            lineHeight: 1.4, fontVariantNumeric: 'tabular-nums',
          }}>{subtitle}</div>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 18px 0' }}>
          <Stat value={queued} label="Queued"/>
          <Stat value={synced} label="Synced today"/>
          <Stat value={state === 'synced' ? 'just now' : '2h'} label="Last sync"/>
        </div>

        {/* PENDING UPLOAD */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10, padding: '0 2px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--accent)' }}/>
              <h2 style={{
                fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, letterSpacing: '-0.005em',
                color: 'var(--ink)', margin: 0,
              }}>Pending upload</h2>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(201,151,74,0.18)', color: '#8C6420',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11,
              fontVariantNumeric: 'tabular-nums',
            }}>{queued}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ITEMS.map((it, i) => (
              <UploadRow key={it.id} item={it} status={statuses[it.id]} index={i}/>
            ))}
          </div>
          {queued > ITEMS.length && (
            <button style={{
              marginTop: 10, width: '100%',
              padding: '11px 14px', borderRadius: 14,
              background: 'transparent', border: '1px dashed var(--border)',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5,
              color: 'var(--ink-soft)', cursor: 'pointer',
            }}>
              Show all {queued} →
            </button>
          )}
        </div>

        {/* PENDING DOWNLOAD */}
        <div style={{ padding: '22px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            marginBottom: 10, padding: '0 2px',
          }}>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--accent)' }}/>
            <h2 style={{
              fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, letterSpacing: '-0.005em',
              color: 'var(--ink)', margin: 0,
            }}>Pending download</h2>
          </div>
          <div style={{
            background: 'var(--surface)', borderRadius: 18,
            border: '1px solid var(--border)',
            boxShadow: '0 1px 2px rgba(20,18,12,0.03)',
            overflow: 'hidden',
          }}>
            <DownloadRow title="Updated risk models" sub="5 changes"/>
            <DownloadRow title="New farmer entries" sub="2 records"/>
            <DownloadRow title="Stock updates" sub="4 Kisan stores" last/>
          </div>
        </div>

        {/* OFFLINE READY */}
        <div style={{ padding: '22px 18px 0' }}>
          <div style={{
            background: 'var(--primary-soft)', borderRadius: 20,
            padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(20,18,12,0.03), 0 10px 26px rgba(46,74,58,0.10)',
          }}>
            {/* faint wheat stalk */}
            <svg width="120" height="160" viewBox="0 0 64 88" fill="none" style={{
              position: 'absolute', top: -10, right: -14, opacity: 0.12, transform: 'rotate(14deg)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: 'rgba(46,74,58,0.14)', color: 'var(--primary)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IHardDrive size={15} stroke="#2E4A3A"/>
                </span>
                <h3 style={{
                  fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
                  color: 'var(--ink)', margin: 0, letterSpacing: '-0.005em',
                }}>Offline ready</h3>
              </div>
              <div style={{
                marginTop: 10,
                fontFamily: 'Fraunces', fontWeight: 500, fontSize: 28, lineHeight: 1.05,
                letterSpacing: '-0.02em', color: 'var(--primary)',
                fontVariationSettings: '"opsz" 36',
              }}>
                12 villages <span style={{ fontStyle: 'italic', fontWeight: 400 }}>cached</span>
              </div>
              <p style={{
                fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink)',
                margin: '6px 0 0', lineHeight: 1.45, opacity: 0.78, maxWidth: 280,
              }}>
                Farmer data, risk models, and product catalog for tomorrow's route.
              </p>
              <div style={{ marginTop: 14 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
                  color: 'var(--ink-soft)', marginBottom: 6, letterSpacing: '0.02em',
                }}>
                  <span>Cache usage</span>
                  <span style={{ color: 'var(--ink)' }}>248 MB <span style={{ color: 'var(--ink-soft)' }}>/ 500 MB</span></span>
                </div>
                <div style={{
                  height: 6, borderRadius: 999, overflow: 'hidden',
                  background: 'rgba(46,74,58,0.18)',
                }}>
                  <div style={{
                    width: `${(248/500)*100}%`, height: '100%',
                    background: 'var(--primary)', borderRadius: 999,
                  }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY ACTIONS */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50,
        paddingTop: 22, paddingBottom: 18, paddingLeft: 18, paddingRight: 18,
        background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
      }}>
        <button
          onClick={state === 'synced' ? resetDemo : startSync}
          disabled={buttonDisabled}
          style={{
            width: '100%', height: 56, borderRadius: 14,
            background: buttonDisabled
              ? 'rgba(229,220,201,0.7)'
              : (state === 'synced' ? 'var(--primary)' : 'var(--primary)'),
            color: buttonDisabled ? 'var(--ink-soft)' : 'white',
            border: 'none', cursor: buttonDisabled ? 'not-allowed' : 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15,
            boxShadow: buttonDisabled ? 'none' : '0 6px 18px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
            letterSpacing: '-0.005em',
          }}>
          {buttonLabel}
        </button>
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600,
            color: 'var(--ink-soft)',
          }}>Auto-sync on Wi-Fi only</span>
          <button
            onClick={() => setAutoWifi(v => !v)}
            style={{
              width: 36, height: 22, borderRadius: 999, padding: 2,
              background: autoWifi ? 'var(--primary)' : 'var(--border)',
              border: 'none', cursor: 'pointer',
              position: 'relative', transition: 'background 200ms ease',
            }}
            aria-pressed={autoWifi}
          >
            <span style={{
              display: 'block', width: 18, height: 18, borderRadius: '50%',
              background: '#FFFFFF',
              transform: autoWifi ? 'translateX(14px)' : 'translateX(0)',
              transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)',
              boxShadow: '0 1px 3px rgba(20,18,12,0.18)',
            }}/>
          </button>
        </div>
      </div>
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
        <SyncCenter/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
