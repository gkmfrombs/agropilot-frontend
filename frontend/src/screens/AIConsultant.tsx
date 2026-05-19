import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IChev, IMic, TopStrip, ISend, IClose, Eyebrow, PulseDot } from '../components/Shared';
import { useTranslation } from '../lib/i18n';

function ScarecrowAvatar({ size = 36 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hat brim */}
            <ellipse cx="18" cy="11" rx="10" ry="2.5" fill="#5C3D1E" />
            {/* Hat crown */}
            <rect x="12" y="3" width="12" height="9" rx="2" fill="#7A5230" />
            {/* Hat band */}
            <rect x="12" y="9.5" width="12" height="2" fill="#C9974A" />
            {/* Straw from hat */}
            <line x1="10" y1="10" x2="7" y2="7" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="26" y1="10" x2="29" y2="7" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="18" y1="3" x2="18" y2="1" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            {/* Face */}
            <circle cx="18" cy="18" r="7" fill="#F5C88A" />
            {/* Eyes — simple X stitched style */}
            <line x1="15" y1="16.5" x2="16.5" y2="18" stroke="#5C3D1E" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="16.5" y1="16.5" x2="15" y2="18" stroke="#5C3D1E" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="19.5" y1="16.5" x2="21" y2="18" stroke="#5C3D1E" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="21" y1="16.5" x2="19.5" y2="18" stroke="#5C3D1E" strokeWidth="1.2" strokeLinecap="round" />
            {/* Smile — stitched curve */}
            <path d="M15.5 20 Q18 22.5 20.5 20" stroke="#5C3D1E" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Cheek patches */}
            <circle cx="14" cy="19.5" r="1.8" fill="rgba(201,151,74,0.35)" />
            <circle cx="22" cy="19.5" r="1.8" fill="rgba(201,151,74,0.35)" />
            {/* Body / shirt */}
            <rect x="13" y="25" width="10" height="8" rx="2" fill="#2E4A3A" />
            {/* Shirt patch */}
            <rect x="15" y="27" width="3" height="2.5" rx="0.5" fill="#4a6a55" />
            {/* Straw from sleeves */}
            <line x1="13" y1="27" x2="9" y2="25" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="13" y1="28" x2="9" y2="27" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="23" y1="27" x2="27" y2="25" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="23" y1="28" x2="27" y2="27" stroke="#D4A347" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

interface Message {
    text: string;
    isUser: boolean;
    hasGraph?: boolean;
}

const initialMessages: Message[] = [
    { text: "Good morning Arjun! I'm ready to help with your field visits today. What do you need?", isUser: false },
];

function ChatMessage({ message, isUser, showGraph, delay, whyLabel }: any) {
    return (
        <div className="slide-in-l" style={{ animationDelay: `${delay}ms`, display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
            {!isUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface-warm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <ScarecrowAvatar size={26} />
                    </div>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>AgroPilot</span>
                </div>
            )}
            <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isUser ? 'var(--primary)' : 'var(--surface)', color: isUser ? 'white' : 'var(--ink)', border: isUser ? 'none' : '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, lineHeight: 1.45, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {message}
                {!isUser && showGraph && (
                    <button onClick={showGraph} style={{ marginTop: 12, padding: '8px 12px', width: '100%', borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)', color: 'var(--primary)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {whyLabel} <IChev size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

function ReasoningGraphModal({ onClose, t }: any) {
    const signals = [
        { label: 'Ramesh\n(Farmer)', x: 20, y: 18, color: 'var(--ink)' },
        { label: 'HD-2967\n(Wheat)', x: 78, y: 15, color: 'var(--ink)' },
        { label: '48mm Rain', x: 12, y: 58, color: 'var(--danger)' },
        { label: '89%\nHumidity', x: 85, y: 55, color: 'var(--warning)' },
        { label: '2023\nOutbreak', x: 20, y: 82, color: 'var(--ink-soft)' },
        { label: 'Stock 5km', x: 78, y: 82, color: 'var(--primary)' },
    ];

    const steps = [
        'Detected wheat at flowering stage from farmer profile',
        'Connected rainfall and humidity to fungal risk model',
        'Matched current pattern against 2023 outbreak in same panchayat',
        'Filtered Syngenta products for early-stage blight efficacy',
        'Identified in-stock location within 5km radius',
    ];

    return (
        <div className="fade-up" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 2 }}>
                <div>
                    <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>{t('reasoningGraph')}</h2>
                    <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)' }}>6 signals · 1 outcome</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--ink)' }}><IClose size={24} /></button>
            </div>
            
            {/* Graph */}
            <div style={{ position: 'relative', height: 320, margin: '16px 18px', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {signals.map((s, i) => (
                        <line key={i} x1={`${s.x}%`} y1={`${s.y}%`} x2="50%" y2="48%" stroke="var(--primary-soft)" strokeWidth="1.5" strokeDasharray="4 4" />
                    ))}
                </svg>
                {signals.map((s, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)', padding: '6px 10px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: 600, color: s.color, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>{s.label}</div>
                ))}
                <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, boxShadow: '0 0 0 6px rgba(46,74,58,0.12), 0 4px 16px rgba(46,74,58,0.3)', zIndex: 10, lineHeight: 1.3 }}>
                    Tilt<br/>25EC
                </div>
            </div>

            {/* Reasoning Trail */}
            <div style={{ padding: '0 18px 20px' }}>
                <Eyebrow>{t('reasoningTrail')}</Eyebrow>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans', fontSize: 11, fontWeight: 700, flex: 'none' }}>{i+1}</span>
                            <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '0 18px 24px', display: 'flex', gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: '15px', borderRadius: 16, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 6px 16px rgba(46,74,58,0.28)' }}>
                    {t('useThisAnswer')}
                </button>
            </div>
        </div>
    );
}

