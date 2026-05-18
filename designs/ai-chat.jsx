// AI Consultant chat screen — 390px mobile

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
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IInfo = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>}/>;
const IArrowR = (p) => <Icon {...p} d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>}/>;
const ICloud = (p) => <Icon {...p} d={<path d="M17.5 19a4.5 4.5 0 1 0-1.5-8.75A6 6 0 1 0 6 16"/>}/>;
const IWheat = (p) => <Icon {...p} d={<><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/></>}/>;
const IDb = (p) => <Icon {...p} d={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></>}/>;
const IBox = (p) => <Icon {...p} d={<><path d="M21 8 12 13 3 8"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M12 13v9"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;
const IThumbUp = (p) => <Icon {...p} d={<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L15 2h0a3 3 0 0 1 0 3.88Z"/>}/>;
const IThumbDn = (p) => <Icon {...p} d={<path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L9 22h0a3 3 0 0 1 0-3.88Z"/>}/>;
const IMic = (p) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>}/>;
const ISend = (p) => <Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}/>;
const IPlay = (p) => <Icon {...p} d={<path d="m5 3 14 9-14 9V3z"/>} fill="currentColor"/>;
const IPin = (p) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></>}/>;

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
        <a href="Farmer Profile.html" style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--ink)', textDecoration: 'none',
        }}>
          <IChevL size={18}/>
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16,
            color: 'var(--ink)', letterSpacing: '-0.005em',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: 99,
              background: '#7B9C6A', boxShadow: '0 0 0 2.5px rgba(123,156,106,0.18)',
              display: 'inline-block',
            }}/>
            AI Consultant
          </div>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 500,
            color: 'var(--ink-soft)', marginTop: 2,
          }}>Ramesh's Field</div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
          cursor: 'pointer', justifySelf: 'end',
        }}>
          <IInfo size={18}/>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Context chip strip
// ===================================================================
function ContextChips() {
  const chips = [
    { label: 'Wheat' },
    { label: 'Block 4' },
    { label: 'Flowering' },
    { label: 'Cached ✓', dot: true },
  ];
  return (
    <div style={{
      padding: '12px 18px',
      background: 'var(--surface-warm)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="no-scrollbar" style={{
        display: 'flex', gap: 8, overflowX: 'auto',
      }}>
        {chips.map((c, i) => (
          <span key={c.label} style={{
            flex: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600,
            color: 'var(--ink-soft)', letterSpacing: '0.01em',
          }}>
            {c.dot && <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }}/>}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// User message
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

function UserMessage() {
  return (
    <div className="fade-up" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
      animationDelay: '40ms',
    }}>
      <div style={{
        maxWidth: '80%',
        background: 'var(--primary)', color: 'white',
        padding: '13px 16px',
        borderRadius: '20px 20px 8px 20px',
        fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, lineHeight: 1.45,
        boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(46,74,58,0.18)',
      }}>
        Ramesh's wheat is showing early signs of blight — what should I recommend?
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '0 4px',
        fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)',
        letterSpacing: '0.02em',
      }}>
        <MiniWave/>
        voice · 8s · 11:42 AM
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
    const t0 = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(iv);
      }, delayPerChar);
      return () => clearInterval(iv);
    }, start);
    return () => clearTimeout(t0);
  }, [text, delayPerChar, start]);
  return [text.slice(0, n), n >= text.length];
}

// ===================================================================
// AI response card
// ===================================================================
const HEADLINE = 'Apply Syngenta Fungicide X within 48 hours';

