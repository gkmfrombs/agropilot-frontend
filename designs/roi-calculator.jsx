// Yield Loss / ROI Calculator — 390px mobile
// Premium Editorial Style

import React, { useState, useEffect, useMemo } from 'react';

// ===================================================================
// Injected Styles for Animations & Custom Overrides
// ===================================================================
const injectedStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  @keyframes popIn {
    0% { transform: scale(0.96); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
  .val-update { animation: popIn 250ms cubic-bezier(0.16, 1, 0.3, 1); }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  .mono { font-family: 'IBM Plex Mono', monospace; }

  .styled-input {
    width: 100%; padding: 14px 16px; border-radius: 14px;
    border: 1px solid var(--border); background: var(--surface);
    font-size: 15px; font-weight: 600; color: var(--ink);
    transition: all 0.2s ease;
    box-shadow: inset 0 2px 4px rgba(20,18,12,0.02);
  }
  .styled-input:focus {
    border-color: var(--primary); outline: none;
    box-shadow: 0 0 0 3px rgba(46,74,58,0.1), inset 0 2px 4px rgba(20,18,12,0.02);
  }

  .segment-btn {
    flex: 1; padding: 12px 6px; text-align: center; font-size: 13px; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1px solid var(--border); background: var(--surface); color: var(--ink-soft);
    transition: all 0.2s; cursor: pointer;
  }
  .segment-btn.active {
    background: var(--primary); color: white; border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(46,74,58,0.25); z-index: 2; position: relative;
  }
  .segment-btn:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
  .segment-btn:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
  .segment-btn:not(:last-child) { border-right: none; }
`;

// ===================================================================
// Icons
// ===================================================================
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', vb = '0 0 24 24', style }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const IChevL = (p) => <Icon {...p} d={<path d="m15 18-6-6 6-6"/>}/>;
const IPlus = (p) => <Icon {...p} d={<><path d="M5 12h14"/><path d="M12 5v14"/></>}/>;
const IMinus = (p) => <Icon {...p} d={<path d="M5 12h14"/>}/>;
const IWeed = (p) => <Icon {...p} d={<><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/></>}/>;
const IFungi = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/><path d="M7.5 12h.01"/><path d="M16.5 12h.01"/></>}/>;
const IBug = (p) => <Icon {...p} d={<><rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m9 4 1 2"/><path d="m15 4-1 2"/></>}/>;
const ICamera = (p) => <Icon {...p} d={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>}/>;
const IMessageCircle = (p) => <Icon {...p} d={<><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></>}/>;
const ITrendingUp = (p) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}/>;
const ICheckCircle = (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>}/>;

// ===================================================================
// Shared UI Components
// ===================================================================
function SectionH({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, padding: '0 2px' }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }}/>
      <h2 style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0, fontVariationSettings: '"opsz" 18' }}>
        {children}
      </h2>
    </div>
  );
}

// ===================================================================
// Domain Data Model
// ===================================================================
const CROPS = {
  'Wheat':    { baseYield: 2000, price: 28 },
  'Mustard':  { baseYield: 800,  price: 55 },
  'Chickpea': { baseYield: 600,  price: 65 },
  'Potato':   { baseYield: 10000,price: 15 },
};

const PROBLEMS = [
  { id: 'weed',   label: 'Weeds',    Icon: IWeed,  costPerAcre: 800 },
  { id: 'fungal', label: 'Disease',  Icon: IFungi, costPerAcre: 1200 },
  { id: 'insect', label: 'Insects',  Icon: IBug,   costPerAcre: 1000 },
];

const SEVERITY = {
  'Mild':     { loss: 0.10, color: '#85A85A' },
  'Moderate': { loss: 0.20, color: '#D97E3C' },
  'Severe':   { loss: 0.35, color: '#B85C3C' },
};

const EFFICACY = 0.90;

const formatIN = (num) => Math.round(num).toLocaleString('en-IN');

// ===================================================================
// Main Component
// ===================================================================
export default function ROICalculator() {
  const [crop, setCrop] = useState('Wheat');
  const [farmSize, setFarmSize] = useState(2.5);
  const [price, setPrice] = useState(CROPS['Wheat'].price);
  const [problem, setProblem] = useState('fungal');
  const [severity, setSeverity] = useState('Moderate');
  
  useEffect(() => { setPrice(CROPS[crop].price); }, [crop]);

  const results = useMemo(() => {
    const baseYieldTotal = CROPS[crop].baseYield * farmSize;
    const lossRate = SEVERITY[severity].loss;
    
    const probConfig = PROBLEMS.find(p => p.id === problem);
    const treatmentCost = probConfig.costPerAcre * farmSize;

    const lossKg = baseYieldTotal * lossRate;
    const lossRupees = lossKg * price;

    const savedKg = lossKg * EFFICACY;
    const savedRupees = savedKg * price;

    const netROI = savedRupees - treatmentCost;
    const breakEvenKg = treatmentCost / price;

    return { lossKg, lossRupees, treatmentCost, savedKg, savedRupees, netROI, breakEvenKg };
  }, [crop, farmSize, price, problem, severity]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: 'var(--bg)', paddingTop: 48 }}>
      <style>{injectedStyles}</style>

      {/* Paper Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      }}/>

      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(245,241,232,0.85)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid rgba(229,220,201,0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 18px' }}>
          <button style={{ width: 40, height: 40, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}>
            <IChevL size={20}/>
          </button>
          <h1 style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500, margin: 0, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            ROI Calculator
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px 18px', paddingBottom: 140, position: 'relative', zIndex: 2 }}>
        
        {/* 1. INPUT SECTION */}
        <div className="fade-up" style={{
          background: 'var(--surface)', borderRadius: 28, padding: '24px',
          boxShadow: '0 4px 24px rgba(20,18,12,0.04)', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 28, animationDelay: '50ms'
        }}>
          
          <div>
            <SectionH>Target Crop</SectionH>
            <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 16, padding: 5, border: '1px solid var(--border)' }}>
              {Object.keys(CROPS).map(c => (
                <button key={c} onClick={() => setCrop(c)} className={`segment-btn ${crop === c ? 'active' : ''}`} style={{
                  borderRadius: 12, border: 'none', background: crop === c ? 'var(--primary)' : 'transparent',
                  color: crop === c ? 'white' : 'var(--ink-soft)'
                }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Farm Size</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 16, padding: '6px', border: '1px solid var(--border)' }}>
                <button onClick={() => setFarmSize(Math.max(0.5, farmSize - 0.5))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(20,18,12,0.03)', cursor: 'pointer' }}><IMinus size={18}/></button>
                <div className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{farmSize}</div>
                <button onClick={() => setFarmSize(farmSize + 0.5)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(20,18,12,0.03)', cursor: 'pointer' }}><IPlus size={18}/></button>
              </div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 10, textAlign: 'center', fontWeight: 600 }}>
                ~ {formatIN(farmSize * 0.4047)} Hectares
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mandi Price</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: 16, fontSize: 17, fontWeight: 600, color: 'var(--ink-soft)' }}>₹</span>
                <input 
                  type="number" value={price} onChange={e => setPrice(Number(e.target.value) || 0)}
                  className="styled-input mono" style={{ paddingLeft: 34, height: 54, fontSize: 17 }}
                />
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '0 -24px' }}/>

          <div>
            <SectionH>Primary Threat</SectionH>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {PROBLEMS.map(p => {
                const isActive = problem === p.id;
                return (
                  <button key={p.id} onClick={() => setProblem(p.id)} style={{
                    height: 80, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: isActive ? 'var(--primary)' : 'var(--bg)',
                    border: `1.5px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                    color: isActive ? 'white' : 'var(--ink)',
                    transition: 'all 0.2s', cursor: 'pointer',
                    boxShadow: isActive ? '0 8px 20px rgba(46,74,58,0.25)' : 'none'
                  }}>
                    <p.Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600 }}>{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionH>Severity Level</SectionH>
            <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 16, padding: 5, border: '1px solid var(--border)' }}>
              {Object.entries(SEVERITY).map(([key, config]) => {
                const isActive = severity === key;
                return (
                  <button key={key} onClick={() => setSeverity(key)} className={`segment-btn ${isActive ? 'active' : ''}`} style={{
                    borderRadius: 12, border: 'none', background: isActive ? config.color : 'transparent',
                    color: isActive ? 'white' : 'var(--ink-soft)'
                  }}>
                    {key}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="fade-up" style={{ textAlign: 'center', margin: '32px 0 20px', animationDelay: '100ms' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Economic Projection</span>
        </div>

        {/* 2. OUTPUT SECTION (2 Column + Hero Card) */}
        <div className="fade-up val-update" key={`${crop}-${farmSize}-${price}-${problem}-${severity}`} style={{
          display: 'flex', flexDirection: 'column', gap: 12, animationDelay: '150ms'
        }}>
          
          {/* Top Row: 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Without Action (Red) */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid rgba(184,92,60,0.2)', borderRadius: 24, padding: '20px 16px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 14px rgba(184,92,60,0.06)' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, color: '#B85C3C', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B85C3C' }}/> Without Action
              </div>
              
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>Yield Loss</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: '#B85C3C', marginBottom: 20 }}>
                -{formatIN(results.lossKg)} <span style={{ fontSize: 12 }}>kg</span>
              </div>
              
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 'auto' }}>Value Lost</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: '#B85C3C' }}>
                -₹{formatIN(results.lossRupees)}
              </div>
            </div>

            {/* With Treatment (Green) */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid rgba(46,74,58,0.2)', borderRadius: 24, padding: '20px 16px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 14px rgba(46,74,58,0.06)' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }}/> With Treatment
              </div>
              
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>Yield Saved</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginBottom: 20 }}>
                +{formatIN(results.savedKg)} <span style={{ fontSize: 12 }}>kg</span>
              </div>
              
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 'auto' }}>Product Cost</div>
              <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                ₹{formatIN(results.treatmentCost)}
              </div>
            </div>
          </div>

          {/* Bottom Row: Net ROI Hero Card */}
          <div style={{ background: 'var(--primary)', borderRadius: 24, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 32px rgba(46,74,58,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
               <ITrendingUp size={120} stroke="#fff" />
            </div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 800, color: 'var(--primary-soft)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.1em' }}>
                Your Net Benefit
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Total ROI</div>
                  <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', marginTop: 4, lineHeight: 1 }}>
                    +₹{formatIN(results.netROI)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Value Saved</div>
                  <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginTop: 4 }}>
                    ₹{formatIN(results.savedRupees)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Break-even Highlight */}
        <div className="fade-up" style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24,
          padding: '20px 24px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 18,
          animationDelay: '200ms', boxShadow: '0 4px 16px rgba(20,18,12,0.03)'
        }}>
          <div style={{ 
            width: 52, height: 52, borderRadius: '50%', background: 'var(--surface-warm)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 10px rgba(20,18,12,0.04)'
          }}>
            <ICheckCircle size={24} stroke="var(--primary)" />
          </div>
          <div>
            <div style={{ fontFamily: 'Fraunces', fontSize: 17, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, fontVariationSettings: '"opsz" 18' }}>
              Need only <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatIN(results.breakEvenKg)} kg</span> of extra yield to recover cost.
            </div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, fontWeight: 600 }}>
              That's just <span className="mono">{(results.breakEvenKg / (CROPS[crop].baseYield * farmSize) * 100).toFixed(1)}%</span> of total crop.
            </div>
          </div>
        </div>

      </div>

      {/* 4. Sticky Action Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(180deg, rgba(245,241,232,0) 0%, rgba(245,241,232,0.95) 30%, var(--bg) 65%)',
        padding: '24px 18px 32px', display: 'flex', gap: 12, pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 12, width: '100%' }}>
          <button style={{
            flex: 1, height: 60, borderRadius: 18,
            background: 'var(--wa-green)', color: 'white',
            fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(37,211,102,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            border: 'none', cursor: 'pointer', transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <IMessageCircle size={20} fill="currentColor" stroke="none" /> Share ROI
          </button>
          <button style={{
            width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(20,18,12,0.06)', cursor: 'pointer', transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ICamera size={22} />
          </button>
        </div>
      </div>

    </div>
  );
}