export default function AIConsultant() {
    const { t } = useTranslation();
    const [showGraph, setShowGraph] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const scanHandled = useRef(false);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    // Handle scan context from CropScanner navigation
    useEffect(() => {
        const state = location.state as any;
        if (state?.scanContext && !scanHandled.current) {
            scanHandled.current = true;
            const ctx = state.scanContext;
            setMessages(prev => [...prev, { text: ctx, isUser: true }]);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: "Based on the scan results, here is my detailed recommendation. The product I've suggested is the best match for this disease at the current severity level. Apply it as directed — timing is critical for maximum efficacy. Would you like to know about dosage adjustments, alternative products, or nearby stock availability?",
                    isUser: false,
                    hasGraph: true,
                }]);
            }, 1000);
        }
    }, [location.state]);


    const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
        
        // Simulate AI response
        setTimeout(() => {
            let response = '';
            let hasGraph = false;
            if (userMsg.toLowerCase().includes('ramesh') || userMsg.toLowerCase().includes('pitch')) {
                response = "Based on Ramesh's profile and current weather, pitch Tilt 25EC. His wheat (HD-2967) is at flowering stage, and 48mm rainfall has created high blight risk. Stock is available 5km away at Kisan Store.";
                hasGraph = true;
            } else if (userMsg.toLowerCase().includes('stock') || userMsg.toLowerCase().includes('inventory')) {
                response = "Topik 15WP is out of stock at 3 retailers in Sandila tehsil. Score 250EC is running low at Kisan Agri Store (4 units). Actara and Kavach levels are healthy across your territory.";
            } else if (userMsg.toLowerCase().includes('dose') || userMsg.toLowerCase().includes('dosage')) {
                response = "For Tilt 25EC on wheat at heading/flowering stage: Apply 200ml per acre mixed with 200L water. Best applied in early morning or late afternoon. Avoid application if rain is expected within 6 hours.";
            } else {
                response = "I can help with product recommendations, inventory status, crop advice, and territory intelligence. Try asking about a specific farmer, product, or what to pitch today!";
            }
            setMessages(prev => [...prev, { text: response, isUser: false, hasGraph }]);
        }, 800);
    };

    return (
        <div style={{ height: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', zIndex: 10, flexShrink: 0 }}>
                <Link to="/" style={{ color: 'var(--ink)', textDecoration: 'none' }}><IChev size={20} style={{ transform: 'rotate(180deg)' }} /></Link>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-warm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <ScarecrowAvatar size={36} />
                </div>
                <div>
                    <h2 style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, margin: 0, color: 'var(--ink)' }}>AgroPilot</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <PulseDot color="var(--primary)" size={5} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>GraphRAG Connected</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
                {messages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        message={msg.text}
                        isUser={msg.isUser}
                        delay={i * 100}
                        showGraph={msg.hasGraph ? () => setShowGraph(true) : undefined}
                        whyLabel={t('whyRecommendation')}
                    />
                ))}
            </div>

            {/* Input */}
            <div style={{ padding: '14px 18px env(safe-area-inset-bottom, 20px)', background: 'var(--surface)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', padding: '8px 12px', borderRadius: 24, border: '1px solid var(--border)' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                        <IMic size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask AgroPilot..."
                        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 14, color: 'var(--ink)' }}
                    />
                    <button onClick={sendMessage} style={{ width: 32, height: 32, borderRadius: '50%', background: input.trim() ? 'var(--primary)' : 'var(--border)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'background 200ms' }}>
                        <ISend size={16} />
                    </button>
                </div>
            </div>

            {showGraph && <ReasoningGraphModal onClose={() => setShowGraph(false)} t={t} />}
        </div>
    );
}
