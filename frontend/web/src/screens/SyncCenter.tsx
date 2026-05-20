import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BottomNav, Icon } from '../components/Shared'

const IChevL = (p: any) => <Icon {...p} d={<path d="m15 18-6-6 6-6" />} />
const ISettings = (p: any) => <Icon {...p} d={<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>} />
const ICheck = (p: any) => <Icon {...p} d={<path d="M20 6 9 17l-5-5" />} />
const IWifiOff = (p: any) => <Icon {...p} d={<><line x1="2" y1="2" x2="22" y2="22" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 4.17-2.65" /><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" /><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" /><path d="M5 13a10 10 0 0 1 5.24-2.76" /><line x1="12" y1="20" x2="12.01" y2="20" /></>} />
const IFile = (p: any) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></>} />
const IMic = (p: any) => <Icon {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></>} />
const IImage = (p: any) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>} />
const IClipboard = (p: any) => <Icon {...p} d={<><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>} />
const IArrowD = (p: any) => <Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>} />

const R = 78
const CIRC = 2 * Math.PI * R

type SyncState = 'ready' | 'syncing' | 'synced' | 'offline'
type ItemStatus = 'queued' | 'progress' | 'done'

const ITEMS = [
  { id: 'i1', I: IFile,      title: 'Visit log — Ramesh Yadav',         time: 'Today 11:42 AM', size: '2 KB' },
  { id: 'i2', I: IMic,       title: 'Voice note — Bhatpura field',       time: 'Today 11:38 AM', size: '340 KB' },
  { id: 'i3', I: IImage,     title: 'Photo — wheat blight sample',       time: 'Today 11:36 AM', size: '1.2 MB' },
  { id: 'i4', I: IClipboard, title: 'Outcome — Fungicide X recommended', time: 'Today 11:42 AM', size: '1 KB' },
]

function HeroRing({ state, progress }: { state: SyncState; progress: number }) {
  const offline = state === 'offline'
  const syncing = state === 'syncing'
  const synced = state === 'synced'

  return (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(46,74,58,0.10) 0%, rgba(46,74,58,0) 65%)' }} />
      <svg width="180" height="180" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E4A3A" />
            <stop offset="100%" stopColor="#7c9784" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={R} fill="none" stroke="#E5DCC9" strokeWidth="6" strokeDasharray={offline ? '6 8' : '0'} />
        {(syncing || synced) && (
          <circle cx="90" cy="90" r={R} fill="none" stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 380ms cubic-bezier(0.16,1,0.3,1)' }}
          />
        )}
        {syncing && (
          <g className="ring-spin" style={{ transformOrigin: '90px 90px' }}>
            <circle cx="90" cy="90" r={R} fill="none" stroke="#C9974A" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${CIRC * 0.16} ${CIRC}`} transform="rotate(-90 90 90)" opacity="0.85"
            />
          </g>
        )}
        {state === 'ready' && (
          <g className="ring-spin-slow" style={{ transformOrigin: '90px 90px' }}>
            <circle cx="90" cy="90" r={R} fill="none" stroke="#2E4A3A" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${CIRC * 0.08} ${CIRC}`} transform="rotate(-90 90 90)" opacity="0.5"
            />
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 24, textAlign: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: synced ? 'var(--primary)' : (offline ? 'rgba(184,92,60,0.14)' : 'rgba(46,74,58,0.10)'), color: synced ? '#FAF6EC' : (offline ? '#B85C3C' : 'var(--primary)'), transition: 'background 240ms ease' }}>
          {synced && <span className="check-pop"><ICheck size={20} stroke="#FAF6EC" /></span>}
          {offline && <IWifiOff size={18} stroke="#B85C3C" />}
          {(state === 'ready' || syncing) && <span className={syncing ? 'arrow-bounce' : ''}><IArrowD size={18} stroke="#2E4A3A" /></span>}
        </div>
        <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 20, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.015em' }}>
          {state === 'ready' && 'Ready to sync'}
          {state === 'syncing' && 'Syncing…'}
          {state === 'synced' && 'Back online'}
          {state === 'offline' && 'Offline'}
        </div>
      </div>
    </div>
  )
}

