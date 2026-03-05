import React, { useEffect, useState, useCallback } from 'react';
import { propertyService } from '../../services/propertyService';
import type { Property, PropertyType, PropertyStatus } from '../../types';
import PropertyCard from '../../components/PropertyCard';
import Modal from '../../components/Modal';
import { EmptyState, SkeletonCard, Spinner } from '../../components/UI';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PROPERTY_TYPES: PropertyType[] = ['APARTMENT', 'VILLA', 'COMMERCIAL', 'PLOT', 'OFFICE', 'WAREHOUSE'];
const STATUSES: PropertyStatus[] = ['AVAILABLE', 'SOLD'];

const emptyForm = {
    title: '', location: '', price: '', propertyType: 'APARTMENT' as PropertyType,
    status: 'AVAILABLE' as PropertyStatus, description: '', bedrooms: '', bathrooms: '', area: '', imageUrl: '',
};

const AdminPropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Property | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const fetch = useCallback(async () => {
        try {
            const data = await propertyService.getAll();
            setProperties(data);
        }
        catch { setProperties([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const filtered = properties.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));

    const openCreate = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
    const openEdit = (p: Property) => {
        setForm({ title: p.title, location: p.location, price: String(p.price), propertyType: p.propertyType, status: p.status, description: p.description || '', bedrooms: p.bedrooms ? String(p.bedrooms) : '', bathrooms: p.bathrooms ? String(p.bathrooms) : '', area: p.area ? String(p.area) : '', imageUrl: p.imageUrl || '' });
        setEditing(p);
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, price: parseFloat(form.price), bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined, bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined, area: form.area ? parseFloat(form.area) : undefined };
            if (editing) {
                await propertyService.update(editing.id, payload);
            } else {
                await propertyService.create(payload);
            }
            toast.success(editing ? 'Property updated!' : 'Property created!');
            setShowModal(false);
            fetch();
        } catch { toast.error('Failed to save property'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this property?')) return;
        try { await propertyService.delete(id); fetch(); toast.success('Property deleted!'); }
        catch { toast.error('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                    <p className="text-gray-500 text-sm mt-0.5">{filtered.length} total</p>
                </div>
                <button onClick={openCreate} className="btn-primary text-sm">+ Add Property</button>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-48 relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input className="input-field pl-9" placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="ml-auto flex border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-sm transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>⊞ Grid</button>
                    <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>☰ List</button>
                </div>
            </div>

            {loading ? (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} title="No properties yet" description="Add your first property to get started." />
            ) : view === 'grid' ? (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {filtered.map(p => (
                        <PropertyCard key={p.id} property={p} showActions onEdit={openEdit} onDelete={handleDelete} />
                    ))}
                </motion.div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Location</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.location}</td>
                                    <td className="px-4 py-3 font-semibold text-blue-600">₹{Number(p.price).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.propertyType}</td>
                                    <td className="px-4 py-3"><span className={`badge ${p.status === 'AVAILABLE' ? 'badge-available' : 'badge-sold'}`}>{p.status}</span></td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openEdit(p)} className="btn-secondary btn-sm text-xs mr-2">Edit</button>
                                        <button onClick={() => {
                                            toast((t) => (
                                                <div>
                                                    <p className="mb-2">Delete this property?</p>
                                                    <div className="flex gap-2">
                                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => { toast.dismiss(t.id); try { await propertyService.delete(p.id); fetch(); toast.success('Property deleted!'); } catch { toast.error('Failed to delete'); } }}>Yes</button>
                                                        <button className="bg-gray-200 px-2 py-1 rounded" onClick={() => toast.dismiss(t.id)}>No</button>
                                                    </div>
                                                </div>
                                            ), { duration: 4000 });
                                        }} className="btn-danger btn-sm text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Property' : 'New Property'} maxWidth="max-w-2xl">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2"><label className="label">Title *</label><input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Luxury 3BHK in Anna Nagar" /></div>
                        <div><label className="label">Location *</label><input className="input-field" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required placeholder="City, Area" /></div>
                        <div><label className="label">Price (₹) *</label><input type="number" className="input-field" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="8500000" /></div>
                        <div><label className="label">Type *</label><select className="input-field" value={form.propertyType} onChange={e => setForm(f => ({ ...f, propertyType: e.target.value as PropertyType }))}>{PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div><label className="label">Status *</label><select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PropertyStatus }))}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label className="label">Bedrooms</label><input type="number" className="input-field" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} placeholder="3" /></div>
                        <div><label className="label">Bathrooms</label><input type="number" className="input-field" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} placeholder="2" /></div>
                        <div><label className="label">Area (sqft)</label><input type="number" className="input-field" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="1600" /></div>
                        <div><label className="label">Image URL</label><input className="input-field" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></div>
                        <div className="sm:col-span-2"><label className="label">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
                            {saving ? <><Spinner size="w-4 h-4" /> Saving...</> : 'Save Property'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminPropertiesPage;
