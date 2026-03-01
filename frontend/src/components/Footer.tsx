import React from 'react';
import { Link } from 'react-router-dom';

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
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>📍 Anna Nagar, Chennai – 600040</li>
                        <li>📞 +91 9360004968</li>
                        <li>✉️ suryakumar56394@gmail.com</li>
                        <li>🕒 Mon–Sat: 9 AM – 6 PM</li>
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
