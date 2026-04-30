import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext'; 

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
const socket = io(SOCKET_URL, { withCredentials: true });

const FanChat = ({ room = 'global_fanwall' }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [currentMsg, setCurrentMsg] = useState('');
    const [isOpen, setIsOpen] = useState(false); // 🔥 চ্যাট ওপেন/ক্লোজ স্টেট
    const chatEndRef = useRef(null);
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/';

    useEffect(() => {
        socket.emit('join_room', room);
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => socket.off('receive_message');
    }, [room]);

    useEffect(() => {
        if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (currentMsg.trim() !== '' && user) {
            const messageData = {
                room,
                userId: user._id,
                username: user.username,
                avatar: user.profileImage,
                message: currentMsg,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit('send_message', messageData);
            setCurrentMsg('');
        }
    };

    return (
        <div className="fixed bottom-20 right-6 z-[999] flex flex-col items-end">
            
            {/* 💬 Floating Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#0d131f]/95 backdrop-blur-2xl border border-gray-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col mb-4 animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="bg-[#0a271d] px-5 py-4 border-b border-emerald-500/20 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h3 className="text-emerald-500 font-black tracking-widest uppercase text-xs">Fan Banter</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow p-5 overflow-y-auto custom-scrollbar space-y-4 bg-transparent">
                        {messages.map((msg, idx) => {
                            const isMe = msg.userId === user?._id;
                            return (
                                <div key={idx} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-gray-700 bg-gray-800">
                                        {msg.avatar ? (
                                            <img src={msg.avatar.startsWith('http') ? msg.avatar : `${IMAGE_BASE_URL}${msg.avatar}`} alt="av" className="w-full h-full object-cover" crossOrigin="anonymous"/>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">{msg.username.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-3 py-2 text-sm rounded-2xl ${isMe ? 'bg-emerald-500 text-[#0d131f] rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}`}>
                                            <p className="text-[10px] font-black opacity-50 mb-0.5">{msg.username}</p>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 bg-[#050811] border-t border-gray-800 flex gap-2">
                        <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)} placeholder="Say something..." className="flex-grow bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"/>
                        <button type="submit" disabled={!currentMsg.trim()} className="bg-emerald-500 text-black p-2 rounded-xl disabled:opacity-50 transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            )}

            {/* 🚀 Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${isOpen ? 'bg-gray-800 text-white rotate-180' : 'bg-emerald-500 text-black hover:scale-110'}`}
            >
                {isOpen ? (
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                    <div className="relative">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        {messages.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-500"></span>}
                    </div>
                )}
            </button>
        </div>
    );
};

export default FanChat;