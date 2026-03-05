import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { Location } from 'react-router-dom';
import type { User } from '../types';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
}

const iconClass = "w-5 h-5";

const navItems: NavItem[] = [
    {
        label: 'Dashboard', path: '/admin/dashboard',
        icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4" /></svg>,
        roles: ['ADMIN', 'AGENT'],
    },
    {
        label: 'Leads', path: '/admin/leads',
        icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        roles: ['ADMIN', 'AGENT'],
    },
    {
        label: 'Properties', path: '/admin/properties',
        icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        roles: ['ADMIN'],
    },
    {
        label: 'Agents', path: '/admin/agents',
        icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        roles: ['ADMIN'],
    },
    {
        label: 'Analytics', path: '/admin/analytics',
        icon: <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        roles: ['ADMIN'],
    },
];

interface SidebarProps {
    collapsed: boolean;
    setMobileOpen: (open: boolean) => void;
    filtered: NavItem[];
    location: Location;
    user: User | null;
    handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({ collapsed, setMobileOpen, filtered, location, user, handleLogout }) => (
    <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            {!collapsed && <span className="text-base font-bold text-gray-900 truncate">RealEstate<span className="text-blue-600">Crm</span></span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {!collapsed && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>}
            {filtered.map(item => {
                const active = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`sidebar-link ${active ? 'sidebar-link-active' : ''}`}
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                );
            })}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-gray-100">
            <div className={`flex items-center gap-3 p-2 rounded-lg mb-2 ${collapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase()}
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <span className={`badge text-[10px] ${user?.role === 'ADMIN' ? 'badge-admin' : 'badge-agent'}`}>{user?.role}</span>
                    </div>
                )}
            </div>
            <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {!collapsed && 'Sign Out'}
            </button>
        </div>
    </div>
);

const DashboardLayout: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const filtered = navItems.filter(i => !i.roles || i.roles.includes(user?.role || ''));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
                <SidebarContent collapsed={collapsed} setMobileOpen={setMobileOpen} filtered={filtered} location={location} user={user} handleLogout={handleLogout} />
            </aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/40 z-40"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-50"
                        >
                            <SidebarContent collapsed={false} setMobileOpen={setMobileOpen} filtered={filtered} location={location} user={user} handleLogout={handleLogout} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setMobileOpen(!mobileOpen); }}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:block p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500 hidden sm:block">
                            Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
