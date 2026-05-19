import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../components/AuthContext'
import { IUser, IBarChart, ICheck, WheatStalk } from '../components/Shared'
import { api } from '../services/api'

const DEMO_CREDS: Record<'rep' | 'manager', { username: string; password: string }> = {
  rep: { username: 'arjun', password: 'agropilot2026' },
  manager: { username: 'manager', password: 'agropilot2026' },
}

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState<'rep' | 'manager' | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelect = (role: 'rep' | 'manager') => {
    setSelectedRole(role)
    setUsername(DEMO_CREDS[role].username)
    setPassword(DEMO_CREDS[role].password)
    setError(null)
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim() || loggingIn) return
    setLoggingIn(true)
    setError(null)
    try {
      const data = await api.login(username.trim(), password.trim())
      login(data.role as 'rep' | 'manager', data.name, data.token, data.rep_id)
    } catch {
      setError('Invalid credentials or backend not reachable on port 8000.')
      setLoggingIn(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: '1.5px solid var(--border)',
    background: 'var(--surface-warm)',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 200ms',
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
            margin: '0 0 24px', textAlign: 'center',
          }}>
            {t('login.subtitle')}
          </p>

          {/* Quick-fill role cards */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {(['rep', 'manager'] as const).map(role => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 14,
                  background: selectedRole === role
                    ? (role === 'rep' ? 'rgba(46,74,58,0.07)' : 'rgba(201,151,74,0.08)')
                    : 'var(--surface-warm)',
                  border: selectedRole === role
                    ? `1.5px solid ${role === 'rep' ? 'var(--primary)' : 'var(--accent)'}`
                    : '1.5px solid var(--border)',
                  cursor: 'pointer', transition: 'all 200ms', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flex: 'none',
                  background: selectedRole === role
                    ? (role === 'rep' ? 'var(--primary)' : 'var(--accent)')
                    : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms',
                }}>
                  {role === 'rep'
                    ? <IUser size={16} stroke={selectedRole === role ? '#fff' : 'var(--ink-soft)'} />
                    : <IBarChart size={16} stroke={selectedRole === role ? '#fff' : 'var(--ink-soft)'} />
                  }
                </div>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {role === 'rep' ? 'Field Rep' : 'Manager'}
                  </div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: 'var(--ink-soft)', marginTop: 1 }}>
                    {DEMO_CREDS[role].username}
                  </div>
                </div>
                {selectedRole === role && (
                  <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: role === 'rep' ? 'var(--primary)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <ICheck size={11} stroke="#fff" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Username */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                {showPassword
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(200,50,50,0.08)', border: '1px solid rgba(200,50,50,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 14,
              fontFamily: 'Plus Jakarta Sans', fontSize: 12.5, color: '#c83232',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!username.trim() || !password.trim() || loggingIn}
            className={username && password ? 'press-scale' : ''}
            style={{
              width: '100%', padding: '15px',
              borderRadius: 14,
              background: username && password
                ? (selectedRole === 'manager' ? 'var(--accent)' : 'var(--primary)')
                : 'var(--border)',
              color: username && password ? '#fff' : 'var(--ink-soft)',
              border: 'none',
              fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 600,
              cursor: username && password && !loggingIn ? 'pointer' : 'default',
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
            ) : 'Sign In'}
          </button>

          {/* Demo hint */}
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11.5, color: 'var(--ink-soft)', margin: '16px 0 0', textAlign: 'center', opacity: 0.7 }}>
            Demo: click a role above to auto-fill credentials
          </p>
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
