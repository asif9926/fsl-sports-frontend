import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OtpInput from '../../components/OtpInput';
import { profileApi } from '../../api/profile.api';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { fanWallApi } from '../../api/fanwall.api';

// ==========================================
// 1. Email OTP Modal (Refined Premium Look)
// ==========================================
const EmailOtpModal = ({ email, onVerify, onCancel }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) return toast.error('Please enter the complete 6-digit OTP!');
        setLoading(true);
        try { await onVerify(otp); } catch (error) { } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
            <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl transform transition-all">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-indigo-500/20">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2 tracking-tight">Verify Email</h3>
                <p className="text-zinc-400 text-sm text-center mb-8">We sent a secure OTP to <br/><span className="text-white font-medium">{email}</span></p>
                <div className="flex justify-center mb-8"><OtpInput length={6} onChange={setOtp} disabled={loading} /></div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-300 font-medium hover:bg-white/5 transition-all text-sm">Cancel</button>
                    <button onClick={handleVerify} disabled={loading || otp.length !== 6} className="flex-1 py-3 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 text-sm">Verify OTP</button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. Feedback Modal (Clean & Minimalist)
// ==========================================
const FeedbackModal = ({ onClose }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a star rating!");
        if (!feedback) return toast.error("Please write some feedback!");
        
        setIsSubmitting(true);
        setTimeout(() => {
            toast.success("Thank you! Your feedback has been sent to the developer. 🚀");
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <h3 className="text-xl font-bold text-white mb-1">Send Feedback</h3>
                <p className="text-sm text-zinc-400 mb-6">Your feedback helps us improve the platform.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)} className={`w-9 h-9 transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-zinc-700'}`}>
                                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            </button>
                        ))}
                    </div>
                    <textarea rows="4" placeholder="Tell us what you love or what we can improve..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all text-sm placeholder:text-zinc-600"></textarea>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-medium bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-50 text-sm">{isSubmitting ? 'Sending...' : 'Submit Feedback'}</button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 3. Edit Profile Modal (Professional & Responsive)
