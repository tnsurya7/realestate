import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { leadService } from '../../services/leadService';
import { adminService } from '../../services/adminService';
import { propertyService } from '../../services/propertyService';
import type { Lead, LeadStatus, User, Property } from '../../types';
import { EmptyState, Spinner, SkeletonRow } from '../../components/UI';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'CLOSED'];

const AdminLeadsPage: React.FC = () => {
    const { isAdmin } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [agents, setAgents] = useState<User[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [notesModal, setNotesModal] = useState<Lead | null>(null);
    const [assignModal, setAssignModal] = useState<Lead | null>(null);
    const [notes, setNotes] = useState('');
    const [assignAgentId, setAssignAgentId] = useState('');
    const [saving, setSaving] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [form, setForm] = useState({
        customerName: '', customerEmail: '', customerPhone: '',
        budget: '', propertyId: '', assignedAgentId: '',
        status: 'NEW' as LeadStatus, notes: '', source: '',
    });

    const fetch = useCallback(async () => {
        try {
            const leadsData = await (isAdmin ? leadService.getAll() : leadService.getMyLeads());
            setLeads(leadsData);
            if (isAdmin) {
                const [ag, pr] = await Promise.all([adminService.getAgents(), propertyService.getAll()]);
                setAgents(ag);
                setProperties(pr);
            }
        } catch { toast.error('Failed to load leads'); }
        finally { setLoading(false); }
    }, [isAdmin]);

    useEffect(() => { fetch(); }, [fetch]);

    const filtered = leads.filter(l => {
        const matchStatus = !filterStatus || l.status === filterStatus;
        const matchSearch = !search || l.customerName.toLowerCase().includes(search.toLowerCase()) || l.customerEmail.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                budget: form.budget ? parseFloat(form.budget) : undefined,
                propertyId: form.propertyId ? parseInt(form.propertyId) : undefined,
                assignedAgentId: form.assignedAgentId ? parseInt(form.assignedAgentId) : undefined,
            };
            if (editingLead) {
                await leadService.update(editingLead.id, payload as Record<string, unknown>);
                toast.success('Lead updated!');
            } else {
                await leadService.create(payload as Record<string, unknown>);
                toast.success('Lead created!');
            }
            setShowModal(false);
            fetch();
        } catch { toast.error('Failed to save lead'); }
        finally { setSaving(false); }
    };

    const handleStatusChange = async (id: number, status: LeadStatus) => {
        try { await leadService.updateStatus(id, status, !isAdmin); fetch(); toast.success('Status updated!'); }
        catch { toast.error('Failed to update status'); }
    };

    const handleSaveNotes = async () => {
        if (!notesModal) return;
        try { await leadService.addNotes(notesModal.id, notes); toast.success('Notes saved!'); setNotesModal(null); fetch(); }
        catch { toast.error('Failed to save notes'); }
    };

    const handleAssign = async () => {
        if (!assignModal || !assignAgentId) return;
        try { await leadService.assignAgent(assignModal.id, parseInt(assignAgentId)); toast.success('Agent assigned!'); setAssignModal(null); fetch(); }
        catch { toast.error('Failed to assign agent'); }
    };

    const handleDownloadPDF = async () => {
        setDownloadLoading(true);
        try {
            const blob = await adminService.downloadReport();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-report-${new Date().toISOString().split('T')[0]}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Report downloaded!');
        } catch { toast.error('Failed to generate report'); }
        finally { setDownloadLoading(false); }
    };

    const openCreate = () => {
        setForm({ customerName: '', customerEmail: '', customerPhone: '', budget: '', propertyId: '', assignedAgentId: '', status: 'NEW', notes: '', source: '' });
        setEditingLead(null);
        setShowModal(true);
    };

    const openEdit = (lead: Lead) => {
        setForm({
            customerName: lead.customerName, customerEmail: lead.customerEmail, customerPhone: lead.customerPhone,
            budget: lead.budget ? String(lead.budget) : '', propertyId: lead.property ? String(lead.property.id) : '',
            assignedAgentId: lead.assignedAgent ? String(lead.assignedAgent.id) : '',
            status: lead.status, notes: lead.notes || '', source: lead.source || '',
        });
        setEditingLead(lead);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? 'All Leads' : 'My Leads'}</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{filtered.length} leads</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {isAdmin && (
                        <button onClick={handleDownloadPDF} disabled={downloadLoading} className="btn-secondary text-sm">
                            {downloadLoading ? <><Spinner size="w-4 h-4" /> Generating...</> : 'Download PDF'}
                        </button>
                    )}
                    {isAdmin && <button onClick={openCreate} className="btn-primary text-sm">+ New Lead</button>}
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-wrap gap-3">
                <div className="flex-1 min-w-48 relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input className="input-field pl-9" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="input-field w-auto min-w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => { setSearch(''); setFilterStatus(''); }} className="btn-secondary text-sm">Clear</button>
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Contact</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Property</th>
                                {isAdmin && <th className="px-4 py-3 text-left hidden lg:table-cell">Agent</th>}
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Source</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={8}><EmptyState icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} title="No leads found" description="Add a new lead or adjust filters." /></td></tr>
                            ) : (
                                filtered.map(lead => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{lead.customerName}</div>
                                            <div className="text-xs text-gray-400 sm:hidden">{lead.customerPhone}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                                            <div>{lead.customerEmail}</div>
                                            <div className="text-xs text-gray-400">{lead.customerPhone}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{lead.property?.title || '—'}</td>
                                        {isAdmin && <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{lead.assignedAgent?.name || <span className="text-gray-300">Unassigned</span>}</td>}
                                        <td className="px-4 py-3">
                                            <select
                                                value={lead.status}
                                                onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{lead.source || '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                {!isAdmin && (
                                                    <button
                                                        onClick={() => { setNotesModal(lead); setNotes(lead.notes || ''); }}
                                                        className="text-xs btn-secondary btn-sm px-2 py-1"
                                                        title="Add Notes"
                                                    ><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                                )}
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => { setAssignModal(lead); setAssignAgentId(String(lead.assignedAgent?.id || '')); }} className="text-xs btn-secondary btn-sm px-2 py-1" title="Assign Agent"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
                                                        <button onClick={() => openEdit(lead)} className="text-xs btn-secondary btn-sm px-2 py-1" title="Edit Lead"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                                        <button onClick={() => {
                                                            toast((t) => (
                                                                <div>
                                                                    <p className="mb-2">Delete this lead?</p>
                                                                    <div className="flex gap-2">
                                                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => { toast.dismiss(t.id); await leadService.delete(lead.id); fetch(); toast.success('Deleted!'); }}>Yes</button>
                                                                        <button className="bg-gray-200 px-2 py-1 rounded" onClick={() => toast.dismiss(t.id)}>No</button>
                                                                    </div>
                                                                </div>
                                                            ), { duration: 4000 });
                                                        }} className="text-xs btn-danger btn-sm px-2 py-1" title="Delete Lead"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Lead Create/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingLead ? 'Edit Lead' : '+ New Lead'} maxWidth="max-w-2xl">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="label">Full Name *</label><input className="input-field" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} required /></div>
                        <div><label className="label">Email *</label><input type="email" className="input-field" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} required /></div>
                        <div><label className="label">Phone *</label><input className="input-field" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} required /></div>
                        <div><label className="label">Budget (₹)</label><input type="number" className="input-field" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} /></div>
                        <div><label className="label">Property</label>
                            <select className="input-field" value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))}>
                                <option value="">No property</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Assign Agent</label>
                            <select className="input-field" value={form.assignedAgentId} onChange={e => setForm(f => ({ ...f, assignedAgentId: e.target.value }))}>
                                <option value="">Unassigned</option>
                                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Status</label>
                            <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label className="label">Source</label><input className="input-field" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Website, Referral..." /></div>
                    </div>
                    <div><label className="label">Notes</label><textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
                            {saving ? <><Spinner size="w-4 h-4" /> Saving...</> : 'Save Lead'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Notes Modal */}
            <Modal isOpen={!!notesModal} onClose={() => setNotesModal(null)} title={`Add Notes — ${notesModal?.customerName}`}>
                <textarea className="input-field w-full" rows={6} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Write your notes here..." />
                <div className="flex gap-3 mt-4">
                    <button className="btn-secondary flex-1 justify-center" onClick={() => setNotesModal(null)}>Cancel</button>
                    <button className="btn-primary flex-1 justify-center" onClick={handleSaveNotes}>Save Notes</button>
                </div>
            </Modal>

            {/* Assign Modal */}
            <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign Agent — ${assignModal?.customerName}`}>
                <div className="mb-4">
                    <label className="label">Select Agent</label>
                    <select className="input-field" value={assignAgentId} onChange={e => setAssignAgentId(e.target.value)}>
                        <option value="">Unassigned</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex-1 justify-center" onClick={() => setAssignModal(null)}>Cancel</button>
                    <button className="btn-primary flex-1 justify-center" onClick={handleAssign}>Assign</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminLeadsPage;
