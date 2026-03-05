import api from './api';
import type { ApiResponse } from '../types';

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export const contactService = {
    async submit(data: ContactFormData): Promise<void> {
        await api.post<ApiResponse<void>>('/contact', data);
    },
};
