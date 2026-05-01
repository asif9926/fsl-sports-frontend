import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const getPasswordStrength = (password) => {
    const hasLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const score = (hasLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
    return { hasLength, hasNumber, hasSpecial, score, isValid: score === 3 };
};

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginContext } = useAuth();

    const strength = getPasswordStrength(formData.password);
    const strengthColors = ['bg-gray-800', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
    const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!strength.isValid) return toast.error('Please make sure your password is strong enough!');

    setLoading(true); // এখানে লোডিং শুরু হচ্ছে
    const toastId = toast.loading('Creating your account... 🚀');

    try {
        const response = await authApi.signup(formData);
        toast.success(response.data.message, { id: toastId });
        localStorage.setItem('verifyEmail', formData.email);
        setTimeout(() => navigate('/verify'), 1500);
    } catch (err) {
        // এই অংশটি যোগ করুন যাতে এরর আসলে বাটন আবার ঠিক হয়ে যায়
        toast.error(err.response?.data?.message || 'Signup failed! ❌', { id: toastId });
        setLoading(false); // <--- এটি অত্যন্ত জরুরি[cite: 24]
    }
};

    const handleGoogleSuccess = async (credentialResponse) => {
        const toastId = toast.loading('Authenticating with Google... ⏳');
        try {
            const res = await authApi.googleLogin(credentialResponse.credential);
            const { accessToken, user } = res.data.data;
            loginContext(user, accessToken);
            toast.success('Welcome to FSL-SPORTS! 🎉', { id: toastId });
            setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication Failed! ❌', { id: toastId });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-[#0d131f]/90 backdrop-blur-xl border border-gray-800 p-10 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 my-8">
                
                <div className="text-center mb-8">
                    <Link to="/home" className="inline-block text-3xl font-black italic tracking-tighter text-white uppercase mb-4">
                        FSL<span className="text-emerald-500">-SPORTS</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Join the ultimate sports community.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                        <input type="text" id="username" required placeholder="e.g. striker99" value={formData.username} onChange={handleChange} className="w-full px-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-600 transition-all" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input type="email" id="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} className="w-full px-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-600 transition-all" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} id="password" required placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="w-full pr-12 pl-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-600 transition-all" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white">
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {formData.password.length > 0 && (
                            <div className="mt-3 px-1">
                                <div className="flex justify-between items-center mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span>Security</span>
                                    <span className={strength.score === 3 ? 'text-emerald-500' : 'text-amber-500'}>{strengthLabels[strength.score]}</span>
                                </div>
                                <div className="flex gap-1.5 h-1 w-full rounded-full overflow-hidden bg-gray-800">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`h-full flex-1 transition-all duration-500 rounded-full ${strength.score >= i ? strengthColors[strength.score] : 'bg-transparent'}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading || (formData.password.length > 0 && !strength.isValid)} className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 bg-emerald-500 text-[#0d131f] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 mt-4">
                        {loading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-800" />
                    <span className="px-4 text-xs font-bold uppercase tracking-widest text-gray-600">or</span>
                    <div className="flex-1 border-t border-gray-800" />
                </div>

                <div className="flex justify-center w-full overflow-hidden rounded-xl">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Failed! ❌')} theme="filled_black" shape="rectangular" size="large" width="100%" text="signup_with" />
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm font-medium">
                    Already a member? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold">Log In here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;