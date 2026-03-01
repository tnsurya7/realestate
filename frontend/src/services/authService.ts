import api from './api';
import type { ApiResponse, LoginResponse } from '../types';

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
        return res.data.data;
    },
    async register(data: { name: string; email: string; password: string; role: string }): Promise<LoginResponse> {
        const res = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
        return res.data.data;
    },
    logout() {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
    },
    getUser() {
        const raw = localStorage.getItem('crm_user');
        return raw ? JSON.parse(raw) : null;
    },
};