function AIResponse() {
  const [typed, done] = useTypewriter(HEADLINE, 28, 350);
  const [bulletStep, setBulletStep] = useState(0);
  useEffect(() => {
    if (!done) return;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setBulletStep(i);
      if (i >= 3) clearInterval(iv);
    }, 220);
    return () => clearInterval(iv);
  }, [done]);

  const bullets = [
    'Early Septoria blight matches symptom description',
    'Flowering stage is the critical intervention window',
    '48mm recent rainfall accelerates spread',
  ];

  const sources = [
    { I: ICloud, label: 'Weather' },
    { I: IWheat, label: 'Crop' },
    { I: IDb, label: 'Disease DB' },
    { I: IBox, label: 'Product' },
  ];

  return (
    <div className="fade-up" style={{
      maxWidth: '90%', alignSelf: 'flex-start',
      background: 'var(--surface)',
      borderRadius: '20px 20px 20px 8px',
      boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 14px 36px rgba(20,18,12,0.10)',
      padding: '16px 18px 14px',
      position: 'relative', overflow: 'hidden',
      animationDelay: '320ms',
    }}>
      <div style={{
        fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
        color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>Recommendation</div>
      <h3 style={{
        marginTop: 8, marginBottom: 0,
        fontFamily: 'Fraunces', fontWeight: 500, fontSize: 18, lineHeight: 1.22,
        letterSpacing: '-0.01em', color: 'var(--ink)',
        fontVariationSettings: '"opsz" 24', minHeight: 44,
        textWrap: 'pretty',
      }}>
        {typed}
        {!done && <span className="caret"/>}
      </h3>

      <div style={{ height: 1, background: 'var(--border)', margin: '14px -2px 12px' }}/>

      {/* bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bullets.map((b, i) => (
          <div key={i} className={i < bulletStep ? 'fade-up' : ''} style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            opacity: i < bulletStep ? 1 : 0,
            transition: 'opacity 200ms ease',
            fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)',
            lineHeight: 1.42, textWrap: 'pretty',
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 6,
              background: 'rgba(46,74,58,0.10)', color: 'var(--primary)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flex: 'none', marginTop: 1,
            }}>
              <IArrowR size={11} stroke="#2E4A3A"/>
            </span>
            <span>{b}</span>
          </div>
        ))}
      </div>

      {/* source chips */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700,
          color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase',
          marginBottom: 6,
        }}>Sources</div>
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2,
        }}>
          {sources.map((s, i) => (
            <span key={s.label} className="slide-in-l" style={{
              flex: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 999,
              background: 'var(--surface-warm)', border: '1px solid var(--border)',
              fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600,
              color: 'var(--ink-soft)',
              animationDelay: `${done ? 700 + i * 50 : 1200 + i * 50}ms`,
            }}>
              <s.I size={11} stroke="#6B6A5F"/>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* stock card */}
      <div style={{
        marginTop: 14, background: 'var(--primary-soft)', borderRadius: 14,
        padding: '11px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'rgba(46,74,58,0.14)', color: 'var(--primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: 'none',
        }}>
          <ICheckCircle size={15} stroke="#2E4A3A"/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
            color: 'var(--ink)', lineHeight: 1.25,
          }}>
            In stock — <span style={{ fontWeight: 700 }}>Kisan Store</span>, 5km away
          </div>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 3,
            fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700,
            color: 'var(--primary)', textDecoration: 'none',
          }}>
            <IPin size={10} stroke="#2E4A3A"/>
            View location →
          </a>
        </div>
      </div>

      {/* footer row */}
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(201,151,74,0.16)', color: '#8C6420',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }}/>
          94% confidence
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={iconRoundBtn} aria-label="Helpful"><IThumbUp size={14} stroke="#6B6A5F"/></button>
          <button style={iconRoundBtn} aria-label="Not helpful"><IThumbDn size={14} stroke="#6B6A5F"/></button>
        </div>
      </div>

      <a href="Reasoning Graph.html" style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        marginTop: 12,
        fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700,
        color: 'var(--primary)', textDecoration: 'none',
      }}>
        Show reasoning graph →
      </a>
    </div>
  );
}
const iconRoundBtn = {
  width: 30, height: 30, borderRadius: '50%',
  background: 'transparent', border: '1px solid var(--border)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

// ===================================================================
// Suggested follow-ups
// ===================================================================
function FollowUps() {
  const items = ['What dosage?', 'Any safety precautions?', 'Alternative if out of stock?'];
  return (
    <div style={{
      padding: '12px 18px 12px',
      background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, var(--bg) 50%)',
    }}>
      <div className="no-scrollbar" style={{
        display: 'flex', gap: 8, overflowX: 'auto',
      }}>
        {items.map((t, i) => (
          <button key={t} className="slide-in-l" style={{
            flex: 'none',
            padding: '8px 13px', borderRadius: 999,
            background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--ink)', cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600,
            whiteSpace: 'nowrap',
            animationDelay: `${1600 + i * 60}ms`,
            boxShadow: '0 1px 2px rgba(20,18,12,0.04)',
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// Input row
// ===================================================================
function InputRow() {
  const [recording, setRecording] = useState(false);
  return (
    <div style={{
      padding: '8px 18px 20px',
      background: 'var(--bg)',
      borderTop: '1px solid rgba(229,220,201,0.7)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 999, padding: '6px 6px 6px 18px',
        boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(20,18,12,0.06)',
      }}>
        <input
          placeholder="Ask anything…"
          style={{
            flex: 1, minWidth: 0, height: 36,
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)',
          }}
        />
        <button
          onClick={() => setRecording(r => !r)}
          className={recording ? 'fab-pulse' : 'fab-breathe-mic'}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)',
            border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flex: 'none',
            boxShadow: '0 6px 14px rgba(46,74,58,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
          aria-label={recording ? 'Stop recording' : 'Voice input'}
        >
          <IMic size={18} stroke="#fff"/>
        </button>
        <button style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--surface-warm)', border: '1px solid var(--border)',
          color: 'var(--ink-soft)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: 'none',
        }} aria-label="Send">
          <ISend size={17} stroke="#6B6A5F"/>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// Screen
// ===================================================================
function ChatScreen() {
  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100%',
      background: 'var(--bg)',
      paddingTop: 48,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <Header/>
        <ContextChips/>

        {/* messages */}
        <div style={{
          flex: 1, overflow: 'auto', padding: '18px 18px 8px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <UserMessage/>
          <AIResponse/>
        </div>

        <FollowUps/>
        <InputRow/>
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
        <ChatScreen/>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