function UploadRow({ item, status, index }: { item: typeof ITEMS[0]; status: ItemStatus; index: number }) {
  const done = status === 'done'
  const progress = status === 'progress'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', columnGap: 12, alignItems: 'center', padding: '12px 14px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', opacity: done ? 0 : 1, transform: done ? 'translateX(36px) scale(0.96)' : 'translateX(0) scale(1)', transition: 'opacity 360ms cubic-bezier(0.4,0,0.2,1), transform 360ms cubic-bezier(0.4,0,0.2,1)', animationDelay: `${1100 + index * 60}ms` }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: progress ? 'var(--primary-soft)' : 'var(--surface-warm)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative', transition: 'background 240ms ease' }}>
        <item.I size={16} stroke="#2E4A3A" />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 2 }}>{item.time}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>{item.size}</span>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: progress ? 'var(--accent)' : 'var(--warning)', transition: 'background 240ms ease' }} />
      </div>
    </div>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ flex: 1, padding: '14px 12px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 24, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{value}</div>
      <div style={{ marginTop: 6, fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

export default function SyncCenter() {
  const [state, setState] = useState<SyncState>('ready')
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>(() => Object.fromEntries(ITEMS.map(i => [i.id, 'queued'])))
  const [queued, setQueued] = useState(4)
  const [synced, setSynced] = useState(23)
  const [progress, setProgress] = useState(0)
  const [flash, setFlash] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const cancelTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => cancelTimers(), [])

  const startSync = () => {
    if (state === 'syncing' || state === 'offline') return
    cancelTimers()
    setState('syncing')
    setProgress(0)
    const perItem = 700
    const total = ITEMS.length * perItem + 500
    const tickStart = Date.now()
    const iv = setInterval(() => {
      const p = Math.min(1, (Date.now() - tickStart) / total)
      setProgress(p)
      if (p >= 1) clearInterval(iv)
    }, 60) as unknown as ReturnType<typeof setTimeout>
    timers.current.push(iv)
    ITEMS.forEach((it, i) => {
      timers.current.push(setTimeout(() => setStatuses(prev => ({ ...prev, [it.id]: 'progress' })), i * perItem + 100))
      timers.current.push(setTimeout(() => {
        setStatuses(prev => ({ ...prev, [it.id]: 'done' }))
        setQueued(q => Math.max(0, q - 1))
        setSynced(s => s + 1)
      }, i * perItem + perItem))
    });
    [1, 2, 3].forEach((_, idx) => {
      timers.current.push(setTimeout(() => {
        setQueued(q => Math.max(0, q - 1))
        setSynced(s => s + 1)
      }, ITEMS.length * perItem + 200 + idx * 200))
    })
    timers.current.push(setTimeout(() => {
      setState('synced')
      setFlash(true)
      timers.current.push(setTimeout(() => setFlash(false), 220))
    }, ITEMS.length * perItem + 1100))
  }

  const resetDemo = () => {
    cancelTimers()
    setState('ready')
    setStatuses(Object.fromEntries(ITEMS.map(i => [i.id, 'queued'])))
    setQueued(4)
    setSynced(23)
    setProgress(0)
  }

  const cycleOffline = () => {
    cancelTimers()
    if (state === 'offline') { setState('ready') } else { resetDemo(); setTimeout(() => setState('offline'), 0) }
  }

  const subtitle = {
    ready: `${queued} items queued · Will sync on tap`,
    syncing: `Uploading ${ITEMS.length} items · ${Math.max(0, Math.ceil((1 - progress) * 12))}s remaining`,
    synced: 'All caught up · Last sync just now',
    offline: 'Will auto-sync when network returns',
  }[state]

  const btnLabel = { ready: 'Sync now', syncing: 'Syncing…', synced: 'Reset demo', offline: 'Sync unavailable' }[state]

  return (
    <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
      {/* haptic flash overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 80, background: 'var(--primary-soft)', opacity: flash ? 0.6 : 0, transition: 'opacity 220ms ease' }} />

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(245,241,232,0.85)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)', borderBottom: '1px solid rgba(229,220,201,0.7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '10px 14px' }}>
          <Link to="/" style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', textDecoration: 'none' }}>
            <IChevL size={18} />
          </Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.005em' }}>Sync Center</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Field Bridge · v1.4</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', justifySelf: 'end' as const }}>
            <ISettings size={17} />
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 160 }}>
        {/* Hero */}
        <div style={{ background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)', padding: '36px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
          <button onClick={cycleOffline} style={{ position: 'absolute', top: 16, right: 16, padding: '5px 10px', borderRadius: 999, background: state === 'offline' ? 'var(--ink)' : 'var(--surface)', color: state === 'offline' ? 'var(--bg)' : 'var(--ink-soft)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {state === 'offline' ? '● Offline' : 'Demo offline'}
          </button>
          <HeroRing state={state} progress={progress} />
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink-soft)', textAlign: 'center', maxWidth: 280, lineHeight: 1.4 }}>{subtitle}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 18px 0' }}>
          <Stat value={queued} label="Queued" />
          <Stat value={synced} label="Synced today" />
          <Stat value={state === 'synced' ? 'just now' : '2h'} label="Last sync" />
        </div>

        {/* Pending upload */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', margin: 0 }}>Pending upload</h2>
            <span style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(201,151,74,0.18)', color: '#8C6420', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11 }}>{queued}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ITEMS.map((it, i) => <UploadRow key={it.id} item={it} status={statuses[it.id]} index={i} />)}
          </div>
        </div>

        {/* Pending download */}
        <div style={{ padding: '22px 18px 0' }}>
          <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', margin: '0 0 10px' }}>Pending download</h2>
          <div style={{ background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden' }}>
            {[
              { title: "Tomorrow's route bundle", sub: 'Pre-computed briefing for 14 stops' },
              { title: 'Product catalogue update', sub: 'Rabi 2026 pricing + 3 new SKUs' },
              { title: 'Weather forecast', sub: 'Hardoi district · 7-day ahead' },
            ].map((r, i, arr) => (
              <div key={r.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--primary-soft)', boxShadow: '0 0 0 3px rgba(200,213,187,0.4)' }} />
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{r.title}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 2 }}>{r.sub}</div>
                  </div>
                </div>
                <IArrowD size={14} stroke="#6B6A5F" style={{ transform: 'rotate(-90deg)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Sync button */}
        <div style={{ padding: '24px 18px 0' }}>
          <button
            onClick={state === 'synced' ? resetDemo : startSync}
            disabled={state === 'offline' || state === 'syncing'}
            style={{ width: '100%', padding: '16px', borderRadius: 18, background: state === 'offline' ? 'var(--border)' : 'var(--primary)', color: state === 'offline' ? 'var(--ink-soft)' : 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, cursor: state === 'offline' || state === 'syncing' ? 'not-allowed' : 'pointer', boxShadow: state === 'offline' ? 'none' : '0 8px 20px rgba(46,74,58,0.30)', transition: 'all 240ms ease', opacity: state === 'syncing' ? 0.7 : 1 }}
          >
            {btnLabel}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
