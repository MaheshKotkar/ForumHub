import api from './api';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async signup(fullName, username, email, password) {
        const response = await api.post('/auth/signup', { fullName, username, email, password });
        return response.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    async forgotPassword(email) {
        const response = await api.post('/auth/forgotpassword', { email });
        return response.data;
    },

    async resetPassword(token, password) {
        const response = await api.put(`/auth/resetpassword/${token}`, { password });
        return response.data;
    }
};
