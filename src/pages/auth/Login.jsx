import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { loginContext } = useAuth();

    useEffect(() => {
        if (location.state?.prefilledEmail) {
            setFormData((prev) => ({ ...prev, email: location.state.prefilledEmail }));
        }
    }, [location.state]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return toast.error('Please fill in all fields!');
        
        setLoading(true);
        const toastId = toast.loading('Authenticating...');
        try {
            const response = await authApi.login(formData);
            const { accessToken, user } = response.data.data;
            loginContext(user, accessToken);
            toast.success(response.data.message, { id: toastId });

            if (user.role === 'admin') setTimeout(() => navigate('/admin-dashboard'), 1500);
            else setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Connection failed! ❌', { id: toastId });
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const toastId = toast.loading('Connecting with Google...');
        try {
            const res = await authApi.googleLogin(credentialResponse.credential);
            const { accessToken, user } = res.data.data;
            loginContext(user, accessToken);
            toast.success('Login Successful!', { id: toastId });

            if (user.role === 'admin') setTimeout(() => navigate('/admin-dashboard'), 1500);
            else setTimeout(() => navigate('/profile'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google Login Failed! ❌', { id: toastId });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative overflow-hidden font-sans">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-[#0d131f]/90 backdrop-blur-xl border border-gray-800 p-10 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10">
                
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link to="/home" className="inline-block text-3xl font-black italic tracking-tighter text-white uppercase mb-6">
                        FSL<span className="text-emerald-500">-SPORTS</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Access live scores & Fan Zone.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                            </span>
                            <input type="email" id="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:bg-[#0a0f18] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-white placeholder-gray-600" />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" className="text-xs text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </span>
                            <input type={showPassword ? 'text' : 'password'} id="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full pl-11 pr-12 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:bg-[#0a0f18] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-white placeholder-gray-600" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white">
                                {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${loading ? 'bg-gray-800 text-gray-500 cursor-wait' : 'bg-emerald-500 text-[#0d131f] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95'}`}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-800" />
                    <span className="px-4 text-xs font-bold uppercase tracking-widest text-gray-600">or continue with</span>
                    <div className="flex-1 border-t border-gray-800" />
                </div>

                <div className="flex justify-center w-full overflow-hidden rounded-xl">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess} 
                        onError={() => toast.error('Google Login Failed! ❌')} 
                        theme="filled_black" shape="rectangular" size="large" width="100%"
                    />
                </div>

                <p className="text-center text-gray-500 mt-8 text-sm font-medium">
                    New to FSL-SPORTS?{' '}
                    <Link to="/signup" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;