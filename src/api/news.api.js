import api from './axiosConfig';

export const newsApi = {
    getAllNews: () => api.get('/news'),
    getNewsById: (id) => api.get(`/news/${id}`),
    createNews: (formData) => api.post('/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteNews: (id) => api.delete(`/news/${id}`)
};