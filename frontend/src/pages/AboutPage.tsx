import React from 'react';
import { motion } from 'framer-motion';

const PHONE = '9360004968';
const EMAIL = 'suryakumar56394@gmail.com';

const TEAM = [
    {
        name: 'Surya Kumar',
        role: 'CEO & Founder',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        bio: 'Visionary entrepreneur with 10+ years in real estate and technology.',
    },
    {
        name: 'Priya Sharma',
        role: 'Head of Operations',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
        bio: 'Operations expert ensuring seamless experiences for clients and agents.',
    },
    {
        name: 'Arun Patel',
        role: 'Lead Agent',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        bio: 'Top-performing agent with 500+ successful property deals across India.',
    },
    {
        name: 'Sunita Nair',
        role: 'Marketing Head',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        bio: 'Creative strategist driving brand growth and digital outreach.',
    },
];

const AboutPage: React.FC = () => (
    <div className="pt-16 min-h-screen">
        {/* ── HERO ── */}
        <div className="relative min-h-[400px] flex items-center overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
                alt="About RealEstateCrm"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 to-slate-900/60" />
            <div className="relative max-w-4xl mx-auto px-4 py-20 text-center w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="inline-block badge bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-5">Since 2015</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About RealEstateCrm</h1>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        We are India's fastest-growing real estate CRM platform, connecting buyers, sellers, and agents through technology and trust.
                    </p>
                </motion.div>
            </div>
        </div>

        {/* ── STATS ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[['10,000+', 'Properties Listed'], ['500+', 'Verified Agents'], ['25,000+', 'Happy Clients'], ['₹500Cr+', 'Deals Closed']].map(([val, label]) => (
                    <motion.div key={label} className="card p-6 text-center shadow-md" whileHover={{ y: -4 }}>
                        <div className="text-2xl font-bold text-blue-600 mb-1">{val}</div>
                        <div className="text-sm text-gray-500">{label}</div>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* ── MISSION ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        At RealEstateCrm, we believe everyone deserves a home that matches their dream. Our mission is to simplify real estate through technology, transparency, and trust.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        We combine advanced CRM tools with a human-first approach to deliver exceptional experiences for buyers, sellers, and agents alike.
                    </p>
                    <div className="space-y-3">
                        {['Verified listings with accurate details', 'Expert agents across 50+ cities', 'End-to-end secured transactions'].map(pt => (
                            <div key={pt} className="flex items-center gap-2 text-sm text-gray-700">
                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {pt}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-72">
                    <img
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                        alt="Our mission"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* ── CONTACT STRIP ── */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-16 flex flex-wrap gap-4 items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Get in touch with us</h3>
                    <p className="text-sm text-gray-500">Anna Nagar, Chennai – 600040</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href={`tel:+91${PHONE}`} className="btn-primary text-sm gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        +91 {PHONE}
                    </a>
                    <a href={`mailto:${EMAIL}`} className="btn-secondary text-sm gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {EMAIL}
                    </a>
                </div>
            </div>

            {/* ── TEAM ── */}
            <div>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
                    <p className="text-gray-500 mt-2 text-sm">The people who make RealEstateCrm great</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TEAM.map((m, i) => (
                        <motion.div
                            key={m.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="card overflow-hidden text-center group"
                        >
                            <div className="h-52 overflow-hidden">
                                <img
                                    src={m.image}
                                    alt={m.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-900">{m.name}</h3>
                                <p className="text-xs text-blue-600 font-medium mt-0.5 mb-2">{m.role}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default AboutPage;
