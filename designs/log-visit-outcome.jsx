// Log Visit Outcome — Field Rep App (390px mobile)
// Premium Editorial Style

import React, { useState } from 'react';

// ===================================================================
// Injected Styles
// ===================================================================
const injectedStyles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes expandDown {
    from { opacity: 0; transform: translateY(-10px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 500px; }
  }
  .expand-down { animation: expandDown 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; overflow: hidden; }

  @keyframes fabBreatheMic {
    0%, 100% { transform: scale(1); box-shadow: 0 4px 10px rgba(46,74,58,0.2), inset 0 1px 0 rgba(255,255,255,0.18); }
    50%      { transform: scale(1.04); box-shadow: 0 8px 18px rgba(46,74,58,0.25), inset 0 1px 0 rgba(255,255,255,0.18); }
  }
  .fab-breathe-mic { animation: fabBreatheMic 2.6s ease-in-out infinite; transform-origin: center; }

  @keyframes fabPulse {
    0%, 100% { transform: scale(1.06); box-shadow: 0 0 0 0 rgba(201,151,74,0.5), 0 4px 10px rgba(46,74,58,0.2); }
    50%      { transform: scale(1.12); box-shadow: 0 0 0 12px rgba(201,151,74,0), 0 8px 18px rgba(46,74,58,0.25); }
  }
  .fab-pulse { animation: fabPulse 1.2s ease-in-out infinite; transform-origin: center; }

  @keyframes toastIn {
    0%   { opacity: 0; transform: translate(-50%, 20px) scale(0.95); }
    100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  }
  .toast-in { animation: toastIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

  .styled-input {
    width: 100%; padding: 14px 16px; border-radius: 14px;
    border: 1px solid var(--border); background: var(--surface);
    font-size: 14.5px; color: var(--ink); font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 4px rgba(20,18,12,0.02);
  }
  .styled-input::placeholder { color: #A09F91; }
  .styled-input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(46,74,58,0.1), inset 0 2px 4px rgba(20,18,12,0.02); }
  
  .styled-textarea {
    width: 100%; padding: 16px; border-radius: 18px;
    border: 1px solid var(--border); background: var(--surface);
    font-size: 14.5px; color: var(--ink); min-height: 130px; resize: none;
    line-height: 1.5; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: inset 0 2px 4px rgba(20,18,12,0.02);
    transition: all 0.2s ease;
  }
  .styled-textarea::placeholder { color: #A09F91; }
  .styled-textarea:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(46,74,58,0.1), inset 0 2px 4px rgba(20,18,12,0.02); }

  .toggle-switch { position: relative; display: inline-block; width: 48px; height: 28px; flex-shrink: 0; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--border); transition: .3s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 30px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  }
  .toggle-slider:before {
    position: absolute; content: ""; height: 22px; width: 22px; left: 3px; bottom: 3px;
    background-color: white; transition: .3s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }
  input:checked + .toggle-slider { background-color: var(--accent); }
  input:checked + .toggle-slider:before { transform: translateX(20px); }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;
const IBox = (p) => <Icon {...p} d={<><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>}/>;
const IXCircle = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>}/>;
const IClock = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const IMic = (p) => <Icon {...p} d={<><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></>}/>;
const IPlus = (p) => <Icon {...p} d={<><path d="M5 12h14"/><path d="M12 5v14"/></>}/>;
const IMinus = (p) => <Icon {...p} d={<path d="M5 12h14"/>}/>;
const IAlertTriangle = (p) => <Icon {...p} d={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>}/>;

// ===================================================================
// Shared Components
// ===================================================================
function SectionH({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, padding: '0 2px' }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }}/>
      <h2 style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0, fontVariationSettings: '"opsz" 18' }}>
        {children}
      </h2>
    </div>
  );
}

