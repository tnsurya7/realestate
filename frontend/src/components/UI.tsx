import React from 'react';

// Loading skeleton
export const SkeletonCard: React.FC = () => (
    <div className="card p-4 animate-pulse">
        <div className="h-44 bg-gray-200 rounded-lg mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
);

export const SkeletonRow: React.FC = () => (
    <tr className="animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
            <td key={i} className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded" />
            </td>
        ))}
    </tr>
);

// Spinner
export const Spinner: React.FC<{ size?: string }> = ({ size = 'w-5 h-5' }) => (
    <svg className={`${size} animate-spin text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

// Empty state
export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; description?: string }> = ({
    icon, title, description
}) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        {icon && <div className="text-blue-300 mb-4">{icon}</div>}
        <h3 className="text-gray-700 font-semibold text-lg mb-1">{title}</h3>
        {description && <p className="text-gray-400 text-sm max-w-xs">{description}</p>}
    </div>
);

// Status badge
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const map: Record<string, string> = {
        NEW: 'badge-new',
        CONTACTED: 'badge-contacted',
        CLOSED: 'badge-closed',
        AVAILABLE: 'badge-available',
        SOLD: 'badge-sold',
        ADMIN: 'badge-admin',
        AGENT: 'badge-agent',
    };
    return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

// Stat card
export const StatCard: React.FC<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color?: string;
    trend?: string;
}> = ({ label, value, icon, color = 'bg-blue-500', trend }) => (
    <div className="card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
            </div>
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
        </div>
    </div>
);

// Section header
export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
    title, subtitle, action
}) => (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle text-sm">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);
