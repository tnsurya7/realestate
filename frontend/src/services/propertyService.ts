import api from './api';
import type { ApiResponse, Property } from '../types';

export const propertyService = {
    async getAll(): Promise<Property[]> {
        const res = await api.get<ApiResponse<Property[]>>('/admin/properties');
        return res.data.data;
    },
    async getPublic(): Promise<Property[]> {
        const res = await api.get<ApiResponse<Property[]>>('/properties');
        return res.data.data;
    },
    async create(data: Partial<Property>): Promise<Property> {
        const res = await api.post<ApiResponse<Property>>('/admin/properties', data);
        return res.data.data;
    },
    async update(id: number, data: Partial<Property>): Promise<Property> {
        const res = await api.put<ApiResponse<Property>>(`/admin/properties/${id}`, data);
        return res.data.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`/admin/properties/${id}`);
    },
};
