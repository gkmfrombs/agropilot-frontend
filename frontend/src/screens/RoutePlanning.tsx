import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IChev, INav, TopStrip, BottomNav, Icon } from '../components/Shared'
import { apiFetch, REP_ID } from '../lib/api'

const IFilter = (p: any) => <Icon {...p} d={<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>} />

const RISK_COLORS: any = {
  HIGH: { bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', dot: '#B85C3C' },
  MEDIUM: { bg: 'rgba(212,163,71,0.18)', fg: '#8C6420', dot: '#D4A347' },
  LOW: { bg: 'rgba(200,213,187,0.5)', fg: '#2E4A3A', dot: '#7B9C6A' },
}

interface Stop {
  id: string
  name: string
  type: 'retailer' | 'farmer'
  dist: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  reason: string
}

const MOCK_STOPS: Stop[] = [
  { id: '1', name: 'Kisan Agri Store', type: 'retailer', dist: '2.1', priority: 'HIGH', reason: 'Topik 15WP out of stock — 4 farmers waiting' },
  { id: '2', name: 'Ramesh Yadav', type: 'farmer', dist: '4.2', priority: 'HIGH', reason: 'Blight risk at flowering — foliar window 36h' },
  { id: '3', name: 'Suresh Verma', type: 'farmer', dist: '6.8', priority: 'HIGH', reason: 'Yellow rust spreading from adjacent plots' },
  { id: '4', name: 'Sharma Seeds', type: 'retailer', dist: '8.3', priority: 'MEDIUM', reason: 'Score 250EC low stock — restock recommended' },
  { id: '5', name: 'Manju Devi', type: 'farmer', dist: '4.5', priority: 'MEDIUM', reason: 'Soil moisture above threshold' },
  { id: '6', name: 'Vikram Pal', type: 'farmer', dist: '11.3', priority: 'LOW', reason: 'Routine seed enquiry — cultivar demo' },
]

function MapPlaceholder({ stops }: { stops: Stop[] }) {
  return (
    <div style={{ margin: '0 18px', borderRadius: 20, height: 240, background: 'linear-gradient(135deg, #d4dcc8 0%, #c8d5bb 50%, #b8c9a0 100%)', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
      {[0,1,2,3,4,5].map(i => <div key={`h${i}`} style={{ position:'absolute', top: `${i*20}%`, left:0, right:0, height:1, background:'rgba(46,74,58,0.08)' }} />)}
      {[0,1,2,3,4].map(i => <div key={`v${i}`} style={{ position:'absolute', left: `${i*25}%`, top:0, bottom:0, width:1, background:'rgba(46,74,58,0.08)' }} />)}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <polyline points="60,40 120,80 200,60 260,120 320,160" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="8 4" opacity="0.6" />
      </svg>
      {stops.slice(0, 4).map((s, i) => (
        <div key={s.id} style={{ position:'absolute', left: `${15 + i*22}%`, top: `${20 + (i%2)*30}%`, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: RISK_COLORS[s.priority].dot, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, boxShadow: `0 2px 8px ${RISK_COLORS[s.priority].dot}44`, border: '2px solid white' }}>{i+1}</div>
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>
        Hardoi Territory · {stops.length} stops
      </div>
    </div>
  )
}

export default function RoutePlanning() {
  const [filter, setFilter] = useState<'all' | 'retailer' | 'farmer'>('all')
  const [stops, setStops] = useState<Stop[]>(MOCK_STOPS)
  const [totalHours, setTotalHours] = useState(2.5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch<{ route: any[]; estimated_total_hours: number }>(`/api/route?rep_id=${REP_ID}`),
      apiFetch<{ retailers: any[] }>(`/api/retailers?rep_id=${REP_ID}&limit=20`),
    ])
      .then(([routeData, retailerData]) => {
        const retailerMap: Record<string, string> = {}
        for (const r of retailerData.retailers) {
          retailerMap[r.retailer_id] = r.tehsil ? `${r.tehsil} Retailer` : r.retailer_id
        }

        const mapped: Stop[] = routeData.route.map((s, i) => ({
          id: s.retailer_id || String(i),
          name: retailerMap[s.retailer_id] || s.retailer_id,
          type: 'retailer' as const,
          dist: String(((i + 1) * 2.1).toFixed(1)),
          priority: s.priority === 'high' ? 'HIGH' : s.priority === 'medium' ? 'MEDIUM' : 'LOW',
          reason: s.pitch || `Last visited ${s.days_since_last_visit} days ago`,
        }))

        if (mapped.length > 0) {
          setStops(mapped)
          setTotalHours(routeData.estimated_total_hours)
        }
      })
      .catch(() => {/* keep mock */})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? stops : stops.filter(s => s.type === filter)
  const urgentCount = stops.filter(s => s.priority === 'HIGH').length

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
      <TopStrip />

      <div style={{ padding: '18px 18px 12px' }}>
        <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Route Plan</h1>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>
          {loading ? 'Optimizing route...' : 'AI-optimized for priority + distance'}
        </p>
      </div>

      <MapPlaceholder stops={stops} />

      <div className="fade-up" style={{ margin: '16px 18px', padding: '12px 16px', background: 'var(--surface-warm)', borderRadius: 14, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)' }}>
          <strong>{stops.length}</strong> stops · <strong>~{totalHours}h</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(184,92,60,0.12)', color: '#B85C3C', fontSize: 11, fontWeight: 700 }}>{urgentCount} urgent</span>
        </div>
      </div>

      <div style={{ padding: '0 18px 12px', display: 'flex', gap: 8 }}>
        {(['all', 'retailer', 'farmer'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, border: filter === f ? '1px solid var(--primary)' : '1px solid var(--border)', background: filter === f ? 'var(--primary)' : 'var(--surface)', color: filter === f ? 'white' : 'var(--ink)', fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' as const }}>
            {f === 'all' ? 'All' : f === 'retailer' ? 'Retailers' : 'Farmers'}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((s, i) => {
          const r = RISK_COLORS[s.priority]
          return (
            <Link to={s.type === 'farmer' ? '/farmer/1' : '/retailer/1'} key={s.id} className="fade-up" style={{ animationDelay: `${i * 60}ms`, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: r.dot, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, flex: 'none' }}>{i+1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: s.type === 'retailer' ? 'rgba(201,151,74,0.15)' : 'rgba(200,213,187,0.5)', color: s.type === 'retailer' ? '#8C6420' : 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' as const }}>{s.type}</span>
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{s.reason}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flex: 'none' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>{s.dist}km</span>
                <span style={{ padding: '2px 7px', borderRadius: 999, background: r.bg, color: r.fg, fontSize: 10, fontWeight: 700 }}>{s.priority}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ padding: '20px 18px' }}>
        <button style={{ width: '100%', padding: '15px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <INav size={18} /> Start Navigation
        </button>
      </div>

      <div style={{ height: 100 }} />
      <BottomNav />
    </div>
  )
}
