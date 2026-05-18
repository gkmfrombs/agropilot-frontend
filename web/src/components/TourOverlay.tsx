import React, { useState, useEffect, useCallback } from 'react'

// ─── Tour step definitions ────────────────────────────────────────────────────

type TargetType = 'bottom-nav' | 'center'

interface TourStep {
  targetType: TargetType
  // For bottom-nav targets: 0-indexed position among the 5 nav items
  navIndex?: number
  title: string
  description: string
  // Which side to render the tooltip: 'above' or 'center-float'
  tooltipPosition: 'above-nav' | 'center-float'
}

const STEPS: TourStep[] = [
  {
    targetType: 'bottom-nav',
    navIndex: 0,
    title: 'Morning Briefing',
    description: 'AI-prioritized farms to visit today, ranked by urgency and opportunity.',
    tooltipPosition: 'above-nav',
  },
  {
    targetType: 'bottom-nav',
    navIndex: 1,
    title: 'Route Planner',
    description: 'Optimized daily route — AI sequences visits by urgency + weather + distance.',
    tooltipPosition: 'above-nav',
  },
  {
    targetType: 'bottom-nav',
    navIndex: 2,
    title: 'AgroPilot Chat',
    description: 'Ask anything — crop advice, dosage, competitor pricing, inventory stock.',
    tooltipPosition: 'above-nav',
  },
  {
    targetType: 'bottom-nav',
    navIndex: 3,
    title: 'Sync & Offline',
    description: 'Field-proof offline mode. Syncs visits, photos, and notes when back online.',
    tooltipPosition: 'above-nav',
  },
  {
    targetType: 'bottom-nav',
    navIndex: 4,
    title: 'Your Profile',
    description: 'Your stats, tools, territory coverage, and account settings.',
    tooltipPosition: 'above-nav',
  },
  {
    targetType: 'center',
    title: 'Farm Cards',
    description: 'Tap any farm card to start a guided visit. AgroPilot briefs you before you knock.',
    tooltipPosition: 'center-float',
  },
  {
    targetType: 'center',
    title: "You're ready.",
    description: 'AgroPilot knows your territory, your crops, your farmers. Let\'s go.',
    tooltipPosition: 'center-float',
  },
]

// ─── Geometry helpers ─────────────────────────────────────────────────────────

/**
 * Returns the center {x, y} and radius of the spotlight for each step.
 * Bottom nav is at the very bottom of the screen, 62px tall, items evenly split.
 * We use window dimensions directly since the nav is full-width and fixed.
 */
function getSpotlight(step: TourStep, winW: number, winH: number) {
  if (step.targetType === 'bottom-nav' && step.navIndex !== undefined) {
    const navH = 62
    // 5 items, evenly spaced
    const itemW = winW / 5
    const cx = itemW * step.navIndex + itemW / 2
    const cy = winH - navH / 2

    // The "Chat" icon (index 2) has a special raised bubble — slightly larger spotlight
    const r = step.navIndex === 2 ? 34 : 28

    return { cx, cy, r }
  }
  // Center of screen float
  return { cx: winW / 2, cy: winH / 2, r: 56 }
}

/**
 * Returns CSS top/left positioning for the tooltip card.
 */
function getTooltipStyle(
  step: TourStep,
  winW: number,
  winH: number
): React.CSSProperties {
  if (step.tooltipPosition === 'above-nav' && step.navIndex !== undefined) {
    const navH = 62
    const itemW = winW / 5
    const cx = itemW * step.navIndex + itemW / 2

    // Tooltip card is ~300px wide; clamp so it doesn't overflow edges
    const cardW = Math.min(300, winW - 32)
    let left = cx - cardW / 2
    left = Math.max(16, Math.min(left, winW - cardW - 16))

    return {
      position: 'fixed',
      bottom: navH + 18,
      left,
      width: cardW,
    }
  }

  // center-float: vertically centered with offset upward
  const cardW = Math.min(320, winW - 32)
  return {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    width: cardW,
  }
}

// ─── Spotlight clip component ─────────────────────────────────────────────────

interface SpotlightProps {
  cx: number
  cy: number
  r: number
}

function Spotlight({ cx, cy, r }: SpotlightProps) {
  return (
    <>
      {/* Full-screen dark overlay with a circular hole punched via radial-gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(circle ${r + 2}px at ${cx}px ${cy}px, transparent 0%, transparent ${r}px, rgba(0,0,0,0.80) ${r + 2}px)`,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      {/* Spotlight ring — amber pulse */}
      <div
        style={{
          position: 'fixed',
          left: cx - r - 4,
          top: cy - r - 4,
          width: (r + 4) * 2,
          height: (r + 4) * 2,
          borderRadius: '50%',
          border: '2px solid rgba(201,151,74,0.75)',
          boxShadow: '0 0 0 4px rgba(201,151,74,0.12), 0 0 24px rgba(201,151,74,0.22)',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'tourSpotlightPulse 2s ease-in-out infinite',
        }}
      />
    </>
  )
}

// ─── Tooltip card ─────────────────────────────────────────────────────────────

interface TooltipProps {
  step: TourStep
  stepIndex: number
  totalSteps: number
  style: React.CSSProperties
  isLast: boolean
  onNext: () => void
  onSkip: () => void
  visible: boolean
}

