import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, SkipForward, Volume2 } from "lucide-react";

const TRACKS = [
  { id: 1, name: "Lofi Study Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, name: "Ambient Rain", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, name: "Deep Focus", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(new Audio(TRACKS[0].url));

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    audioRef.current.src = TRACKS[nextIndex].url;
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
      <div className="flex items-center gap-2 mr-2">
        <div className={`w-2 h-2 rounded-full bg-indigo-400 ${isPlaying ? "animate-pulse" : "opacity-30"}`} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Music</span>
      </div>
      
      <div className="flex flex-col min-w-[80px]">
        <span className="text-[11px] font-bold text-white truncate w-24">{TRACKS[currentTrackIndex].name}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={skipTrack}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
