import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IChev, IPhone, INav, TopStrip, BottomNav, VoiceFAB, ICalendar } from '../components/Shared'
import { apiFetch } from '../lib/api'
import { useTranslation } from '../lib/i18n'

const PHOTO_FARMER = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=200&q=80&auto=format&fit=crop'

const MOCK_PURCHASES = [
  { date: '7 May', product: 'Topik 15WP', qty: '2 units', amount: '₹1,240' },
  { date: '22 Apr', product: 'Score 250EC', qty: '1 unit', amount: '₹680' },
  { date: '5 Mar', product: 'Kavach 75WP', qty: '3 units', amount: '₹2,100' },
]

const MOCK_VISITS = [
  { date: '10 May 2026', title: 'Pitched Actara 25WG', outcome: 'no_purchase', notes: 'Farmer wants to see pest count increase before spraying.' },
  { date: '22 Apr 2026', title: 'Bought Topik 15WP', outcome: 'sale', notes: 'Purchased 2 units from Kisan Store.' },
  { date: '5 Apr 2026', title: 'Crop assessment', outcome: 'follow_up', notes: 'Early tillering. Scheduled follow-up for heading stage.' },
]

const STAGE_ORDER = ['germination', 'sowing', 'tillering', 'booting', 'heading', 'flowering', 'grain_fill', 'maturity', 'harvest']

interface FarmerData {
  id: string
  district: string
  tehsil: string
  state: string
  age: string | number
  gender: string
  farm_size_acres: number
  language: string
  crop: string
  current_stage: string
  stages: Array<{ stage: string; start?: string; end?: string }>
  campaign_attended: boolean
  scanned_product: string | null
}

