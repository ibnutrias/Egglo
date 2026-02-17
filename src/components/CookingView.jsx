import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
// Import Icon Speaker untuk Mute/Unmute
import { PauseIcon, PlayIcon, StopIcon, CheckIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import cookingAnim from '../assets/cooking_pot.json';
import checkAnim from '../assets/check.json';

const CookingView = ({ totalTime, timeLeft, isPaused, onStop, onTogglePause }) => {

    const isFinished = timeLeft === 0;

    // --- STATE AUDIO ---
    const [isMuted, setIsMuted] = useState(false); // Default: Suara Nyala

    // --- REFS AUDIO (Agar tidak re-render saat play/pause) ---
    // Pastikan file ada di folder public/sounds/
    const tickingAudio = useRef(new Audio('/sounds/ticking.mp3'));
    const alarmAudio = useRef(new Audio('/sounds/alarm.mp3'));

    // --- LOGIKA HUD ---
    const percentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    const rotation = (percentage / 100 * 180) - 180;
    const size = 300;
    const center = size / 2;
    const radius = 130;
    const arcLength = radius * Math.PI;
    const strokeDashoffset = arcLength - (percentage / 100) * arcLength;
    const isStarted = percentage > 0.5;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- EFEK 1: SUARA TICKING ---
    useEffect(() => {
        // Konfigurasi awal
        tickingAudio.current.loop = true;
        tickingAudio.current.volume = 0.5; // Set volume 50% biar ga berisik

        // Logika Play/Pause
        if (!isFinished && !isPaused && !isMuted) {
            // Mainkan suara jika: Belum selesai, Tidak Pause, dan Tidak Mute
            tickingAudio.current.play().catch(e => console.log("Audio play failed:", e));
        } else {
            // Selain itu, pause suara
            tickingAudio.current.pause();
        }

        // Cleanup saat unmount
        return () => {
            tickingAudio.current.pause();
        };
    }, [isFinished, isPaused, isMuted]); // Jalankan ulang jika status berubah

    // --- EFEK 2: SUARA ALARM (SELESAI) ---
    useEffect(() => {
        alarmAudio.current.loop = true;

        if (isFinished) {
            // Matikan ticking paksa
            tickingAudio.current.pause();
            // Mainkan Alarm
            alarmAudio.current.play().catch(e => console.log("Alarm play failed:", e));
        } else {
            // Reset Alarm jika belum selesai
            alarmAudio.current.pause();
            alarmAudio.current.currentTime = 0;
        }

        // Cleanup: Matikan alarm jika user klik Stop / Keluar
        return () => {
            alarmAudio.current.pause();
            alarmAudio.current.currentTime = 0;
        };
    }, [isFinished]);

    // Fungsi Wrapper untuk Stop (Mematikan semua suara)
    const handleStop = () => {
        tickingAudio.current.pause();
        alarmAudio.current.pause();
        onStop(); // Panggil fungsi stop asli dari App.jsx
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in text-white overflow-hidden font-serif">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none"></div>

            {/* LAYER 1: PANCI (Lottie) */}
            <div className={`relative z-10 w-64 h-64 -mt-20 mb-[-40px] transition-all duration-500 ${isFinished ? 'opacity-0 scale-90 hidden' : 'opacity-100 scale-100'}`}>
                <div className="absolute inset-0 bg-orange-400/20 blur-[60px] rounded-full animate-pulse"></div>
                {!isFinished && <Lottie animationData={cookingAnim} loop={!isPaused} autoplay={true} />}
            </div>

            {/* LAYER 2: HUD vs CHECK */}
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

                {!isFinished ? (
                    /* TAMPILAN HUD */
                    <div className="absolute inset-0 animate-fade-in">
                        {/* SVG ARC */}
                        <svg width={size} height={size} className="absolute inset-0 rotate-[180deg] overflow-visible z-0">
                            <defs>
                                <linearGradient id="genshinGold" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FFF7D0" />
                                    <stop offset="100%" stopColor="#FFB13B" />
                                </linearGradient>
                                <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="rgba(255, 255, 255, 0.15)" strokeWidth={8} strokeLinecap="round" style={{ strokeDasharray: `${arcLength} ${arcLength * 2}` }} />
                            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="url(#genshinGold)" strokeWidth={8} strokeLinecap="round" filter="url(#glow)" className={`transition-opacity duration-300 ${isStarted ? 'opacity-100' : 'opacity-0'}`} style={{ strokeDasharray: `${arcLength} ${arcLength * 3}`, strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in' }} />
                            <circle cx={center} cy={center} r={radius + 15} fill="transparent" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" strokeDasharray="2 10" style={{ strokeDasharray: `${arcLength + 50} ${arcLength * 3}` }} />
                        </svg>

                        {/* JARUM */}
                        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                            <div className="absolute right-1 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white -rotate-90">
                                    <path d="M12 3V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M8 14H16V17C16 19.2091 14.2091 21 12 21C9.79086 21 8 19.2091 8 17V14Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>

                        {/* TEXT TIMER */}
                        <div className="absolute bottom-10 w-full flex flex-col items-center z-30">
                            <div className="text-5xl font-bold tracking-widest text-white drop-shadow-md font-mono">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-[10px] text-[#FFE38D] tracking-[0.3em] uppercase opacity-80 mt-1">
                                Time Remaining
                            </div>
                        </div>
                    </div>

                ) : (
                    /* TAMPILAN SELESAI */
                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-zoom-in">
                        <div className="w-64 h-64 relative mb-2">
                            <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full"></div>
                            <Lottie
                                animationData={checkAnim}
                                loop={true}
                                autoplay={true}
                                style={{ width: '100%', height: '100%' }}
                                rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                            />
                        </div>
                        <div className="text-center relative z-10 -mt-8 space-y-4">
                            <h1 className="text-5xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE38D] to-[#D98823] drop-shadow-[0_2px_10px_rgba(255,165,0,0.5)]">
                                Completed
                            </h1>
                            <div className="text-white text-sm font-medium tracking-wider opacity-90 leading-relaxed">
                                Turn off the stove & soak in cold water!
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* LAYER 3: TOMBOL KONTROL */}
            <div className="mt-12 z-30 min-h-[100px] flex items-center justify-center">
                {!isFinished ? (

                    /* KONTROL SAAT MASAK: STOP - PAUSE - MUTE */
                    <div className="flex items-center gap-8 animate-fade-in">

                        {/* 1. Tombol STOP */}
                        <button onClick={handleStop} className="group flex flex-col items-center gap-2 transition-transform active:scale-95">
                            <div className="relative flex items-center justify-center w-16 h-16">
                                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/60 transition-colors"></div>
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-[#FF6B6B] transition-colors flex items-center justify-center">
                                    <StopIcon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 group-hover:text-white transition-colors">Stop</span>
                        </button>

                        {/* 2. Tombol PAUSE */}
                        <button onClick={onTogglePause} className="group flex flex-col items-center gap-2 transition-transform active:scale-95">
                            <div className="relative flex items-center justify-center w-16 h-16">
                                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/60 transition-colors"></div>
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-[#FFE38D] transition-colors flex items-center justify-center">
                                    {isPaused ? <PlayIcon className="w-5 h-5 text-white" /> : <PauseIcon className="w-5 h-5 text-white" />}
                                </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 group-hover:text-white transition-colors">{isPaused ? "Resume" : "Pause"}</span>
                        </button>

                        {/* 3. Tombol MUTE (Baru!) */}
                        <button onClick={() => setIsMuted(!isMuted)} className="group flex flex-col items-center gap-2 transition-transform active:scale-95">
                            <div className="relative flex items-center justify-center w-16 h-16">
                                {/* Border lebih tipis untuk tombol sekunder */}
                                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/40 transition-colors"></div>
                                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-blue-400/20 transition-colors flex items-center justify-center">
                                    {isMuted ?
                                        <SpeakerXMarkIcon className="w-5 h-5 text-white/50 group-hover:text-white" /> :
                                        <SpeakerWaveIcon className="w-5 h-5 text-white group-hover:text-white" />
                                    }
                                </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 group-hover:text-white transition-colors">
                                {isMuted ? "Unmute" : "Mute"}
                            </span>
                        </button>

                    </div>
                ) : (

                    /* KONTROL SAAT SELESAI: KONFIRMASI */
                    <button
                        onClick={handleStop}
                        className="group relative px-8 py-3 bg-[#D98823] hover:bg-[#FFE38D] text-black font-bold tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:shadow-[0_0_30px_rgba(255,165,0,0.8)] transition-all transform hover:scale-105 active:scale-95 animate-zoom-in"
                    >
                        <div className="absolute inset-1 border border-black/10 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <CheckIcon className="w-6 h-6 text-black/80" />
                            <span>Confirm</span>
                        </div>
                    </button>
                )}
            </div>

        </div>
    );
};

export default CookingView;