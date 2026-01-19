import api from './api';

export const feedbackService = {
    async submitFeedback(feedbackData) {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },

    async getAllFeedback() {
        const response = await api.get('/feedback');
        return response.data;
    }
};
