import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { WheatStalk } from '../components/Shared'

// ─── Inline SVG illustrations ───────────────────────────────────────────────

/** Card 1: Sprout emerging from soil — premium, botanical-line style */
const SproutIllustration = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" aria-hidden="true">
    {/* Soil line */}
    <path
      d="M20 130 Q90 120 160 130"
      stroke="rgba(201,151,74,0.55)" strokeWidth="1.5" strokeLinecap="round"
    />
    {/* Main stem */}
    <path
      d="M90 130 Q88 105 92 80 Q94 60 90 42"
      stroke="rgba(201,151,74,0.9)" strokeWidth="1.8" strokeLinecap="round"
    />
    {/* Left leaf */}
    <path
      d="M90 95 Q68 80 54 58 Q72 60 82 78 Q86 86 90 95Z"
      fill="rgba(201,151,74,0.18)" stroke="rgba(201,151,74,0.75)" strokeWidth="1.2"
    />
    {/* Right leaf */}
    <path
      d="M90 78 Q112 62 126 40 Q108 44 98 62 Q94 70 90 78Z"
      fill="rgba(201,151,74,0.18)" stroke="rgba(201,151,74,0.75)" strokeWidth="1.2"
    />
    {/* Top bud */}
    <ellipse cx="90" cy="38" rx="8" ry="12"
      fill="rgba(201,151,74,0.22)" stroke="rgba(201,151,74,0.85)" strokeWidth="1.3"
    />
    <path d="M90 28 Q86 22 90 18 Q94 22 90 28Z"
      fill="rgba(201,151,74,0.6)" stroke="rgba(201,151,74,0.9)" strokeWidth="0.9"
    />
    {/* Root tendrils */}
    <path d="M90 130 Q80 140 68 138" stroke="rgba(201,151,74,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M90 130 Q100 142 114 140" stroke="rgba(201,151,74,0.4)" strokeWidth="1" strokeLinecap="round" />
    <path d="M90 132 Q88 146 82 152" stroke="rgba(201,151,74,0.3)" strokeWidth="1" strokeLinecap="round" />
    {/* Soil dots */}
    {[50, 72, 95, 118, 140].map((x, i) => (
      <circle key={i} cx={x} cy={132 + (i % 2) * 3} r="2" fill="rgba(201,151,74,0.25)" />
    ))}
    {/* Floating sparkle dots */}
    <circle cx="44" cy="70" r="2.5" fill="rgba(201,151,74,0.35)" />
    <circle cx="138" cy="80" r="2" fill="rgba(201,151,74,0.3)" />
    <circle cx="60" cy="44" r="1.5" fill="rgba(201,151,74,0.25)" />
    <circle cx="130" cy="55" r="1.5" fill="rgba(201,151,74,0.25)" />
  </svg>
)

