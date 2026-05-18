import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import i18next from 'i18next'
import {
  IChev,
  TopStrip,
  BottomNav,
  Icon,
  Eyebrow,
  WheatStalk,
  IWifi,
  IMoon,
  ISun,
} from '../components/Shared'
import { useAuth } from '../components/AuthContext'
import { useTheme } from '../components/ThemeContext'

// Maps human-readable label → BCP-47 language code used by i18next
const LANGUAGE_OPTIONS = [
  { label: 'English',            code: 'en' },
  { label: 'हिंदी (Hindi)',      code: 'hi' },
  { label: 'मराठी (Marathi)',    code: 'mr' },
  { label: 'தமிழ் (Tamil)',      code: 'ta' },
  { label: 'తెలుగు (Telugu)',    code: 'te' },
] as const

type LanguageCode = typeof LANGUAGE_OPTIONS[number]['code']

// ── Inline icon definitions (SVG via Icon wrapper) ──────────────────────────

const ILogOut = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    }
  />
)

const ICameraFull = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    }
  />
)

const ICalcFull = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
      </>
    }
  />
)

const IGlobe = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    }
  />
)

const IDataSaver = (p: any) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </>
    }
  />
)

const IShield = (p: any) => (
  <Icon
    {...p}
    d={<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
  />
)

// ── Data ────────────────────────────────────────────────────────────────────

const REP_PHOTO =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop'

const COVER_PHOTO =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80&auto=format&fit=crop'

interface KPI {
  label: string
  value: string
  target: string
  numericValue: number
  numericTarget: number
  unit: string
  onTrack: boolean
}

const kpis: KPI[] = [
  {
    label: 'Visits',
    value: '18',
    target: '24',
    numericValue: 18,
    numericTarget: 24,
    unit: '',
    onTrack: false,
  },
  {
    label: 'Rev / Day',
    value: '₹12.4k',
    target: '₹15k',
    numericValue: 12.4,
    numericTarget: 15,
    unit: '₹k',
    onTrack: false,
  },
  {
    label: 'AI Accept',
    value: '78%',
    target: '85%',
    numericValue: 78,
    numericTarget: 85,
    unit: '%',
    onTrack: false,
  },
  {
    label: 'Coverage',
    value: '64%',
    target: '80%',
    numericValue: 64,
    numericTarget: 80,
    unit: '%',
    onTrack: false,
  },
]

const achievements = [
  { icon: '🔥', label: '12-day visit streak' },
  { icon: '⭐', label: '94% AI acceptance' },
  { icon: '🏆', label: 'Top 12% this month' },
]

const tools = [
  {
    label: 'Crop Scanner',
    desc: 'AI disease diagnosis in the field',
    to: '/scanner',
    Icon: ICameraFull,
    gradient: 'linear-gradient(135deg, rgba(46,74,58,0.06) 0%, rgba(46,74,58,0.02) 100%)',
    accentColor: 'var(--primary)',
  },
  {
    label: 'Yield Calculator',
    desc: 'Project ROI for farmer decisions',
    to: '/calculator',
    Icon: ICalcFull,
    gradient: 'linear-gradient(135deg, rgba(201,151,74,0.08) 0%, rgba(201,151,74,0.02) 100%)',
    accentColor: 'var(--accent)',
  },
]

// ── Animated progress bar ────────────────────────────────────────────────────

function ProgressBar({
  pct,
  onTrack,
  delay = 0,
}: {
  pct: number
  onTrack: boolean
  delay?: number
}) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(Math.min(100, pct)), 120 + delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  const color = onTrack ? 'var(--primary)' : 'var(--accent)'
  return (
    <div
      style={{
        height: 3,
        borderRadius: 99,
        background: 'rgba(0,0,0,0.07)',
        overflow: 'hidden',
        marginTop: 10,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          borderRadius: 99,
          background: color,
          transition: `width 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          boxShadow: onTrack
            ? '0 0 6px rgba(46,74,58,0.3)'
            : '0 0 6px rgba(201,151,74,0.3)',
        }}
      />
    </div>
  )
}

// ── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 46,
        height: 27,
        borderRadius: 99,
        background: value ? 'var(--primary)' : 'var(--border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        boxShadow: value ? 'inset 0 1px 3px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <div
        style={{
          width: 21,
          height: 21,
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: 3,
          left: value ? 22 : 3,
          transition: 'left 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        }}
      />
    </div>
  )
}

// ── Setting row ──────────────────────────────────────────────────────────────

function SettingRow({
  IconEl,
  label,
  sub,
  right,
}: {
  IconEl: React.ReactNode
  label: string
  sub?: string
  right: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '13px 16px',
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: 'var(--surface-warm)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--primary)',
        }}
      >
        {IconEl}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 11.5,
              color: 'var(--ink-soft)',
              marginTop: 1,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      {right}
    </div>
  )
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function RepProfile() {
  // Derive the initial selected language from the active i18next language code.
  // Falls back to 'en' when the stored code has no matching option.
  const resolveInitialCode = (): LanguageCode => {
    const active = i18next.language?.split('-')[0] as LanguageCode
    return LANGUAGE_OPTIONS.some((o) => o.code === active) ? active : 'en'
  }

  const [langCode, setLangCode] = useState<LanguageCode>(resolveInitialCode)
  const [dataSaver, setDataSaver] = useState(false)
  const [wifiSync, setWifiSync] = useState(true)
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  /** Change the UI language, persist preference, and update local state. */
  const handleLanguageChange = (code: LanguageCode) => {
    setLangCode(code)
    i18next.changeLanguage(code)
    localStorage.setItem('agro_lang', code)
  }

  // Ref for horizontal KPI scroll snap
  const kpiRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="screen-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        background: 'var(--bg)',
      }}
    >
      <TopStrip />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{
          position: 'relative',
          height: 220,
          marginBottom: 52,
        }}
      >
        {/* Background layer — clipped so ken-burns doesn't overflow */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Cover image with Ken Burns drift */}
          <div
            className="ken-burns"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${COVER_PHOTO})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />

          {/* Dark gradient overlay — forest green tinted */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(14,30,20,0.52) 0%, rgba(14,30,20,0.78) 55%, rgba(14,30,20,0.92) 100%)',
            }}
          />
        </div>

        {/* WheatStalk decoration — top right, subtle */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            pointerEvents: 'none',
          }}
        >
          <WheatStalk size={44} color="#FAF6EC" opacity={0.18} />
        </div>

        {/* Rank badge — top left */}
        <div
          className="slide-in-l"
          style={{
            position: 'absolute',
            top: 16,
            left: 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 99,
            background: 'rgba(201,151,74,0.18)',
            border: '1px solid rgba(201,151,74,0.38)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="var(--accent)"
            stroke="none"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '0.02em',
            }}
          >
            Top 12% this month
          </span>
        </div>

        {/* Name + role text — sits above the fold-line */}
        <div
          style={{
            position: 'absolute',
            bottom: 62,
            left: 18,
            right: 18,
          }}
        >
          <h1
            style={{
              fontFamily: 'Fraunces',
              fontSize: 30,
              fontWeight: 500,
              color: '#F5F1E8',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            Arjun Mehta
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 12.5,
                fontWeight: 500,
                color: 'rgba(245,241,232,0.7)',
              }}
            >
              Field Sales Representative
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(245,241,232,0.4)',
                display: 'inline-block',
              }}
            />
            {/* Territory badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 99,
                background: 'rgba(200,213,187,0.18)',
                border: '1px solid rgba(200,213,187,0.3)',
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-soft)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--primary-soft)',
                  letterSpacing: '0.02em',
                }}
              >
                Hardoi · UP West
              </span>
            </span>
          </div>
        </div>

        {/* Avatar — overlapping hero bottom edge */}
        <div
          style={{
            position: 'absolute',
            bottom: -44,
            left: 18,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `center/cover url(${REP_PHOTO})`,
            border: '3px solid var(--surface)',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.22), 0 0 0 1px rgba(46,74,58,0.12)',
          }}
        >
          {/* Online dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#4CAF50',
              border: '2px solid var(--surface)',
            }}
          />
        </div>
      </div>

      {/* ── ACHIEVEMENT PILLS ────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{
          animationDelay: '80ms',
          // offset left to clear avatar overhang, right stays standard
          paddingLeft: 114,
          paddingRight: 18,
          marginBottom: 24,
        }}
      >
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {achievements.map((a, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 99,
                background: 'rgba(201,151,74,0.10)',
                border: '1px solid rgba(201,151,74,0.25)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 12 }}>{a.icon}</span>
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#9A6A20',
                  letterSpacing: '0.01em',
                }}
              >
                {a.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── KPI STRIP ────────────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{ animationDelay: '140ms', marginBottom: 28 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            paddingLeft: 18,
            paddingRight: 18,
            marginBottom: 12,
          }}
        >
          <Eyebrow color="var(--ink-soft)">This Week</Eyebrow>
          <span
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            View report →
          </span>
        </div>

        {/* Horizontal scroll snap container */}
        <div
          ref={kpiRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingLeft: 18,
            paddingRight: 18,
            scrollSnapType: 'x mandatory',
          }}
        >
          {kpis.map((kpi, i) => {
            const pct = (kpi.numericValue / kpi.numericTarget) * 100
            const onTrack = pct >= 80
            const statusColor = onTrack ? 'var(--primary)' : 'var(--accent)'
            const statusBg = onTrack
              ? 'rgba(46,74,58,0.07)'
              : 'rgba(201,151,74,0.08)'
            const fraction = `${kpi.numericValue}/${kpi.numericTarget}`

            return (
              <div
                key={kpi.label}
                style={{
                  minWidth: 148,
                  maxWidth: 148,
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  padding: '16px 16px 14px',
                  background: 'var(--surface)',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Eyebrow color="var(--ink-soft)">{kpi.label}</Eyebrow>

                <div
                  style={{
                    marginTop: 10,
                    fontFamily: 'Fraunces',
                    fontSize: 32,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {kpi.value}
                </div>

                {/* Fraction to target */}
                <div
                  style={{
                    marginTop: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 7px',
                    borderRadius: 99,
                    background: statusBg,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: statusColor,
                    }}
                  >
                    {fraction} {kpi.unit}
                  </span>
                </div>

                <ProgressBar pct={pct} onTrack={onTrack} delay={i * 80} />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TOOLS ────────────────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{ animationDelay: '200ms', paddingLeft: 18, paddingRight: 18, marginBottom: 28 }}
      >
        <div style={{ marginBottom: 12 }}>
          <Eyebrow color="var(--ink-soft)">Field Tools</Eyebrow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tools.map((tool) => (
            <Link
              key={tool.label}
              to={tool.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 16px',
                background: 'var(--surface)',
                borderRadius: 20,
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Gradient tint layer */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: tool.gradient,
                  pointerEvents: 'none',
                }}
              />

              {/* Icon container */}
              <div
                style={{
                  position: 'relative',
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: 'var(--surface-warm)',
                  border: `1px solid ${tool.accentColor === 'var(--primary)' ? 'rgba(46,74,58,0.16)' : 'rgba(201,151,74,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: tool.accentColor,
                }}
              >
                <tool.Icon size={20} stroke={tool.accentColor} />
              </div>

              <div style={{ flex: 1, position: 'relative' }}>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                  }}
                >
                  {tool.label}
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 12,
                    color: 'var(--ink-soft)',
                    marginTop: 2,
                  }}
                >
                  {tool.desc}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <IChev size={16} stroke="var(--ink-soft)" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── SETTINGS ─────────────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{ animationDelay: '260ms', paddingLeft: 18, paddingRight: 18, marginBottom: 28 }}
      >
        <div style={{ marginBottom: 12 }}>
          <Eyebrow color="var(--ink-soft)">Preferences</Eyebrow>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 20,
            border: '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Language */}
          <SettingRow
            IconEl={<IGlobe size={17} stroke="var(--primary)" />}
            label="Language"
            sub="Interface & voice prompts"
            right={
              <select
                value={langCode}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 9,
                  border: '1px solid var(--border)',
                  background: 'var(--surface-warm)',
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingRight: 28,
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%236B6A5F' stroke-width='1.5' stroke-linecap='round'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                {LANGUAGE_OPTIONS.map(({ label, code }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            }
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', marginLeft: 68 }} />

          {/* Data Saver */}
          <SettingRow
            IconEl={<IDataSaver size={17} stroke="var(--primary)" />}
            label="Data Saver"
            sub="Compress images & map tiles"
            right={<Toggle value={dataSaver} onChange={setDataSaver} />}
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', marginLeft: 68 }} />

          {/* WiFi Auto-Sync */}
          <SettingRow
            IconEl={<IWifi size={17} stroke="var(--primary)" />}
            label="Auto-sync on WiFi"
            sub="Sync automatically when connected to WiFi"
            right={<Toggle value={wifiSync} onChange={setWifiSync} />}
          />

          <div style={{ height: 1, background: 'var(--border)', marginLeft: 68 }} />

          {/* Dark Mode */}
          <SettingRow
            IconEl={theme === 'dark'
              ? <ISun size={17} stroke="var(--primary)" />
              : <IMoon size={17} stroke="var(--primary)" />}
            label="Dark Mode"
            sub={theme === 'dark' ? 'Dark theme active' : 'Switch to dark theme'}
            right={<Toggle value={theme === 'dark'} onChange={() => toggleTheme()} />}
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', marginLeft: 68 }} />

          {/* App version — static info row */}
          <SettingRow
            IconEl={<IShield size={17} stroke="var(--primary)" />}
            label="AgroPilot"
            sub="Version 2.4.1 · Syngenta India"
            right={
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: 'var(--primary-soft)',
                  padding: '3px 8px',
                  borderRadius: 99,
                }}
              >
                Up to date
              </span>
            }
          />
        </div>
      </div>

      {/* ── SIGN OUT ─────────────────────────────────────────────────── */}
      <div
        className="fade-up"
        style={{ animationDelay: '320ms', paddingLeft: 18, paddingRight: 18 }}
      >
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '15px 20px',
            borderRadius: 20,
            background: 'rgba(184,92,60,0.06)',
            border: '1px solid rgba(184,92,60,0.18)',
            color: 'var(--danger)',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            letterSpacing: '0.01em',
            transition: 'background 160ms ease, border-color 160ms ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'rgba(184,92,60,0.11)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'rgba(184,92,60,0.06)'
          }}
        >
          <ILogOut size={16} stroke="var(--danger)" />
          Sign Out
        </button>
      </div>

      {/* Bottom spacer for nav */}
      <div style={{ height: 120 }} />
      <BottomNav />
    </div>
  )
}
