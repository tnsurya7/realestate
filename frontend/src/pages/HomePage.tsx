import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import type { Property } from '../types';
import { propertyService } from '../services/propertyService';
import { SkeletonCard } from '../components/UI';

// Fallback mock data with real Unsplash images
const MOCK_PROPERTIES: Property[] = [
    {
        id: 1, title: 'Luxury 3BHK in Anna Nagar', location: 'Chennai', price: 8500000,
        propertyType: 'APARTMENT', status: 'AVAILABLE', bedrooms: 3, bathrooms: 2, area: 1600,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    },
    {
        id: 2, title: 'Premium Villa with Pool', location: 'Coimbatore', price: 22000000,
        propertyType: 'VILLA', status: 'AVAILABLE', bedrooms: 5, bathrooms: 4, area: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    },
    {
        id: 3, title: 'Commercial Space – IT Park', location: 'Hyderabad', price: 15000000,
        propertyType: 'COMMERCIAL', status: 'AVAILABLE', area: 3000,
        imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    },
];

const WHY_FEATURES = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: 'Trusted Agents', desc: '500+ verified real estate professionals nationwide.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        title: 'Secure Transactions', desc: 'End-to-end encrypted process with legal compliance.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Smart Analytics', desc: 'Data-driven insights to help you make better decisions.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        title: '24/7 Support', desc: 'Round-the-clock assistance from our expert team.',
    },
];

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
            {children}
        </motion.div>
    );
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        propertyService.getPublic()
            .then(setProperties)
            .catch(() => setProperties(MOCK_PROPERTIES))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/properties?q=${encodeURIComponent(searchQuery)}`);
    };

    const displayProperties = properties.length ? properties.slice(0, 6) : MOCK_PROPERTIES;

    return (
        <div className="pt-16">
            {/* ── HERO ── */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden">
                {/* Background photo */}
                <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=85"
                    alt="Luxury real estate"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
                {/* Blue tint top */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                    <div className="max-w-2xl">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            <span className="inline-flex items-center gap-2 text-blue-300 text-sm font-semibold mb-5 bg-blue-500/15 border border-blue-400/20 px-4 py-1.5 rounded-full">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                #1 Real Estate Platform in India
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                                Find Your Perfect
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mt-1">Dream Home</span>
                            </h1>
                            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                Discover premium properties across India with our intelligent CRM platform. Connect with top agents and close deals faster.
                            </p>
                        </motion.div>

                        {/* Search */}
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 max-w-xl"
                        >
                            <div className="flex-1 flex items-center gap-2 px-3">
                                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by city, area, property type..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm outline-none py-2"
                                />
                            </div>
                            <button type="submit" className="btn-primary rounded-xl text-sm px-5">
                                Search
                            </button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                            className="flex gap-10 mt-10"
                        >
                            {[['10K+', 'Properties'], ['500+', 'Verified Agents'], ['₹500Cr+', 'Deals Closed']].map(([val, label]) => (
                                <div key={label} className="text-center">
                                    <div className="text-2xl font-extrabold text-white">{val}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FEATURED PROPERTIES ── */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
                            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Hand-picked listings from our top agents across India's prime locations</p>
                        </div>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {loading
                            ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                            : displayProperties.map((p, i) => (
                                <FadeIn key={p.id} delay={i * 0.08}>
                                    <PropertyCard property={p} />
                                </FadeIn>
                            ))
                        }
                    </div>
                    <div className="text-center">
                        <button onClick={() => navigate('/properties')} className="btn-outline">
                            View All Properties
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ── */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl font-bold text-gray-900">Why Choose RealEstateCrm?</h2>
                            <p className="text-gray-500 mt-3">Built for modern buyers, sellers, and agents</p>
                        </div>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {WHY_FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 0.1}>
                                <div className="card p-6 text-center hover:border-blue-200 transition-all group">
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PHOTO SPLIT SECTION ── */}
            <section className="py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                    <div className="relative overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80"
                            alt="Modern apartment interior"
                            className="w-full h-full object-cover min-h-64"
                        />
                        <div className="absolute inset-0 bg-blue-900/30" />
                    </div>
                    <div className="bg-blue-600 flex items-center px-10 py-16">
                        <FadeIn>
                            <div className="text-white max-w-md">
                                <svg className="w-10 h-10 text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <h2 className="text-3xl font-bold mb-4">Your Home Journey Starts Here</h2>
                                <p className="text-blue-100 leading-relaxed mb-6">
                                    From searching to closing, our platform guides you through every step. Our expert agents are ready to help you find the perfect match.
                                </p>
                                <button onClick={() => navigate('/contact')} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2.5 rounded-xl transition-colors">
                                    Talk to an Agent
                                </button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
                        <p className="text-gray-400 mb-8">Join thousands of happy homeowners who found their perfect match.</p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button onClick={() => navigate('/properties')} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/30">
                                Browse Properties
                            </button>
                            <button onClick={() => navigate('/contact')} className="border border-gray-600 text-gray-300 hover:bg-white/5 font-semibold px-8 py-3 rounded-xl transition-colors">
                                Contact Us
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
