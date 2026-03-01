import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import type { Property, PropertyType } from '../types';
import { SkeletonCard, EmptyState } from '../components/UI';
import { motion } from 'framer-motion';

const TYPES: PropertyType[] = ['APARTMENT', 'VILLA', 'COMMERCIAL', 'PLOT', 'OFFICE', 'WAREHOUSE'];

const MOCK: Property[] = [
    { id: 1, title: 'Luxury 3BHK in Anna Nagar', location: 'Chennai', price: 8500000, propertyType: 'APARTMENT', status: 'AVAILABLE', bedrooms: 3, bathrooms: 2, area: 1600, imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
    { id: 2, title: 'Premium Villa with Pool', location: 'Coimbatore', price: 22000000, propertyType: 'VILLA', status: 'AVAILABLE', bedrooms: 5, bathrooms: 4, area: 4500, imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80' },
    { id: 3, title: 'Commercial Space – IT Park', location: 'Hyderabad', price: 15000000, propertyType: 'COMMERCIAL', status: 'AVAILABLE', area: 3000, imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80' },
    { id: 4, title: 'Studio Apartment – City Centre', location: 'Bengaluru', price: 4500000, propertyType: 'APARTMENT', status: 'AVAILABLE', bedrooms: 1, bathrooms: 1, area: 650, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
    { id: 5, title: 'Farm House Retreat', location: 'Mysore', price: 11000000, propertyType: 'VILLA', status: 'SOLD', bedrooms: 4, bathrooms: 3, area: 8000, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
    { id: 6, title: 'Office Space – Premier Zone', location: 'Mumbai', price: 35000000, propertyType: 'OFFICE', status: 'AVAILABLE', area: 5000, imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
];

const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        propertyService.getPublic()
            .then(setProperties)
            .catch(() => setProperties(MOCK))
            .finally(() => setLoading(false));
    }, []);

    const filtered = properties.filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !search || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
        const matchType = !filterType || p.propertyType === filterType;
        const matchStatus = !filterStatus || p.status === filterStatus;
        const matchPrice = !maxPrice || p.price <= Number(maxPrice);
        return matchSearch && matchType && matchStatus && matchPrice;
    });

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Properties</h1>
                    <p className="text-gray-500">{filtered.length} properties found</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="card p-4 mb-8 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-48">
                        <label className="label">Search</label>
                        <div className="relative">
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input className="input-field pl-9" placeholder="City, area, title..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="min-w-40">
                        <label className="label">Type</label>
                        <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option value="">All Types</option>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="min-w-36">
                        <label className="label">Status</label>
                        <select className="input-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="AVAILABLE">Available</option>
                            <option value="SOLD">Sold</option>
                        </select>
                    </div>
                    <div className="min-w-48">
                        <label className="label">Max Price (₹)</label>
                        <input type="number" className="input-field" placeholder="e.g. 10000000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                    </div>
                    <button
                        onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); setMaxPrice(''); }}
                        className="btn-secondary text-sm"
                    >
                        Clear
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} title="No properties found" description="Try adjusting your filters to see more results." />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        {filtered.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <PropertyCard property={p} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PropertiesPage;
