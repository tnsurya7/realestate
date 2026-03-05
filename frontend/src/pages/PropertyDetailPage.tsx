import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import { leadService } from '../services/leadService';
import toast from 'react-hot-toast';
import { Spinner } from '../components/UI';
import type { Property } from '../types';
import api from '../services/api';
import type { ApiResponse } from '../types';

const PHONE = '9360004968';
const WA_MSG = 'Hello, I am interested in a property from RealEstateCrm.';

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<(Property & { description?: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [interestModal, setInterestModal] = useState(false);
    const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', budget: '', source: 'Website' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        api.get<ApiResponse<Property>>(`/properties/${id}`)
            .then(res => setProperty(res.data.data))
            .catch(() => setProperty(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner size="w-8 h-8" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                    <p className="text-gray-500">The property you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const p = property;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await leadService.create({ ...form, propertyId: p.id, budget: Number(form.budget) });
            toast.success('Thank you! An agent will contact you shortly.');
            setInterestModal(false);
            setForm({ customerName: '', customerEmail: '', customerPhone: '', budget: '', source: 'Website' });
        } catch { toast.error('Failed to submit. Please try again.'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            {/* Hero Image */}
            <div className="h-72 sm:h-[420px] relative overflow-hidden bg-blue-50">
                {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"; }} />
                ) : (
                    <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200" alt="Fallback" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge badge-available">{p.status}</span>
                    <span className="badge bg-blue-100 text-blue-700">{p.propertyType}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-2xl sm:text-3xl font-bold drop-shadow">{p.title}</h1>
                    <p className="flex items-center gap-1 text-white/80 text-sm mt-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {p.location}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                            <div className="flex flex-wrap gap-3 mb-5">
                                {p.bedrooms && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12v4a1 1 0 001 1h16a1 1 0 001-1v-4M3 12V8a2 2 0 012-2h4a2 2 0 012 2v4M3 12h18" /></svg>
                                        {p.bedrooms} Bedrooms
                                    </div>
                                )}
                                {p.bathrooms && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5V19a1 1 0 001 1h16a1 1 0 001-1V9.5M3 9.5h18" /></svg>
                                        {p.bathrooms} Bathrooms
                                    </div>
                                )}
                                {p.area && (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2" /></svg>
                                        {p.area} sqft
                                    </div>
                                )}
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2">About this property</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{(p as { description?: string }).description || 'A premium property in a prime location with excellent amenities and connectivity.'}</p>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['24/7 Security', 'Power Backup', 'Parking', 'Gym', 'Swimming Pool', 'Club House', 'CCTV Surveillance', 'Maintenance Staff'].map(a => (
                                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {a}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Map embed */}
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card overflow-hidden">
                            <iframe
                                title="Location Map"
                                className="w-full h-56"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(p.location)}&output=embed`}
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                            <div className="p-3 flex justify-end border-t border-gray-50">
                                <a href={`https://maps.google.com/?q=${encodeURIComponent(p.location)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Open in Google Maps
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Price & CTA Sidebar */}
                    <div>
                        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card p-6 sticky top-20">
                            <div className="mb-5">
                                <p className="text-xs text-gray-500 mb-0.5">Listed Price</p>
                                <p className="text-3xl font-extrabold text-blue-600">₹{Number(p.price).toLocaleString('en-IN')}</p>
                                {p.area && <p className="text-xs text-gray-400 mt-1">₹{Math.round(p.price / p.area!).toLocaleString('en-IN')} / sqft</p>}
                            </div>

                            <button onClick={() => setInterestModal(true)} className="btn-primary w-full justify-center mb-3">
                                I'm Interested
                            </button>
                            <a href={`tel:+91${PHONE}`} className="btn-secondary w-full justify-center text-sm mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                Call Agent
                            </a>
                            <a href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(WA_MSG + ' ' + p.title)}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                WhatsApp Agent
                            </a>

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Typically responds within 2 hours
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    Verified listing
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Interest Modal */}
            <Modal isOpen={interestModal} onClose={() => setInterestModal(false)} title="I'm Interested in this Property">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="label">Full Name *</label><input className="input-field" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} required placeholder="Your name" /></div>
                    <div><label className="label">Email *</label><input type="email" className="input-field" value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} required placeholder="your@email.com" /></div>
                    <div><label className="label">Phone *</label><input className="input-field" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} required placeholder="+91 XXXXX XXXXX" /></div>
                    <div><label className="label">Your Budget (₹)</label><input type="number" className="input-field" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. 9000000" /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setInterestModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary flex-1 justify-center" disabled={submitting}>
                            {submitting ? <><Spinner size="w-4 h-4" />Sending...</> : 'Submit Interest'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PropertyDetailPage;