export default function FarmerProfile() {
  const { t } = useTranslation()
  const [farmer, setFarmer] = useState<FarmerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<FarmerData>('/api/farmers/GRW_00001')
      .then(data => setFarmer(data))
      .catch(() => {/* show mock UI */})
      .finally(() => setLoading(false))
  }, [])

  const name = farmer ? `Grower ${farmer.id}` : 'Ramesh Yadav'
  const location = farmer ? `${farmer.tehsil}, ${farmer.district}` : 'Bhatpura, Hardoi'
  const cropLabel = farmer ? `${farmer.crop.charAt(0).toUpperCase() + farmer.crop.slice(1)} · ${farmer.farm_size_acres} acres` : 'Wheat (HD-2967) · 3.2 acres'
  const currentStage = farmer?.current_stage || 'flowering'

  const calendarStages = farmer?.stages?.length
    ? farmer.stages.map((s, i) => ({
        label: s.stage.charAt(0).toUpperCase() + s.stage.slice(1),
        date: s.start || '',
        done: i < farmer.stages.length - 1,
        active: i === farmer.stages.length - 1,
      }))
    : [
        { label: 'Sowing', date: 'Nov 15', done: true, active: false },
        { label: 'Tillering', date: 'Dec 20', done: true, active: false },
        { label: 'Heading', date: 'Feb 10', done: true, active: false },
        { label: 'Flowering', date: 'Mar 5', done: false, active: true },
        { label: 'Grain Fill', date: 'Apr 1', done: false, active: false },
        { label: 'Harvest', date: 'Apr 20', done: false, active: false },
      ]

  const stats = [
    { label: t('farmSize'), value: farmer ? String(farmer.farm_size_acres) : '3.2', unit: 'acres' },
    { label: t('stage'), value: currentStage.replace('_', ' '), unit: '', color: 'var(--primary)' },
    { label: t('language'), value: farmer?.language || 'Hindi', unit: '' },
    { label: t('campaign'), value: farmer?.campaign_attended ? t('attended') : t('pending'), unit: '', color: farmer?.campaign_attended ? 'var(--primary)' : '#B85C3C' },
  ]

  const outcomeColors: any = {
    sale: { bg: 'rgba(200,213,187,0.5)', fg: 'var(--primary)', label: 'SALE' },
    no_purchase: { bg: 'rgba(184,92,60,0.12)', fg: '#B85C3C', label: 'NO SALE' },
    follow_up: { bg: 'rgba(212,163,71,0.15)', fg: '#8C6420', label: 'FOLLOW-UP' },
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
      <TopStrip />

      {/* Header */}
      <div className="fade-up" style={{ padding: '14px 18px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, color: 'var(--ink-soft)', textDecoration: 'none' }}>
          <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>{t('back')}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundImage: `url(${PHOTO_FARMER})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid var(--primary-soft)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', flex: 'none' }} />
          <div style={{ paddingTop: 4 }}>
            {loading
              ? <div style={{ height: 28, width: 160, background: 'var(--border)', borderRadius: 8, marginBottom: 8 }} />
              : <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>{name}</h1>
            }
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{location}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 3 }}>{cropLabel}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <IPhone size={16} /> {t('call')}
          </button>
          <button style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', color: 'var(--primary)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <INav size={16} /> {t('navigate')}
          </button>
          <Link to="/chat" style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'var(--surface-warm)', color: 'var(--primary)', border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            {t('askAI')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up" style={{ animationDelay: '80ms', padding: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '14px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: s.color || 'var(--ink)', lineHeight: 1.2 }}>
              {s.value} {s.unit && <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'Plus Jakarta Sans' }}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Crop Calendar */}
      <div className="fade-up" style={{ animationDelay: '160ms', padding: '20px 18px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ICalendar size={18} stroke="var(--primary)" /> {t('cropCalendar')}
        </h2>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', padding: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', paddingBottom: 8, overflowX: 'auto' }}>
            <div style={{ position: 'absolute', top: 8, left: 20, right: 20, height: 2, background: 'var(--border)', zIndex: 0 }}>
              <div style={{ width: `${(calendarStages.filter(s => s.done).length / Math.max(calendarStages.length - 1, 1)) * 100}%`, height: '100%', background: 'var(--primary)' }} />
            </div>
            {calendarStages.slice(0, 6).map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1, flex: 1, minWidth: 40 }}>
                <div style={{ width: s.active ? 16 : 10, height: s.active ? 16 : 10, borderRadius: '50%', background: s.active ? 'var(--primary)' : s.done ? 'var(--primary-soft)' : 'var(--border)', border: s.active ? '3px solid var(--surface)' : 'none', boxShadow: s.active ? '0 0 0 2px var(--primary)' : 'none' }} />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 9, fontWeight: s.active ? 700 : 600, color: s.active ? 'var(--primary)' : 'var(--ink-soft)', textAlign: 'center' }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(212,163,71,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--warning)' }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>
              Current: <strong>{currentStage.replace('_', ' ')}</strong> stage
            </span>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="fade-up" style={{ animationDelay: '240ms', padding: '20px 18px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>{t('purchaseHistory')}</h2>
        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {MOCK_PURCHASES.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: i < MOCK_PURCHASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.product}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)' }}>{p.date} · {p.qty}</div>
              </div>
              <span style={{ fontFamily: 'Fraunces', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{p.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visit History */}
      <div className="fade-up" style={{ animationDelay: '320ms', padding: '20px 18px' }}>
        <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', marginBottom: 14 }}>{t('visitHistory')}</h2>
        <div style={{ position: 'relative', paddingLeft: 16 }}>
          <div style={{ position: 'absolute', top: 8, bottom: 0, left: 0, width: 2, background: 'var(--border)' }} />
          {MOCK_VISITS.map((v, i) => {
            const oc = outcomeColors[v.outcome]
            return (
              <div key={i} style={{ position: 'relative', marginBottom: i < MOCK_VISITS.length - 1 ? 18 : 0 }}>
                <div style={{ position: 'absolute', top: 4, left: -21, width: 12, height: 12, borderRadius: '50%', background: 'var(--surface)', border: `2px solid ${oc.fg}` }} />
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>{v.date}</div>
                <div style={{ background: 'var(--surface)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{v.title}</span>
                    <span style={{ padding: '2px 6px', borderRadius: 999, background: oc.bg, color: oc.fg, fontSize: 9, fontWeight: 700 }}>{oc.label}</span>
                  </div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)' }}>{v.notes}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ height: 120 }} />
      <VoiceFAB />
      <BottomNav />
    </div>
  )
}
