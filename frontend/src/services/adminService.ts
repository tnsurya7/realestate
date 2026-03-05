import api from './api';
import type { ApiResponse, Analytics, User } from '../types';

export const adminService = {
    async getAnalytics(): Promise<Analytics> {
        const res = await api.get<ApiResponse<Analytics>>('/admin/analytics');
        return res.data.data;
    },
    async getAgents(): Promise<User[]> {
        const res = await api.get<ApiResponse<User[]>>('/admin/agents');
        return res.data.data;
    },
    async createAgent(data: { name: string; email: string; password: string; role?: string }): Promise<User> {
        const res = await api.post<ApiResponse<User>>('/admin/agents', { ...data, role: 'AGENT' });
        return res.data.data;
    },
    async updateAgent(id: number, data: { name: string; email: string; password?: string }): Promise<User> {
        const res = await api.put<ApiResponse<User>>(`/admin/agents/${id}`, data);
        return res.data.data;
    },
    async deleteAgent(id: number): Promise<void> {
        await api.delete(`/admin/agents/${id}`);
    },
    async downloadReport(): Promise<Blob> {
        const res = await api.get('/admin/report', {
            responseType: 'blob',
        });
        return res.data;
    },
};
