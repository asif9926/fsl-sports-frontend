import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    withCredentials: true,
});

// 1. Request Interceptor: রিকোয়েস্ট পাঠানোর আগেই অফলাইন কি না চেক করবে
api.interceptors.request.use(
    (config) => {
        if (!navigator.onLine) {
            // আইডি ব্যবহার করায় এটি স্ক্রিনে একবারই দেখাবে
            toast.error('You are offline! 🌐', { id: 'offline-toast' });
            // রিকোয়েস্ট বাতিল করে দিবে যাতে পরের স্টেপে না যায়
            return Promise.reject(new Error('No internet connection'));
        }

        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: সার্ভার থেকে এরর আসলে হ্যান্ডেল করবে
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // যদি অফলাইন থাকে, তবে নতুন করে 'Server unreachable' দেখানোর দরকার নেই
        if (!navigator.onLine) {
            return Promise.reject(error);
        }

        // ইন্টারনেট আছে কিন্তু সার্ভার থেকে রেসপন্স নেই (সার্ভার ডাউন)
        if (!error.response) {
            toast.error('Server is unreachable! 📡', { id: 'server-toast' });
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        const skipRefreshRoutes = ['/auth/login', '/auth/signup', '/auth/refresh'];
        const isSkipRoute = skipRefreshRoutes.some(route => originalRequest.url.includes(route));

        // 401 Unauthorized এবং টোকেন রিফ্রেশ লজিক
        if (error.response?.status === 401 && !originalRequest._retry && !isSkipRoute) {
            originalRequest._retry = true;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
                    { withCredentials: true }
                );

                const newAccessToken = res.data.data?.accessToken;
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;