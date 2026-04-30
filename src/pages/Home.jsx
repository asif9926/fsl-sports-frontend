import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosConfig';

const Home = () => {
    const [tickerUpdates, setTickerUpdates] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                
                const [fslCricket, fslFootball, intlCricket, intlFootball, newsRes, fanwallRes] = await Promise.all([
                    axios.get('/scores/fsl/cricket').catch(() => null),
                    axios.get('/scores/fsl/football').catch(() => null),
                    axios.get('/scores/cricket').catch(() => null),
                    axios.get('/scores/football').catch(() => null),
                    axios.get('/news').catch(() => null),
                    axios.get('/fanwall').catch(() => null)
                ]);

                const liveItems = [];

                if (fslCricket?.data?.data?.match1?.isLive) {
                    const c = fslCricket.data.data.match1;
                    liveItems.push(`🏏 [FSL LIVE] ${c.teamA} ${c.scoreA} vs ${c.teamB} ${c.scoreB}`);
                }
                if (fslFootball?.data?.data?.match1?.isLive) {
                    const f = fslFootball.data.data.match1;
                    liveItems.push(`⚽ [FSL LIVE] ${f.teamA} ${f.scoreA} - ${f.scoreB} ${f.teamB}`);
                }

                const intlC = intlCricket?.data?.data || [];
                intlC.slice(0, 3).forEach(m => {
                    liveItems.push(`🏏 [INTL] ${m.name}: ${m.score?.[0]?.r || '0'} vs ${m.score?.[1]?.r || '0'}`);
                });

                const intlF = intlFootball?.data?.data || [];
                intlF.slice(0, 3).forEach(m => {
                    liveItems.push(`⚽ [INTL] ${m.homeTeam?.name} ${m.homeScore?.display || 0} - ${m.awayScore?.display || 0} ${m.awayTeam?.name}`);
                });

                const fetchedNews = newsRes?.data?.data || [];
                setLatestNews(fetchedNews.slice(0, 2)); 
                if (fetchedNews.length > 0) liveItems.push(`📰 [NEWS] ${fetchedNews[0].title}`);

                const fanwallPosts = fanwallRes?.data?.data || [];
                if (fanwallPosts.length > 0) {
                    liveItems.push(`🎨 [FAN WALL] New post by ${fanwallPosts[0]?.user?.username || 'Fan'}`);
                }

                if (liveItems.length === 0) {
                    liveItems.push("🏆 Welcome to FSL Sports Web - Stay Tuned for Live Updates!");
                }

                setTickerUpdates(liveItems);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="min-h-screen bg-[#070b14] text-gray-300 font-sans overflow-x-hidden pb-20">
            
            {/* 🔥 Custom CSS for Smooth Right-to-Left Marquee 🔥 */}
            <style>
                {`
                @keyframes smoothMarquee {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100%); }
                }
                .custom-marquee {
                    display: inline-flex;
                    white-space: nowrap;
                    animation: smoothMarquee 150s linear infinite; /* স্পিড ১০০ সেকেন্ড করা হয়েছে */
                    padding-left: 100vw; /* ডান দিক থেকে শুরু করার জন্য */
                }
                .custom-marquee:hover {
                    animation-play-state: paused;
                }
                `}
            </style>

            {/* LIVE UPDATE TICKER */}
            <div className="bg-[#0a0f18] border-b border-gray-800 flex items-center h-12 z-20 relative shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-[10px] sm:text-xs px-4 md:px-6 py-3 h-full flex items-center tracking-[0.2em] uppercase z-10 shrink-0 gap-2 shadow-[5px_0_20px_rgba(220,38,38,0.3)]">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    LIVE UPDATE
                </div>
                
                <div className="flex-1 overflow-hidden relative h-full">
                    {!loading && (
                        <div className="custom-marquee h-full items-center gap-16 cursor-pointer">
                            {/* কন্টিনিউয়াস দেখানোর জন্য অ্যারেকে রিপিট করা হয়েছে */}
                            {[...tickerUpdates, ...tickerUpdates, ...tickerUpdates].map((update, idx) => (
                                <div key={idx} className="flex items-center gap-6 text-xs md:text-sm">
                                    <span className="font-bold text-gray-200 uppercase tracking-wide">{update}</span>
                                    <span className="text-red-500 font-bold opacity-40">•</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* HERO SECTION */}
            <div className="relative w-full max-w-7xl mx-auto mt-6 md:mt-10 px-4 sm:px-6 z-10">
                <div className="relative min-h-[580px] md:h-[70vh] rounded-[2.5rem] overflow-hidden bg-[#0d131f] border border-gray-800 shadow-2xl flex items-center justify-center group py-16 md:py-0">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] md:blur-[120px]"></div>
                        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/10 rounded-full blur-[100px] md:blur-[120px]"></div>
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#1a2235] border border-gray-700/50 text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
                            🏆 FSL Sports Web | The Ultimate Hub
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-6 leading-tight">
                            Experience the Game <br className="hidden md:block"/> Like Never Before
                        </h1>
                        <p className="text-gray-400 text-xs md:text-base font-medium mb-10 max-w-xl leading-relaxed">
                            Your ultimate destination for real-time scores, breaking sports news, and the exclusive Fan Zone Creator Studio.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <Link to="/live-score" className="px-8 py-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 text-sm tracking-wide flex items-center justify-center gap-2">
                                Match Center
                            </Link>
                            <Link to="/fan-zone" className="px-8 py-3.5 bg-[#1a2235] hover:bg-[#253047] text-gray-200 font-black rounded-xl border border-gray-700/50 transition-all transform hover:-translate-y-1 text-sm tracking-wide flex items-center justify-center">
                                Enter Fan Zone
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* TRENDING NEWS SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
                <div className="flex justify-between items-end mb-10 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                        Trending Updates
                    </h2>
                    <Link to="/news" className="text-gray-400 font-bold text-xs md:text-sm hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-1 group">
                        View All 
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map((n) => (
                            <div key={n} className="h-64 bg-[#0d131f] rounded-3xl animate-pulse border border-gray-800 flex items-center gap-8 p-6">
                                <div className="h-full w-1/3 bg-[#1a2235] rounded-xl"></div>
                                <div className="w-2/3 space-y-4">
                                    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                                    <div className="h-8 bg-[#1a2235] rounded w-full"></div>
                                    <div className="h-10 bg-[#1a2235] rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-800 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : latestNews.length > 0 ? (
                    <div className="space-y-8">
                        {latestNews.map((news) => (
                            <Link to={`/news/${news._id}`} key={news._id} className="group flex flex-col md:flex-row bg-[#0a0f18] rounded-[2rem] overflow-hidden border border-gray-800/60 shadow-lg hover:border-gray-700/60 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 p-6 sm:p-8 items-center gap-6 md:gap-10">
                                <div className="w-full md:w-2/5 h-64 md:h-60 rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shrink-0 relative">
                                    <img 
                                        src={news.imageUrl || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                        alt={news.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                                        crossOrigin="anonymous"
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <span className="absolute top-4 left-4 z-20 bg-[#1a2235] border border-gray-700/50 text-gray-300 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm">
                                        {news.category || "Sports"}
                                    </span>
                                </div>
                                <div className="w-full md:w-3/5 flex flex-col h-full py-2">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-3 text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                            <span><span className="text-emerald-500 font-bold">•</span> {new Date(news.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="w-px h-3 bg-gray-700"></span>
                                            <span>FSL DESK</span>
                                        </div>
                                        <h3 className="text-xl md:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300 leading-tight tracking-tight mb-4 line-clamp-2">
                                            {news.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                            {news.content || "Read the full story on FSL Sports."} 
                                        </p>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button className="px-5 py-2.5 rounded-xl text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                                            Read Full News 
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="w-full bg-[#0d131f] border border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                        <span className="text-5xl mb-4 grayscale opacity-50">📰</span>
                        <h3 className="text-xl font-black text-gray-300 mb-2 uppercase tracking-widest">No News Available</h3>
                        <p className="text-sm text-gray-500 font-bold">Check back later for the latest updates from the sports world.</p>
                    </div>
                )}
            </div>

            {/* FAN ZONE CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0b101a] to-[#0d131f] border border-gray-800 p-10 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 group">
                    <div className="relative z-10 md:w-2/3 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <span className="text-xl">🎨</span>
                            </div>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">Creator Studio</p>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Fan Identity</span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base font-medium mb-0 max-w-lg mx-auto md:mx-0">
                            Access our premium editor, apply team frames, and feature your masterpiece on the Fan Wall.
                        </p>
                    </div>
                    <div className="relative z-10 md:w-1/3 flex justify-center md:justify-end w-full">
                        <Link to="/fan-zone" className="px-8 py-4 bg-white text-black hover:bg-gray-200 font-black rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-1 uppercase tracking-widest text-xs flex items-center gap-3">
                            Open Editor
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;