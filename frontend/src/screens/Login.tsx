import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { WheatStalk } from '../components/Shared';

const PHOTO_FIELD = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop';

export default function Login() {
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState<'rep' | 'manager' | null>(null);

    const handleLogin = () => {
        if (!selectedRole) return;
        const name = selectedRole === 'rep' ? 'Arjun Mehta' : 'Priya Sharma';
        login(selectedRole, name);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(at 28% 14%, #586b3f 0%, #3f5230 50%, #2c3a22 100%)', position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${PHOTO_FIELD})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
            <div style={{ position: 'absolute', top: 60, right: -30, pointerEvents: 'none', opacity: 0.08 }}><WheatStalk size={200} color="#fff" opacity={1} /></div>
            <div style={{ position: 'absolute', bottom: 40, left: -40, pointerEvents: 'none', opacity: 0.06, transform: 'rotate(18deg)' }}><WheatStalk size={250} color="#fff" opacity={1} /></div>

            <div className="fade-up" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 440, padding: '0 24px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8D5BB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                        </div>
                        <h1 style={{ fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500, color: '#FAF6EC', margin: 0, letterSpacing: '-0.02em' }}>
                            Agro<span style={{ fontWeight: 400, fontStyle: 'italic' }}>Pilot</span>
                        </h1>
                    </div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'rgba(245,241,232,0.7)', margin: 0, letterSpacing: '0.01em' }}>AI-Powered Field Intelligence for Syngenta</p>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', borderRadius: 28, padding: '36px 28px 32px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ fontFamily: 'Fraunces', fontSize: 24, fontWeight: 500, color: '#FAF6EC', margin: '0 0 6px', textAlign: 'center' }}>Welcome back</h2>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'rgba(245,241,232,0.68)', margin: '0 0 28px', textAlign: 'center' }}>Select your role to continue</p>

                    {/* Role cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                        <button onClick={() => setSelectedRole('rep')} style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 18,
                            background: selectedRole === 'rep' ? 'rgba(200,213,187,0.18)' : 'rgba(255,255,255,0.04)',
                            border: selectedRole === 'rep' ? '1.5px solid rgba(200,213,187,0.5)' : '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer', transition: 'all 250ms ease', textAlign: 'left',
                            boxShadow: selectedRole === 'rep' ? '0 0 0 3px rgba(200,213,187,0.12)' : 'none',
                        }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: selectedRole === 'rep' ? 'var(--primary)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 250ms', flex: 'none' }}>
                                <svg width="22" height="22" viewBox="0 0 64 88" fill="none" opacity={selectedRole === 'rep' ? 1 : 0.6}>
                                    <line x1="32" y1="6" x2="32" y2="84" stroke={selectedRole === 'rep' ? '#FAF6EC' : 'rgba(245,241,232,0.7)'} strokeWidth="1.8" strokeLinecap="round" />
                                    {[0,1,2,3,4,5,6,7].map(i => (
                                        <g key={i} transform={`translate(32, ${12 + i * 8.5})`}>
                                            <path d="M0 0 Q -7 -3 -11 -10" stroke={selectedRole === 'rep' ? '#C8D5BB' : 'rgba(245,241,232,0.5)'} strokeWidth="1.6" strokeLinecap="round" fill="none" />
                                            <path d="M0 0 Q  7 -3  11 -10" stroke={selectedRole === 'rep' ? '#C8D5BB' : 'rgba(245,241,232,0.5)'} strokeWidth="1.6" strokeLinecap="round" fill="none" />
                                        </g>
                                    ))}
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#FAF6EC' }}>Field Rep</div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(245,241,232,0.65)', marginTop: 2 }}>Mobile-first field intelligence app</div>
                            </div>
                            {selectedRole === 'rep' && <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </div>}
                        </button>

                        <button onClick={() => setSelectedRole('manager')} style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 18,
                            background: selectedRole === 'manager' ? 'rgba(201,151,74,0.15)' : 'rgba(255,255,255,0.04)',
                            border: selectedRole === 'manager' ? '1.5px solid rgba(201,151,74,0.4)' : '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer', transition: 'all 250ms ease', textAlign: 'left',
                            boxShadow: selectedRole === 'manager' ? '0 0 0 3px rgba(201,151,74,0.1)' : 'none',
                        }}>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: selectedRole === 'manager' ? 'var(--accent)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 250ms', flex: 'none' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selectedRole === 'manager' ? 'white' : 'rgba(245,241,232,0.6)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, color: '#FAF6EC' }}>Manager</div>
                                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'rgba(245,241,232,0.65)', marginTop: 2 }}>Regional command centre dashboard</div>
                            </div>
                            {selectedRole === 'manager' && <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </div>}
                        </button>
                    </div>

                    <button onClick={handleLogin} disabled={!selectedRole} style={{
                        width: '100%', padding: '16px', borderRadius: 16,
                        background: selectedRole ? (selectedRole === 'rep' ? 'var(--primary)' : 'var(--accent)') : 'rgba(255,255,255,0.06)',
                        color: selectedRole ? 'white' : 'rgba(255,255,255,0.3)',
                        border: 'none', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, cursor: selectedRole ? 'pointer' : 'default',
                        boxShadow: selectedRole ? '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
                        transition: 'all 300ms ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                        {selectedRole === 'rep' ? 'Enter as Field Rep' : selectedRole === 'manager' ? 'Enter Manager Console' : 'Select a role to continue'}
                        {selectedRole && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                            </svg>
                        )}
                    </button>
                </div>

                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'rgba(245,241,232,0.3)', margin: '20px 0 0', textAlign: 'center' }}>
                    Syngenta AgroPilot · IITM Hackathon 2026
                </p>
            </div>
        </div>
    );
}
