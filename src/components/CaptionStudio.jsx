import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CaptionStudio = () => {
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customMood, setCustomMood] = useState('');

    // প্রি-ডিফাইনড মুড (ফ্যান এবং ম্যানেজমেন্ট উভয়ের জন্য)
    const moods = [
        { icon: '🔥', label: 'Fan Hype', value: 'crazy fan hype and energetic reaction' },
        { icon: '📢', label: 'Announcement', value: 'official tournament announcement or update' }, // Management
        { icon: '🏆', label: 'Match Result', value: 'official match result and congratulations' }, // Management
        { icon: '😂', label: 'Banter', value: 'funny sports banter among fans' },
    ];

const generateCaption = async (selectedMood) => {
        setIsLoading(true);
        setCaption(''); 
        
        try {
            // 🔥 URL ফিক্স: আপনার ব্যাকএন্ডের লিংকে রিকোয়েস্ট যাচ্ছে
            const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

            // সরাসরি Groq নয়, বরং আপনার নিজের ব্যাকএন্ডকে কল করা হচ্ছে
            const response = await axios.post(
                `${baseURL}/api/v1/ai/generate-caption`, 
                { mood: selectedMood },
                { withCredentials: true } // এটি আপনার কুকি/টোকেন ব্যাকএন্ডে পাঠাবে
            );
            
            // ব্যাকএন্ড থেকে আসা ক্যাপশন সেট করা
            setCaption(response.data.data.caption);
            toast.success('Magic created securely! ✨');
            setCustomMood(''); 
        }
        catch (error) {
            console.error("Backend Error:", error);
            toast.error('Failed to generate. Please try again!');
        } finally {
            setIsLoading(false);
        }
    };



    


    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customMood.trim()) {
            generateCaption(customMood);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(caption);
        toast.success('Caption copied! Ready to share. 🚀');
    };

    return (
        <div className="bg-[#0d131f]/90 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                    <h3 className="text-white font-black text-lg tracking-tight">AI Caption Studio</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Z-SPORTS</p>
                </div>
            </div>

            <div className="mb-5">
                <p className="text-xs text-gray-400 mb-3 font-semibold">1-Click Magic Themes</p>
                <div className="grid grid-cols-2 gap-2">
                    {moods.map((m, idx) => (
                        <button 
                            key={idx}
                            onClick={() => generateCaption(m.value)}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-gray-300 transition-all text-sm font-medium disabled:opacity-50"
                        >
                            <span>{m.icon}</span> {m.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 my-4">
                <div className="h-px bg-gray-800 flex-grow"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">OR Custom</span>
                <div className="h-px bg-gray-800 flex-grow"></div>
            </div>

            <form onSubmit={handleCustomSubmit} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={customMood}
                    onChange={(e) => setCustomMood(e.target.value)}
                    placeholder="e.g. Messi bicycle kick..." 
                    className="flex-grow bg-[#050811] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button 
                    type="submit" 
                    disabled={!customMood.trim() || isLoading}
                    className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                    Generate
                </button>
            </form>

            <div className="relative">
                {isLoading ? (
                    <div className="h-28 bg-[#050811] border border-gray-800 rounded-2xl flex flex-col items-center justify-center">
                        <span className="relative flex h-4 w-4 mb-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                        </span>
                        <p className="text-xs text-indigo-400 font-bold animate-pulse">AI is crafting your caption...</p>
                    </div>
                ) : (
                    <div className={`h-28 bg-[#050811] border rounded-2xl p-4 transition-all ${caption ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-gray-800'}`}>
                        {caption ? (
                            <div className="h-full flex flex-col justify-between">
                                <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed">{caption}</p>
                                <button onClick={copyToClipboard} className="self-end text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    Copy Text
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center opacity-50">
                                <p className="text-xs text-gray-500 font-medium">Your generated masterpiece<br/>will appear right here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CaptionStudio;