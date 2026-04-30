import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, APP_VERSION } from '../../constants';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/';

    // Fan Wall-কে Protected করা হয়েছে
    const navItems = [
        { name: 'Home', path: '/home', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { name: 'Fan Zone', path: '/fan-zone', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 13" /></svg> },
        { name: 'Fan Wall', path: '/fan-wall', isProtected: true, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { name: 'Live', path: '/live-score', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
        { name: 'News', path: '/news', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
    ];

    // Smart Click Handler
    const handleProtectedClick = (e) => {
        if (!user) {
            e.preventDefault();
            toast('Please login first! New here? Create an account to join us.', {
                icon: '🔒',
                id: 'auth-required',
                duration: 4000,
                style: {
                    background: '#0d131f',
                    color: '#fff',
                    border: '1px solid rgba(16, 185, 129, 0.2)', // Emerald border
                }
            });
            navigate('/login');
        }
    };

    return (
        <nav className="fixed top-0 w-full z-[100] bg-[#0d131f]/80 backdrop-blur-xl border-b border-gray-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    <NavLink to="/home" className="relative flex flex-col items-start group">
                        <span className="text-2xl font-black italic tracking-tighter text-white">
                            {APP_NAME.split('-')[0]}
                            <span className="text-emerald-500">-{APP_NAME.split('-')[1]}</span>
                        </span>
                        <span className="absolute -bottom-2.5 right-0 text-[9px] font-bold bg-emerald-500 text-[#0d131f] px-1.5 py-0.5 rounded-sm uppercase tracking-widest leading-none shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            {APP_VERSION}
                        </span>
                    </NavLink>

                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                onClick={(e) => item.isProtected && handleProtectedClick(e)}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                                    ${isActive 
                                        ? 'bg-[#0a271d] text-[#00d26a] shadow-[0_0_15px_rgba(0,210,106,0.15)]'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                    }
                                `}
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <NavLink 
                            to="/profile" 
                            onClick={handleProtectedClick}
                            className={({isActive}) => `w-11 h-11 rounded-full border-2 overflow-hidden transition-all duration-300 ${isActive ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105' : 'border-gray-700 hover:border-emerald-500'}`}
                        >
                           
                            {user?.profileImage ? (
    <img 
        src={user.profileImage.startsWith('http') ? user.profileImage : `${IMAGE_BASE_URL}${user.profileImage}`} 
        alt="Profile" 
        referrerPolicy="no-referrer" /* 🔥 shudhu ei line ti add korun */
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
    />
) : user?.username ? (

    // লগইন করা ইউজার ছবি না দিলে নামের প্রথম অক্ষর দেখাবে
    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        <span className="text-[#0d131f] font-black text-lg uppercase">
            {user.username.charAt(0)}
        </span>
    </div>
) : (
    // লগইন না করা থাকলে (Guest) ডিফল্ট আইকন দেখাবে
    <div className="w-full h-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
        <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
    </div>
)}

                            
                        </NavLink>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;