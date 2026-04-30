import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_VERSION } from '../../constants'; 

const Footer = () => {
    const [joinStatus, setJoinStatus] = useState('');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // 🔥 PWA Install Prompt ধরার জন্য
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e); 
        });
    }, []);

    const handleInstallApp = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };

    // 🔥 ২ সেকেন্ডের Join Now ম্যাজিক
    const handleJoinClick = () => {
        setJoinStatus('Thank You! 🎉');
        setTimeout(() => {
            setJoinStatus('');
        }, 2000);
    };

    return (
        <footer className="bg-[#0a0f18] border-t border-gray-800/60 relative overflow-hidden mt-auto z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-28 md:pb-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-gray-800/60 mb-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">
                            Stay in the <span className="text-emerald-500">Game</span>
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">Get the latest updates and exclusive offers.</p>
                    </div>
                    <div className="w-full md:w-auto flex items-center bg-gray-900/50 border border-gray-800 p-1.5 rounded-2xl backdrop-blur-sm transition-all duration-300">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="bg-transparent border-none text-sm text-white px-4 py-2 w-full md:w-64 focus:outline-none placeholder:text-gray-600"
                        />
                        <button 
                            onClick={handleJoinClick}
                            className={`${joinStatus ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-[#0d131f]'} hover:opacity-90 text-xs font-black uppercase px-6 py-2.5 rounded-xl transition-all duration-300 active:scale-95 w-[120px]`}
                        >
                            {joinStatus ? joinStatus : 'Join Now'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">
                    <div className="space-y-6 md:col-span-2">
                        <Link to="/home" className="inline-block relative group">
                            <div className="relative pr-12">
                                <span className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                    {APP_NAME.split('-')[0]}<span className="text-emerald-500">-{APP_NAME.split('-')[1]}</span>
                                </span>
                                <span className="absolute bottom-1 -right-2 text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-[0.1em] group-hover:bg-emerald-500 group-hover:text-[#0d131f] transition-all duration-300">
                                    {APP_VERSION}
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                            The ultimate platform for sports fans. Experience live scores, breaking news, and the interactive Fan Wall all in one place.
                        </p>

                        {/* 🚀 Install App Button */}
                        {deferredPrompt && (
                            <button 
                                onClick={handleInstallApp}
                                className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Install FSL-SPORTS App
                            </button>
                        )}
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 opacity-50">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link to="/fan-wall" className="text-gray-500 hover:text-emerald-500 transition-colors text-sm font-bold">Fan Wall</Link></li>
                            <li><Link to="/live-score" className="text-gray-500 hover:text-emerald-500 transition-colors text-sm font-bold">Live Scores</Link></li>
                            {/* 🚀 About Link */}
                            <li><Link to="/about" className="text-emerald-500/70 hover:text-emerald-400 transition-colors text-sm font-bold flex items-center justify-center md:justify-start gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                About FSL-SPORTS
                            </Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 opacity-50">Base</h4>
                        <ul className="space-y-4 flex flex-col items-center md:items-start">
                            <li className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-emerald-500/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                </svg>
                                <span className="text-gray-400 text-sm font-semibold">Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} {APP_NAME}. Engineered for excellence.
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">
                        Designed with <svg className="w-3.5 h-3.5 text-rose-500 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> by Asif
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;