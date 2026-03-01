// Domain types
export type Role = 'ADMIN' | 'AGENT';
export type PropertyType = 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'PLOT' | 'OFFICE' | 'WAREHOUSE';
export type PropertyStatus = 'AVAILABLE' | 'SOLD';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

export interface LoginResponse {
    token: string;
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    accountLocked?: boolean;
    failedAttempts?: number;
    createdAt?: string;
}

export interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    propertyType: PropertyType;
    status: PropertyStatus;
    description?: string;
    imageUrl?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    createdAt?: string;
}

export interface Lead {
    id: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    budget?: number;
    status: LeadStatus;
    notes?: string;
    source?: string;
    property?: Property;
    assignedAgent?: User;
    createdAt?: string;
}

export interface Analytics {
    totalLeads: number;
    totalProperties: number;
    totalAgents: number;
    leadCountByStatus: Record<string, number>;
    leadCountByProperty: { propertyId: number; propertyTitle: string; count: number }[];
    leadCountByAgent: { agentId: number; agentName: string; count: number }[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}
