import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axiosConfig'; 
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

const FootballOverlay = () => {
    const [fslData, setFslData] = useState(null);
    const [displayTime, setDisplayTime] = useState(""); // 🕒 টাইমারের জন্য নতুন স্টেট
    const timerIntervalRef = useRef(null);

    // ==========================================
    // Data Fetching & Socket Logic
    // ==========================================
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await axios.get('/scores/fsl/football');
                setFslData(res.data?.data);
            } catch (error) {
                console.log("Failed to fetch overlay data");
            }
        };
        fetchInitialData();

        const socket = io(SOCKET_URL, { withCredentials: true });
        
        socket.on('fsl_score_updated', (newData) => {
            if (newData && newData.sportType === 'football') {
                setFslData(newData);
            }
        });

        return () => {
            socket.off('fsl_score_updated');
            socket.disconnect();
        };
    }, []);

    // ==========================================
    // 🕒 Smart Auto-Timer Logic
    // ==========================================
    useEffect(() => {
        // আগের কোনো টাইমার চললে সেটা ক্লিয়ার করে দেওয়া
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        const bottomText = fslData?.match1?.bottomText || "";
        
        // চেক করা হচ্ছে টেক্সটটি "মিনিট:সেকেন্ড" (যেমন 45:10) ফরম্যাটে আছে কিনা
        const timeMatch = bottomText.match(/^(\d+):(\d{2})$/);

        if (timeMatch && fslData?.match1?.isLive) {
            // যদি লাইভ হয় এবং টাইম দেওয়া থাকে, তাহলে টাইমার শুরু হবে
            let mins = parseInt(timeMatch[1], 10);
            let secs = parseInt(timeMatch[2], 10);

            // সাথে সাথে টাইমটা স্ক্রিনে সেট করা
            setDisplayTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);

            // প্রতি সেকেন্ডে ১ করে বাড়ানো
            timerIntervalRef.current = setInterval(() => {
                secs++;
                if (secs >= 60) {
                    secs = 0;
                    mins++;
                }
                setDisplayTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            }, 1000);

        } else {
            // যদি টাইম ফরম্যাট না হয় (যেমন "Halftime" বা "Match Over"), তাহলে শুধু টেক্সট দেখাবে
            setDisplayTime(bottomText);
        }

        // ক্লিনআপ
        return () => clearInterval(timerIntervalRef.current);
    }, [fslData?.match1?.bottomText, fslData?.match1?.isLive]);


    if (!fslData || !fslData.match1) return null;

    const { match1 } = fslData;

    return (
        <div className="w-screen h-screen bg-transparent flex justify-center items-start pt-12 font-sans overflow-hidden">
            
            <div className="flex flex-col items-center">
                {/* Premium Scoreboard Container */}
                <div className="flex items-stretch bg-[#050811]/90 backdrop-blur-md border border-gray-700/50 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden text-white z-10">

                    {/* 🔥 1. BRAND LOGO SECTION (Far Left) 🔥 */}
                    {/* আমি আপনার লোগোটির ডিজাইন হুবহু কোড দিয়ে বানিয়ে দিয়েছি */}
                    <div className="flex flex-col items-end justify-center px-5 md:px-6 bg-[#050811] border-r border-gray-800 shrink-0">
                        <div className="flex items-center gap-0.5">
                            <span className="font-black italic text-lg tracking-tighter text-white">FSL-</span>
                            <span className="font-black italic text-lg tracking-tighter text-emerald-500">SPORTS</span>
                        </div>
                        <span className="bg-emerald-500 text-[#050811] text-[8px] font-black px-1.5 py-0.5 rounded-sm mt-0.5 tracking-wider leading-none">
                            V2.0
                        </span>
                    </div>

                    {/* 2. Team A */}
                    <div className="flex items-center justify-center px-6 md:px-8 py-3 bg-gradient-to-r from-gray-900 to-[#0a0f1c]">
                        <span className="font-black text-xl md:text-2xl tracking-widest uppercase truncate max-w-[200px]">
                            {match1.teamA || 'HOME'}
                        </span>
                    </div>

                    {/* 3. Score section */}
                    <div className="flex items-center justify-center px-6 md:px-8 bg-emerald-600 border-x border-emerald-400/30 min-w-[120px]">
                        <span className="font-black text-3xl md:text-4xl tabular-nums drop-shadow-md">
                            {match1.scoreA || '0'} - {match1.scoreB || '0'}
                        </span>
                    </div>

                    {/* 4. Team B */}
                    <div className="flex items-center justify-center px-6 md:px-8 py-3 bg-gradient-to-l from-gray-900 to-[#0a0f1c]">
                        <span className="font-black text-xl md:text-2xl tracking-widest uppercase truncate max-w-[200px]">
                            {match1.teamB || 'AWAY'}
                        </span>
                    </div>

                    {/* 5. Match Info/Live Ping (Far Right) */}
                    <div className={`flex items-center justify-center px-6 min-w-[100px] ${match1.isLive ? 'bg-red-600' : 'bg-gray-800'}`}>
                        <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            {match1.isLive && <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>}
                            {match1.label || 'LIVE'}
                        </span>
                    </div>
                </div>

                {/* 🔥 🕒 Live Auto-Updating Timer Badge 🔥 */}
                {displayTime && (
                    <div className="mt-[-5px] bg-white text-black px-8 py-1.5 rounded-b-xl border-x border-b border-gray-300 shadow-xl font-black text-sm tracking-widest uppercase flex items-center gap-2 z-0 animate-in slide-in-from-top-2">
                        {/* যদি টাইমার চলে, তবে ঘড়ির আইকনটি ঘুরবে/পালস করবে */}
                        {match1.isLive && displayTime.includes(":") && (
                            <svg className="w-4 h-4 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        )}
                        {/* লাইভ কাউন্টিং টাইম */}
                        <span className="tabular-nums">{displayTime}</span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default FootballOverlay;