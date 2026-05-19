import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../node_modules/react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { IChev, IMic, ISend, IClose, Icon } from '../components/Shared'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const chatCss = `
  .chat-screen {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 767px) {
    .chat-screen {
      position: fixed;
      inset: 0;
      z-index: 20;
      height: 100dvh;
    }
  }
  /* ── Markdown body ─────────────────────────────────────────── */
  .md-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    line-height: 1.65;
  }
  .md-body > *:first-child { margin-top: 0 !important; }
  .md-body > *:last-child  { margin-bottom: 0 !important; }

  /* Paragraphs */
  .md-body p { margin: 0 0 10px; }

  /* Headings — Fraunces serif to match design system */
  .md-body h1, .md-body h2, .md-body h3, .md-body h4 {
    font-family: 'Fraunces', serif;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 16px 0 6px;
  }
  .md-body h1 { font-size: 18px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
  .md-body h2 { font-size: 16px; }
  .md-body h3 { font-size: 14.5px; color: var(--primary); }
  .md-body h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); }

  /* Lists — custom arrow bullets matching design system */
  .md-body ul, .md-body ol { margin: 8px 0 10px; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .md-body ol { counter-reset: md-ol; }
  .md-body li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13.5px;
    line-height: 1.5;
  }
  .md-body ul li::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--primary);
    opacity: 0.7;
    flex-shrink: 0;
    margin-top: 7px;
  }
  .md-body ol li::before {
    counter-increment: md-ol;
    content: counter(md-ol);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px; height: 18px;
    border-radius: 6px;
    background: rgba(46,74,58,0.10);
    color: var(--primary);
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
  }
  /* nested lists */
  .md-body li > ul, .md-body li > ol { margin: 4px 0 0; }

  /* Inline formatting */
  .md-body strong { font-weight: 700; color: var(--ink); }
  .md-body em     { font-style: italic; color: var(--ink-soft); }

  /* Inline code */
  .md-body code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
    background: rgba(46,74,58,0.09);
    color: var(--primary);
    padding: 1px 6px;
    border-radius: 5px;
    border: 1px solid rgba(46,74,58,0.12);
  }
  /* Code block */
  .md-body pre {
    background: rgba(20,18,12,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    overflow-x: auto;
    margin: 10px 0;
  }
  .md-body pre code { background: none; border: none; padding: 0; font-size: 12.5px; color: var(--ink); }

  /* Blockquote — left-border accent */
  .md-body blockquote {
    margin: 10px 0;
    padding: 8px 14px;
    border-left: 3px solid var(--primary);
    background: rgba(46,74,58,0.04);
    border-radius: 0 8px 8px 0;
    color: var(--ink-soft);
    font-style: italic;
    font-size: 13.5px;
  }

  /* Horizontal rule */
  .md-body hr { border: none; border-top: 1px solid var(--border); margin: 12px 0; }

  /* Tables */
  .md-body table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 10px 0; border-radius: 8px; overflow: hidden; }
  .md-body thead { background: var(--surface-warm); }
  .md-body th { font-weight: 700; padding: 7px 10px; border-bottom: 2px solid var(--border); text-align: left; color: var(--ink); }
  .md-body td { padding: 6px 10px; border-bottom: 1px solid var(--border); }
  .md-body tr:last-child td { border-bottom: none; }
`

