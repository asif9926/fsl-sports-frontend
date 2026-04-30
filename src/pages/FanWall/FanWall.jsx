import React, { useEffect, useState } from 'react';
import { fanWallApi } from '../../api/fanwall.api';
import { useAuth } from '../../context/AuthContext'; 
import toast from 'react-hot-toast';
import FanChat from '../../components/FanChat';

const FanWall = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth(); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fanWallApi.getWallPosts();
                setPosts(response.data.data);
            } catch (error) {
                toast.error('Failed to load Fan Wall!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        if (!user) return toast.error("Please login to like posts!");
        setPosts(posts.map(post => {
            if (post._id === postId) {
                const hasLiked = post.likes.includes(user._id);
                const updatedLikes = hasLiked ? post.likes.filter(id => id !== user._id) : [...post.likes, user._id];
                return { ...post, likes: updatedLikes };
            }
            return post;
        }));
        try { await fanWallApi.toggleLike(postId); } catch (error) { toast.error("Failed to like post"); }
    };

    // Time Formatting Function
    const timeAgo = (date) => {
        if (!date) return "Just now";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "Y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "M ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <div className="min-h-screen bg-[#050811] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden pb-24">
            
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* 🔥 max-w-7xl পুনরায় ফিরিয়ে আনা হয়েছে পারফেক্ট সাইজের জন্য */}
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
<div className="text-center mb-16">
    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Community Gallery
    </div>
    
    {/* 🔥 Updated: White and Green Heading */}
    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
        <span className="text-white">Fan</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Wall</span>
    </h1>
</div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    </div>
                ) : (
                    /* 🔥 lg:columns-3 দিয়ে আগের পারফেক্ট ৩ কলামে সেট করা হয়েছে */
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                        {posts.map((post) => (
                            <div key={post._id} className="break-inside-avoid inline-block w-full mb-6 bg-gradient-to-b from-[#121a2f] to-[#0a0f1c] rounded-3xl overflow-hidden border border-gray-800/80 shadow-lg hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)] hover:border-emerald-500/40 transition-all duration-500 group">
                                
                                {/* Image Section */}
                                <div className="relative overflow-hidden bg-[#050811]">
                                    <img 
                                        src={post.imageUrl} 
                                        alt="Fan Post" 
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        loading="lazy" 
                                        crossOrigin="anonymous"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <a href={post.imageUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 hover:scale-110 transition-all duration-300 shadow-xl">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Footer / User Info Section */}
                                <div className="p-5 flex items-center justify-between relative z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img src={post.user?.profileImage || `https://ui-avatars.com/api/?name=${post.user?.username}`} className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover" crossOrigin="anonymous"/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">{post.user?.username}</span>
                                            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                                                {timeAgo(post.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Like Button & Counter */}
                                    <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 group/btn focus:outline-none">
                                        <div className={`p-2 rounded-full transition-all duration-300 ${post.likes?.includes(user?._id) ? 'bg-pink-500/10 text-pink-500' : 'bg-gray-800/50 text-gray-400 group-hover/btn:bg-gray-800 group-hover/btn:text-pink-400'}`}>
                                            <svg className={`w-5 h-5 transition-transform duration-300 ${post.likes?.includes(user?._id) ? 'fill-current scale-110' : 'fill-none stroke-current stroke-2 group-hover/btn:scale-110'}`} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                        </div>
                                        <span className={`text-xs font-bold transition-colors ${post.likes?.includes(user?._id) ? 'text-pink-500' : 'text-gray-500 group-hover/btn:text-gray-300'}`}>
                                            {post.likes?.length || 0}
                                        </span>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Live Chat Widget */}
            <FanChat room="global_fanwall" />

        </div>
    );
};

export default FanWall;