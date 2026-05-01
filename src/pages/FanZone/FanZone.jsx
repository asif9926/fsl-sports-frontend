import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { removeBackground } from '@imgly/background-removal';
import toast from 'react-hot-toast';
import { frameApi } from '../../api/frame.api';
import { fanWallApi } from '../../api/fanwall.api';
import CaptionStudio from '../../components/CaptionStudio';

const FanZone = () => {
    const canvasElementRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const fabricCanvas = useRef(null);
    const userImage = useRef(null);
    const baseScale = useRef(1);
    
    // UI States
    const [frames, setFrames] = useState([]);
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [selectedBackground, setSelectedBackground] = useState(null); 
    
    const [isProcessingBg, setIsProcessingBg] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [rawFile, setRawFile] = useState(null);
    const [hasImage, setHasImage] = useState(false);
    
    // Action Limit States
    const [hasRemovedBg, setHasRemovedBg] = useState(false);
    const [hasPosted, setHasPosted] = useState(false);
    
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const hasDecoration = selectedFrame || selectedBackground;

    useEffect(() => {
        const fetchFrames = async () => {
            try {
                const res = await frameApi.getFrames();
                setFrames(res.data.data);
            } catch (error) {
                console.log("Waiting for frames...");
            }
        };
        fetchFrames();
    }, []);

    useEffect(() => {
        fabricCanvas.current = new fabric.Canvas(canvasElementRef.current, {
            width: 400,
            height: 400,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
            allowTouchScrolling: false, 
        });
        return () => {
            if (fabricCanvas.current) fabricCanvas.current.dispose();
        };
    }, []);

    const addImageToCanvas = (imageUrl, isNewUpload = false) => {
        fabric.Image.fromURL(imageUrl, (img) => {
            if (!img) return toast.error("Failed to load image!");
            const cvs = fabricCanvas.current;
            if (!cvs) return;
            if (userImage.current) cvs.remove(userImage.current);

            img.set({ originX: 'center', originY: 'center', left: 200, top: 200 });
            img.scaleToWidth(250);
            baseScale.current = img.scaleX;
            setZoom(1);
            setRotation(0);

            cvs.add(img);
            cvs.setActiveObject(img);
            cvs.renderAll();
            userImage.current = img;
            if (isNewUpload) setHasImage(true);
        }, { crossOrigin: 'anonymous' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setRawFile(file);
        setHasRemovedBg(false);
        setHasPosted(false);
        
        setSelectedFrame(null);
        setSelectedBackground(null);
        if (fabricCanvas.current) {
            fabricCanvas.current.setOverlayImage(null, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
            fabricCanvas.current.setBackgroundImage(null, fabricCanvas.current.renderAll.bind(fabricCanvas.current));
        }

        const url = URL.createObjectURL(file);
        addImageToCanvas(url, true);
        e.target.value = '';
    };

    const handleBgRemove = async () => {
        if (!rawFile) return toast.error("Please upload a photo first!");
        setIsProcessingBg(true);
        const toastId = toast.loading('AI Magic is working...');
        
        try {
            const imageBlob = await removeBackground(rawFile);
            const url = URL.createObjectURL(imageBlob);
            
            const cvs = fabricCanvas.current;
            if (cvs) {
                cvs.setOverlayImage(null, cvs.renderAll.bind(cvs));
                setSelectedFrame(null);
            }

            addImageToCanvas(url, false);
            toast.success('Background Removed!', { id: toastId });
            setHasRemovedBg(true); 
        } catch (error) {
            console.error("AI Error:", error);
            toast.error('AI Processing Failed.', { id: toastId });
        } finally {
            setIsProcessingBg(false);
        }
    };

    const clearCanvasSafely = () => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;
        if (userImage.current) cvs.remove(userImage.current);
        cvs.setOverlayImage(null, cvs.renderAll.bind(cvs));
        cvs.setBackgroundImage(null, cvs.renderAll.bind(cvs));
        cvs.renderAll();

        setHasImage(false);
        userImage.current = null;
        setSelectedFrame(null);
        setSelectedBackground(null); 
        setRawFile(null);
        setZoom(1);
        setRotation(0);
        setHasRemovedBg(false);
        setHasPosted(false);
    };

    const handleZoomChange = (value) => {
        const newZoom = parseFloat(value);
        setZoom(newZoom);
        if (userImage.current && fabricCanvas.current) {
            userImage.current.set({ scaleX: baseScale.current * newZoom, scaleY: baseScale.current * newZoom });
            fabricCanvas.current.renderAll();
        }
    };

    const handleRotationChange = (value) => {
        const newAngle = parseInt(value);
        setRotation(newAngle);
        if (userImage.current && fabricCanvas.current) {
            userImage.current.set({ angle: newAngle });
            fabricCanvas.current.renderAll();
        }
    };

    const resetAll = () => {
        if (!userImage.current || !fabricCanvas.current) return;
        setZoom(1);
        setRotation(0);
        userImage.current.set({ scaleX: baseScale.current, scaleY: baseScale.current, angle: 0, left: 200, top: 200 });
        fabricCanvas.current.renderAll();
    };

    const applyFrame = (imageUrl) => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;

        if (hasRemovedBg) {
            setSelectedBackground(imageUrl);
            setSelectedFrame(null);
            cvs.setOverlayImage(null, cvs.renderAll.bind(cvs));

            fabric.Image.fromURL(imageUrl, (img) => {
                const scale = Math.max(cvs.width / img.width, cvs.height / img.height);
                img.set({
                    originX: 'center',
                    originY: 'center',
                    left: cvs.width / 2,
                    top: cvs.height / 2,
                    scaleX: scale,
                    scaleY: scale
                });
                cvs.setBackgroundImage(img, cvs.renderAll.bind(cvs));
            }, { crossOrigin: 'anonymous' });

        } else {
            setSelectedFrame(imageUrl);
            setSelectedBackground(null);
            cvs.setBackgroundImage(null, cvs.renderAll.bind(cvs));

            fabric.Image.fromURL(imageUrl, (img) => {
                img.scaleToWidth(cvs.width);
                img.scaleToHeight(cvs.height);
                img.set({ selectable: false, evented: false });
                cvs.setOverlayImage(img, cvs.renderAll.bind(cvs));
            }, { crossOrigin: 'anonymous' });
        }
    };

    const removeFrame = () => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;
        cvs.setOverlayImage(null, cvs.renderAll.bind(cvs));
        cvs.setBackgroundImage(null, cvs.renderAll.bind(cvs)); 
        setSelectedFrame(null);
        setSelectedBackground(null);
    };

    const handleDownload = () => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;
        cvs.discardActiveObject();
        cvs.renderAll();
        const dataURL = cvs.toDataURL({ format: 'png', quality: 1, multiplier: 2.7 });
        const link = document.createElement('a');
        link.download = `FSL-SPORTS-Post-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        toast.success('Downloaded in HD Quality!');
        
        setTimeout(() => {
            clearCanvasSafely();
            toast('Ready for a new photo!', { icon: '✨' });
        }, 1000);
    };

    const handleShare = async () => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;
        cvs.discardActiveObject();
        cvs.renderAll();
        const dataURL = cvs.toDataURL({ format: 'png', quality: 1, multiplier: 2.7 });
        try {
            const blob = await (await fetch(dataURL)).blob();
            const file = new File([blob], 'FSL-Fan-Post.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My FSL-SPORTS Fan Post!',
                    text: 'Check out this awesome photo I created on FSL-SPORTS Fan Zone!',
                    files: [file]
                });
                toast.success('Shared successfully!');
                
                setTimeout(() => {
                    clearCanvasSafely();
                    toast('Ready for a new photo!', { icon: '✨' });
                }, 1000);

            } else {
                toast.error("Sharing directly to apps is not supported on this browser.");
            }
        } catch (error) {
            console.log("User cancelled sharing.");
        }
    };

    const handlePostToWall = async () => {
        const cvs = fabricCanvas.current;
        if (!cvs) return;
        cvs.discardActiveObject();
        cvs.renderAll();
        const dataURL = cvs.toDataURL({ format: 'jpeg', quality: 1, multiplier: 2.7 });
        
        setIsPosting(true);
        const toastId = toast.loading('Posting to Fan Wall...');
        try {
            const blob = await (await fetch(dataURL)).blob();
            const file = new File([blob], `wall-post-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('image', file);

            await fanWallApi.createPost(formData);
            toast.success('Posted successfully to Fan Wall! 🎉', { id: toastId });
            setHasPosted(true); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post.', { id: toastId });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-gray-300 flex flex-col pt-6 pb-20 overflow-x-hidden font-sans">
            {/* Header / Top Action Bar */}
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/20">
                        <span className="text-xl md:text-2xl">🎨</span>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Creator Studio</h1>
                        <p className="text-[9px] md:text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Fan Zone Premium Editor</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start">
                    {hasImage && (
                        <button 
                            onClick={handleBgRemove} 
                            disabled={isProcessingBg || hasRemovedBg} 
                            className={`flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold transition text-xs md:text-sm flex justify-center items-center gap-2 ${!hasRemovedBg && !isProcessingBg ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                            {hasRemovedBg ? '✨ BG Removed' : '✨ Remove BG'}
                        </button>
                    )}
                    
                    <button 
                        onClick={handleShare} 
                        disabled={!hasImage || !hasDecoration}
                        className={`flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold transition text-xs md:text-sm flex justify-center items-center gap-2 ${hasImage && hasDecoration ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-lg shadow-blue-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        Share
                    </button>

                    <button 
                        onClick={handlePostToWall} 
                        disabled={!hasImage || !hasDecoration || isPosting || hasPosted}
                        className={`flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold transition text-xs md:text-sm flex justify-center items-center gap-2 ${hasImage && hasDecoration && !hasPosted ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        {isPosting ? 'Posting...' : hasPosted ? '✅ Posted' : '🌍 Post to Wall'}
                    </button>

                    <button 
                        onClick={handleDownload} 
                        disabled={!hasImage || !hasDecoration}
                        className={`flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-semibold transition text-xs md:text-sm flex justify-center items-center gap-2 ${hasImage && hasDecoration ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        Download
                    </button>
                </div>
            </div>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

            {/* Main Editor Container - Cleaned up and single layout */}
            <div className="flex flex-col lg:flex-row items-start gap-0 max-w-6xl mx-auto w-full bg-[#0d131f] border-y md:border border-gray-800 md:rounded-xl shadow-2xl relative">

                {/* Left/Top Area: Canvas (Sticky Setup) */}
                <div className="w-full lg:flex-1 flex flex-col items-center justify-center p-4 md:p-10 bg-[#0a0f18] min-h-[350px] md:min-h-[500px] sticky top-20 z-40 border-b border-gray-800 lg:border-b-0">
                    
                    <div className="relative shadow-2xl bg-white rounded-md overflow-hidden transform scale-[0.8] sm:scale-90 md:scale-100 origin-top" style={{ width: '400px', height: '400px' }}>
                        {!hasImage && (
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="absolute inset-0 z-20 border-2 border-dashed border-gray-600 bg-[#0d131f] hover:bg-gray-800 flex flex-col items-center justify-center cursor-pointer transition-all group"
                            >
                                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</span>
                                <span className="text-gray-400 font-medium tracking-wide">Click to Upload Image</span>
                            </div>
                        )}
                        <div className="absolute inset-0 z-10" style={{ touchAction: 'none' }}>
                            <canvas ref={canvasElementRef} />
                        </div>
                        {isProcessingBg && (
                            <div className="absolute inset-0 bg-[#0a0f18]/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                                <p className="font-semibold text-indigo-400 tracking-wider">Processing...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right/Bottom Area: Controls (Scrollable) */}
                <div className="w-full lg:w-[360px] bg-[#0b101a] border-l border-gray-800 p-5 md:p-6 flex flex-col">
                    
                    {/* Frames Selection */}
                    {hasImage && (
                        <div className="w-full mb-8 bg-[#111827] p-4 rounded-xl border border-gray-700/50 shadow-inner">
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-700/50 pb-2">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <p className="text-xs font-black text-gray-200 uppercase tracking-[0.15em]">
                                    {hasRemovedBg ? 'Set New Background' : 'Select Frame Overlay'}
                                </p>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {frames.map((frame) => {
                                    const isSelected = selectedFrame === frame.imageUrl || selectedBackground === frame.imageUrl;
                                    return (
                                        <div 
                                            key={frame._id}
                                            onClick={() => applyFrame(frame.imageUrl)}
                                            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-800 rounded-xl cursor-pointer border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-emerald-500 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-transparent active:scale-95'}`}
                                        >
                                            <img src={frame.imageUrl} alt={frame.name} className="w-full h-full object-cover" crossOrigin="anonymous"/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-base md:text-lg">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        Adjustments
                    </h3>
                    
                    <div className="mb-5">
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span className="text-gray-400 font-medium">Zoom</span>
                            <span className="text-emerald-500 font-medium">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="py-2">
                            <input type="range" min="0.5" max="3" step="0.05" value={zoom} onChange={(e) => handleZoomChange(e.target.value)} disabled={!hasImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between text-xs md:text-sm mb-2">
                            <span className="text-gray-400 font-medium">Rotation</span>
                            <span className="text-emerald-500 font-medium">{rotation}°</span>
                        </div>
                        <div className="py-2 mb-3">
                            <input type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => handleRotationChange(e.target.value)} disabled={!hasImage} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleRotationChange(90)} disabled={!hasImage} className="bg-[#1a2235] active:bg-[#253047] text-gray-300 text-xs py-2.5 rounded-md font-medium transition">90°</button>
                            <button onClick={() => handleRotationChange(180)} disabled={!hasImage} className="bg-[#1a2235] active:bg-[#253047] text-gray-300 text-xs py-2.5 rounded-md font-medium transition">180°</button>
                            <button onClick={() => handleRotationChange(270)} disabled={!hasImage} className="bg-[#1a2235] active:bg-[#253047] text-gray-300 text-xs py-2.5 rounded-md font-medium transition">270°</button>
                        </div>
                    </div>
                    
                    <button onClick={resetAll} disabled={!hasImage} className="w-full py-3 bg-[#1a2235] active:bg-[#253047] text-gray-300 rounded-lg font-medium transition flex justify-center items-center gap-2 mb-8 text-sm">
                        Reset All Settings
                    </button>
                    
                    <div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</p>
                        <div className="flex flex-col gap-2.5">
                            <button onClick={() => fileInputRef.current.click()} className="w-full py-3 px-4 bg-[#1a2235] active:bg-[#253047] text-gray-300 rounded-lg font-medium transition flex items-center gap-3 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Change Image
                            </button>
                            
                            <button onClick={clearCanvasSafely} disabled={!hasImage} className="w-full py-3 px-4 bg-rose-500/10 active:bg-rose-500/20 text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center gap-3 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Remove Photo
                            </button>

                            <button onClick={removeFrame} disabled={!hasDecoration} className="w-full py-3 px-4 bg-[#1a2235] active:bg-[#253047] text-gray-300 rounded-lg font-medium transition flex items-center gap-3 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {hasRemovedBg ? 'Remove Background' : 'Remove Frame'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Caption Studio Section */}
            <div className="max-w-6xl mx-auto w-full mt-8 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CaptionStudio />
            </div>

        </div>
    );
};

export default FanZone;