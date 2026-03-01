import React, { createContext, useContext, useState } from 'react';
import type { LoginResponse } from '../types';

interface AuthContextType {
    user: LoginResponse | null;
    token: string | null;
    login: (userData: LoginResponse) => void;
    logout: () => void;
    isAdmin: boolean;
    isAgent: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LoginResponse | null>(() => {
        const raw = localStorage.getItem('crm_user');
        return raw ? JSON.parse(raw) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('crm_token'));

    const login = (userData: LoginResponse) => {
        localStorage.setItem('crm_token', userData.token);
        localStorage.setItem('crm_user', JSON.stringify(userData));
        setToken(userData.token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, token, login, logout,
            isAdmin: user?.role === 'ADMIN',
            isAgent: user?.role === 'AGENT',
            isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
