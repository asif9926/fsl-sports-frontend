import React, { createContext, useState, useEffect, useContext } from 'react';
import { profileApi } from '../api/profile.api';

export const AuthContext = createContext(null);

// ============================================
// 🌐 Auth Provider
// পুরো app-এর auth state manage করবে
// ============================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ============================================
    // 🔄 App start হলে auth check করো
    // ============================================
useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await profileApi.getProfile();
                const userData = res.data.data || res.data;
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                // 🔥 THE FIX: শুধুমাত্র 401 Unauthorized (টোকেন মেয়াদ শেষ) হলেই লগআউট হবে!
                // সার্ভার স্লিপ মোডে থাকলে বা নেটওয়ার্ক এরর হলে লগআউট হবে না!
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('accessToken');
                    setUser(null);
                    setIsAuthenticated(false);
                } else {
                    console.error("Server might be sleeping or network issue. Token kept alive.");
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ============================================
    // 🔑 Login — user data ও token set করো
    // ============================================
    const loginContext = (userData, token) => {
        localStorage.setItem('accessToken', token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    // ============================================
    // 🚪 Logout — সব clear করো
    // ============================================
    const logoutContext = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    // ============================================
    // ✏️ Profile Update — partial update
    // ============================================
    const updateProfileContext = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
    };

    // Loading-এর সময় spinner দেখাবে
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            loginContext,
            logoutContext,
            updateProfileContext
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// 🎣 Custom Hook — useAuth()
// import করে সহজে use করা যাবে
// ============================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};