import api from './axiosConfig';

export const authApi = {
    signup: (data) => api.post('/auth/signup', data),
    verifyOtp: (data) => api.post('/auth/verify-otp', data),
    login: (data) => api.post('/auth/login', data),
    googleLogin: (token) => api.post('/auth/google', { token }),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};