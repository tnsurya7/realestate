import React from 'react';
import type { Property } from '../types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
    property: Property;
    showActions?: boolean;
    onEdit?: (p: Property) => void;
    onDelete?: (id: number) => void;
}

const typeColors: Record<string, string> = {
    APARTMENT: 'bg-blue-100 text-blue-700',
    VILLA: 'bg-purple-100 text-purple-700',
    COMMERCIAL: 'bg-orange-100 text-orange-700',
    PLOT: 'bg-green-100 text-green-700',
    OFFICE: 'bg-sky-100 text-sky-700',
    WAREHOUSE: 'bg-stone-100 text-stone-700',
};

const BedIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12v4a1 1 0 001 1h16a1 1 0 001-1v-4M3 12V8a2 2 0 012-2h4a2 2 0 012 2v4M3 12h18M13 12V8a2 2 0 012-2h4a2 2 0 012 2v4" />
    </svg>
);

const BathIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5V19a1 1 0 001 1h16a1 1 0 001-1V9.5M3 9.5h18M3 9.5A2.5 2.5 0 015.5 7H7V5a2 2 0 114 0v2h.5" />
    </svg>
);

const AreaIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2M7 3v18M17 3v18M3 7h18M3 17h18" />
    </svg>
);

const PropertyCard: React.FC<PropertyCardProps> = ({ property, showActions, onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(37,99,235,0.12)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card overflow-hidden flex flex-col group cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
                {property.imageUrl ? (
                    <img
                        src={property.imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`badge text-xs font-semibold ${typeColors[property.propertyType] || 'bg-gray-100 text-gray-600'}`}>
                        {property.propertyType}
                    </span>
                    <span className={`badge ${property.status === 'AVAILABLE' ? 'badge-available' : 'badge-sold'}`}>
                        {property.status}
                    </span>
                </div>
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-1">{property.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location}
                </p>

                {(property.bedrooms || property.area) && (
                    <div className="flex gap-3 mb-3 text-xs text-gray-500">
                        {property.bedrooms && (
                            <span className="flex items-center gap-1"><BedIcon />{property.bedrooms} Beds</span>
                        )}
                        {property.bathrooms && (
                            <span className="flex items-center gap-1"><BathIcon />{property.bathrooms} Baths</span>
                        )}
                        {property.area && (
                            <span className="flex items-center gap-1"><AreaIcon />{property.area} sqft</span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div className="text-base font-bold text-blue-600">
                        ₹{Number(property.price).toLocaleString('en-IN')}
                    </div>
                    <div className="flex gap-1.5">
                        {showActions ? (
                            <>
                                <button
                                    onClick={e => { e.stopPropagation(); onEdit?.(property); }}
                                    className="inline-flex items-center gap-1 text-xs btn-secondary px-2.5 py-1.5 rounded-lg"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); onDelete?.(property.id); }}
                                    className="inline-flex items-center gap-1 text-xs btn-danger px-2.5 py-1.5 rounded-lg"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate(`/properties/${property.id}`)}
                                className="btn-primary btn-sm text-xs"
                            >
                                View Details
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;
