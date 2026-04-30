import api from './axiosConfig';

export const profileApi = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/update', data),
    verifyNewEmail: (otp) => api.post('/user/verify-email', { otp }),
    changePassword: (data) => api.put('/user/change-password', data),
    uploadImage: (formData) => api.post('/user/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAccount: () => api.delete('/user/delete'),
    requestAdmin: () => api.post('/user/request-admin'),
};