import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'rep' | 'manager' | null;

interface AuthState {
    role: UserRole;
    name: string;
    login: (role: UserRole, name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    role: null, name: '',
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole>(() => {
        return (localStorage.getItem('agro_role') as UserRole) || null;
    });
    const [name, setName] = useState(() => localStorage.getItem('agro_name') || '');

    const login = (r: UserRole, n: string) => {
        setRole(r);
        setName(n);
        localStorage.setItem('agro_role', r || '');
        localStorage.setItem('agro_name', n);
    };

    const logout = () => {
        setRole(null);
        setName('');
        localStorage.removeItem('agro_role');
        localStorage.removeItem('agro_name');
    };

    return (
        <AuthContext.Provider value={{ role, name, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
