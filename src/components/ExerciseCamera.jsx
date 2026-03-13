import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, VideoOff } from "lucide-react";

export function ExerciseCamera() {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setReady(true);
        }
      })
      .catch(() => setHasError(true));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] bg-[#080a10]"
    >
      {/* Corner brackets — camera frame effect */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-7 h-7 border-2 border-blue-400/60 rounded-sm pointer-events-none`}
          style={{
            borderTop: i < 2 ? undefined : "none",
            borderBottom: i >= 2 ? undefined : "none",
            borderLeft: i % 2 === 0 ? undefined : "none",
            borderRight: i % 2 !== 0 ? undefined : "none",
          }}
        />
      ))}

      {ready && !hasError ? (
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-3">
          <VideoOff className="w-12 h-12 opacity-30" />
          <span className="text-sm font-medium">{hasError ? "Camera Offline" : "Initializing…"}</span>
        </div>
      )}

      {/* Status badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-full">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
        />
        <Activity className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-semibold text-blue-300 tracking-wide">Exercise Monitoring Active</span>
      </div>

      {/* Body silhouette overlay guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-64 border border-blue-400/15 rounded-full opacity-40" />
      </div>
    </motion.div>
  );
}
