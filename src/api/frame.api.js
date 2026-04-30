import api from './axiosConfig';

export const frameApi = {
    getFrames: () => api.get('/frames'),
    uploadFrame: (formData) => api.post('/frames/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    deleteFrame: (id) => api.delete(`/frames/${id}`) 
};