/** Card 2: Route map with animated dashes and location pins */
const RouteIllustration = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" aria-hidden="true">
    {/* Map grid (faint) */}
    {[40, 80, 120, 160].map(x => (
      <line key={`vg${x}`} x1={x} y1="10" x2={x} y2="150" stroke="var(--border)" strokeWidth="0.6" strokeDasharray="3 6" />
    ))}
    {[30, 70, 110].map(y => (
      <line key={`hg${y}`} x1="10" y1={y} x2="190" y2={y} stroke="var(--border)" strokeWidth="0.6" strokeDasharray="3 6" />
    ))}
    {/* Route path — wavy organic road */}
    <path
      id="route-path-ob"
      d="M28 130 Q55 100 80 108 Q108 118 128 85 Q148 52 172 38"
      stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" fill="none"
      strokeDasharray="8 6"
      style={{ animation: 'dashMove 1.2s linear infinite' }}
    />
    {/* Shadow/glow under path */}
    <path
      d="M28 130 Q55 100 80 108 Q108 118 128 85 Q148 52 172 38"
      stroke="rgba(46,74,58,0.12)" strokeWidth="6" strokeLinecap="round" fill="none"
    />
    {/* Location pin A */}
    <g transform="translate(22,118)">
      <circle cx="6" cy="6" r="9" fill="var(--primary)" />
      <circle cx="6" cy="6" r="4" fill="var(--surface)" />
      <line x1="6" y1="15" x2="6" y2="22" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
      <text x="6" y="9" textAnchor="middle" fill="var(--surface)" fontFamily="Plus Jakarta Sans" fontSize="6" fontWeight="700">A</text>
    </g>
    {/* Location pin 2 */}
    <g transform="translate(72,96)">
      <circle cx="6" cy="6" r="7" fill="rgba(201,151,74,0.9)" />
      <circle cx="6" cy="6" r="3" fill="var(--surface)" />
    </g>
    {/* Location pin 3 */}
    <g transform="translate(120,72)">
      <circle cx="6" cy="6" r="7" fill="rgba(201,151,74,0.9)" />
      <circle cx="6" cy="6" r="3" fill="var(--surface)" />
    </g>
    {/* End pin */}
    <g transform="translate(164,24)">
      <circle cx="8" cy="8" r="10" fill="var(--accent)" />
      <circle cx="8" cy="8" r="4.5" fill="var(--surface)" />
      <line x1="8" y1="18" x2="8" y2="26" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <text x="8" y="11" textAnchor="middle" fill="var(--surface)" fontFamily="Plus Jakarta Sans" fontSize="6" fontWeight="700">4</text>
    </g>
    {/* Rain drops */}
    {[[165, 100, 0.6], [148, 120, 0.4], [175, 115, 0.5], [155, 135, 0.35]].map(([x, y, o], i) => (
      <ellipse key={i} cx={x as number} cy={y as number} rx="1.5" ry="4"
        fill={`rgba(46,74,58,${o})`}
        style={{ animation: `fadeUp ${0.6 + i * 0.15}s ease infinite alternate` }}
      />
    ))}
    {/* Distance badge */}
    <rect x="90" y="132" width="48" height="18" rx="9" fill="var(--primary)" />
    <text x="114" y="144" textAnchor="middle" fill="#FAF6EC" fontFamily="Plus Jakarta Sans" fontSize="8" fontWeight="700">42 km · 6 stops</text>
  </svg>
)

/** Card 3: Camera aperture with scanning lines */
const ApertureIllustration = () => (
  <svg width="170" height="170" viewBox="0 0 170 170" fill="none" aria-hidden="true">
    {/* Outer ring */}
    <circle cx="85" cy="85" r="72"
      stroke="rgba(46,74,58,0.5)" strokeWidth="1.2"
      fill="none"
      strokeDasharray="4 8"
      style={{ animation: 'ringSpin 18s linear infinite' }}
    />
    {/* Mid ring */}
    <circle cx="85" cy="85" r="58"
      stroke="rgba(201,151,74,0.35)" strokeWidth="1"
      fill="none"
      strokeDasharray="6 6"
      style={{ animation: 'ringSpin 10s linear infinite reverse' }}
    />
    {/* Aperture blades — 6 blade shapes */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60) * (Math.PI / 180)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const cx = 85 + 36 * cos
      const cy = 85 + 36 * sin
      return (
        <ellipse
          key={i}
          cx={cx} cy={cy}
          rx="18" ry="9"
          fill="rgba(46,74,58,0.22)"
          stroke="rgba(46,74,58,0.55)"
          strokeWidth="0.9"
          transform={`rotate(${i * 60 + 90}, ${cx}, ${cy})`}
        />
      )
    })}
    {/* Inner iris */}
    <circle cx="85" cy="85" r="26"
      fill="rgba(46,74,58,0.12)" stroke="rgba(46,74,58,0.6)" strokeWidth="1.2"
    />
    {/* Leaf vein inside iris */}
    <path d="M85 68 Q80 78 85 88 Q90 78 85 68Z"
      fill="rgba(46,74,58,0.5)" stroke="rgba(46,74,58,0.8)" strokeWidth="0.8"
    />
    <path d="M72 78 Q81 80 92 78 Q81 82 72 78Z"
      fill="rgba(201,151,74,0.4)" stroke="rgba(201,151,74,0.7)" strokeWidth="0.8"
    />
    {/* Scan line */}
    <line
      x1="30" y1="85" x2="140" y2="85"
      stroke="rgba(201,151,74,0.8)" strokeWidth="1.5" strokeLinecap="round"
      style={{ animation: 'scanLine 2.4s cubic-bezier(0.45,0,0.55,1) infinite' }}
    />
    {/* Corner brackets */}
    {[
      [30, 30, 1, 1], [140, 30, -1, 1], [30, 140, 1, -1], [140, 140, -1, -1]
    ].map(([x, y, dx, dy], i) => (
      <g key={i}>
        <line x1={x} y1={y} x2={x + dx * 14} y2={y} stroke="rgba(201,151,74,0.7)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={x} y1={y} x2={x} y2={y + dy * 14} stroke="rgba(201,151,74,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ))}
    {/* "3 sec" tag */}
    <rect x="58" y="106" width="54" height="18" rx="9" fill="rgba(201,151,74,0.9)" />
    <text x="85" y="118" textAnchor="middle" fill="#1A1A17" fontFamily="Plus Jakarta Sans" fontSize="8" fontWeight="700">3 sec · AI result</text>
  </svg>
)