// ==========================================
const EditProfileModal = ({ user, onClose, updateData, setUpdateData, passData, setPassData, strength, handleUpdate, handlePasswordChange, handleDelete, isUpdating }) => {
    const strengthColors = ['bg-zinc-700', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];

    return (
        // z-index বাড়িয়ে দেওয়া হয়েছে যাতে Navbar এর উপরে থাকে। 
        // মোবাইলে যাতে উপরে কাটা না পড়ে সেজন্য p-4 এবং items-center রাখা হয়েছে।
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4">
            
            {/* Modal Container: 
                - max-h-[90vh]: স্ক্রিনের ৯০% এর বেশি লম্বা হবে না।
                - overflow-hidden: কন্টেইনার নিজে স্ক্রল হবে না, ভেতরের কন্টেন্ট হবে।
            */}
            <div className="bg-[#0f0f13] border border-white/10 rounded-[2rem] w-full max-w-xl max-h-[85vh] md:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* 1. Header (Sticky) */}
                <div className="border-b border-white/10 px-6 py-5 flex justify-between items-center shrink-0 bg-[#0f0f13] sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Account Settings</h2>
                        <p className="text-[10px] md:text-xs text-zinc-400 mt-0.5">Manage your identity and security</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    >
                        ✕
                    </button>
                </div>

                {/* 2. Scrollable Content Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-grow">
                    
                    {/* General Profile Section */}
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">General Profile</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-5">
                            <div className="group">
                                <label className="text-[11px] font-bold text-zinc-500 ml-1 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Display Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={updateData.username} 
                                    onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })} 
                                    className="w-full mt-1.5 bg-[#18181b] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-zinc-600 text-sm" 
                                    placeholder="e.g. John Doe" 
                                />
                            </div>
                            
                            <div className="group">
                                <label className="text-[11px] font-bold text-zinc-500 ml-1 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={updateData.email} 
                                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })} 
                                    disabled={user.authProvider === 'google'} 
                                    className={`w-full mt-1.5 px-4 py-3.5 rounded-2xl text-sm transition-all outline-none border ${
                                        user.authProvider === 'google' 
                                        ? 'bg-[#18181b]/50 border-white/5 text-zinc-500 cursor-not-allowed opacity-60' 
                                        : 'bg-[#18181b] border-white/5 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                                    }`} 
                                />
                                {user.authProvider === 'google' && (
                                    <p className="text-[10px] text-amber-500/80 mt-2 ml-1 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                        Google users cannot modify email.
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={isUpdating} 
                                className="w-full md:w-auto px-8 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all text-xs uppercase tracking-widest disabled:opacity-50 active:scale-95"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    {/* Password Section */}
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security</h3>
                        </div>

                        {user.authProvider === 'local' && (
                            <div className="group">
                                <label className="text-[11px] font-bold text-zinc-500 ml-1 uppercase tracking-wider group-focus-within:text-emerald-500 transition-colors">Current Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={passData.oldPassword} 
                                    onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })} 
                                    className="w-full mt-1.5 bg-[#18181b] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-600 text-sm" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        )}

                        <div className="group">
                            <label className="text-[11px] font-bold text-zinc-500 ml-1 uppercase tracking-wider group-focus-within:text-emerald-500 transition-colors">New Password</label>
                            <input 
                                type="password" 
                                required 
                                value={passData.newPassword} 
                                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} 
                                className="w-full mt-1.5 bg-[#18181b] border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-600 text-sm" 
                                placeholder="Create a strong password" 
                            />
                            
                            {/* Strength Meter */}
                            {passData.newPassword.length > 0 && (
                                <div className="mt-3 px-1">
                                    <div className="flex gap-1.5 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                                        {[1, 2, 3].map((i) => (
                                            <div 
                                                key={i} 
                                                className={`h-full flex-1 rounded-full transition-all duration-700 ${
                                                    strength.score >= i ? strengthColors[strength.score] : 'bg-transparent'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest mt-2 text-zinc-500">
                                        Password Strength: <span className={
                                            strength.score === 1 ? 'text-rose-500' : 
                                            strength.score === 2 ? 'text-amber-500' : 
                                            strength.score === 3 ? 'text-emerald-500' : ''
                                        }>
                                            {strength.score === 1 ? 'Weak' : strength.score === 2 ? 'Medium' : strength.score === 3 ? 'Strong' : ''}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={passData.newPassword.length > 0 && !strength.isValid} 
                                className="w-full md:w-auto px-8 py-3 rounded-2xl font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all text-xs uppercase tracking-widest disabled:opacity-30 active:scale-95"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>

                    {/* Danger Zone */}
                    <div className="p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/5 mt-10">
                        <h3 className="text-xs font-black text-rose-500 mb-2 uppercase tracking-[0.2em]">Danger Zone</h3>
                        <p className="text-[11px] text-zinc-400 mb-5 leading-relaxed font-medium">Once you delete your account, all your data, posts, and gallery images will be permanently erased. This action cannot be undone.</p>
                        <button 
                            onClick={handleDelete} 
                            className="w-full py-3.5 rounded-2xl font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all text-[11px] uppercase tracking-widest active:scale-95"
                        >
                            Deactivate Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getPasswordStrength = (password) => {
    const score = (password.length >= 6 ? 1 : 0) + (/\d/.test(password) ? 1 : 0) + (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0);
    return { score, isValid: score === 3 };
};

// ==========================================
// 4. Main Profile Component (Sleek & Professional)
// ==========================================
const Profile = () => {
    const { user, updateProfileContext, logoutContext } = useAuth();
    const navigate = useNavigate();
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [updateData, setUpdateData] = useState({ username: '', email: '' });
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingEmail, setPendingEmail] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Dynamic Posts Data
    const [userPosts, setUserPosts] = useState([]); 

    useEffect(() => {
        const fetchMyGallery = async () => {
            try {
                const res = await fanWallApi.getMyPosts();
                setUserPosts(res.data.data);
            } catch (error) {
                console.error("Failed to load gallery:", error);
            }
        };

        if (user) {
            fetchMyGallery();
        }
    }, [user]);

    const strength = getPasswordStrength(passData.newPassword);
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/';

    useEffect(() => { if (user) setUpdateData({ username: user.username, email: user.email }); }, [user]);

    const handleLogout = async () => {
        try { await authApi.logout(); } catch { } 
        finally { logoutContext(); toast.success('Logged out successfully!'); navigate('/'); }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const toastId = toast.loading('Uploading avatar...');
        const formData = new FormData(); formData.append('image', file);
        try {
            const res = await profileApi.uploadImage(formData);
            updateProfileContext({ profileImage: res.data.data.image + '?t=' + Date.now() });
            toast.success('Avatar updated!', { id: toastId });
        } catch (err) { 
    toast.error(err.response?.data?.message || 'Upload failed', { id: toastId }); 
}
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (updateData.username === user.username && updateData.email === user.email) return toast.error('No changes detected!');
        setIsUpdating(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const res = await profileApi.updateProfile(updateData);
            if (res.data.data?.requireOtp) {
                setPendingEmail(updateData.email); setShowOtpModal(true); setIsEditModalOpen(false);
                toast.success(res.data.message, { id: toastId });
            } else {
                updateProfileContext({ username: updateData.username });
                toast.success(res.data.message, { id: toastId });
            }
        } catch (err) { 
    toast.error(err.response?.data?.message || 'Update failed', { id: toastId }); 
}
        finally { setIsUpdating(false); }
    };

    const handleEmailOtpVerify = async (otp) => {
        try {
            const res = await profileApi.verifyNewEmail(otp);
            updateProfileContext({ email: pendingEmail, username: updateData.username });
            setShowOtpModal(false); setPendingEmail(''); setIsEditModalOpen(true);
            toast.success(res.data.message);
        } catch (err) { toast.error('Invalid OTP'); throw err; }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!strength.isValid) return toast.error('Password is not strong enough!');
        const toastId = toast.loading('Updating password...');
        try {
            const res = await profileApi.changePassword(passData);
            toast.success(res.data.message, { id: toastId });
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (err) { 
    toast.error(err.response?.data?.message || 'Update failed', { id: toastId }); 
}
    };

    const handleDelete = async () => {
        try {
            await profileApi.deleteAccount();
            logoutContext(); toast.success('Account deleted permanently!'); navigate('/');
        } catch { toast.error('Failed to delete account.'); }
    };

    const handleAdminRequest = async () => {
        setRequestLoading(true);
        const toastId = toast.loading('Sending request to developer...');
        try {
            const res = await profileApi.requestAdmin();
            toast.success(res.data.message, { id: toastId });
            updateProfileContext({ adminRequestStatus: 'pending' });
        } catch (err) { toast.error('Failed to send request', { id: toastId }); } 
        finally { setRequestLoading(false); }
    };

    if (!user) return null;

    return (
        <>
            {showOtpModal && <EmailOtpModal email={pendingEmail} onVerify={handleEmailOtpVerify} onCancel={() => { setShowOtpModal(false); setIsEditModalOpen(true); }} />}
            {isEditModalOpen && <EditProfileModal user={user} onClose={() => setIsEditModalOpen(false)} updateData={updateData} setUpdateData={setUpdateData} passData={passData} setPassData={setPassData} strength={strength} handleUpdate={handleUpdate} handlePasswordChange={handlePasswordChange} handleDelete={handleDelete} isUpdating={isUpdating} />}
            {isFeedbackModalOpen && <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />}

            <div className="min-h-screen bg-[#09090b] text-zinc-300 pb-24 font-sans">
                {/* Minimalist Cover Photo */}
                <div className="h-48 w-full relative bg-zinc-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900 opacity-50"></div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-16">
                    {/* Top Identity Clean Card */}
                    <div className="bg-[#18181b] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                            {/* Sleek Avatar */}
                            <div className="relative w-32 h-32 group shrink-0 -mt-12 md:-mt-0">
                                <div className="w-full h-full rounded-full bg-[#18181b] p-1.5 shadow-lg">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 relative">
                                        {user.profileImage ? (
                                            <img 
        src={user.profileImage.startsWith('http') ? user.profileImage : `${IMAGE_BASE_URL}${user.profileImage}`} 
        alt="Profile" 
        referrerPolicy="no-referrer" /* 🔥 shudhu ei line ti add korun */
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        crossOrigin="anonymous"
    />        
                                        ) : (
                                            <svg className="w-14 h-14 text-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm z-10 m-1.5">
                                    <div className="text-white text-center">
                                        <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider">Change</span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            
                            {/* User Info & Minimalist Stats */}
                            <div className="text-center md:text-left flex-grow">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                                    {user.username}
                                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1 mb-4">{user.email}</p>
                                
                                <div className="flex items-center justify-center md:justify-start gap-6 mt-3 pt-4 border-t border-white/5">
                                    <div className="text-center md:text-left">
                                        <span className="block text-lg font-semibold text-white">{userPosts.length}</span>
                                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Posts</span>
                                    </div>
                                    <div className="w-px h-6 bg-white/10"></div>
                                    <div className="text-center md:text-left">
                                        <span className="block text-lg font-semibold text-white">0</span>
                                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Likes</span>
                                    </div>
                                    <div className="w-px h-6 bg-white/10"></div>
                                    <div className="text-center md:text-left">
                                        <span className="block text-lg font-semibold text-white">{new Date(user.createdAt).getFullYear()}</span>
                                        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Joined</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                            <button onClick={() => setIsEditModalOpen(true)} className="px-5 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit Profile
                            </button>
                            {user.role === 'admin' ? (
                                <button onClick={() => navigate('/admin-dashboard')} className="px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-sm">Admin Panel</button>
                            ) : (
                                <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/10 text-rose-500 font-medium hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm">Sign Out</button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        
                        {/* Fan Gallery Section */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                My Fan Gallery
                            </h2>
                            
                            {userPosts.length === 0 ? (
                                /* Clean Empty State */
                                <div className="bg-[#18181b] border border-dashed border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-zinc-200 mb-1">No posts yet</h3>
                                    <p className="text-sm text-zinc-500 max-w-xs mb-5">Share your moments from the Fan Zone and they will appear beautifully in your gallery.</p>
                                    <button onClick={() => navigate('/fan-zone')} className="px-5 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 hover:text-white transition-all text-xs">
                                        Go to Fan Zone
                                    </button>
                                </div>
                            ) : (
                                /* Dynamic Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {userPosts.map((post, idx) => (
                                        <div key={idx} className="bg-zinc-900 rounded-2xl h-60 border border-zinc-800 relative overflow-hidden group">
                                            <img src={post.imageUrl} alt="Fan Art" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="text-white font-medium text-sm flex items-center gap-1.5"><svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> {post.likes || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Developer & Contact Section (Sleek Sidebar style) */}
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                Developer
                            </h2>
                            
                            <div className="bg-[#18181b] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                                        <span className="font-bold text-sm">AH</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm">Asif</h3>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase">FSL Sports Web Architect</p>
                                    </div>
                                </div>

                                <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                                    Designed with precision to deliver a premium sports experience. Need help or found a bug? Let us know.
                                </p>

                                {/* Interactive Contact Links */}
                                <div className="flex items-center gap-2 mb-5">
                                    <a href="mailto:your.asif992088@gmail.com" className="flex-1 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-zinc-300 flex items-center justify-center transition-colors" title="Email">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </a>
                                    <a href="https://wa.me/+8801710256453" target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-zinc-300 flex items-center justify-center transition-colors" title="WhatsApp">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    </a>
                                    <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-zinc-300 flex items-center justify-center transition-colors" title="GitHub">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                    </a>
                                </div>

                                <div className="space-y-2">
                                    <button onClick={() => setIsFeedbackModalOpen(true)} className="w-full py-2.5 rounded-xl font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all text-xs border border-white/5 flex items-center justify-center gap-2">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                        App Feedback
                                    </button>
                                    
                                    {user.role !== 'admin' && (
                                        <button onClick={handleAdminRequest} disabled={requestLoading || user.adminRequestStatus === 'pending'} className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 border ${user.adminRequestStatus === 'pending' ? 'bg-amber-500/5 text-amber-500/80 border-amber-500/10 cursor-not-allowed' : 'bg-white/5 text-zinc-300 hover:bg-white hover:text-black border-white/10'}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                            {user.adminRequestStatus === 'pending' ? 'Request Pending' : 'Request Admin Rights'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;