// ===================================================================
// Data Config
// ===================================================================
const OUTCOMES = [
  { id: 'sale', label: 'Sale Made', Icon: ICheckCircle },
  { id: 'order', label: 'Order Placed', Icon: IBox },
  { id: 'none', label: 'No Purchase', Icon: IXCircle },
  { id: 'followup', label: 'Follow-up Required', Icon: IClock },
];

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Topik 15 WP', price: 500, selected: true, qty: 5 }, 
  { id: 'p2', name: 'Score 250 EC', price: 800, selected: false, qty: 0 },
  { id: 'p3', name: 'Actara 25 WG', price: 350, selected: false, qty: 0 },
  { id: 'p4', name: 'Kavach 75 WP', price: 620, selected: false, qty: 0 },
];

// ===================================================================
// Main Component
// ===================================================================
export default function LogVisitOutcome() {
  const [outcome, setOutcome] = useState(null);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [sawCompetitor, setSawCompetitor] = useState(false);
  const [compBrand, setCompBrand] = useState('');
  const [compProduct, setCompProduct] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleProduct = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const isNowSelected = !p.selected;
        return { ...p, selected: isNowSelected, qty: isNowSelected ? Math.max(1, p.qty) : 0 };
      }
      return p;
    }));
  };

  const updateQty = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, p.qty + delta);
        return { ...p, qty: newQty, selected: newQty > 0 }; 
      }
      return p;
    }));
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate STT typing
      setTimeout(() => setNotes(prev => prev + (prev ? ' ' : '') + 'Farmer mentioned high rust pressure in lower fields.'), 1500);
      setTimeout(() => setIsRecording(false), 2000);
    }
  };

  const handleSubmit = () => {
    if (!outcome) {
      setToast({ type: 'error', msg: 'Please select an outcome first.' });
      setTimeout(() => setToast(null), 3500);
      return;
    }
    if ((outcome === 'sale' || outcome === 'order') && !products.some(p => p.selected && p.qty > 0)) {
      setToast({ type: 'error', msg: 'Please add a quantity for the order.' });
      setTimeout(() => setToast(null), 3500);
      return;
    }

    setToast({ type: 'success', msg: '✓ Visit logged (Offline sync queued)' });
    setTimeout(() => {
      setToast(null);
      // e.g. history.push('/route')
    }, 2000);
  };

  const selectedProducts = products.filter(p => p.selected);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-in" style={{
          position: 'absolute', top: 60, left: '50%', zIndex: 120,
          padding: '12px 18px', borderRadius: 16,
          background: toast.type === 'error' ? 'var(--danger)' : 'var(--primary)',
          color: 'white', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(20,18,12,0.15)',
          width: '90%', maxWidth: 350,
          fontFamily: 'Plus Jakarta Sans', fontSize: 14, fontWeight: 600,
        }}>
          {toast.type === 'error' && <IAlertTriangle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(245,241,232,0.85)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid rgba(229,220,201,0.7)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '10px 14px' }}>
          <button style={{
            width: 36, height: 36, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', cursor: 'pointer'
          }}>
            <IChevL size={18}/>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces', fontWeight: 500, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
              Log Visit
            </div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>
              Baramati Agro
            </div>
          </div>
          <div/>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, padding: '24px 18px 120px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* 1. Outcomes */}
        <div className="fade-up" style={{ animationDelay: '50ms' }}>
          <SectionH>Primary Outcome</SectionH>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OUTCOMES.map((o) => {
              const isSelected = outcome === o.id;
              return (
                <button key={o.id} onClick={() => setOutcome(o.id)} style={{
                  width: '100%', height: 64, borderRadius: 20,
                  display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px',
                  background: isSelected ? 'var(--primary)' : 'var(--surface)',
                  border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                  color: isSelected ? 'white' : 'var(--ink)',
                  fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600,
                  boxShadow: isSelected ? '0 8px 22px rgba(46,74,58,0.2)' : '0 1px 2px rgba(20,18,12,0.03)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer'
                }}>
                  <o.Icon size={22} stroke={isSelected ? "white" : "var(--ink-soft)"} />
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Conditional Follow-up Date */}
        {outcome === 'followup' && (
          <div className="expand-down" style={{ marginTop: -16 }}>
            <SectionH>Schedule Follow-up</SectionH>
            <input 
              type="date" 
              className="styled-input" 
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
        )}

        {/* 2. Products Discussed */}
        <div className="fade-up" style={{ animationDelay: '120ms' }}>
          <SectionH>Products Discussed</SectionH>
          
          <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, margin: '0 -18px', paddingLeft: 18, paddingRight: 18 }}>
            {products.map((p) => (
              <button key={p.id} onClick={() => toggleProduct(p.id)} style={{
                padding: '10px 16px', borderRadius: 999, flexShrink: 0,
                background: p.selected ? 'var(--primary)' : 'var(--surface)',
                border: p.selected ? '1px solid var(--primary)' : '1px solid var(--border)',
                color: p.selected ? 'white' : 'var(--ink-soft)',
                fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600,
                transition: 'all 0.2s ease', cursor: 'pointer',
                boxShadow: p.selected ? '0 4px 12px rgba(46,74,58,0.15)' : 'none',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                {p.selected && <ICheckCircle size={14} stroke="white" />}
                {p.name}
              </button>
            ))}
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {selectedProducts.map(p => (
                <div key={p.id} className="expand-down" style={{
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20,
                  padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(20,18,12,0.03)'
                }}>
                  <div>
                    <div style={{ fontFamily: 'Fraunces', fontSize: 16, fontWeight: 500, color: 'var(--ink)', fontVariationSettings: '"opsz" 18' }}>{p.name}</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', marginTop: 4 }}>
                      ₹{(p.price * p.qty).toLocaleString()} · {p.qty} bags
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-warm)', borderRadius: 99, padding: '4px', border: '1px solid var(--border)' }}>
                    <button onClick={() => updateQty(p.id, -1)} style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(20,18,12,0.04)'
                    }}><IMinus size={18}/></button>
                    
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, width: 20, textAlign: 'center', color: 'var(--ink)' }}>{p.qty}</span>
                    
                    <button onClick={() => updateQty(p.id, 1)} style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(20,18,12,0.04)'
                    }}><IPlus size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Competitor Activity */}
        <div className="fade-up" style={{ animationDelay: '190ms' }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24,
            padding: '20px 22px', boxShadow: '0 1px 4px rgba(20,18,12,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Competitor Activity Observed?</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={sawCompetitor} onChange={(e) => setSawCompetitor(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {sawCompetitor && (
              <div className="expand-down" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
                <input 
                  type="text" placeholder="Competitor Brand (e.g., Bayer)" 
                  className="styled-input" value={compBrand} onChange={e => setCompBrand(e.target.value)} 
                />
                <input 
                  type="text" placeholder="Product Name / Segment" 
                  className="styled-input" value={compProduct} onChange={e => setCompProduct(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* 4. Voice Notes */}
        <div className="fade-up" style={{ animationDelay: '260ms' }}>
          <SectionH>Visit Notes</SectionH>
          <div style={{ position: 'relative' }}>
            <textarea 
              className="styled-textarea" 
              placeholder="Add observations, commitments, or concerns..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button 
              onClick={handleMicToggle}
              className={isRecording ? "fab-pulse" : "fab-breathe-mic"}
              style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 48, height: 48, borderRadius: '50%',
                background: isRecording ? 'var(--accent)' : 'radial-gradient(circle at 32% 28%, #4a6a55 0%, #2E4A3A 60%, #243a2e 100%)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s ease', zIndex: 10, cursor: 'pointer',
                border: isRecording ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <IMic size={20} stroke="#fff" />
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Submit Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
        padding: '24px 18px 32px', display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto', width: '100%' }}>
          <button onClick={handleSubmit} style={{
            width: '100%', height: 56, borderRadius: 16,
            background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(46,74,58,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
            transition: 'transform 0.1s', letterSpacing: '-0.005em'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Submit & Sync Log
          </button>
        </div>
      </div>

    </div>
  );
}