// ─── Card data ────────────────────────────────────────────────────────────────

interface OnboardCard {
  bg: string
  textColor: string
  subtitleColor: string
  eyebrow: string
  title: string
  subtitle: string
  Illustration: React.FC
}

const CARDS: OnboardCard[] = [
  {
    bg: 'var(--primary)',
    textColor: '#FAF6EC',
    subtitleColor: 'rgba(250,246,236,0.72)',
    eyebrow: 'AgroPilot Intelligence',
    title: 'Your AI field co-pilot',
    subtitle: 'Know which farm to visit, what to pitch, and when to act — before you leave in the morning.',
    Illustration: SproutIllustration,
  },
  {
    bg: 'var(--bg)',
    textColor: 'var(--ink)',
    subtitleColor: 'var(--ink-soft)',
    eyebrow: 'Route Engine',
    title: 'Route optimized for rain',
    subtitle: 'AI reads weather + crop stage + inventory to build your optimal day. No guesswork.',
    Illustration: RouteIllustration,
  },
  {
    bg: '#111C15',
    textColor: '#FAF6EC',
    subtitleColor: 'rgba(250,246,236,0.65)',
    eyebrow: 'Crop Intelligence',
    title: 'Scan any crop, get answers',
    subtitle: 'Point at a diseased leaf. Get product recommendation in 3 seconds.',
    Illustration: ApertureIllustration,
  },
]