function TooltipCard({
  step,
  stepIndex,
  totalSteps,
  style,
  isLast,
  onNext,
  onSkip,
  visible,
}: TooltipProps) {
  return (
    <div
      style={{
        ...style,
        zIndex: 10000,
        background: 'var(--surface)',
        borderRadius: 20,
        padding: '22px 20px 18px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06)',
        opacity: visible ? 1 : 0,
        transform: visible
          ? (style.transform ?? 'none')
          : `${style.transform ?? ''} translateY(10px)`,
        transition: 'opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 300ms cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Step badge + progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--primary-soft)',
          borderRadius: 999,
          padding: '4px 10px 4px 6px',
        }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 10,
              fontWeight: 700,
              color: '#FAF6EC',
              lineHeight: 1,
            }}>
              {stepIndex + 1}
            </span>
          </div>
          <span style={{
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 10.5,
            fontWeight: 600,
            color: 'var(--primary)',
            letterSpacing: '0.01em',
          }}>
            Tour
          </span>
        </div>

        {/* X / n progress */}
        <span style={{
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--ink-soft)',
          letterSpacing: '0.04em',
        }}>
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3,
        borderRadius: 999,
        background: 'var(--border)',
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: 999,
          background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
          width: `${((stepIndex + 1) / totalSteps) * 100}%`,
          transition: 'width 350ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Fraunces',
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: 'var(--ink)',
        margin: '0 0 8px',
        lineHeight: 1.15,
      }}>
        {step.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 13.5,
        lineHeight: 1.6,
        color: 'var(--ink-soft)',
        margin: '0 0 18px',
        fontWeight: 400,
      }}>
        {step.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={onNext}
          className="press-scale"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            background: isLast ? 'var(--accent)' : 'var(--primary)',
            color: '#FAF6EC',
            border: 'none',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 200ms ease, transform 100ms ease',
          }}
        >
          {isLast ? (
            <>
              Start using AgroPilot
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            <>
              Next
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </>
          )}
        </button>

        {!isLast && (
          <button
            onClick={onSkip}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'var(--surface-warm)',
              border: '1px solid var(--border)',
              color: 'var(--ink-soft)',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              transition: 'background 150ms ease',
            }}
          >
            Skip tour
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Keyframe injection ───────────────────────────────────────────────────────

/**
 * Injects the @keyframes needed by TourOverlay once, lazily.
 * We avoid an external CSS file to stay consistent with the project's inline-style approach.
 */
let injected = false
function injectTourStyles() {
  if (injected || typeof document === 'undefined') return
  injected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes tourSpotlightPulse {
      0%, 100% { opacity: 0.9; box-shadow: 0 0 0 4px rgba(201,151,74,0.12), 0 0 24px rgba(201,151,74,0.22); }
      50%       { opacity: 0.6; box-shadow: 0 0 0 8px rgba(201,151,74,0.06), 0 0 36px rgba(201,151,74,0.32); }
    }
    @keyframes tourFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `
  document.head.appendChild(style)
}

// ─── Main TourOverlay component ───────────────────────────────────────────────

interface TourOverlayProps {
  onDone: () => void
}

export default function TourOverlay({ onDone }: TourOverlayProps) {
  injectTourStyles()

  const [stepIndex, setStepIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [winW, setWinW] = useState(window.innerWidth)
  const [winH, setWinH] = useState(window.innerHeight)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Track window size for responsive spotlight positioning
  useEffect(() => {
    const handleResize = () => {
      setWinW(window.innerWidth)
      setWinH(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const markDone = useCallback(() => {
    localStorage.setItem('agro_tour_done', '1')
    onDone()
  }, [onDone])

  // Animate step transition: briefly hide tooltip, then show next step
  const [tooltipVisible, setTooltipVisible] = useState(true)

  const goToStep = useCallback((nextIndex: number) => {
    setTooltipVisible(false)
    setTimeout(() => {
      setStepIndex(nextIndex)
      setTooltipVisible(true)
    }, 220)
  }, [])

  const handleNext = useCallback(() => {
    if (stepIndex === STEPS.length - 1) {
      markDone()
    } else {
      goToStep(stepIndex + 1)
    }
  }, [stepIndex, goToStep, markDone])

  const handleSkip = useCallback(() => {
    markDone()
  }, [markDone])

  const step = STEPS[stepIndex]
  const spotlight = getSpotlight(step, winW, winH)
  const tooltipStyle = getTooltipStyle(step, winW, winH)
  const isLast = stepIndex === STEPS.length - 1

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms ease',
        // Prevent body scroll while tour is open
        overflow: 'hidden',
      }}
      // Tapping the dark backdrop advances the tour (common pattern in product tours)
      onClick={(e) => {
        // Only advance if click was on the backdrop itself, not the tooltip
        if ((e.target as HTMLElement).closest('[data-tour-tooltip]')) return
        handleNext()
      }}
    >
      {/* Backdrop + spotlight cutout */}
      <Spotlight cx={spotlight.cx} cy={spotlight.cy} r={spotlight.r} />

      {/* Tooltip card — stop click propagation so backdrop tap doesn't double-fire */}
      <div
        data-tour-tooltip=""
        onClick={(e) => e.stopPropagation()}
      >
        <TooltipCard
          step={step}
          stepIndex={stepIndex}
          totalSteps={STEPS.length}
          style={tooltipStyle}
          isLast={isLast}
          onNext={handleNext}
          onSkip={handleSkip}
          visible={tooltipVisible}
        />
      </div>

      {/* Optional: step indicator strip at very top for orientation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          zIndex: 10001,
          pointerEvents: 'none',
        }}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
          width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
          transition: 'width 350ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  )
}
