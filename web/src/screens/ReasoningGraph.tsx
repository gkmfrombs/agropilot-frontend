import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BottomNav, TopStrip, Icon } from '../components/Shared'
import { api } from '../services/api'
import type { GraphResponse } from '../services/api'

// ---------------------------------------------------------------------------
// Icon components
// ---------------------------------------------------------------------------
const IX = (p: any) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />
const IShare = (p: any) => <Icon {...p} d={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="11.49" /></>} />
const ISprout = (p: any) => <Icon {...p} d={<><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></>} />
const IUser = (p: any) => <Icon {...p} d={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />
const IWheat = (p: any) => <Icon {...p} d={<><path d="M2 22 16 8" /><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /></>} />
const ICloudRain = (p: any) => <Icon {...p} d={<><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></>} />
const IDroplets = (p: any) => <Icon {...p} d={<><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></>} />
const IHistory = (p: any) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></>} />
const IPin = (p: any) => <Icon {...p} d={<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>} />

// Maps icon_type strings from the API to the local icon components
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'user': IUser,
  'wheat': IWheat,
  'cloud-rain': ICloudRain,
  'droplets': IDroplets,
  'history': IHistory,
  'pin': IPin,
}

// ---------------------------------------------------------------------------
// Canvas geometry constants
// ---------------------------------------------------------------------------
const VB_W = 390, VB_H = 380
const CENTER = { x: VB_W / 2, y: VB_H / 2 + 6 }
const RADIUS = 132

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------
function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180
  return { x: CENTER.x + Math.cos(rad) * radius, y: CENTER.y + Math.sin(rad) * radius }
}
function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
function offsetAlong(a: { x: number; y: number }, b: { x: number; y: number }, d: number) {
  const dx = b.x - a.x, dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  return { x: a.x + (dx / len) * d, y: a.y + (dy / len) * d }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GraphNode = GraphResponse['nodes'][0]

interface GraphCanvasProps {
  nodes: GraphNode[]
  recommendation: GraphResponse['recommendation']
  selected: string | null
  onSelect: (id: string) => void
  onCenterClick: () => void
}

// ---------------------------------------------------------------------------
// GraphCanvas
// ---------------------------------------------------------------------------
function GraphCanvas({ nodes, recommendation, selected, onSelect, onCenterClick }: GraphCanvasProps) {
  const edges = nodes.map((n) => {
    const p = polar(n.angle, RADIUS)
    const from = offsetAlong(p, CENTER, 30)
    const to = offsetAlong(CENTER, p, 47)
    return { id: n.id, from, to, mid: midpoint(from, to) }
  })

  return (
    <div style={{ position: 'relative', height: 380, background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Dot grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
        <defs>
          <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="#6B6A5F" fillOpacity="0.18" />
          </pattern>
          <radialGradient id="canvasGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#C8D5BB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C8D5BB" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
        <rect width="100%" height="100%" fill="url(#canvasGlow)" />
      </svg>

      {/* SVG graph */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#141812" floodOpacity="0.10" />
          </filter>
          <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#2E4A3A" floodOpacity="0.35" />
          </filter>
          <radialGradient id="warmInside" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FAF6EC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="centerSheen" cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#7c9784" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2E4A3A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo rings */}
        <circle cx={CENTER.x} cy={CENTER.y} r="64" fill="none" stroke="#2E4A3A" strokeOpacity="0.10" strokeWidth="1" />
        <circle cx={CENTER.x} cy={CENTER.y} r="78" fill="none" stroke="#2E4A3A" strokeOpacity="0.06" strokeWidth="1" />

        {/* edges — the API does not return an edge label so the pill is omitted */}
        {edges.map((e, i) => {
          const dim = selected && selected !== e.id
          return (
            <g key={e.id} style={{ opacity: dim ? 0.18 : 1, transition: 'opacity 240ms ease' }}>
              <line
                x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
                stroke="#2E4A3A" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round"
                className="edge-draw"
                style={{ animationDelay: `${250 + i * 180}ms` }}
              />
              <circle r="2.6" fill="#C9974A" className="edge-pulse"
                style={{ offsetPath: `path("M ${e.from.x} ${e.from.y} L ${e.to.x} ${e.to.y}")`, animationDelay: `${i * 0.65}s` } as React.CSSProperties}
              />
            </g>
          )
        })}

        {/* outer nodes */}
        {nodes.map((n, i) => {
          const p = polar(n.angle, RADIUS)
          const dim = selected && selected !== n.id
          const active = selected === n.id
          // Resolve icon component from the string sent by the API; fall back to IPin
          const NodeIcon = ICON_MAP[n.icon_type] ?? IPin
          return (
            <g key={n.id} className="node-in"
              style={{ animationDelay: `${900 + i * 80}ms`, opacity: dim ? 0.28 : 1, transition: 'opacity 240ms ease', cursor: 'pointer', transformBox: 'fill-box' as any, transformOrigin: 'center' }}
              onClick={() => onSelect(n.id)}
            >
              <circle cx={p.x} cy={p.y} r="32" fill="#FFFFFF" stroke={active ? '#2E4A3A' : '#E5DCC9'} strokeWidth={active ? 2 : 1} filter="url(#nodeShadow)" />
              <circle cx={p.x} cy={p.y} r="32" fill="url(#warmInside)" opacity="0.6" />
              <foreignObject x={p.x - 30} y={p.y - 26} width="60" height="52">
                <div style={{ width: 60, height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, pointerEvents: 'none' }}>
                  <NodeIcon size={16} stroke="#2E4A3A" />
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: '#1A1A17', textAlign: 'center', lineHeight: 1.1 }}>{n.label}</div>
                </div>
              </foreignObject>
            </g>
          )
        })}

        {/* center node — click to reset / show reasoning trail */}
        <g className="node-in" style={{ animationDelay: '700ms', transformBox: 'fill-box' as any, transformOrigin: 'center', cursor: 'pointer' }} onClick={onCenterClick}>
          <circle cx={CENTER.x} cy={CENTER.y} r="48" fill="none" stroke="#2E4A3A" strokeOpacity="0.35" strokeWidth="2" className="center-glow" />
          <circle cx={CENTER.x} cy={CENTER.y} r="45" fill="#2E4A3A" filter="url(#centerShadow)" />
          <circle cx={CENTER.x} cy={CENTER.y} r="45" fill="url(#centerSheen)" opacity="0.6" />
          <foreignObject x={CENTER.x - 42} y={CENTER.y - 36} width="84" height="72">
            <div style={{ width: 84, height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, pointerEvents: 'none' }}>
              <ISprout size={18} stroke="#FAF6EC" />
              <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 13, color: '#FAF6EC', textAlign: 'center', lineHeight: 1.05 }}>{recommendation.product}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 8, fontWeight: 700, color: 'rgba(245,241,232,0.85)', textAlign: 'center', letterSpacing: '0.10em' }}>{recommendation.confidence}% confidence</div>
            </div>
          </foreignObject>
        </g>
      </svg>

      <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
        {nodes.length} signals · 1 outcome
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 14, fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>
        Tap signal to inspect · tap centre to reset
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// NodeDetail
// ---------------------------------------------------------------------------
function NodeDetail({ node }: { node: GraphNode }) {
  // Resolve icon component from the icon_type string
  const NodeIcon = ICON_MAP[node.icon_type] ?? IPin
  return (
    <div className="fade-up" style={{ margin: '16px 18px', padding: '16px 18px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(20,18,12,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NodeIcon size={18} stroke="var(--primary)" />
        </div>
        <div>
          <div style={{ fontFamily: 'Fraunces', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{node.label}</div>
          <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{node.type}</div>
        </div>
      </div>
      {node.facts.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)' }}>{k}</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>Source: {node.source}</div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>Contribution to recommendation</span>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{node.weight}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--primary-soft)', overflow: 'hidden' }}>
          <div style={{ width: `${node.weight * 3}%`, height: '100%', borderRadius: 3, background: 'var(--accent)', transition: 'width 600ms ease' }} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading skeleton — matches the canvas height so there is no layout shift
// ---------------------------------------------------------------------------
function GraphSkeleton() {
  return (
    <div style={{ height: 380, background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulsing ring mimics the center node */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'var(--primary-soft)',
        animation: 'skeleton-pulse 1.4s ease-in-out infinite',
      }} />
      <style>{`@keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------
interface ErrorStateProps {
  onRetry: () => void
}

function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div style={{ height: 380, background: 'var(--surface-warm)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', padding: '0 32px' }}>
        Could not load graph. Check your connection and try again.
      </div>
      <button
        onClick={onRetry}
        style={{ padding: '8px 20px', borderRadius: 999, background: 'var(--primary)', border: 'none', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 13, color: '#FAF6EC', cursor: 'pointer' }}
      >
        Retry
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Screen root
// ---------------------------------------------------------------------------
export default function ReasoningGraph() {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const repId = localStorage.getItem('agro_rep_id') || 'REP_0001'

  const fetchGraph = () => {
    setLoading(true)
    setError(false)
    api.getGraph(repId)
      .then((data) => {
        setGraphData(data)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGraph()
  }, [repId])

  // Derive the selected node object from live data
  const selectedNode = graphData?.nodes.find((n) => n.id === selected) ?? null

  const toggle = (id: string) => setSelected((prev) => prev === id ? null : id)

  return (
    <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
      <TopStrip />
      {/* Header */}
      <div style={{ position: 'sticky', top: 48, zIndex: 30, background: 'rgba(245,241,232,0.85)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)', borderBottom: '1px solid rgba(229,220,201,0.7)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '10px 14px' }}>
          <Link to="/chat" style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', textDecoration: 'none' }}>
            <IX size={17} />
          </Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.005em' }}>How the AI connected the dots</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Reasoning Graph</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer', justifySelf: 'end' }}>
            <IShare size={16} />
          </button>
        </div>
      </div>

      {/* Canvas area — three mutually exclusive states */}
      {loading && <GraphSkeleton />}
      {!loading && error && <ErrorState onRetry={fetchGraph} />}
      {!loading && !error && graphData && (
        <GraphCanvas
          nodes={graphData.nodes}
          recommendation={graphData.recommendation}
          selected={selected}
          onSelect={toggle}
          onCenterClick={() => setSelected(null)}
        />
      )}

      {/* Node detail or reasoning trail — only shown once data is loaded */}
      {!loading && !error && graphData && (
        selectedNode ? (
          <NodeDetail node={selectedNode} />
        ) : (
          <div style={{ background: 'var(--surface)', borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: '0 -10px 30px rgba(20,18,12,0.10)', padding: '10px 20px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0 10px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0 }}>Reasoning trail</h2>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: 'var(--ink-soft)', margin: '3px 0 0' }}>How we connected the dots</p>
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{graphData.steps.length} steps</span>
            </div>
            {graphData.steps.map((s, i) => (
              <div key={s.n} className="fade-up" style={{ animationDelay: `${i * 80}ms`, display: 'flex', gap: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 12, color: '#FAF6EC' }}>{s.n}</div>
                  {i < graphData.steps.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4, marginBottom: 4 }} />}
                </div>
                <div style={{ paddingTop: 3, paddingBottom: 14 }}>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.45, margin: '0 0 4px' }}>{s.text}</p>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', padding: '2px 8px', borderRadius: 999, background: 'var(--surface-warm)', border: '1px solid var(--border)' }}>{s.src}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <div style={{ height: 100 }} />
      <BottomNav />
    </div>
  )
}