// Local icons not in Shared
const ICloud = (p: any) => <Icon {...p} d={<path d="M17.5 19a4.5 4.5 0 1 0-1.5-8.75A6 6 0 1 0 6 16" />} />
const IWheat = (p: any) => <Icon {...p} d={<><path d="M2 22 16 8" /><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /></>} />
const IDb = (p: any) => <Icon {...p} d={<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>} />
const IBox = (p: any) => <Icon {...p} d={<><path d="M21 8 12 13 3 8" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="M12 13v9" /></>} />
const ICheckCircle = (p: any) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></>} />
const IPin = (p: any) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>} />
const IThumbUp = (p: any) => <Icon {...p} d={<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L15 2h0a3 3 0 0 1 0 3.88Z" />} />
const IThumbDn = (p: any) => <Icon {...p} d={<path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L9 22h0a3 3 0 0 1 0-3.88Z" />} />
const IArrowR = (p: any) => <Icon {...p} d={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} />

interface Message {
  text: string
  isUser: boolean
  isVoice?: boolean
  hasGraph?: boolean
  showSources?: boolean
  confidence?: number
  bullets?: string[]
  stockInfo?: string
  followUps?: string[]
}

const initialMessages: Message[] = [
  { text: "Good morning Arjun! I've already analysed your territory. 3 farms need attention before the rain hits Thursday.", isUser: false },
  { text: 'What should I prioritize before the rain hits today?', isUser: true },
  {
    text: 'Apply Syngenta Tilt 25EC within 48 hours',
    isUser: false,
    bullets: [
      'HD-2967 wheat at BBCH 65 (flowering) — peak fungal vulnerability window',
      '48mm rainfall + 89% humidity over 31h matched Septoria infection conditions (Hardoi IMD)',
      '0.87 cosine match to May 2023 outbreak — 14 plots, 12–22% yield loss in Bhatpura-Mallawan cluster',
      '14 units Tilt 25EC at Kisan Store, Sandila Rd — 11 min drive, confirmed 2h ago',
    ],
    confidence: 94,
    showSources: true,
    followUps: ['What dosage?', 'Check stock', 'Show route'],
  },
]

// Mini waveform for voice messages
function MiniWave() {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.5, 0.7, 0.4, 0.6]
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
      {bars.map((h, i) => (
        <rect key={i} x={i * 5 + 1} y={(12 - h * 12) / 2} width="2.2" height={h * 12} rx="1" fill="rgba(255,255,255,0.7)" />
      ))}
    </svg>
  )
}

/**
 * Typewriter hook — kept only for the structured `bullets` headline animation
 * on initialMessages. Stream messages receive real tokens so they don't use this.
 */
function useTypewriter(text: string, speed = 28, startDelay = 0) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const t0 = setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        i += 1
        setN(i)
        if (i >= text.length) clearInterval(iv)
      }, speed)
      return () => clearInterval(iv)
    }, startDelay)
    return () => clearTimeout(t0)
  }, [text])
  return [text.slice(0, n), n >= text.length] as const
}

const SOURCES = [
  { I: ICloud, label: 'Weather' },
  { I: IWheat, label: 'Crop' },
  { I: IDb, label: 'Disease DB' },
  { I: IBox, label: 'Product' },
]

const iconRoundBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%',
  background: 'transparent', border: '1px solid var(--border)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}

