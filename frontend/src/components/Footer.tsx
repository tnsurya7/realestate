import React from 'react';
import { Link } from 'react-router-dom';

const PHONE = import.meta.env.VITE_CONTACT_PHONE || '9360004968';
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'suryakumar56394@gmail.com';

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">RealEstate<span className="text-blue-400">Crm</span></span>
                    </div>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                        India's trusted real estate CRM platform. Discover premium properties and connect with expert agents.
                    </p>
                    <div className="flex gap-4 mt-4">
                        {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(s => (
                            <a key={s} href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">{s}</a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        {[{ label: 'Home', path: '/' }, { label: 'Properties', path: '/properties' }, { label: 'About', path: '/about' }, { label: 'Contact', path: '/contact' }].map(l => (
                            <li key={l.path}>
                                <Link to={l.path} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Contact</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li>
                            <a 
                                href="https://maps.google.com/?q=Anna+Nagar,+Chennai" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-start gap-2 hover:text-blue-400 transition-colors group"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Anna Nagar, Chennai – 600040</span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href={`tel:+91${PHONE}`} 
                                className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+91 {PHONE}</span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href={`mailto:${EMAIL}`} 
                                className="flex items-center gap-2 hover:text-blue-400 transition-colors group"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{EMAIL}</span>
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Mon–Sat: 9 AM – 6 PM</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <span>© 2025 RealEstateCrm. All rights reserved.</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
