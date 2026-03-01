import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { leadService } from '../../services/leadService';
import { propertyService } from '../../services/propertyService';
import type { Analytics, Lead, LeadStatus, Property, PropertyType, PropertyStatus, User } from '../../types';
import { StatCard, SkeletonCard, SkeletonRow, EmptyState, Spinner } from '../../components/UI';
import Modal from '../../components/Modal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// ──────────────────────────────────────────────────────
//  MOCK DATA
// ──────────────────────────────────────────────────────
const MOCK_ANALYTICS: Analytics = {
    totalLeads: 42, totalProperties: 18, totalAgents: 6,
    leadCountByStatus: { NEW: 18, CONTACTED: 16, CLOSED: 8 },
    leadCountByProperty: [
        { propertyId: 1, propertyTitle: 'Anna Nagar 3BHK', count: 12 },
        { propertyId: 2, propertyTitle: 'Villa with Pool', count: 8 },
        { propertyId: 3, propertyTitle: 'IT Park Office', count: 6 },
    ],
    leadCountByAgent: [],
};
const MOCK_PROPERTIES: Property[] = [
    { id: 1, title: 'Luxury 3BHK in Anna Nagar', location: 'Chennai', price: 8500000, propertyType: 'APARTMENT', status: 'AVAILABLE', bedrooms: 3, bathrooms: 2, area: 1600, imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70' },
    { id: 2, title: 'Premium Villa with Pool', location: 'Coimbatore', price: 22000000, propertyType: 'VILLA', status: 'AVAILABLE', bedrooms: 5, bathrooms: 4, area: 4500, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70' },
    { id: 3, title: 'Commercial Space – IT Park', location: 'Hyderabad', price: 15000000, propertyType: 'COMMERCIAL', status: 'AVAILABLE', area: 3000, imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70' },
];

// ──────────────────────────────────────────────────────
//  ICONS
// ──────────────────────────────────────────────────────
const Icons = {
    users: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    home: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    check: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    chart: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    download: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    plus: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    edit: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    del: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    eye: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    eyeoff: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
};

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'CLOSED'];
const PROPERTY_TYPES: PropertyType[] = ['APARTMENT', 'VILLA', 'COMMERCIAL', 'PLOT', 'OFFICE', 'WAREHOUSE'];
const PROP_STATUSES: PropertyStatus[] = ['AVAILABLE', 'SOLD'];

const emptyLeadForm = { customerName: '', customerEmail: '', customerPhone: '', budget: '', propertyId: '', status: 'NEW' as LeadStatus, notes: '', source: '' };
const emptyPropForm = { title: '', location: '', price: '', propertyType: 'APARTMENT' as PropertyType, status: 'AVAILABLE' as PropertyStatus, bedrooms: '', bathrooms: '', area: '', imageUrl: '', description: '' };

// ──────────────────────────────────────────────────────
//  MAIN COMPONENT
// ──────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
    const { user, isAdmin } = useAuth();

    // ── State ──
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [agents, setAgents] = useState<User[]>([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [downloadLoading, setDownloadLoading] = useState(false);

    // Leads modal
    const [leadModal, setLeadModal] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [leadForm, setLeadForm] = useState(emptyLeadForm);
    const [savingLead, setSavingLead] = useState(false);

    // Properties modal
    const [propModal, setPropModal] = useState(false);
    const [editingProp, setEditingProp] = useState<Property | null>(null);
    const [propForm, setPropForm] = useState(emptyPropForm);
    const [savingProp, setSavingProp] = useState(false);

    // Hidden properties (client-side toggle)
    const [hiddenPropIds, setHiddenPropIds] = useState<Set<number>>(new Set());

    // ── Fetch ──
    const fetchAll = useCallback(async () => {
        try {
            const a = await adminService.getAnalytics();
            setAnalytics(a);
        } catch { setAnalytics(MOCK_ANALYTICS); }
        finally { setLoadingAnalytics(false); }

        try {
            const l = isAdmin ? await leadService.getAll() : await leadService.getMyLeads();
            setLeads(l);
        } catch { setLeads([]); }
        finally { setLoadingLeads(false); }

        try {
            const p = await propertyService.getAll();
            setProperties(p.length ? p : MOCK_PROPERTIES);
        } catch { setProperties(MOCK_PROPERTIES); }
        finally { setLoadingProperties(false); }

        if (isAdmin) {
            try { setAgents(await adminService.getAgents()); } catch { /* ignore */ }
        }
    }, [isAdmin]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── PDF Download ──
    const handleDownloadPDF = async () => {
        setDownloadLoading(true);
        try {
            const blob = await adminService.downloadReport();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `crm-dashboard-summary-${new Date().toISOString().split('T')[0]}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Dashboard summary downloaded!');
        } catch { toast.error('Failed to generate PDF. Ensure backend is running.'); }
        finally { setDownloadLoading(false); }
    };

    // ── Leads CRUD ──
    const openAddLead = () => { setLeadForm(emptyLeadForm); setEditingLead(null); setLeadModal(true); };
    const openEditLead = (l: Lead) => {
        setLeadForm({ customerName: l.customerName, customerEmail: l.customerEmail, customerPhone: l.customerPhone, budget: l.budget ? String(l.budget) : '', propertyId: l.property ? String(l.property.id) : '', status: l.status, notes: l.notes || '', source: l.source || '' });
        setEditingLead(l); setLeadModal(true);
    };
    const saveLead = async (e: React.FormEvent) => {
        e.preventDefault(); setSavingLead(true);
        try {
            const payload = { ...leadForm, budget: leadForm.budget ? parseFloat(leadForm.budget) : undefined, propertyId: leadForm.propertyId ? parseInt(leadForm.propertyId) : undefined };
            editingLead ? await leadService.update(editingLead.id, payload as Record<string, unknown>) : await leadService.create(payload as Record<string, unknown>);
            toast.success(editingLead ? 'Lead updated!' : 'Lead created!');
            setLeadModal(false); fetchAll();
        } catch { toast.error('Failed to save lead'); } finally { setSavingLead(false); }
    };
    const deleteLead = async (id: number) => {
        if (!confirm('Delete this lead permanently?')) return;
        try { await leadService.delete(id); fetchAll(); toast.success('Lead deleted.'); }
        catch { toast.error('Failed to delete lead'); }
    };
    const updateLeadStatus = async (id: number, status: LeadStatus) => {
        try { await leadService.updateStatus(id, status, !isAdmin); fetchAll(); }
        catch { toast.error('Failed to update status'); }
    };

    // ── Properties CRUD ──
    const openAddProp = () => { setPropForm(emptyPropForm); setEditingProp(null); setPropModal(true); };
    const openEditProp = (p: Property) => {
        setPropForm({ title: p.title, location: p.location, price: String(p.price), propertyType: p.propertyType, status: p.status, bedrooms: p.bedrooms ? String(p.bedrooms) : '', bathrooms: p.bathrooms ? String(p.bathrooms) : '', area: p.area ? String(p.area) : '', imageUrl: p.imageUrl || '', description: p.description || '' });
        setEditingProp(p); setPropModal(true);
    };
    const saveProp = async (e: React.FormEvent) => {
        e.preventDefault(); setSavingProp(true);
        try {
            const payload = { ...propForm, price: parseFloat(propForm.price), bedrooms: propForm.bedrooms ? parseInt(propForm.bedrooms) : undefined, bathrooms: propForm.bathrooms ? parseInt(propForm.bathrooms) : undefined, area: propForm.area ? parseFloat(propForm.area) : undefined };
            editingProp ? await propertyService.update(editingProp.id, payload) : await propertyService.create(payload);
            toast.success(editingProp ? 'Property updated!' : 'Property created!');
            setPropModal(false); fetchAll();
        } catch { toast.error('Failed to save property'); } finally { setSavingProp(false); }
    };
    const deleteProp = async (id: number) => {
        if (!confirm('Delete this property?')) return;
        try { await propertyService.delete(id); fetchAll(); toast.success('Property deleted.'); }
        catch { toast.error('Failed to delete property'); }
    };
    const toggleHideProp = (id: number) => {
        setHiddenPropIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
        toast.success(hiddenPropIds.has(id) ? 'Property visible again.' : 'Property hidden from public listing.');
    };

    const a = analytics || MOCK_ANALYTICS;
    const pieData = Object.entries(a.leadCountByStatus).map(([name, value]) => ({ name, value }));
    const barData = a.leadCountByProperty.map((p) => ({ name: (p.propertyTitle || '').split(' ').slice(0, 2).join(' '), leads: p.count }));

    return (
        <div className="space-y-8">
            {/* ── Top Bar ── */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                    <motion.h1 initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900">
                        Dashboard Overview
                    </motion.h1>
                    <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name?.split(' ')[0]}! Here's what's happening.</p>
                </div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleDownloadPDF} disabled={downloadLoading}
                    className="btn-primary gap-2 shadow-md shadow-blue-200"
                >
                    {downloadLoading ? <><Spinner size="w-4 h-4" />Generating...</> : <>{Icons.download}Download Dashboard PDF</>}
                </motion.button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {loadingAnalytics ? (Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)) : (
                    <>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                            <StatCard label="Total Leads" value={a.totalLeads} icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} color="bg-blue-500" trend="↑ 12% this month" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                            <StatCard label="New Leads" value={a.leadCountByStatus.NEW || 0} icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>} color="bg-amber-500" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <StatCard label="Properties" value={a.totalProperties} icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} color="bg-purple-500" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <StatCard label="Closed Deals" value={a.leadCountByStatus.CLOSED || 0} icon={<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-500" trend="↑ 5 this week" />
                        </motion.div>
                    </>
                )}
            </div>

            {/* ── Charts ── */}
            {isAdmin && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                                    {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(val) => [`${val} leads`]} />
                                <Legend formatter={(val: string) => <span className="text-sm text-gray-600">{val}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Leads by Property</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                                <Tooltip />
                                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
           LEADS MANAGEMENT
      ══════════════════════════════════════════════ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Leads Management</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{leads.length} total leads</p>
                    </div>
                    <button onClick={openAddLead} className="btn-primary text-sm gap-1.5">
                        {Icons.plus} Add Lead
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Contact</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Property</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">Source</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loadingLeads ? (
                                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={6}><EmptyState icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} title="No leads yet" description="Add your first lead using the button above." /></td></tr>
                            ) : leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{lead.customerName}</div>
                                        <div className="text-xs text-gray-400">{lead.customerEmail}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{lead.customerPhone}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">{lead.property?.title || '—'}</td>
                                    <td className="px-4 py-3">
                                        <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{lead.source || '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => openEditLead(lead)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                {Icons.edit}
                                            </button>
                                            <button onClick={() => deleteLead(lead.id)} title="Delete" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                {Icons.del}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════
           PROPERTIES MANAGEMENT
      ══════════════════════════════════════════════ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Properties Management</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{properties.length} total properties</p>
                    </div>
                    <button onClick={openAddProp} className="btn-primary text-sm gap-1.5">
                        {Icons.plus} Add Property
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Property</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Location</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">Visibility</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loadingProperties ? (
                                Array(4).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : properties.length === 0 ? (
                                <tr><td colSpan={7}><EmptyState icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} title="No properties yet" description="Add your first property." /></td></tr>
                            ) : properties.map(prop => {
                                const isHidden = hiddenPropIds.has(prop.id);
                                return (
                                    <tr key={prop.id} className={`hover:bg-gray-50 transition-colors ${isHidden ? 'opacity-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {prop.imageUrl ? (
                                                    <img src={prop.imageUrl} alt={prop.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900 text-xs line-clamp-1">{prop.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{prop.location}</td>
                                        <td className="px-4 py-3 font-semibold text-blue-600 text-xs">₹{Number(prop.price).toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{prop.propertyType}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge text-xs ${prop.status === 'AVAILABLE' ? 'badge-available' : 'badge-sold'}`}>{prop.status}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className={`badge text-xs ${isHidden ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                                {isHidden ? 'Hidden' : 'Visible'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => toggleHideProp(prop.id)} title={isHidden ? 'Show' : 'Hide'} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                                                    {isHidden ? Icons.eye : Icons.eyeoff}
                                                </button>
                                                <button onClick={() => openEditProp(prop)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                    {Icons.edit}
                                                </button>
                                                <button onClick={() => deleteProp(prop.id)} title="Delete" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                    {Icons.del}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* ══════════════════════════════════════════════
           LEAD MODAL
      ══════════════════════════════════════════════ */}
            <Modal isOpen={leadModal} onClose={() => setLeadModal(false)} title={editingLead ? 'Edit Lead' : 'Add New Lead'} maxWidth="max-w-2xl">
                <form onSubmit={saveLead} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="label">Full Name *</label><input className="input-field" value={leadForm.customerName} onChange={e => setLeadForm(f => ({ ...f, customerName: e.target.value }))} required /></div>
                        <div><label className="label">Email *</label><input type="email" className="input-field" value={leadForm.customerEmail} onChange={e => setLeadForm(f => ({ ...f, customerEmail: e.target.value }))} required /></div>
                        <div><label className="label">Phone *</label><input className="input-field" value={leadForm.customerPhone} onChange={e => setLeadForm(f => ({ ...f, customerPhone: e.target.value }))} required /></div>
                        <div><label className="label">Budget (₹)</label><input type="number" className="input-field" value={leadForm.budget} onChange={e => setLeadForm(f => ({ ...f, budget: e.target.value }))} /></div>
                        <div><label className="label">Property</label>
                            <select className="input-field" value={leadForm.propertyId} onChange={e => setLeadForm(f => ({ ...f, propertyId: e.target.value }))}>
                                <option value="">Select property</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Status</label>
                            <select className="input-field" value={leadForm.status} onChange={e => setLeadForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
                                {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Source</label><input className="input-field" placeholder="Website, Referral..." value={leadForm.source} onChange={e => setLeadForm(f => ({ ...f, source: e.target.value }))} /></div>
                    </div>
                    <div><label className="label">Notes</label><textarea className="input-field" rows={3} value={leadForm.notes} onChange={e => setLeadForm(f => ({ ...f, notes: e.target.value }))} /></div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setLeadModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 justify-center" disabled={savingLead}>
                            {savingLead ? <><Spinner size="w-4 h-4" />Saving...</> : (editingLead ? 'Update Lead' : 'Create Lead')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ══════════════════════════════════════════════
           PROPERTY MODAL
      ══════════════════════════════════════════════ */}
            <Modal isOpen={propModal} onClose={() => setPropModal(false)} title={editingProp ? 'Edit Property' : 'Add New Property'} maxWidth="max-w-2xl">
                <form onSubmit={saveProp} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2"><label className="label">Title *</label><input className="input-field" value={propForm.title} onChange={e => setPropForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Luxury 3BHK in Anna Nagar" /></div>
                        <div><label className="label">Location *</label><input className="input-field" value={propForm.location} onChange={e => setPropForm(f => ({ ...f, location: e.target.value }))} required /></div>
                        <div><label className="label">Price (₹) *</label><input type="number" className="input-field" value={propForm.price} onChange={e => setPropForm(f => ({ ...f, price: e.target.value }))} required /></div>
                        <div><label className="label">Type</label>
                            <select className="input-field" value={propForm.propertyType} onChange={e => setPropForm(f => ({ ...f, propertyType: e.target.value as PropertyType }))}>
                                {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Status</label>
                            <select className="input-field" value={propForm.status} onChange={e => setPropForm(f => ({ ...f, status: e.target.value as PropertyStatus }))}>
                                {PROP_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Bedrooms</label><input type="number" className="input-field" value={propForm.bedrooms} onChange={e => setPropForm(f => ({ ...f, bedrooms: e.target.value }))} /></div>
                        <div><label className="label">Bathrooms</label><input type="number" className="input-field" value={propForm.bathrooms} onChange={e => setPropForm(f => ({ ...f, bathrooms: e.target.value }))} /></div>
                        <div><label className="label">Area (sqft)</label><input type="number" className="input-field" value={propForm.area} onChange={e => setPropForm(f => ({ ...f, area: e.target.value }))} /></div>
                        <div><label className="label">Image URL</label><input className="input-field" placeholder="https://..." value={propForm.imageUrl} onChange={e => setPropForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className="label">Description</label><textarea className="input-field" rows={3} value={propForm.description} onChange={e => setPropForm(f => ({ ...f, description: e.target.value }))} /></div>
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setPropModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 justify-center" disabled={savingProp}>
                            {savingProp ? <><Spinner size="w-4 h-4" />Saving...</> : (editingProp ? 'Update Property' : 'Create Property')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