function AIMessageCard({ message }: { message: Message }) {
  const headline = message.bullets ? 'Apply Syngenta Tilt 25EC within 48 hours' : message.text
  const [typed, done] = useTypewriter(message.bullets ? headline : '', 28, 200)
  const [bulletStep, setBulletStep] = useState(0)
  const [feedback, setFeedback] = useState<'up' | 'dn' | null>(null)

  useEffect(() => {
    if (!done || !message.bullets) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setBulletStep(i)
      if (i >= (message.bullets?.length ?? 0)) clearInterval(iv)
    }, 220)
    return () => clearInterval(iv)
  }, [done])

  // text === '' means the placeholder was just added; first token clears loading state
  const isLoading = message.text === '' && !message.bullets

  return (
    <div className="fade-up" style={{ maxWidth: '92%', alignSelf: 'flex-start', background: 'var(--surface)', borderRadius: '20px 20px 20px 8px', boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 14px 36px rgba(20,18,12,0.10)', padding: '16px 18px 14px', position: 'relative', overflow: 'hidden' }}>

      {/* Label */}
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {message.bullets ? 'Recommendation' : 'AgroPilot'}
      </div>

      {/* Headline or markdown stream or loading dots */}
      {message.bullets ? (
        <h3 style={{ marginTop: 8, marginBottom: 0, fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, lineHeight: 1.22, letterSpacing: '-0.01em', color: 'var(--ink)', minHeight: 42 }}>
          {typed}
          {!done && <span className="caret" style={{ display: 'inline-block', width: 2, height: '1em', background: 'var(--primary)', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'caretBlink 0.9s steps(1) infinite' }} />}
        </h3>
      ) : isLoading ? (
        <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--border)', animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ height: 1, background: 'var(--border)', margin: '10px -2px 12px' }} />
          <div className="md-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>
        </>
      )}

      {/* Divider + bullets for structured responses */}
      {message.bullets && (
        <>
          <div style={{ height: 1, background: 'var(--border)', margin: '14px -2px 12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {message.bullets.map((b, i) => (
              <div key={i} className={i < bulletStep ? 'fade-up' : ''} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, opacity: i < bulletStep ? 1 : 0, transition: 'opacity 200ms ease', fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.42 }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(46,74,58,0.10)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}>
                  <IArrowR size={11} stroke="#2E4A3A" />
                </span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Source chips */}
      {message.showSources && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Sources</div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {SOURCES.map((s, i) => (
              <span key={s.label} className="slide-in-l" style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: 'var(--surface-warm)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)', animationDelay: `${700 + i * 50}ms` }}>
                <s.I size={11} stroke="#6B6A5F" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stock card */}
      {message.stockInfo && (
        <div style={{ marginTop: 14, background: 'var(--primary-soft)', borderRadius: 14, padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(46,74,58,0.14)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <ICheckCircle size={15} stroke="#2E4A3A" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>{message.stockInfo}</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 3, fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>
              <IPin size={10} stroke="#2E4A3A" /> View location →
            </span>
          </div>
        </div>
      )}

      {/* Footer — only on non-loading messages */}
      {!isLoading && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {message.confidence ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(201,151,74,0.16)', color: '#8C6420', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11 }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }} />
              {message.confidence}% confidence
            </span>
          ) : (
            <Link to="/graph" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              Show reasoning →
            </Link>
          )}
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setFeedback('up')} style={{ ...iconRoundBtn, background: feedback === 'up' ? 'rgba(46,74,58,0.1)' : 'transparent' }}>
              <IThumbUp size={14} stroke={feedback === 'up' ? 'var(--primary)' : '#6B6A5F'} />
            </button>
            <button onClick={() => setFeedback('dn')} style={{ ...iconRoundBtn, background: feedback === 'dn' ? 'rgba(184,92,60,0.1)' : 'transparent' }}>
              <IThumbDn size={14} stroke={feedback === 'dn' ? 'var(--danger)' : '#6B6A5F'} />
            </button>
          </div>
        </div>
      )}

      {message.confidence && !isLoading && (
        <Link to="/graph" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 12, fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
          Show reasoning graph →
        </Link>
      )}
    </div>
  )
}

function ChatMessage({ message, delay, onSend }: { message: Message; delay: number; onSend?: (t: string) => void }) {
  return (
    <div className="slide-in-l" style={{ animationDelay: `${delay}ms`, display: 'flex', flexDirection: 'column', alignItems: message.isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      {!message.isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10, flexShrink: 0,
            border: '1px solid rgba(46,74,58,0.14)',
            overflow: 'hidden',
            background: 'var(--primary-soft)',
          }}>
            <img src="/scarecrow.jpg" alt="AgroPilot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>AgroPilot</span>
        </div>
      )}
      {message.isUser ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ maxWidth: '80%', background: 'var(--primary)', color: 'white', padding: '13px 16px', borderRadius: '20px 20px 8px 20px', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, lineHeight: 1.45, boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(46,74,58,0.18)' }}>
            {message.text}
          </div>
          {message.isVoice && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 4px', fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>
              <MiniWave /> voice · 8s
            </div>
          )}
        </div>
      ) : (
        <AIMessageCard message={message} />
      )}
      {/* Follow-up pills */}
      {!message.isUser && message.followUps && (
        <div style={{ marginTop: 10, paddingLeft: 30 }}>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {message.followUps.map((t, i) => (
              <button key={t} className="slide-in-l" onClick={() => onSend?.(t)} style={{ flex: 'none', padding: '8px 13px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', animationDelay: `${i * 60}ms`, boxShadow: '0 1px 2px rgba(20,18,12,0.04)' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AIConsultant() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<{ role: string; content: string }[]>([])

  // Holds the AbortController for the active stream so we can cancel on unmount
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Cancel any in-flight stream when the component unmounts
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const sendMessage = async (text?: string) => {
    const userMsg = (text ?? input).trim()
    if (!userMsg || loading) return

    setInput('')
    setLoading(true)

    // Append user bubble + empty AI placeholder (empty text triggers loading dots)
    setMessages(prev => [...prev, { text: userMsg, isUser: true }, { text: '', isUser: false }])
    historyRef.current = [...historyRef.current, { role: 'user', content: userMsg }]

    const repId = localStorage.getItem('agro_rep_id') || 'REP_0001'
    const token = localStorage.getItem('agro_token')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(`${BASE}/api/chat/stream`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: historyRef.current, rep_id: repId }),
      })

      if (!res.ok) throw new Error(`${res.status}`)
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      // Buffer for partial SSE lines that arrive across chunk boundaries
      let lineBuffer = ''
      let accumulated = ''
      let firstToken = true

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break

        lineBuffer += decoder.decode(value, { stream: true })

        // SSE lines are delimited by \n\n — split and process each complete event
        const parts = lineBuffer.split('\n\n')
        // The last element may be an incomplete line; keep it in the buffer
        lineBuffer = parts.pop() ?? ''

        for (const part of parts) {
          // Each SSE event may contain one or more "data: ..." lines
          for (const line of part.split('\n')) {
            if (!line.startsWith('data:')) continue
            // Slice off "data:" and exactly one optional space — preserves
            // token-leading spaces that the LLM emits (e.g. " checked")
            const payload = line.replace(/^data: ?/, '')

            if (payload === '[DONE]') break outer

            accumulated += payload

            if (firstToken) {
              // First real token: turn off loading state so dots disappear
              setLoading(false)
              firstToken = false
            }

            // Capture snapshot for the closure so each setState call is pure
            const snapshot = accumulated
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { text: snapshot, isUser: false }
              return next
            })
          }
        }
      }

      // Stream finished — attach follow-ups and persist to history
      historyRef.current = [...historyRef.current, { role: 'assistant', content: accumulated }]
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = {
          text: accumulated || 'Got it.',
          isUser: false,
          followUps: ['What dosage?', 'Check stock', 'Show route'],
        }
        return next
      })
    } catch (err) {
      // AbortError means the component unmounted — silently ignore
      if (err instanceof DOMException && err.name === 'AbortError') return

      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = {
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          isUser: false,
        }
        return next
      })
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  // Context chips for current visit
  const contextChips = ['Wheat', 'Block 4', 'Flowering', 'Cached ✓']

  return (
    <div className="chat-screen">
      <style>{chatCss}</style>

      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', background: 'rgba(245,241,232,0.85)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to="/" style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', textDecoration: 'none' }}>
          <IChev size={18} style={{ transform: 'rotate(180deg)' }} />
        </Link>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)' }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#7B9C6A', boxShadow: '0 0 0 2.5px rgba(123,156,106,0.18)', display: 'inline-block' }} />
            AgroPilot
          </div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{t('chat.rag_label', { count: 6 })}</div>
        </div>
        <Link to="/graph" style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', border: '1px solid var(--border)', color: 'var(--primary)', textDecoration: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, flexDirection: 'column', gap: 1 }}>
          <IArrowR size={13} stroke="var(--primary)" style={{ transform: 'rotate(-45deg)' }} />
        </Link>
      </div>

      {/* Context chips */}
      <div style={{ padding: '10px 18px', background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)' }}>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {contextChips.map(c => (
            <span key={c} style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'var(--bg)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
              {c === 'Cached ✓' && <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }} />}
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} delay={i * 80} onSend={sendMessage} />
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 18px 20px', background: 'var(--bg)', borderTop: '1px solid rgba(229,220,201,0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, padding: '6px 6px 6px 18px', boxShadow: '0 1px 2px rgba(20,18,12,0.04), 0 8px 22px rgba(20,18,12,0.06)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={t('chat.placeholder')}
            autoFocus
            style={{ flex: 1, minWidth: 0, height: 36, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)' }}
          />
          <button
            onClick={() => setRecording(r => !r)}
            style={{ width: 44, height: 44, borderRadius: '50%', background: recording ? 'var(--danger)' : 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', flex: 'none', boxShadow: '0 6px 14px rgba(46,74,58,0.30), inset 0 1px 0 rgba(255,255,255,0.18)' }}
            aria-label={recording ? 'Stop recording' : 'Voice input'}
          >
            <IMic size={18} stroke="#fff" />
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            style={{ width: 44, height: 44, borderRadius: '50%', background: (input.trim() && !loading) ? 'var(--primary)' : 'var(--surface-warm)', border: '1px solid var(--border)', color: (input.trim() && !loading) ? 'white' : 'var(--ink-soft)', cursor: (input.trim() && !loading) ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transition: 'background 200ms' }}
          >
            {loading
              ? <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              : <ISend size={17} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
