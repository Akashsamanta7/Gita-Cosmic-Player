import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ListMusic,
  ChevronUp,
  Gauge
} from 'lucide-react';
import { GITA_AUDIO_URL, GITA_CHAPTERS, Chapter } from '../constants';
import { cn } from '../lib/utils';

export const GitaPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [seeking, setSeeking] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter>(GITA_CHAPTERS[0]);
  const [showChapters, setShowChapters] = useState(false);
  
  const [isReady, setIsReady] = useState(false);
  
  const playerRef = useRef<any>(null);
  const Player = ReactPlayer as any;

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('gita_progress');
    if (savedProgress) {
      const { playedSeconds, chapterId } = JSON.parse(savedProgress);
      // We'll seek to playedSeconds once the player is ready
      const chapter = GITA_CHAPTERS.find(c => c.id === chapterId);
      if (chapter) setCurrentChapter(chapter);
    }
  }, []);

  // Save progress periodically
  useEffect(() => {
    if (isReady && !seeking) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          localStorage.setItem('gita_progress', JSON.stringify({
            playedSeconds: currentTime,
            chapterId: currentChapter.id
          }));
        }
      }, 5000); // Save every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isReady, seeking, currentChapter]);

  // Media Session API for background play and lock screen controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentChapter.title,
        artist: 'Shrimad Bhagavad Gita',
        album: 'Cosmic Recitation',
        artwork: [
          { src: 'https://picsum.photos/seed/gita/512/512', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
      navigator.mediaSession.setActionHandler('seekbackward', () => handleSkip(-10));
      navigator.mediaSession.setActionHandler('seekforward', () => handleSkip(10));
    }
  }, [currentChapter]);

  const handlePlayPause = useCallback(() => {
    if (!isReady) return;
    setPlaying(prev => !prev);
  }, [isReady]);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMute = () => setMuted(!muted);

  const handleProgress = (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      
      // Update duration if not already set (fallback for some players)
      if (duration === 0 && playerRef.current) {
        const d = playerRef.current.getDuration();
        if (d > 0) setDuration(d);
      }
      
      // Update current chapter based on time
      const currentTime = state.playedSeconds;
      const chapter = [...GITA_CHAPTERS].reverse().find(c => currentTime >= c.startTime);
      if (chapter && chapter.id !== currentChapter.id) {
        setCurrentChapter(chapter);
      }
    }
  };

  const handleSeekMouseDown = () => setSeeking(true);
  
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (isReady && playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const handleDuration = (duration: number) => setDuration(duration);

  const handleReady = () => {
    setIsReady(true);
    if (playerRef.current) {
      const d = playerRef.current.getDuration();
      if (d > 0) setDuration(d);

      // Resume from saved progress
      const savedProgress = localStorage.getItem('gita_progress');
      if (savedProgress) {
        const { playedSeconds } = JSON.parse(savedProgress);
        playerRef.current.seekTo(playedSeconds, 'seconds');
      }
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    if (isReady && playerRef.current) {
      playerRef.current.seekTo(chapter.startTime);
    }
    setPlaying(true);
    setShowChapters(false);
  };

  const handleSkip = (amount: number) => {
    if (isReady && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + amount);
    }
  };

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden cosmic-bg">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] bg-radial from-cosmic-purple/20 via-transparent to-transparent blur-3xl" 
        />
      </div>

      {/* Hidden Player */}
      <div className="hidden">
        <Player
          ref={(player: any) => {
            playerRef.current = player;
          }}
          url={GITA_AUDIO_URL}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onReady={handleReady}
          onError={(e: any) => console.error('Player Error:', e)}
        />
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full space-y-12 mb-24"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-3 mb-2"
          >
            <div className="h-[1px] w-8 bg-gold/30" />
            <span className="text-gold/60 text-xs uppercase tracking-[0.3em] font-mono">Chapter {currentChapter.id}</span>
            <div className="h-[1px] w-8 bg-gold/30" />
          </motion.div>
          
          <motion.h2 
            key={currentChapter.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-serif text-5xl md:text-7xl text-gold text-glow leading-tight"
          >
            {currentChapter.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-white font-serif italic text-xl md:text-2xl max-w-xl mx-auto leading-relaxed"
          >
            {currentChapter.description}
          </motion.p>
        </div>

        {/* Cosmic Visualizer */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          {/* Outer Rings */}
          <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-8 border border-gold/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
          <div className="absolute inset-16 border border-white/5 rounded-full animate-[spin_40s_linear_infinite]" />
          
          {/* Central Glow */}
          <motion.div 
            animate={{ 
              scale: playing ? [1, 1.1, 1] : 1,
              opacity: playing ? [0.4, 0.7, 0.4] : 0.4,
              rotate: playing ? 360 : 0
            }}
            transition={{ 
              scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 60, ease: "linear" }
            }}
            className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-radial from-gold/40 via-cosmic-purple/20 to-transparent blur-3xl" 
          />

          {/* Core Icon */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!playing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-gold/40"
                >
                  <Play size={64} strokeWidth={1} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bottom Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 z-30">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto glass-dark rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/50"
        >
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                <span className="flex items-center space-x-2">
                  <span className="w-1 h-1 rounded-full bg-gold/40 animate-pulse" />
                  <span>{formatTime(played * duration)}</span>
                </span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleSeekMouseDown}
                onTouchEnd={handleSeekMouseUp}
                className="w-full"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-0 items-center">
              {/* Left Side: Chapter List & Volume (Desktop) */}
              <div className="flex items-center justify-between w-full md:w-auto md:justify-start space-x-4 order-2 md:order-1">
                <button 
                  onClick={() => setShowChapters(true)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-gold transition-all group"
                  aria-label="Chapters"
                >
                  <ListMusic size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                
                <div className="hidden md:flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <button onClick={handleToggleMute} className="text-white/40 hover:text-gold transition-colors">
                    {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                {/* Mobile Speed Control (Small) */}
                <div className="flex md:hidden items-center space-x-3 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <Gauge size={14} className="text-gold/60" />
                  <span className="text-[10px] font-mono text-white/60">{playbackRate.toFixed(1)}x</span>
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.1}
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Center: Playback Controls */}
              <div className="flex items-center justify-center space-x-8 md:space-x-10 order-1 md:order-2">
                <button 
                  onClick={() => handleSkip(-10)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-white/40 hover:text-gold hover:bg-white/5 transition-all active:scale-90"
                  aria-label="Skip Back 10s"
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                
                <button 
                  onClick={handlePlayPause}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold text-cosmic-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)] relative group"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {playing ? (
                    <Pause className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" />
                  ) : (
                    <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" />
                  )}
                </button>
                
                <button 
                  onClick={() => handleSkip(10)}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-white/40 hover:text-gold hover:bg-white/5 transition-all active:scale-90"
                  aria-label="Skip Forward 10s"
                >
                  <RotateCw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Right Side: Speed Control (Desktop) */}
              <div className="hidden md:flex items-center justify-end order-3">
                <div className="flex flex-col items-end space-y-2 bg-white/5 p-3 rounded-2xl border border-white/5 min-w-[140px]">
                  <div className="flex items-center space-x-2 text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">
                    <Gauge size={12} className="text-gold/60" />
                    <span>Speed: {playbackRate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={2}
                    step={0.1}
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chapter Drawer */}
      <AnimatePresence>
        {showChapters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChapters(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 glass-dark rounded-t-[3rem] z-50 max-h-[85vh] overflow-hidden flex flex-col border-t border-white/10"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-3xl text-gold leading-none">Chapters</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-2">Bhagavad Gita Recitation</p>
                </div>
                <button 
                  onClick={() => setShowChapters(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronUp className="rotate-180 text-white/60" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 space-y-3 mask-fade pb-12">
                {GITA_CHAPTERS.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className={cn(
                      "w-full p-5 rounded-3xl text-left transition-all flex items-center justify-between group relative overflow-hidden",
                      currentChapter.id === chapter.id 
                        ? "bg-gold/10 border border-gold/20" 
                        : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="relative z-10 flex items-center space-x-5">
                      <span className={cn(
                        "font-mono text-xs",
                        currentChapter.id === chapter.id ? "text-gold" : "text-white/20"
                      )}>
                        {chapter.id.toString().padStart(2, '0')}
                      </span>
                      <div>
                        <div className={cn(
                          "font-serif text-xl transition-colors",
                          currentChapter.id === chapter.id ? "text-gold" : "text-white group-hover:text-gold/80"
                        )}>
                          {chapter.title}
                        </div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                          {chapter.description}
                        </div>
                      </div>
                    </div>

                    {currentChapter.id === chapter.id && playing && (
                      <div className="flex space-x-1 items-end h-5 relative z-10">
                        {[0.5, 0.6, 0.7, 0.5].map((d, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: [4, 16, 4] }} 
                            transition={{ repeat: Infinity, duration: d, delay: i * 0.1 }} 
                            className="w-1 bg-gold rounded-full" 
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
