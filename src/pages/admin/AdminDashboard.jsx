import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { frameApi } from '../../api/frame.api';
import { newsApi } from '../../api/news.api'; 
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('fsl');

    const [fslSport, setFslSport] = useState('cricket');
    const [isUpdatingFsl, setIsUpdatingFsl] = useState(false);
    const [fslData, setFslData] = useState({
        match1: { teamA: '', scoreA: '', oversA: '', teamB: '', scoreB: '', oversB: '', label: 'LIVE / FINAL', bottomText: '', isLive: true },
        match2: { teamA: '', scoreA: '', oversA: '', teamB: '', scoreB: '', oversB: '', label: 'Upcoming', bottomText: '', isLive: false },
        tournamentLink: ''
    });

    const [frames, setFrames] = useState([]);
    const [isUploadingFrame, setIsUploadingFrame] = useState(false);
    const [frameName, setFrameName] = useState('');
    const [frameFile, setFrameFile] = useState(null);
    const [category, setCategory] = useState('Tournament');

    const [newsList, setNewsList] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [newsCategory, setNewsCategory] = useState('Football');
    const [newsFile, setNewsFile] = useState(null);
    const [newsLink, setNewsLink] = useState(''); 

    const [stats, setStats] = useState({ todayVisits: 0, totalVisits: 0 });
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [emailData, setEmailData] = useState({ recipient: 'all', subject: '', body: '' });
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    useEffect(() => {
        if (activeTab === 'frames') loadFrames();
        if (activeTab === 'news') loadNews();
        if (activeTab === 'users') loadUsersAndStats();
        if (activeTab === 'fsl') loadFslData();
    }, [activeTab, fslSport]);

    const loadFslData = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
            const res = await axios.get(`${baseURL}/api/v1/scores/fsl/${fslSport}`);
            if (res.data && res.data.data) {
                setFslData(res.data.data);
            }
        } catch (error) { 
            console.log("No FSL data found"); 
        }
    };

    const handleUpdateFsl = async (e) => {
        e.preventDefault();
        setIsUpdatingFsl(true);
        const toastId = toast.loading(`Updating ${fslSport.toUpperCase()} FSL Data...`);
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
            
            await axios.put(`${baseURL}/api/v1/scores/fsl/${fslSport}`, fslData, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
            
            toast.success('FSL Data updated and live! 🏆', { id: toastId });
        } catch (error) {
            toast.error('Failed to update FSL data', { id: toastId });
        } finally {
            setIsUpdatingFsl(false);
        }
    };

    const loadFrames = async () => {
        try {
            const res = await frameApi.getFrames();
            setFrames(res.data.data);
        } catch (error) { toast.error("Failed to load frames"); }
    };

    const loadNews = async () => {
        try {
            const res = await newsApi.getAllNews();
            setNewsList(res.data.data);
        } catch (error) { toast.error("Failed to load news"); }
    };

    const loadUsersAndStats = async () => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';

            const res = await axios.get(`${baseURL}/api/v1/admin/dashboard-data`, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
            
            setStats(res.data.data.stats);
            setVerifiedUsers(res.data.data.verifiedUsers);
        } catch (error) { 
            toast.error("Failed to load user data"); 
        }
    };

    const handleFrameUpload = async (e) => {
        e.preventDefault();
        if (!frameFile) return toast.error("Please select a frame image (PNG)!");
        setIsUploadingFrame(true);
        const toastId = toast.loading('Uploading Frame...');
        const formData = new FormData();
        formData.append('name', frameName || 'New Frame');
        formData.append('category', category);
        formData.append('frameImage', frameFile);

        try {
            await frameApi.uploadFrame(formData);
            toast.success('Frame uploaded successfully!', { id: toastId });
            
            setFrameName(''); 
            setFrameFile(null); 
            document.getElementById('frameFileInput').value = ''; 
            
            loadFrames();
        } catch (error) { 
            toast.error('Upload failed', { id: toastId }); 
        } finally { 
            setIsUploadingFrame(false); 
        }
    };

    const handleDeleteFrame = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        const toastId = toast.loading('Deleting frame...');
        try {
            await frameApi.deleteFrame(id);
            toast.success('Frame deleted!', { id: toastId });
            loadFrames();
        } catch (error) { toast.error('Failed to delete frame', { id: toastId }); }
    };

    const handlePublishNews = async (e) => {
        e.preventDefault();
        if (!newsFile) return toast.error("Please select a cover image!");
        if (!newsTitle || !newsContent) return toast.error("Title and Content are required!");

        setIsPublishing(true);
        const toastId = toast.loading('Publishing News to the world...');
        const formData = new FormData();
        formData.append('title', newsTitle);
        formData.append('content', newsContent);
        formData.append('category', newsCategory);
        formData.append('externalLink', newsLink); 
        formData.append('newsImage', newsFile);

        try {
            await newsApi.createNews(formData);
            toast.success('News published successfully! 📰', { id: toastId });
            
            setNewsTitle(''); 
            setNewsContent(''); 
            setNewsFile(null); 
            setNewsLink(''); 
            
            const fileInput = document.getElementById('newsFileInput');
            if (fileInput) fileInput.value = ''; 
            
            loadNews(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish news', { id: toastId });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news?")) return;
        const toastId = toast.loading('Deleting News...');
        try {
            await newsApi.deleteNews(id);
            toast.success('News deleted successfully!', { id: toastId });
            loadNews();
        } catch (error) {
            toast.error('Failed to delete news', { id: toastId });
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!emailData.subject || !emailData.body) return toast.error("Subject and body are required!");
        
        setIsSendingEmail(true);
        const toastId = toast.loading('Sending secure email...');
        
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';

            await axios.post(`${baseURL}/api/v1/admin/send-email`, emailData, { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
            
            toast.success(`Email sent successfully! 🚀`, { id: toastId });
            setEmailData({ recipient: 'all', subject: '', body: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send email', { id: toastId });
        } finally {
            setIsSendingEmail(false);
        }
    };

    const updateFslField = (match, field, value) => {
        setFslData(prev => ({
            ...prev,
            [match]: { ...prev[match], [field]: value }
        }));
    };

    return (
        <div className="min-h-screen bg-[#050811] text-gray-300 py-10 px-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">ADMIN <span className="text-emerald-500">PANEL</span></h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage Site Content</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <button onClick={() => navigate('/profile')} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all flex items-center justify-center gap-2 text-sm border border-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Profile
                        </button>

                        <div className="flex bg-[#0d131f] p-1.5 rounded-2xl border border-gray-800 shadow-xl overflow-x-auto w-full sm:w-auto custom-scrollbar">
                            <button onClick={() => setActiveTab('fsl')} className={`px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'fsl' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white'}`}>🏆 Score Update</button>
                            <button onClick={() => setActiveTab('news')} className={`px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'news' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}>📰 News Desk</button>
                            <button onClick={() => setActiveTab('frames')} className={`px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'frames' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}>🖼️ Frames</button>
                            <button onClick={() => setActiveTab('users')} className={`px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'users' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400 hover:text-white'}`}>👥 Users & Stats</button>
                        </div>
                    </div>
                </div>

                {activeTab === 'fsl' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="bg-[#0d131f] border border-amber-500/30 p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-amber-500/10 w-64 h-64 rounded-full blur-3xl -z-10"></div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <span className="text-amber-500">🏆</span> Smart Score Control System
                                </h2>
                                
                                <div className="flex bg-[#050811] p-1.5 rounded-xl border border-gray-800 shadow-inner">
                                    <button onClick={() => setFslSport('cricket')} type="button" className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${fslSport === 'cricket' ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Cricket</button>
                                    <button onClick={() => setFslSport('football')} type="button" className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${fslSport === 'football' ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Football</button>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateFsl} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    
                                    {/* 🔥 MATCH 1 SETTINGS 🔥 */}
                                    <div className="bg-[#050811] border border-gray-800 p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-amber-500 uppercase tracking-widest text-sm flex flex-col xl:flex-row xl:items-center gap-1.5">
                                                <span>Match 1 Settings</span>
                                                {/* শুধুমাত্র ফুটবলের জন্য Smart Overlay ট্যাগ দেখাবে */}
                                                {fslSport === 'football' && (
                                                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/20 w-fit">
                                                        + Smart Scorecard Overlay
                                                    </span>
                                                )}
                                            </h3>
                                            <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                                <input type="checkbox" checked={fslData.match1.isLive} onChange={(e) => updateFslField('match1', 'isLive', e.target.checked)} className="accent-red-500" />
                                                <span className="text-xs text-gray-400 font-bold uppercase">Show Live Ping</span>
                                            </label>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex-[2]"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Team A Name</label><input type="text" value={fslData.match1.teamA} onChange={(e) => updateFslField('match1', 'teamA', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></div>
                                                <div className="flex-1"><label className="text-[10px] text-amber-500 uppercase font-bold mb-1 block">Score</label><input type="text" value={fslData.match1.scoreA} onChange={(e) => updateFslField('match1', 'scoreA', e.target.value)} className="w-full bg-[#0d131f] border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-amber-500" /></div>
                                                {fslSport === 'cricket' && <div className="flex-1"><label className="text-[10px] text-emerald-500 uppercase font-bold mb-1 block">Overs</label><input type="text" value={fslData.match1.oversA} onChange={(e) => updateFslField('match1', 'oversA', e.target.value)} placeholder="(15.2)" className="w-full bg-[#0d131f] border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" /></div>}
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-[2]"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Team B Name</label><input type="text" value={fslData.match1.teamB} onChange={(e) => updateFslField('match1', 'teamB', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></div>
                                                <div className="flex-1"><label className="text-[10px] text-amber-500 uppercase font-bold mb-1 block">Score</label><input type="text" value={fslData.match1.scoreB} onChange={(e) => updateFslField('match1', 'scoreB', e.target.value)} className="w-full bg-[#0d131f] border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-amber-500" /></div>
                                                {fslSport === 'cricket' && <div className="flex-1"><label className="text-[10px] text-emerald-500 uppercase font-bold mb-1 block">Overs</label><input type="text" value={fslData.match1.oversB} onChange={(e) => updateFslField('match1', 'oversB', e.target.value)} placeholder="(0.0)" className="w-full bg-[#0d131f] border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" /></div>}
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Top Label</label><input type="text" value={fslData.match1.label} onChange={(e) => updateFslField('match1', 'label', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" /></div>
                                                
                                                <div className="flex-1">
                                                    <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                        Bottom Text
                                                        {/* শুধুমাত্র ফুটবলের জন্য Set Time ট্যাগ দেখাবে */}
                                                        {fslSport === 'football' && (
                                                            <span className="text-amber-500 lowercase opacity-80">+ set time (00:00)</span>
                                                        )}
                                                    </label>
                                                    <input type="text" value={fslData.match1.bottomText} onChange={(e) => updateFslField('match1', 'bottomText', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500" />
                                                </div>
                                            </div>

                                            {/* 🔥 শুধুমাত্র ফুটবলের জন্য OBS Overlay Link Section দেখাবে 🔥 */}
                                            {fslSport === 'football' && (
                                                <div className="mt-4 p-4 bg-[#0a0f1c] border border-emerald-500/20 rounded-xl">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            📺 OBS Overlay Link
                                                            
                                                            {/* ℹ️ Tooltip Icon & Box */}
                                                            <div className="relative inline-flex group/tooltip cursor-help">
                                                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-500 flex items-center justify-center text-[9px] font-black hover:bg-emerald-500 hover:text-black transition-colors">i</span>
                                                                
                                                                {/* Tooltip Content (Hover/Touch) */}
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[270px] p-3 bg-[#0d131f] border border-emerald-500/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-[11px] text-gray-300 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50">
                                                                    <strong className="text-emerald-400 block mb-1 text-xs">OBS Setup Guide:</strong>
                                                                    <ul className="space-y-1 ml-3 list-decimal text-gray-400">
                                                                        <li>Add a new <b>"Browser"</b> source in OBS.</li>
                                                                        <li>Paste this link in the URL box.</li>
                                                                        <li>Set Width: <b>1920</b>, Height: <b>1080</b>.</li>
                                                                        <li>Custom CSS: <code className="text-pink-400 bg-black/50 px-1 py-0.5 rounded block mt-1 select-all font-mono">body {'{'} background-color: transparent; margin: 0; overflow: hidden; {'}'}</code></li>
                                                                    </ul>
                                                                    {/* Tooltip Arrow */}
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0d131f]"></div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" 
                                                            readOnly 
                                                            value={`${window.location.origin}/overlay/${fslSport}`} 
                                                            className="w-full bg-[#050811] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-500 outline-none select-all focus:border-emerald-500/50 transition-colors" 
                                                        />
                                                        
                                                        {/* 📋 Copy Button */}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`${window.location.origin}/overlay/${fslSport}`);
                                                                toast.success('Overlay Link Copied! 📋', {
                                                                    style: { background: '#10b981', color: '#fff', fontWeight: 'bold' }
                                                                });
                                                            }}
                                                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-[#050811] border border-emerald-500/30 px-3 py-2 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                            COPY
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {/* End of OBS Link Section */}

                                        </div>
                                    </div>

                                    {/* MATCH 2 SETTINGS */}
                                    <div className="bg-[#050811] border border-gray-800 p-6 rounded-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm">Match 2 Settings</h3>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={fslData.match2.isLive} onChange={(e) => updateFslField('match2', 'isLive', e.target.checked)} className="accent-red-500" />
                                                <span className="text-xs text-gray-400 font-bold uppercase">Show Live Ping</span>
                                            </label>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <div className="flex-[2]"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Team C Name</label><input type="text" value={fslData.match2.teamA} onChange={(e) => updateFslField('match2', 'teamA', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-500" /></div>
                                                <div className="flex-1"><label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Score</label><input type="text" value={fslData.match2.scoreA} onChange={(e) => updateFslField('match2', 'scoreA', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-gray-500" /></div>
                                                {fslSport === 'cricket' && <div className="flex-1"><label className="text-[10px] text-emerald-500 uppercase font-bold mb-1 block">Overs</label><input type="text" value={fslData.match2.oversA} onChange={(e) => updateFslField('match2', 'oversA', e.target.value)} className="w-full bg-[#0d131f] border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" /></div>}
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-[2]"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Team D Name</label><input type="text" value={fslData.match2.teamB} onChange={(e) => updateFslField('match2', 'teamB', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-500" /></div>
                                                <div className="flex-1"><label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Score</label><input type="text" value={fslData.match2.scoreB} onChange={(e) => updateFslField('match2', 'scoreB', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-gray-500" /></div>
                                                {fslSport === 'cricket' && <div className="flex-1"><label className="text-[10px] text-emerald-500 uppercase font-bold mb-1 block">Overs</label><input type="text" value={fslData.match2.oversB} onChange={(e) => updateFslField('match2', 'oversB', e.target.value)} className="w-full bg-[#0d131f] border border-emerald-500/50 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" /></div>}
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Top Label</label><input type="text" value={fslData.match2.label} onChange={(e) => updateFslField('match2', 'label', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-500" /></div>
                                                <div className="flex-1"><label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Bottom Text</label><input type="text" value={fslData.match2.bottomText} onChange={(e) => updateFslField('match2', 'bottomText', e.target.value)} className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-gray-500" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 items-end bg-[#050811] border border-gray-800 p-6 rounded-2xl">
                                    <div className="flex-grow w-full">
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Tournament Hub Link (Optional URL)</label>
                                        <input type="text" value={fslData.tournamentLink} onChange={(e) => setFslData({...fslData, tournamentLink: e.target.value})} className="w-full bg-[#0d131f] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500" />
                                    </div>
                                    <button type="submit" disabled={isUpdatingFsl} className="w-full md:w-auto shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-[#050811] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                        {isUpdatingFsl ? 'Publishing...' : 'Publish Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-[#0d131f] to-[#161f33] border border-gray-800 p-6 rounded-3xl shadow-xl flex items-center justify-between group">
                                <div><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Today's Visitors</p><h3 className="text-4xl font-black text-white">{stats.todayVisits}</h3></div>
                                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-pink-500/20"><span className="text-2xl">🔥</span></div>
                            </div>
                            <div className="bg-gradient-to-br from-[#0d131f] to-[#161f33] border border-gray-800 p-6 rounded-3xl shadow-xl flex items-center justify-between group">
                                <div><p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Visitors</p><h3 className="text-4xl font-black text-emerald-400">{stats.totalVisits.toLocaleString()}</h3></div>
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20"><span className="text-2xl">🌍</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl h-fit shadow-2xl">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="text-pink-500 text-2xl">✉️</span> Broadcast Email</h2>
                                <form onSubmit={handleSendEmail} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">To (Recipient)</label>
                                        <select value={emailData.recipient} onChange={(e) => setEmailData({...emailData, recipient: e.target.value})} className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-white transition-all font-medium">
                                            <option value="all">📢 All Verified Users</option>
                                            {verifiedUsers.map(u => <option key={u._id} value={u.email}>👤 {u.username} ({u.email})</option>)}
                                        </select>
                                    </div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Subject</label><input type="text" value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} required className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-white transition-all" /></div>
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email Body</label><textarea value={emailData.body} onChange={(e) => setEmailData({...emailData, body: e.target.value})} required rows="6" className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-white transition-all resize-none" /></div>
                                    <button type="submit" disabled={isSendingEmail} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_15px_rgba(236,72,153,0.3)]">{isSendingEmail ? 'Sending...' : 'Send Email'}</button>
                                </form>
                            </div>

                            <div className="lg:col-span-2 bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3"><span className="text-pink-500 text-2xl">✅</span> Verified Users</h2>
                                    <span className="text-xs font-bold bg-pink-500/10 text-pink-500 px-3 py-1 rounded-lg">Total: {verifiedUsers.length}</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                                    {verifiedUsers.map((user) => (
                                        <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#050811] border border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">{user.username.charAt(0).toUpperCase()}</div>
                                                <div><h3 className="font-bold text-gray-200">{user.username}</h3><p className="text-xs text-gray-500">{user.email}</p></div>
                                            </div>
                                            <button onClick={() => { setEmailData({ ...emailData, recipient: user.email }); toast('Selected for email', { icon: '✍️' }); }} className="text-xs font-bold bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-700">Direct Email</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        <div className="bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl h-fit shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="text-orange-500 text-2xl">✍️</span> Write Article</h2>
                            <form onSubmit={handlePublishNews} className="space-y-5">
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Headline</label><input type="text" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-orange-500 text-white outline-none" /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category</label><select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none"><option value="Cricket">Cricket</option><option value="Football">Football</option><option value="Tennis">Tennis</option><option value="Others">Others</option></select></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Content</label><textarea value={newsContent} onChange={(e) => setNewsContent(e.target.value)} required rows="5" className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-orange-500 text-white outline-none resize-none" /></div>
                                
                                {/* 🔥 NEW: External Link Input */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Source Link (Optional)</label>
                                    <input type="url" value={newsLink} onChange={(e) => setNewsLink(e.target.value)} placeholder="https://example.com" className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-orange-500 text-white outline-none" />
                                </div>

                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cover Image</label><input id="newsFileInput" type="file" accept="image/*" onChange={(e) => setNewsFile(e.target.files[0])} className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white" /></div>
                                <button type="submit" disabled={isPublishing || !newsFile} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]">{isPublishing ? 'Publishing...' : 'Publish News'}</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="text-orange-500 text-2xl">📰</span> Published Articles</h2>
                            <div className="space-y-4">
                                {newsList.map((news) => (
                                    <div key={news._id} className="flex gap-4 p-4 rounded-2xl bg-[#050811] border border-gray-800 items-center">
                                        <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-900"><img src={news.imageUrl} alt="News" className="w-full h-full object-cover" crossOrigin="anonymous"/></div>
                                        <div className="flex-grow min-w-0"><h3 className="font-bold text-gray-200 truncate">{news.title}</h3></div>
                                        <button onClick={() => handleDeleteNews(news._id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center">X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'frames' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        <div className="bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl h-fit shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6"><span className="text-indigo-500">📤</span> Upload Frame</h2>
                            <form onSubmit={handleFrameUpload} className="space-y-5">
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Name</label><input type="text" value={frameName} onChange={(e) => setFrameName(e.target.value)} className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none" /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#050811] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none"><option value="Tournament">Tournament</option><option value="Team">Team Support</option></select></div>
                                <div><input id="frameFileInput" type="file" accept="image/png" onChange={(e) => setFrameFile(e.target.files[0])} className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white" /></div>
                                <button type="submit" disabled={isUploadingFrame || !frameFile} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl">Upload Frame</button>
                            </form>
                        </div>
                        <div className="lg:col-span-2 bg-[#0d131f] border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-6"><span className="text-indigo-500">🖼️</span> Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {frames.map((frame) => (
                                    <div key={frame._id} className="relative group bg-gray-900 rounded-xl border border-gray-700 p-2 shadow-lg">
                                        <div className="aspect-square bg-cover bg-center rounded-lg overflow-hidden"><img src={frame.imageUrl} className="w-full h-full object-contain" crossOrigin="anonymous"/></div>
                                        <p className="text-xs font-bold text-center mt-3 text-gray-300 truncate px-1">{frame.name}</p>
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl"><button onClick={() => handleDeleteFrame(frame._id)} className="bg-red-500 text-white text-xs px-4 py-2 rounded-lg">Delete</button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;