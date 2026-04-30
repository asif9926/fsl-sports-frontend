import api from './axiosConfig';

export const fanWallApi = {
    getWallPosts: () => api.get('/fanwall'),
    createPost: (formData) => api.post('/fanwall', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    getMyPosts: () => api.get('/fanwall/my-posts'),

    toggleLike: (postId) => api.put(`/fanwall/${postId}/like`)
};