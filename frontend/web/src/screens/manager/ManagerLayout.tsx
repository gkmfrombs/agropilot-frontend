import React from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../components/AuthContext'
import { Icon } from '../../components/Shared'

const IMap = (p: any) => <Icon {...p} d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14" /><path d="M15 6v14" /></>} />
const IBarChart = (p: any) => <Icon {...p} d={<><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>} />
const IUsers = (p: any) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />
const IBell = (p: any) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />
const IMegaphone = (p: any) => <Icon {...p} d={<><path d="m3 11 18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>} />
const ILogOut = (p: any) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />

const navItems = [
  { path: '/manager', label: 'Heatmap', icon: IMap, exact: true },
  { path: '/manager/kpi', label: 'KPI Dashboard', icon: IBarChart },
  { path: '/manager/reps', label: 'Rep Tracker', icon: IUsers },
  { path: '/manager/alerts', label: 'Alerts', icon: IBell },
  { path: '/manager/campaigns', label: 'Campaigns', icon: IMegaphone },
]

const layoutCss = `
  .mgr-shell {
    display: flex;
    height: 100vh;
    background: var(--bg);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .mgr-sidebar {
    width: 260px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex: none;
    box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  }
  .mgr-main {
    flex: 1;
    overflow: auto;
    background: var(--bg);
  }
  .mgr-bottom-nav {
    display: none;
  }
  .mgr-mobile-header {
    display: none;
  }

  @media (max-width: 767px) {
    .mgr-mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 0 rgba(0,0,0,0.04);
    }
    .mgr-shell {
      flex-direction: column;
      height: auto;
      min-height: 100vh;
    }
    .mgr-sidebar {
      display: none;
    }
    .mgr-main {
      flex: 1;
      overflow: auto;
      padding-bottom: 72px;
    }
    .mgr-bottom-nav {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: #ffffff;
      border-top: 1px solid var(--border);
      z-index: 100;
      align-items: stretch;
    }
    .mgr-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: none;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .mgr-tab-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .mgr-tab.active .mgr-tab-label { color: var(--primary); }
    .mgr-tab:not(.active) .mgr-tab-label { color: var(--ink-soft); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`

export default function ManagerLayout() {
  const { name, logout } = useAuth()
  const location = useLocation()

  const initials = name
    ? name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'PS'

  return (
    <>
      <style>{layoutCss}</style>
      <div className="mgr-shell">
        {/* Desktop sidebar */}
        <aside className="mgr-sidebar">
          {/* Brand */}
          <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Fraunces', fontSize: 18, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em' }}>AgroPilot</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Manager Console</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map(item => {
              const active = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12,
                    background: active ? 'var(--primary-soft)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--ink-soft)',
                    textDecoration: 'none', fontSize: 14, fontWeight: 600,
                    transition: 'all 150ms',
                  }}
                >
                  <item.icon size={18} stroke={active ? 'var(--primary)' : 'var(--ink-soft)'} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #a87a35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'Fraunces', fontSize: 14, fontWeight: 500,
                flexShrink: 0,
              }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{name || 'Priya Sharma'}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Regional Manager</div>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%', padding: '9px 14px', borderRadius: 10,
                background: 'rgba(184,92,60,0.06)', border: '1px solid rgba(184,92,60,0.15)',
                color: 'var(--danger)', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <ILogOut size={14} stroke="var(--danger)" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile-only top header with sign out */}
        <div className="mgr-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: 'Fraunces', fontSize: 15, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.01em' }}>AgroPilot</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 9, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginLeft: 6 }}>Manager</span>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 9,
              background: 'rgba(184,92,60,0.06)', border: '1px solid rgba(184,92,60,0.18)',
              color: 'var(--danger)', fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <ILogOut size={13} stroke="var(--danger)" /> Sign Out
          </button>
        </div>

        {/* Main content */}
        <main className="mgr-main no-scrollbar">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="mgr-bottom-nav">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mgr-tab${active ? ' active' : ''}`}
              >
                <item.icon
                  size={22}
                  stroke={active ? 'var(--primary)' : 'var(--ink-soft)'}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span className="mgr-tab-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
