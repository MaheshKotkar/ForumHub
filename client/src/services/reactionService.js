import api from './api';

export const reactionService = {
    async handleReaction(postId, reaction) {
        const response = await api.post('/reactions', { postId, reaction });
        return response.data;
    },

    async getPostReactions(postId) {
        const response = await api.get(`/reactions/post/${postId}`);
        return response.data;
    }
};
