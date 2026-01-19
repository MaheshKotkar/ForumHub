import api from './api';

export const postService = {
    async getPosts(searchParams = {}) {
        const params = new URLSearchParams(searchParams);
        const response = await api.get(`/posts?${params}`);
        return response.data;
    },

    async getPost(id) {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    async createPost(formData) {
        const response = await api.post('/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async updatePost(id, formData) {
        const response = await api.put(`/posts/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async deletePost(id) {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    },

    async getUserPosts(userId) {
        const response = await api.get(`/posts/user/${userId}`);
        return response.data;
    }
};