// ─── Onboarding screen ────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  // Touch state for swipe detection
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const markDoneAndGoToLogin = useCallback(() => {
    localStorage.setItem('agro_onboarded', '1')
    navigate('/login', { replace: true })
  }, [navigate])

  const goTo = useCallback((index: number, dir: 'forward' | 'back' = 'forward') => {
    if (transitioning) return
    if (index < 0 || index >= CARDS.length) return
    setDirection(dir)
    setTransitioning(true)
    // Allow CSS transition to play then update
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 320)
  }, [transitioning])

  const goNext = useCallback(() => {
    if (current === CARDS.length - 1) {
      markDoneAndGoToLogin()
    } else {
      goTo(current + 1, 'forward')
    }
  }, [current, goTo, markDoneAndGoToLogin])

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1, 'back')
  }, [current, goTo])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only register horizontal swipes that clearly dominate vertical
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const card = CARDS[current]
  const isLast = current === CARDS.length - 1

  // Slide transform: during transition, slide out in direction; snaps on mount
  const slideStyle: React.CSSProperties = {
    transform: transitioning
      ? `translateX(${direction === 'forward' ? '-6%' : '6%'})`
      : 'translateX(0)',
    opacity: transitioning ? 0 : 1,
    transition: transitioning
      ? 'transform 300ms cubic-bezier(0.32,0,0.67,0), opacity 260ms ease'
      : 'transform 360ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        background: card.bg,
        transition: 'background 420ms cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.8 0 0 0 0 0.7 0 0 0 0 0.5 0 0 0 0.12 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }} />

      {/* Ambient decorative wheat on card 1 */}
      {current === 0 && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: -50,
          opacity: 0.07,
          pointerEvents: 'none',
          transform: 'rotate(-8deg)',
          transition: 'opacity 400ms ease',
        }}>
          <WheatStalk size={280} color="#FAF6EC" opacity={1} />
        </div>
      )}

      {/* Top bar — Skip link + progress counter */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '52px 28px 0',
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: current === 1 ? 'var(--primary)' : 'rgba(250,246,236,0.18)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 400ms ease',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={current === 1 ? '#FAF6EC' : 'rgba(250,246,236,0.9)'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'Fraunces',
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: current === 1 ? 'var(--ink)' : 'rgba(250,246,236,0.9)',
            transition: 'color 400ms ease',
          }}>
            AgroPilot
          </span>
        </div>

        {/* Skip */}
        <button
          onClick={markDoneAndGoToLogin}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            fontWeight: 600,
            color: current === 1 ? 'var(--ink-soft)' : 'rgba(250,246,236,0.62)',
            cursor: 'pointer',
            padding: '6px 2px',
            transition: 'color 400ms ease, opacity 200ms ease',
            letterSpacing: '-0.01em',
          }}
        >
          Skip
        </button>
      </div>

      {/* Card content */}
      <div
        style={{
          ...slideStyle,
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 480,
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {/* Illustration */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
          <card.Illustration />
        </div>

        {/* Text block */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: current === 1 ? 'var(--accent)' : 'rgba(201,151,74,0.8)',
            marginBottom: 14,
            transition: 'color 400ms ease',
          }}>
            {card.eyebrow}
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Fraunces',
            fontSize: 'clamp(32px, 9vw, 44px)',
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: card.textColor,
            margin: '0 0 18px',
            transition: 'color 400ms ease',
          }}>
            {card.title}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 'clamp(15px, 4.2vw, 17px)',
            fontWeight: 400,
            lineHeight: 1.58,
            color: card.subtitleColor,
            margin: 0,
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
            transition: 'color 400ms ease',
          }}>
            {card.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 480,
        padding: '0 32px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => i !== current && goTo(i, i > current ? 'forward' : 'back')}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 999,
                background: i === current
                  ? (current === 1 ? 'var(--primary)' : 'rgba(201,151,74,0.9)')
                  : (current === 1 ? 'var(--border)' : 'rgba(250,246,236,0.28)'),
                border: 'none',
                padding: 0,
                cursor: i === current ? 'default' : 'pointer',
                transition: 'all 400ms cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={goNext}
          className="press-scale"
          style={{
            width: '100%',
            padding: '17px 24px',
            borderRadius: 18,
            background: current === 1
              ? 'var(--primary)'
              : 'rgba(250,246,236,0.13)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: current === 1
              ? 'none'
              : '1px solid rgba(250,246,236,0.22)',
            color: current === 1 ? '#FAF6EC' : '#FAF6EC',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.02em',
            transition: 'background 400ms ease, border 400ms ease, transform 100ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isLast ? 'Get Started' : 'Next'}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 200ms ease',
          }}>
            {isLast ? (
              // Checkmark-arrow hybrid for "Get Started"
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </span>
        </button>

        {/* Syngenta tagline */}
        <p style={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11,
          color: current === 1 ? 'var(--ink-soft)' : 'rgba(250,246,236,0.35)',
          margin: 0,
          letterSpacing: '0.04em',
          transition: 'color 400ms ease',
        }}>
          Syngenta India · Field Intelligence Platform
        </p>
      </div>
    </div>
  )
}
