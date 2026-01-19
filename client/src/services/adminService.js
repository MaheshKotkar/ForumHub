import axios from 'axios';

const API_URL = '/api/admin';

// Create a separate axios instance for admin operations without the redirect interceptor
const adminApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add admin token to requests
adminApi.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
});

// Handle errors WITHOUT auto-redirect (unlike the normal api.js)
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Just return the error, don't redirect
        return Promise.reject(error);
    }
);

export const adminService = {
    async adminLogin(email, password) {
        const response = await adminApi.post('/admin/login', { email, password });
        return response.data;
    },

    async getAllUsers() {
        const response = await adminApi.get('/admin/users');
        return response.data;
    },

    async deleteUser(userId, reason) {
        const response = await adminApi.delete(`/admin/users/${userId}`, { data: { reason } });
        return response.data;
    },

    async deletePost(postId, reason) {
        const response = await adminApi.delete(`/admin/posts/${postId}`, { data: { reason } });
        return response.data;
    },

    async deleteComment(commentId, reason) {
        const response = await adminApi.delete(`/admin/comments/${commentId}`, { data: { reason } });
        return response.data;
    },

    async getDeletionAlerts(userId) {
        const response = await adminApi.get(`/admin/alerts/${userId}`);
        return response.data;
    },

    async dismissAlert(alertId) {
        const response = await adminApi.delete(`/admin/alerts/${alertId}`);
        return response.data;
    }
};
