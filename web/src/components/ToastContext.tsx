import React, { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem { id: string; message: string; type: ToastType; exiting?: boolean }
interface ToastCtx { showToast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 220)
    }, 3000)
  }, [])

  const icons = { success: '✓', error: '✕', info: 'i' }
  const colors: Record<ToastType, string> = {
    success: 'var(--primary)',
    error: 'var(--danger)',
    info: 'var(--accent)',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
        alignItems: 'center', pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} className={t.exiting ? 'toast-exit' : 'toast-enter'} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 999,
            background: colors[t.type], color: '#fff',
            fontFamily: 'Plus Jakarta Sans', fontSize: 13.5, fontWeight: 600,
            boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, flexShrink: 0,
            }}>
              {icons[t.type]}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
