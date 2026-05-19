import React, { useState } from 'react'
import { useTranslation } from '../../node_modules/react-i18next'
import { useAuth } from '../components/AuthContext'
import { IUser, IBarChart, ICheck, WheatStalk } from '../components/Shared'
import { api } from '../services/api'

// Demo credentials are fixed for the hackathon
const DEMO_CREDS: Record<'rep' | 'manager', { username: string; password: string }> = {
  rep: { username: 'arjun', password: 'agropilot2026' },
  manager: { username: 'manager', password: 'agropilot2026' },
}

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState<'rep' | 'manager' | null>(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!selectedRole || loggingIn) return
    setLoggingIn(true)
    setError(null)

    try {
      const creds = DEMO_CREDS[selectedRole]
      const data = await api.login(creds.username, creds.password)
      // Persist token via AuthContext — api.ts will pick it up from localStorage
      login(data.role as 'rep' | 'manager', data.name, data.token, data.rep_id)
    } catch (err) {
      setError('Login failed — check if the backend is running on port 8000.')
      setLoggingIn(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background decoration */}
      <div style={{ position: 'absolute', top: -60, right: -80, pointerEvents: 'none', opacity: 0.06 }}>
        <WheatStalk size={320} color="var(--primary)" opacity={1} />
      </div>
      <div style={{ position: 'absolute', bottom: -40, left: -60, pointerEvents: 'none', opacity: 0.04, transform: 'rotate(20deg)' }}>
        <WheatStalk size={280} color="var(--primary)" opacity={1} />
      </div>

      <div className="fade-up" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 440, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h1 style={{
              fontFamily: 'Fraunces', fontSize: 32, fontWeight: 500,
              color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em',
            }}>
              Agro<span style={{ fontWeight: 400, fontStyle: 'italic' }}>Pilot</span>
            </h1>
          </div>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, color: 'var(--ink-soft)', margin: 0 }}>
            {t('login.tagline')}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 24,
          padding: '32px 28px 28px',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 4px rgba(20,18,12,0.04), 0 16px 40px rgba(20,18,12,0.08)',
        }}>
          <h2 style={{
            fontFamily: 'Fraunces', fontSize: 22, fontWeight: 500,
            color: 'var(--ink)', margin: '0 0 4px', textAlign: 'center',
          }}>
            {t('login.title')}
          </h2>
          <p style={{
            fontFamily: 'Plus Jakarta Sans', fontSize: 13, color: 'var(--ink-soft)',
            margin: '0 0 28px', textAlign: 'center',
          }}>
            {t('login.subtitle')}
          </p>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setSelectedRole('rep')}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 18px', borderRadius: 16,
                background: selectedRole === 'rep' ? 'rgba(46,74,58,0.06)' : 'var(--surface-warm)',
                border: selectedRole === 'rep' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                cursor: 'pointer', transition: 'all 200ms ease', textAlign: 'left',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flex: 'none',
                background: selectedRole === 'rep' ? 'var(--primary)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                <IUser size={20} stroke={selectedRole === 'rep' ? '#fff' : 'var(--ink-soft)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {t('login.rep_title')}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {t('login.rep_desc')}
                </div>
              </div>
              {selectedRole === 'rep' && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                }}>
                  <ICheck size={13} stroke="#fff" />
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedRole('manager')}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 18px', borderRadius: 16,
                background: selectedRole === 'manager' ? 'rgba(201,151,74,0.07)' : 'var(--surface-warm)',
                border: selectedRole === 'manager' ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                cursor: 'pointer', transition: 'all 200ms ease', textAlign: 'left',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flex: 'none',
                background: selectedRole === 'manager' ? 'var(--accent)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                <IBarChart size={20} stroke={selectedRole === 'manager' ? '#fff' : 'var(--ink-soft)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {t('login.manager_title')}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {t('login.manager_desc')}
                </div>
              </div>
              {selectedRole === 'manager' && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                }}>
                  <ICheck size={13} stroke="#fff" />
                </div>
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(200,50,50,0.08)',
              border: '1px solid rgba(200,50,50,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 14,
              fontFamily: 'Plus Jakarta Sans',
              fontSize: 12.5,
              color: '#c83232',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!selectedRole || loggingIn}
            className={selectedRole ? 'press-scale' : ''}
            style={{
              width: '100%', padding: '15px',
              borderRadius: 14,
              background: selectedRole
                ? (selectedRole === 'rep' ? 'var(--primary)' : 'var(--accent)')
                : 'var(--border)',
              color: selectedRole ? '#fff' : 'var(--ink-soft)',
              border: 'none',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600,
              cursor: selectedRole && !loggingIn ? 'pointer' : 'default',
              transition: 'all 250ms ease',
              letterSpacing: '-0.01em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loggingIn ? (
              <>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                {t('login.signing_in')}
              </>
            ) : selectedRole === 'rep'
              ? t('login.continue_rep')
              : selectedRole === 'manager'
                ? t('login.continue_manager')
                : t('login.select_role')}
          </button>
        </div>

        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontSize: 11,
          color: 'var(--ink-soft)', opacity: 0.5,
          margin: '18px 0 0', textAlign: 'center',
        }}>
          Syngenta AgroPilot · IITM Hackathon 2026
        </p>
      </div>
    </div>
  )
}
