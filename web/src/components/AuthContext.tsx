import React, { createContext, useContext, useState } from 'react'

export type UserRole = 'rep' | 'manager' | null

interface AuthState {
  role: UserRole
  name: string
  repId: string | null
  login: (role: UserRole, name: string, token: string, repId: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  role: null,
  name: '',
  repId: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(
    () => (localStorage.getItem('agro_role') as UserRole) || null
  )
  const [name, setName] = useState(() => localStorage.getItem('agro_name') || '')
  const [repId, setRepId] = useState<string | null>(
    () => localStorage.getItem('agro_rep_id') || null
  )

  const login = (r: UserRole, n: string, token: string, rid: string | null) => {
    setRole(r)
    setName(n)
    setRepId(rid)
    localStorage.setItem('agro_role', r || '')
    localStorage.setItem('agro_name', n)
    localStorage.setItem('agro_token', token)
    if (rid) localStorage.setItem('agro_rep_id', rid)
    else localStorage.removeItem('agro_rep_id')
  }

  const logout = () => {
    setRole(null)
    setName('')
    setRepId(null)
    localStorage.removeItem('agro_role')
    localStorage.removeItem('agro_name')
    localStorage.removeItem('agro_token')
    localStorage.removeItem('agro_rep_id')
  }

  return (
    <AuthContext.Provider value={{ role, name, repId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
