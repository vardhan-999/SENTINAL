import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Activity } from "lucide-react";

export function CameraMonitor() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let activeStream = null;

    async function startCamera() {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setHasError(true);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-48 aspect-video bg-gray-900 rounded-2xl overflow-hidden glass-card shadow-2xl border-white/10 group"
    >
      {/* Status Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded-full text-[10px] font-medium text-white shadow-sm">
        {stream && !hasError ? (
          <>
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" 
            />
            Monitoring
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Offline
          </>
        )}
      </div>

      {stream && !hasError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100" // Mirror effect
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
          <VideoOff className="w-6 h-6 mb-2 opacity-50" />
          <span className="text-xs font-medium">Camera Offline</span>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Activity className="w-6 h-6 text-white/70" />
      </div>
    </motion.div>
  );
}
