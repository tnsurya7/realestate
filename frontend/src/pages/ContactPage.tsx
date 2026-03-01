import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Spinner } from '../components/UI';

const PHONE = '9360004968';
const EMAIL = 'suryakumar56394@gmail.com';
const WA_MSG = 'Hello, I would like to get in touch with RealEstateCrm.';

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setForm({ name: '', email: '', phone: '', message: '' });
        setSubmitting(false);
    };

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
                    <p className="text-gray-500">We'd love to hear from you. Our team will respond within 24 hours.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Form */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Full Name *</label>
                                <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your full name" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Email *</label>
                                    <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Message *</label>
                                <textarea className="input-field" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="Tell us how we can help..." />
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
                                {submitting ? <><Spinner size="w-4 h-4" />Sending...</> : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        Send Message
                                    </span>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Info + Map */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-5">
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-5">Contact Information</h3>
                            <div className="space-y-4">
                                {/* Address */}
                                <a
                                    href="https://maps.google.com/?q=Anna+Nagar,+Chennai"
                                    target="_blank" rel="noreferrer"
                                    className="flex items-start gap-3 group hover:bg-blue-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                >
                                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Address</p>
                                        <p className="text-sm text-gray-500">Anna Nagar, Chennai – 600040, Tamil Nadu</p>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a
                                    href={`tel:+91${PHONE}`}
                                    className="flex items-start gap-3 group hover:bg-blue-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                >
                                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Phone</p>
                                        <p className="text-sm text-blue-600 font-medium">+91 {PHONE}</p>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href={`mailto:${EMAIL}`}
                                    className="flex items-start gap-3 group hover:bg-blue-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                >
                                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Email</p>
                                        <p className="text-sm text-blue-600 font-medium">{EMAIL}</p>
                                    </div>
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/91${PHONE}?text=${encodeURIComponent(WA_MSG)}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-start gap-3 group hover:bg-green-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                >
                                    <div className="w-9 h-9 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">WhatsApp</p>
                                        <p className="text-sm text-green-600 font-medium">Chat with us on WhatsApp</p>
                                    </div>
                                </a>

                                {/* Hours */}
                                <div className="flex items-start gap-3 -mx-2 px-2 py-2">
                                    <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Business Hours</p>
                                        <p className="text-sm text-gray-500">Monday – Saturday, 9 AM – 6 PM IST</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Embedded Map */}
                        <div className="card overflow-hidden">
                            <iframe
                                title="Office Location – Anna Nagar, Chennai"
                                className="w-full h-56"
                                src="https://maps.google.com/maps?q=Anna+Nagar,+Chennai,+Tamil+Nadu&output=embed"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                            <div className="p-3 border-t border-gray-50">
                                <a
                                    href="https://maps.google.com/?q=Anna+Nagar,+Chennai,+Tamil+Nadu"
                                    target="_blank" rel="noreferrer"
                                    className="btn-secondary w-full justify-center text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
