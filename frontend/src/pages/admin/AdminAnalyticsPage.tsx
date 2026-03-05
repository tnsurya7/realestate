import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { Analytics } from '../../types';
import { Spinner } from '../../components/UI';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';


const EMPTY_ANALYTICS: Analytics = {
    totalLeads: 0, totalProperties: 0, totalAgents: 0,
    leadCountByStatus: {},
    leadCountByProperty: [],
    leadCountByAgent: [],
};

const MONTHLY = [
    { month: 'Oct', leads: 6 }, { month: 'Nov', leads: 9 }, { month: 'Dec', leads: 7 },
    { month: 'Jan', leads: 12 }, { month: 'Feb', leads: 18 }, { month: 'Mar', leads: 15 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f87171'];

const AdminAnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getAnalytics().then(setAnalytics).catch(() => setAnalytics(null)).finally(() => setLoading(false));
    }, []);

    const a = analytics || EMPTY_ANALYTICS;
    const pieData = Object.entries(a.leadCountByStatus).map(([name, value]) => ({ name, value }));
    const agentData = a.leadCountByAgent.map(ag => ({ name: ag.agentName.split(' ')[0], leads: ag.count }));
    const propData = a.leadCountByProperty.map(p => ({ name: p.propertyTitle.split(' ').slice(0, 2).join(' '), leads: p.count }));

    if (loading) return (
        <div className="h-64 flex items-center justify-center"><Spinner size="w-8 h-8" /></div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 text-sm mt-0.5">Performance insights and data overview</p>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    ['Total Leads', a.totalLeads, <svg key="1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, 'bg-blue-500'],
                    ['New Leads', a.leadCountByStatus.NEW || 0, <svg key="2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>, 'bg-amber-500'],
                    ['Closed', a.leadCountByStatus.CLOSED || 0, <svg key="3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>, 'bg-green-500'],
                    ['Agents', a.totalAgents, <svg key="4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, 'bg-purple-500']
                ].map(([label, val, icon, color], i) => (
                    <motion.div key={String(label)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
                        <div className="flex items-start justify-between">
                            <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{val}</p></div>
                            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg`}>{icon}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3} label={({ name, percent }) => `${name} (${Math.round((percent ?? 0) * 100)}%)`}>
                                {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Monthly Lead Trend</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={MONTHLY} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Leads by Agent</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={agentData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <Tooltip />
                            <Bar dataKey="leads" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Leads by Property</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={propData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <Tooltip />
                            <Bar dataKey="leads" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
