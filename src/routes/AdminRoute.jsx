import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    // লোডিং স্টেট হ্যান্ডেল
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        );
    }

    // যদি লগিন করা না থাকে, অথবা লগিন করা আছে কিন্তু ইউজার 'admin' নয়
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/profile" replace />;
    }

    // সব ঠিক থাকলে অ্যাডমিন পেজে ঢুকতে দেবে
    return children;
};

export default AdminRoute;