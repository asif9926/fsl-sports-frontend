import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_VERSION } from '../../constants';

const About = () => {
    // 🔥 আপনার তৈরি করা সবগুলো ফিচারের বিস্তারিত লিস্ট (৬টি কার্ড)
    const features = [
        {
            title: "Creator Studio (Fan Zone)",
            icon: "🎨",
            color: "from-indigo-500 to-purple-600",
            glow: "shadow-indigo-500/20",
            points: [
                "Interactive Canvas Editor (fabric.js)",
                "Dynamic Frame & Background placement",
                "Groq AI-powered Smart Caption Generator",
                "High-Resolution Post Download"
            ]
        },
        {
            title: "Community Gallery",
            icon: "🔥",
            color: "from-orange-500 to-red-600",
            glow: "shadow-orange-500/20",
            points: [
                "Masonry-style Fan Wall architecture",
                "Real-time Post Liking & Tracking",
                "Live Global Chat Widget for fans",
                "Social Media sharing integration"
            ]
        },
        {
            title: "Live Fan Banter", 
            icon: "💬",
            color: "from-green-400 to-emerald-600",
            glow: "shadow-emerald-500/20",
            points: [
                "Real-time Global Chat room for fans",
                "Instant message delivery & UI updates",
                "Interactive & engaging community hub",
                "Custom floating chat widget integration"
            ]
        },
        {
            title: "FSL Live Hub",
            icon: "🏆",
            color: "from-amber-400 to-orange-500",
            glow: "shadow-amber-500/20",
            points: [
                "Real-time Cricket & Football Scores",
                "Dynamic Match routing & Updates",
                "Over-by-over detailed tracking",
                "Tournament Hub & Leaderboards"
            ]
        },
        {
            title: "Premium News Desk",
            icon: "📰",
            color: "from-sky-400 to-blue-600",
            glow: "shadow-blue-500/20",
            points: [
                "Markdown supported sports articles",
                "Dynamic Category filtering",
                "Source Link & External reference integration",
                "Automated image optimization"
            ]
        },
        {
            title: "Admin Superpowers",
            icon: "⚡",
            color: "from-rose-500 to-pink-600",
            glow: "shadow-rose-500/20",
            points: [
                "Real-time Website Visitor Analytics",
                "Nodemailer Broadcast Email System",
                "Dynamic Frame & News Management",
                "Iron-clad JWT & Cookie Security"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050811] text-gray-300 py-12 px-6 font-sans relative overflow-hidden pb-24">
            
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* Back Button */}
                <div className="mb-8 flex justify-start">
                    <Link 
                        to="/home" 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-emerald-400 transition-all duration-300 text-sm font-bold backdrop-blur-md group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Website
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-20 mt-4">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {APP_NAME} {APP_VERSION}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        More Than Just a <br className="hidden md:block"/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Sports Platform</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        FSL-SPORTS is an engineered masterpiece designed to bridge the gap between fans, players, and management. Experience a highly interactive, AI-driven, and secure sports ecosystem.
                    </p>
                </div>

                {/* Comprehensive Features Section (3 Columns Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((item, idx) => (
                        <div key={idx} className="bg-[#0d131f]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 shadow-2xl group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">{item.title}</h3>
                            </div>
                            <ul className="space-y-3">
                                {item.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400 font-medium leading-snug">
                                        <svg className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 🔥 MEET THE DEVELOPER (MINIMALIST PREMIUM - NO IMAGE) */}
                <div className="bg-[#0d131f]/50 backdrop-blur-2xl border border-gray-800 rounded-[35px] p-10 md:p-16 shadow-2xl relative overflow-hidden text-center group border-dashed border-emerald-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            💻 Lead Architect & Developer
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter uppercase italic">
                            Asif Ul Haque
                        </h2>
                        
                        <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs mb-8">
                            EEE Undergraduate • Green University of Bangladesh
                        </p>
                        
                        <p className="text-gray-400 leading-relaxed mb-12 text-base md:text-lg font-medium italic">
                            "The visionary mind behind FSL-SPORTS. Specializing in the MERN stack, Asif engineered this platform from the ground up, integrating advanced AI features, real-time communication, and a secure user experience. With a strong passion for IoT and Renewable Energy, he continues to innovate at the intersection of technology and sports."
                        </p>

                        {/* Skills Badges */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {['MERN Stack', 'Tailwind CSS', 'AI Integration', 'WebSockets', 'Canvas API', 'IoT'].map((skill, i) => (
                                <span key={i} className="bg-[#050811] border border-gray-700 text-gray-300 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-inner group-hover:border-emerald-500/30 transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                </div>

            </div>
        </div>
    );
};

export default About;