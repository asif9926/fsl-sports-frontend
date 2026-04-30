import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig'; 
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; 
import { io } from 'socket.io-client'; 

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

const LiveScore = () => {
    const [matches, setMatches] = useState([]);
    const [sport, setSport] = useState('cricket');
    const [loading, setLoading] = useState(true);
    const [isResults, setIsResults] = useState(false); 
    
    const [fslData, setFslData] = useState(null);
    const { user } = useAuth(); 

    // ==========================================
    // Data Fetching Logic
    // ==========================================
    const fetchData = async () => {
        try {
            setLoading(true);

            // ১. FSL Premium Data Fetching
            try {
                const fslRes = await axios.get(`/scores/fsl/${sport}`);
                setFslData(fslRes.data?.data);
            } catch (err) {
                console.log("FSL data fetch error");
            }

            let fetchedData = [];
            
            // ২. International Live match fetch
            try {
                const scoreRes = await axios.get(`/scores/${sport}`);
                fetchedData = scoreRes.data?.data || [];
            } catch (err) {
                console.log("Live score fetch error, trying results...", err);
            }
            
            if (fetchedData.length > 0) {
                setIsResults(false); 
            } else {
                // ৩. Recent Results fetch fallback
                try {
                    const resultRes = await axios.get(`/scores/${sport}/results`);
                    fetchedData = resultRes.data?.data || [];
                    setIsResults(true); 
                } catch (err) {
                    console.log("Results fetch error...", err);
                    fetchedData = [];
                }
            }

            setMatches(fetchedData);
        } catch (error) {
            console.error("Critical error in fetching data:", error);
            toast.error("Failed to sync scores. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Regular Polling (৫ মিনিট পর পর ইন্টারন্যাশনাল ডেটা আপডেট)
    // ==========================================
    useEffect(() => {
        setMatches([]); 
        fetchData();
        
        const interval = setInterval(fetchData, 300000); 
        return () => clearInterval(interval);
    }, [sport]); 

    // ==========================================
    // 🔥 Socket.IO Real-time Logic (FSL Updates)
    // ==========================================
    useEffect(() => {
        const socket = io(SOCKET_URL, { withCredentials: true }); 

        socket.on('fsl_score_updated', (newData) => {
            if (newData && newData.sportType === sport) {
                console.log("⚡ Real-time FSL score updated!");
                setFslData(newData);
            }
        });

        return () => {
            socket.off('fsl_score_updated'); 
            socket.disconnect();
        };
    }, [sport]);

    // ==========================================
    // UI Rendering
    // ==========================================
    return (
        <div className="min-h-screen bg-[#050811] text-gray-300 py-10 px-6 font-sans"> 
            <div className="max-w-6xl mx-auto"> 

                {/* ===================== GLOBAL SPORT SELECTOR ===================== */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 bg-[#0d131f] p-4 md:p-5 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden"> 
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div> 
                    
                    <div className="flex items-center gap-4"> 
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"> 
                            <span className="text-2xl animate-pulse">⚡</span> 
                        </div> 
                        <div> 
                            <h2 className="text-white font-black uppercase tracking-widest text-lg md:text-xl">Fsl-Sports Live</h2> 
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Select your sport to update board</p> 
                        </div> 
                    </div> 

                    <div className="flex bg-[#050811] p-1.5 rounded-2xl border border-gray-800 shadow-inner w-full sm:w-auto"> 
                        <button onClick={() => setSport('cricket')} className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-xl text-sm font-black transition-all ${sport === 'cricket' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>🏏 Cricket</button> 
                        <button onClick={() => setSport('football')} className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-xl text-sm font-black transition-all ${sport === 'football' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>⚽ Football</button> 
                    </div> 
                </div> 
                
                {/* ===================== FSL PREMIUM SECTION ===================== */}
                {fslData && ( 
                    <div className="mb-16 relative"> 
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent blur-3xl -z-10 rounded-full"></div> 

                        <div className="flex items-center gap-3 mb-6"> 
                            <span className="text-2xl animate-bounce">🏆</span> 
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-tighter italic"> 
                                {sport} Update 
                            </h2> 
                            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-widest flex items-center gap-1"> 
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span> LIVE
                            </span> 
                        </div> 

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> 
                            
                            {/* FSL Match 1 */}
                            <div className="bg-gradient-to-br from-[#121a2f] to-[#050811] border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/60 transition-all flex flex-col relative overflow-hidden group"> 
                                <div className="absolute top-0 right-0 bg-amber-500 text-[#050811] text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">Match 1</div> 
                                <p className="text-xs font-bold text-amber-500/80 mb-4 flex items-center gap-2"> 
                                    {fslData.match1.isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}  
                                    {fslData.match1.label || 'LIVE'} 
                                </p> 
                                
                                <div className="space-y-3 flex-grow border-b border-gray-800 pb-5"> 
                                    <div className="flex justify-between items-center"> 
                                        <span className="font-bold text-white text-lg truncate pr-2">{fslData.match1.teamA || 'Team A'}</span> 
                                        <div className="text-right shrink-0"> 
                                            <span className="text-xl font-black text-amber-400">{fslData.match1.scoreA || '-'}</span> 
                                            {sport === 'cricket' && fslData.match1.oversA && <span className="text-xs text-gray-400 ml-1">({fslData.match1.oversA})</span>} 
                                        </div> 
                                    </div> 
                                    <div className="flex justify-between items-center opacity-80"> 
                                        <span className="font-bold text-gray-300 text-lg truncate pr-2">{fslData.match1.teamB || 'Team B'}</span> 
                                        <div className="text-right shrink-0"> 
                                            <span className="text-xl font-black text-amber-400">{fslData.match1.scoreB || '-'}</span> 
                                            {sport === 'cricket' && fslData.match1.oversB && <span className="text-xs text-gray-400 ml-1">({fslData.match1.oversB})</span>} 
                                        </div> 
                                    </div> 
                                </div> 
                                <p className="text-[11px] text-center text-amber-500/70 font-medium italic mt-4"> 
                                    {fslData.match1.bottomText || 'Match details unavailable'} 
                                </p> 
                            </div> 

                            {/* FSL Match 2 */}
                            <div className="bg-gradient-to-br from-[#121a2f] to-[#050811] border border-amber-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/60 transition-all flex flex-col relative overflow-hidden group"> 
                                <div className="absolute top-0 right-0 bg-amber-500 text-[#050811] text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">Match 2</div> 
                                <p className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2"> 
                                    {fslData.match2.isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>} 
                                    {fslData.match2.label || 'UPCOMING'} 
                                </p> 
                                
                                <div className="space-y-3 flex-grow border-b border-gray-800 pb-5"> 
                                    <div className="flex justify-between items-center"> 
                                        <span className="font-bold text-white text-lg truncate pr-2">{fslData.match2.teamA || 'Team C'}</span> 
                                        <div className="text-right shrink-0"> 
                                            <span className="text-xl font-black text-gray-400">{fslData.match2.scoreA || '-'}</span> 
                                            {sport === 'cricket' && fslData.match2.oversA && <span className="text-xs text-gray-500 ml-1">({fslData.match2.oversA})</span>} 
                                        </div> 
                                    </div> 
                                    <div className="flex justify-between items-center opacity-80"> 
                                        <span className="font-bold text-gray-300 text-lg truncate pr-2">{fslData.match2.teamB || 'Team D'}</span> 
                                        <div className="text-right shrink-0"> 
                                            <span className="text-xl font-black text-gray-400">{fslData.match2.scoreB || '-'}</span> 
                                            {sport === 'cricket' && fslData.match2.oversB && <span className="text-xs text-gray-500 ml-1">({fslData.match2.oversB})</span>} 
                                        </div> 
                                    </div> 
                                </div> 
                                <p className="text-[11px] text-center text-gray-500 font-medium italic mt-4"> 
                                    {fslData.match2.bottomText || 'Match starts later'} 
                                </p> 
                            </div> 

                            {/* Tournament Hub */}
                            <div className="bg-[#050811] border border-gray-700 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center transition-all group"> 
                                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20"> 
                                    <span className="text-3xl">📊</span> 
                                </div> 
                                <h3 className="font-black text-white text-xl mb-2">TOURNAMENT HUB</h3> 
                                <p className="text-xs text-gray-400 mb-6 px-4">View points table, full fixtures, and player statistics of the Footstep Sports League.</p> 
                                
                                <button  
                                    onClick={() => fslData.tournamentLink && window.open(fslData.tournamentLink, '_blank')} 
                                    className={`w-full py-3 rounded-xl text-sm font-bold uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${fslData.tournamentLink ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#050811]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`} 
                                > 
                                    Full Details <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> 
                                </button> 
                            </div> 

                        </div> 
                    </div> 
                )}
                {/* ================================================================ */}

                <div className="mb-10 border-t border-gray-800/50 pt-10"> 
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase"> 
                        {isResults ? 'RECENT' : 'LIVE'}<span className="text-emerald-500">SCORE</span> 
                    </h1> 
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1"> 
                        {isResults ? 'Completed Match Results' : 'Real-time International Updates'} 
                    </p> 
                </div> 

                {loading ? ( 
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0d131f] border border-gray-800 rounded-3xl"> 
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div> 
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em]">Syncing Scores...</p> 
                    </div> 
                ) : ( 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 

                        {matches.length > 0 ? matches.map((match, i) => { 
                            return ( 
                                <div key={i} className="relative bg-[#0d131f] border border-gray-800 rounded-3xl p-6 hover:border-emerald-500/40 transition-all group shadow-xl flex flex-col h-full overflow-hidden"> 
                                    
                                    <div className="flex justify-between items-center mb-6 mt-2"> 
                                        <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full truncate max-w-[150px]"> 
                                            {sport === 'football' ? (match.tournament?.name || 'League') : (match.matchType || 'Match')} 
                                        </span> 
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isResults ? 'bg-gray-500/10' : 'bg-red-500/10'}`}> 
                                            {!isResults && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>} 
                                            <span className={`text-[10px] font-bold uppercase ${isResults ? 'text-gray-500' : 'text-red-500'}`}> 
                                                {isResults ? 'Finished' : 'Live'} 
                                            </span> 
                                        </div> 
                                    </div> 

                                    {/* ================= CORRECTED DATA MAPPING ================= */}
<div className="space-y-4 mb-6 flex-grow"> 
    {/* Team 1 */}
    <div className="flex justify-between items-center gap-3"> 
        <span className="font-bold text-white truncate flex-1 text-sm md:text-base"> 
            {sport === 'football'  
                ? (match.homeTeam?.name)  
                : (match.teams?.[0] || match.name?.split(' vs ')[0] || 'Team 1')}
        </span> 
        <span className="text-lg md:text-2xl font-black text-emerald-400 shrink-0 text-right"> 
            {sport === 'football'  
                ? (match.homeScore?.display || '0')  
                : (match.score?.[0]?.r || '0')} 
        </span> 
    </div> 
    
    {/* Team 2 */}
    <div className="flex justify-between items-center gap-3 opacity-80"> 
        <span className="font-bold text-white truncate flex-1 text-sm md:text-base"> 
            {sport === 'football'  
                ? (match.awayTeam?.name)  
                : (match.teams?.[1] || match.name?.split(' vs ')[1] || 'Team 2')}
        </span> 
        <span className="text-lg md:text-2xl font-black text-emerald-400 shrink-0 text-right"> 
            {sport === 'football'  
                ? (match.awayScore?.display || '0')  
                : (match.score?.[1]?.r || '0')} 
        </span> 
    </div> 
</div> 
                                   
                                    {/* ======================================================================= */}

                                    <div className="pt-4 border-t border-gray-800/50 mt-auto"> 
                                        <p className="text-[11px] text-center text-gray-500 font-medium italic mb-4 truncate"> 
                                            {typeof match.status === 'object' ? match.status?.description : (match.status || 'Match Over')} 
                                        </p> 
                                    </div> 
                                </div> 
                            );
                        }) : ( 
                            <div className="col-span-full text-center py-20 bg-[#0d131f] rounded-3xl border border-dashed border-gray-800"> 
                                <span className="text-4xl mb-4 grayscale opacity-50 block">🏏</span> 
                                <p className="text-gray-500 font-bold uppercase tracking-widest">No Matches Found Right Now</p> 
                                <p className="text-xs text-gray-600 mt-2">API might be out of sync. It will automatically retry in a few minutes.</p> 
                            </div> 
                        )} 
                    </div> 
                )} 
            </div> 
        </div> 
    );
};

export default LiveScore;