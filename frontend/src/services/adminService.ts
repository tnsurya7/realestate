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
    async createAgent(data: { name: string; email: string; password: string }): Promise<User> {
        const res = await api.post<ApiResponse<User>>('/admin/agents', data);
        return res.data.data;
    },
    async downloadReport(): Promise<Blob> {
        const res = await api.get('/admin/reports/pdf', { responseType: 'blob' });
        return res.data;
    },
};
