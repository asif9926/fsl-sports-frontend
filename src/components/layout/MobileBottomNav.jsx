import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Smart Click Handler for Mobile
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
                border: '1px solid rgba(16, 185, 129, 0.2)',
            }
        });
        navigate('/login');
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-[100] bg-[#0d131f]/95 backdrop-blur-xl border-t border-gray-800/60 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-2 relative">
        
        {/* Home */}
        <NavLink to="/home" className={({isActive}) => `flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px] font-bold tracking-wider">Home</span>
        </NavLink>

        {/* Fan Wall - Protected */}
        <NavLink 
          to="/fan-wall" 
          onClick={handleProtectedClick}
          className={({isActive}) => `flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-bold tracking-wider">Wall</span>
        </NavLink>

        {/* Center CTA - Fan Zone */}
        <div className="relative -top-5">
          <NavLink to="/fan-zone" className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] border-4 border-[#070b14] active:scale-90 transition-all duration-200">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </NavLink>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 whitespace-nowrap">Fan Zone</span>
        </div>

        {/* Live Scores */}
        <NavLink to="/live-score" className={({isActive}) => `flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-bold tracking-wider">Live</span>
        </NavLink>

        {/* News */}
        <NavLink to="/news" className={({isActive}) => `flex flex-col items-center gap-1 w-16 transition-all duration-300 ${isActive ? 'text-emerald-500 scale-110' : 'text-gray-500 hover:text-gray-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
          <span className="text-[10px] font-bold tracking-wider">News</span>
        </NavLink>

      </div>
    </div>
  );
};

export default MobileBottomNav;