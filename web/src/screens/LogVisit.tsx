import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IChev, IMic, ICheck, TopStrip, BottomNav } from '../components/Shared';
import { api } from '../services/api';
import { useAuth } from '../components/AuthContext';

const outcomes = ['Sale Made', 'Order Placed', 'No Purchase', 'Follow-up Required'];
const products = ['Topik 15 WP', 'Score 250 EC', 'Actara 25 WG', 'Kavach 75 WP', 'Tilt 25 EC', 'Nativo 75 WG', 'Amistar Top'];

export default function LogVisit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { repId } = useAuth();
    const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [competitor, setCompetitor] = useState(false);
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const toggleProduct = (p: string) => {
        setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    if (submitted) {
        return (
            <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
                <div className="fade-up" style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 30px rgba(46,74,58,0.3)' }}>
                    <ICheck size={36} stroke="white" />
                </div>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px' }}>{t('log.success')}</h2>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink-soft)', margin: '0 0 24px' }}>{t('log.saved_offline')}</p>
                <Link to="/route" style={{ padding: '14px 28px', borderRadius: 16, background: 'var(--primary)', color: 'white', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, textDecoration: 'none', boxShadow: '0 6px 16px rgba(46,74,58,0.28)' }}>
                    {t('log.return_route')}
                </Link>
            </div>
        );
    }

    return (
        <div className="screen-root" style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)' }}>
            <TopStrip />
            
            <div style={{ padding: '14px 18px' }}>
                <Link to="/visit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                    <IChev size={16} style={{ transform: 'rotate(180deg)' }} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>Back</span>
                </Link>
                <h1 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: 'var(--ink)', margin: '0 0 4px' }}>Log Visit Outcome</h1>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>Kisan Agri Store · Sandila Rd</p>
            </div>

            {/* Outcome */}
            <div className="fade-up" style={{ padding: '0 18px', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>What happened?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {outcomes.map(o => (
                        <button key={o} onClick={() => setSelectedOutcome(o)} style={{
                            padding: '16px 14px', borderRadius: 16,
                            background: selectedOutcome === o ? 'var(--primary)' : 'var(--surface)',
                            color: selectedOutcome === o ? 'white' : 'var(--ink)',
                            border: selectedOutcome === o ? '1px solid var(--primary)' : '1px solid var(--border)',
                            fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            boxShadow: selectedOutcome === o ? '0 4px 14px rgba(46,74,58,0.18)' : 'none',
                            transition: 'all 200ms ease',
                        }}>
                            {o}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Discussed */}
            <div className="fade-up" style={{ animationDelay: '100ms', padding: '0 18px', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Products Discussed</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {products.map(p => (
                        <button key={p} onClick={() => toggleProduct(p)} style={{
                            padding: '8px 14px', borderRadius: 999,
                            background: selectedProducts.includes(p) ? 'var(--primary)' : 'var(--surface)',
                            color: selectedProducts.includes(p) ? 'white' : 'var(--ink)',
                            border: selectedProducts.includes(p) ? '1px solid var(--primary)' : '1px solid var(--border)',
                            fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 200ms ease',
                        }}>
                            {selectedProducts.includes(p) && '✓ '}{p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Competitor toggle */}
            <div style={{ padding: '0 18px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Competitor products observed?</span>
                    <button onClick={() => setCompetitor(!competitor)} style={{ width: 44, height: 26, borderRadius: 13, background: competitor ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: competitor ? 20 : 2, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                    </button>
                </div>
            </div>

            {/* Notes */}
            <div style={{ padding: '0 18px', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Notes</h2>
                <div style={{ position: 'relative' }}>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tap mic to dictate or type notes..." rows={3} style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)', resize: 'none', outline: 'none' }} />
                    <button style={{ position: 'absolute', left: 10, top: 12, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                        <IMic size={20} />
                    </button>
                </div>
            </div>

            {/* Submit */}
            <div style={{ padding: '0 18px 24px' }}>
                {submitError && <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--danger)', marginBottom: 8 }}>{submitError}</p>}
                <button onClick={async () => {
                    if (!selectedOutcome || submitting) return;
                    setSubmitting(true); setSubmitError(null);
                    try {
                        await api.logVisit({ rep_id: repId || 'REP_0001', outcome: selectedOutcome, products_discussed: selectedProducts, competitor_observed: competitor, notes });
                        setSubmitted(true);
                    } catch {
                        setSubmitError('Failed to save. Check backend is running.');
                    } finally { setSubmitting(false); }
                }} style={{ width: '100%', padding: '15px', borderRadius: 16, background: selectedOutcome ? 'var(--primary)' : 'var(--border)', color: selectedOutcome ? 'white' : 'var(--ink-soft)', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, cursor: selectedOutcome && !submitting ? 'pointer' : 'default', boxShadow: selectedOutcome ? '0 6px 16px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)' : 'none' }}>
                    {submitting ? 'Saving...' : 'Submit Visit Log'}
                </button>
            </div>

            <div style={{ height: 100 }} />
            <BottomNav />
        </div>
    );
}
