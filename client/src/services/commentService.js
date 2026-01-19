import api from './api';

export const commentService = {
    async getCommentsByPost(postId) {
        const response = await api.get(`/comments/post/${postId}`);
        return response.data;
    },

    async addComment(postId, comment, parentId = null) {
        const response = await api.post('/comments', { postId, comment, parentId });
        return response.data;
    },

    async deleteComment(id) {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    }
};
