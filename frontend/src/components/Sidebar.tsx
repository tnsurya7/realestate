import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles?: string[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Properties', path: '/properties', icon: '🏢' },
    { label: 'Leads', path: '/leads', icon: '👥', roles: ['ADMIN', 'AGENT'] },
    { label: 'Analytics', path: '/analytics', icon: '📊', roles: ['ADMIN'] },
];

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredNav = navItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || '')
    );

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px'
                    }}>🏡</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>RealEstate CRM</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Management System</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 8, padding: '0 8px' }}>NAVIGATION</div>
                {filteredNav.map(item => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '10px 12px',
                                borderRadius: 8,
                                marginBottom: 4,
                                textDecoration: 'none',
                                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                                borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                                fontWeight: active ? 600 : 400,
                                fontSize: 14,
                                transition: 'var(--transition)',
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User profile */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    background: 'var(--bg-hover)',
                    borderRadius: 8,
                    marginBottom: 8,
                }}>
                    <div style={{
                        width: 34, height: 34,
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                        <div style={{ fontSize: 11 }}>
                            <span className={`badge badge-${user?.role?.toLowerCase()}`} style={{ padding: '1px 7px', fontSize: 10 }}>{user?.role}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '9px', background: 'none',
                        border: '1px solid var(--border)', borderRadius: 8,
                        color: 'var(--text-secondary)', cursor: 'pointer',
                        fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'var(--transition)',
                    }}
                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--danger)'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                >
                    🚪 Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
