import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import OtpInput from '../../components/OtpInput';

const getPasswordStrength = (password) => {
    const hasLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const score = (hasLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
    return { score, isValid: score === 3 };
};

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const strength = getPasswordStrength(newPassword);
    const strengthColors = ['bg-gray-800', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending OTP... ⏳');
        try {
            const response = await authApi.forgotPassword(email);
            toast.success(response.data.message, { id: toastId });
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP! ❌', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!strength.isValid) return toast.error('Use a stronger password!');
        
        setLoading(true);
        const toastId = toast.loading('Resetting password... ⏳');
        try {
            const response = await authApi.resetPassword({ email, otp, newPassword });
            toast.success(response.data.message, { id: toastId });
            setTimeout(() => navigate('/login', { state: { prefilledEmail: email } }), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset! ❌', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative">
            <div className="bg-[#0d131f]/90 backdrop-blur-xl border border-gray-800 p-10 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{step === 1 ? 'Recover Password' : 'Set New Password'}</h2>
                    <p className="text-gray-400 mt-2 text-sm font-medium">
                        {step === 1 ? "Enter your email to receive a recovery code." : `Enter the code sent to ${email}`}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-600 transition-all" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 bg-emerald-500 text-[#0d131f] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="flex justify-center mb-4">
                            <OtpInput length={6} onChange={setOtp} disabled={loading} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                            <input type="password" required placeholder="Create a strong password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3.5 bg-[#050811] border border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-gray-600 transition-all" />
                            
                            {newPassword.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex gap-1.5 h-1 w-full rounded-full overflow-hidden bg-gray-800">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className={`h-full flex-1 transition-all duration-500 rounded-full ${strength.score >= i ? strengthColors[strength.score] : 'bg-transparent'}`} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button type="submit" disabled={loading || otp.length !== 6 || !strength.isValid} className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 bg-emerald-500 text-[#0d131f] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50">
                            {loading ? 'Processing...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="text-center text-gray-500 mt-8 text-sm font-medium">
                    Remembered your password? <Link to="/login" className="text-emerald-500 font-bold hover:text-white transition-colors">Log In here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;