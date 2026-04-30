import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import OtpInput from '../../components/OtpInput'; // Ensure this matches your path

const Verify = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('verifyEmail');
        if (savedEmail) setEmail(savedEmail);
        else {
            toast.error('No email found. Please sign up first.');
            navigate('/signup');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return toast.error('Enter the complete 6-digit OTP!');

        setLoading(true);
        const toastId = toast.loading('Verifying identity... ⏳');

        try {
            const response = await authApi.verifyOtp({ email, otp });
            toast.success(response.data.message, { id: toastId });
            localStorage.removeItem('verifyEmail');
            setTimeout(() => navigate('/login', { state: { prefilledEmail: email } }), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed! ❌', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative">
            <div className="bg-[#0d131f]/90 backdrop-blur-xl border border-gray-800 p-10 rounded-[2rem] shadow-2xl w-full max-w-md text-center relative z-10">

                <div className="mx-auto w-20 h-20 bg-[#050811] rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-800 text-emerald-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Check your email</h2>
                <p className="text-gray-400 mb-2 text-sm px-4">We've sent a 6-digit code to</p>
                <p className="font-bold text-emerald-500 mb-8 text-sm">{email}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <OtpInput length={6} onChange={setOtp} disabled={loading} />
                    </div>

                    <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 bg-emerald-500 text-[#0d131f] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50">
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>

                <p className="text-gray-500 text-sm mt-6">
                    Didn't receive the code?{' '}
                    <button onClick={() => navigate('/signup')} className="text-emerald-500 font-bold hover:text-white transition-colors">Go back</button>
                </p>
            </div>
        </div>
    );
};

export default Verify;