import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import toast from 'react-hot-toast';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

   
useEffect(() => {
    const fetchNews = async () => {
        try {
            const res = await newsApi.getAllNews();
            setNews(res.data.data);
        } catch (error) {
            // local toast delete kora holo duplicate thakate
            console.error("News load error:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchNews();
}, []);

    return (
        <div className="min-h-screen bg-[#050811] text-gray-300 py-10 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 border-b border-gray-800 pb-6">
                    <h1 className="text-4xl font-black text-white tracking-tighter italic">SPORTS <span className="text-orange-500">NEWS</span></h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Latest updates from around the globe</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 animate-pulse text-orange-500 font-bold uppercase tracking-widest">Loading latest news...</div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 bg-[#0d131f] rounded-3xl border border-dashed border-gray-800">
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No news available at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <Link to={`/news/${item._id}`} key={item._id} className="group bg-[#0d131f] border border-gray-800 rounded-3xl overflow-hidden hover:border-orange-500/40 transition-all shadow-xl flex flex-col h-full hover:-translate-y-1">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-lg">
                                        {item.category}
                                    </div>
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" crossOrigin="anonymous" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> {item.views}</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-100 group-hover:text-orange-400 transition-colors line-clamp-2 mb-3">{item.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">{item.content}</p>
                                    <div className="mt-auto text-orange-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Read Story <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;