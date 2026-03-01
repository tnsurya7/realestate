import api from './api';
import type { ApiResponse, Lead, LeadStatus } from '../types';

export const leadService = {
    async getAll(): Promise<Lead[]> {
        const res = await api.get<ApiResponse<Lead[]>>('/admin/leads');
        return res.data.data;
    },
    async getMyLeads(): Promise<Lead[]> {
        const res = await api.get<ApiResponse<Lead[]>>('/agent/leads');
        return res.data.data;
    },
    async create(data: Record<string, unknown>): Promise<Lead> {
        const res = await api.post<ApiResponse<Lead>>('/leads', data);
        return res.data.data;
    },
    async update(id: number, data: Record<string, unknown>): Promise<Lead> {
        const res = await api.put<ApiResponse<Lead>>(`/admin/leads/${id}`, data);
        return res.data.data;
    },
    async delete(id: number): Promise<void> {
        await api.delete(`/admin/leads/${id}`);
    },
    async updateStatus(id: number, status: LeadStatus, isAgent = false): Promise<Lead> {
        const url = isAgent ? `/agent/leads/${id}/status` : `/admin/leads/${id}/status`;
        const res = await api.patch<ApiResponse<Lead>>(url, { status });
        return res.data.data;
    },
    async addNotes(id: number, notes: string): Promise<Lead> {
        const res = await api.patch<ApiResponse<Lead>>(`/agent/leads/${id}/notes`, { notes });
        return res.data.data;
    },
    async assignAgent(id: number, agentId: number): Promise<Lead> {
        const res = await api.patch<ApiResponse<Lead>>(`/admin/leads/${id}/assign`, { agentId });
        return res.data.data;
    },
};
