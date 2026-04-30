import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import toast from 'react-hot-toast';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await newsApi.getNewsById(id);
                setNews(res.data.data);
            } catch (error) {
                toast.error("News not found!");
                navigate('/news');
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [id, navigate]);

    const handleShare = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(news?.title || "Check out this sports news!");
        let shareUrl = '';

        switch (platform) {
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
            case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text} - ${url}`; break;
            case 'copy': 
                navigator.clipboard.writeText(window.location.href);
                return toast.success("Link copied to clipboard!");
            default: return;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    // 🔥 SMART LOGIC: Content এর ভেতরের লিংক চিনে সেটাকে ক্লিকেবল করা
    const renderContentWithLinks = (text) => {
        if (!text) return null;
        // URL চেনার জন্য Regex
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a 
                        key={index} 
                        href={part} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-orange-500 hover:text-red-500 underline font-bold break-words transition-colors"
                    >
                        {part}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (loading) return <div className="min-h-screen bg-[#050811] flex justify-center items-center text-orange-500 font-bold uppercase tracking-widest">Loading Article...</div>;
    if (!news) return null;

    return (
        <div className="min-h-screen bg-[#050811] text-gray-300 py-10 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/news')} className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-wider transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back to News
                </button>

                <div className="bg-[#0d131f] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="h-64 md:h-96 w-full relative">
                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full z-10 shadow-lg">
                            {news.category}
                        </div>
                        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </div>
                    
                    <div className="p-6 md:p-10">
                        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">{news.title}</h1>
                        
                        <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-800 pb-6 mb-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <div className="flex gap-4">
                                <span>📅 {new Date(news.createdAt).toLocaleDateString()}</span>
                                <span>👁️ {news.views} Views</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="mr-2">Share:</span>
                                <button onClick={() => handleShare('facebook')} className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition" title="Facebook">f</button>
                                <button onClick={() => handleShare('twitter')} className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-500 hover:bg-sky-500 hover:text-white flex items-center justify-center transition" title="Twitter">🐦</button>
                                <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition" title="WhatsApp">W</button>
                                <button onClick={() => handleShare('copy')} className="w-8 h-8 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white flex items-center justify-center transition" title="Copy Link">🔗</button>
                            </div>
                        </div>

                        {/* 🔥 Updated Content Render */}
                        <div className="prose prose-invert max-w-none mb-10">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                                {renderContentWithLinks(news.content)}
                            </p>
                        </div>

                        {news.externalLink && (
                            <div className="border-t border-gray-800 pt-8 mt-8">
                                <a 
                                    href={news.externalLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                                >
                                    Read Full Article / Source
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </a>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;