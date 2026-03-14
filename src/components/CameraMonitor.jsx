import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, VideoOff, Activity, Loader2, RefreshCw, AlertCircle, Maximize2 } from "lucide-react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useFocus } from "../utils/FocusContext";

export function CameraMonitor({ onDrowsy }) {
  const { updateMood } = useFocus();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentClosureDuration, setCurrentClosureDuration] = useState(0);
  const [debugStatus, setDebugStatus] = useState("Initializing...");
  const [eyeScores, setEyeScores] = useState({ left: 0, right: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  
  const faceLandmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const eyesClosedStartTimeRef = useRef(null);
  const lastClosedFoundAtRef = useRef(0);
  const errorCountRef = useRef(0);
  const alertAudioRef = useRef(null);

  // Initialize MediaPipe with stable version
  useEffect(() => {
    async function initMediaPipe() {
      try {
        setDebugStatus("Loading AI Engine...");
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "CPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        setDebugStatus("AI Standby");
        setIsLoading(false);
      } catch (err) {
        console.error("AI Init Error:", err);
        setDebugStatus("AI Failure");
        setHasError(true);
      }
    }

    initMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Optimized camera setup (lower resolution = faster AI)
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      setHasError(false);
      setDebugStatus("Powering Camera...");
      const constraints = { 
        video: { 
          width: { ideal: 320 }, // 320p is perfect for face tracking and much faster
          height: { ideal: 240 },
          facingMode: "user"
        } 
      };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      setDebugStatus("Scanning Environment...");
    } catch (err) {
      console.error("Camera Error:", err);
      setDebugStatus("Permission Denied");
      setHasError(true);
    }
  };

  useEffect(() => {
    if (!isLoading && !hasError && !stream) {
      startCamera();
    }
    return () => {
      if (stream) {
        console.log("释放监控摄像头资源...");
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isLoading, hasError, stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(() => setDebugStatus("Click to Enable"));
      };
    }
  }, [stream]);

  // Ultra-Fast Detection Loop
  const predict = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2 || !faceLandmarkerRef.current) {
      requestRef.current = requestAnimationFrame(predict);
      return;
    }

    const startTimeMs = performance.now();
    
    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      
      try {
        const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          errorCountRef.current = 0; // Reset error count on success
          if (!isMonitoring) {
            setIsMonitoring(true);
            setDebugStatus("Tracking: ACTIVE");
          }
          
          const blendshapes = results.faceBlendshapes[0].categories;
          const leftEye = blendshapes.find(s => s.categoryName === "eyeBlinkLeft")?.score || 0;
          const rightEye = blendshapes.find(s => s.categoryName === "eyeBlinkRight")?.score || 0;
          const smile = blendshapes.find(s => s.categoryName === "mouthSmileLeft")?.score || 0;
          
          setEyeScores({ left: leftEye, right: rightEye });

          // Mood updates
          if (smile > 0.3) updateMood("focused");
          else if (leftEye > 0.4 || rightEye > 0.4) updateMood("tired"); // Lowered threshold for tired state
          else updateMood("neutral");

          // Drowsiness logic: Weighted average for tilt-tolerance + 0.38 threshold
          const avgScore = (leftEye + rightEye) / 2;
          const isClosed = avgScore > 0.38;
          
          if (isClosed) {
            lastClosedFoundAtRef.current = Date.now();
            if (!eyesClosedStartTimeRef.current) {
              eyesClosedStartTimeRef.current = Date.now();
            }
            
            const duration = (Date.now() - eyesClosedStartTimeRef.current) / 1000;
            setCurrentClosureDuration(duration);
            
            if (duration >= 5) {
              if (!alarmActive) {
                if (alertAudioRef.current && alertAudioRef.current.paused) {
                  playAlertSound();
                }
                setAlarmActive(true);
                onDrowsy?.();
                console.log("🔥 SENTINEL: ALERT TRIGGERED at 5s");
              }
            }
          } else {
            // Stability Buffer: Hold "closed" state for 400ms to ignore flickers
            const timeSinceLastSeen = Date.now() - lastClosedFoundAtRef.current;
            if (timeSinceLastSeen > 400) {
              eyesClosedStartTimeRef.current = null;
              if (currentClosureDuration !== 0) setCurrentClosureDuration(0);
              if (alarmActive) setAlarmActive(false);
              stopAlertSound();
            }
          }
        } else {
          // Face lost - reset with buffer
          if (Date.now() - lastClosedFoundAtRef.current > 400) {
            if (isMonitoring) {
              setIsMonitoring(false);
              setDebugStatus("Searching for Face...");
            }
            eyesClosedStartTimeRef.current = null;
            setEyeScores({ left: 0, right: 0 });
            stopAlertSound();
          }
        }
      } catch (err) {
        errorCountRef.current++;
        if (errorCountRef.current > 100) { // Recovery if AI crashes
          console.warn("AI Loop hanging, resetting...");
          setHasError(true);
        }
      }
    }
    requestRef.current = requestAnimationFrame(predict);
  };

  useEffect(() => {
    if (stream && !isLoading) {
      requestRef.current = requestAnimationFrame(predict);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [stream, isLoading]);

  const playAlertSound = () => {
    if (alertAudioRef.current) {
      console.log("🚨 ALARM: STARTING PERSISTENT ALERT (alert.mp3)");
      alertAudioRef.current.play().catch((e) => {
        console.error("Critical: Alarm play failed.", e);
      });
    }
  };

  const stopAlertSound = () => {
    if (alertAudioRef.current && !alertAudioRef.current.paused) {
      console.log("✅ ALARM: USER AWAKE. STOPPING SOUND.");
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
    }
  };

  const handleInteraction = () => {
    // Universal interaction handler to "unlock" audio & camera
    if (videoRef.current) videoRef.current.play();
    setHasInteracted(true);
    
    // Initialize & Prime the audio object on the very first click
    if (!alertAudioRef.current) {
      try {
        const audio = new Audio("/alert.mp3");
        audio.loop = true;
        audio.volume = 1.0;
        // Playing and immediately pausing is a common hack to "authorize" audio
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          alertAudioRef.current = audio;
          console.log("🎵 Sentinel: alert.mp3 energized and ready for alerts.");
          setDebugStatus("Tracking: ACTIVE");
        }).catch(e => {
          console.error("Audio prime failed. Path might be wrong or file missing.", e);
          setDebugStatus("Audio Error");
        });
      } catch (e) {
        console.error("Audio init failed:", e);
      }
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-64 aspect-video bg-gray-950 rounded-2xl overflow-hidden glass-card shadow-2xl border border-white/10 group select-none cursor-pointer"
      onClick={handleInteraction}
      title="Click once to enable sound & tracking"
    >
      {/* Background GFX Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] z-10" />

      {stream && !hasError ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
          
          {/* Diagnostic Overlay */}
          {!hasInteracted && (
            <div className="absolute inset-0 z-30 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 text-center">
              <div className="bg-black/80 border border-white/20 px-3 py-2 rounded-xl shadow-2xl animate-pulse">
                <p className="text-[10px] font-black uppercase text-white tracking-widest mb-1.5">Action Required</p>
                <p className="text-[9px] text-gray-300 mb-2">Click this box to enable the 5-second alarm sound.</p>
                <Maximize2 className="w-3 h-3 text-indigo-400 mx-auto" />
              </div>
            </div>
          )}

          {/* Eye Tracking Diagnostic Bars */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none bg-black/40 p-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-gray-400 font-bold uppercase w-8">L-Eye</span>
              <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${eyeScores.left * 100}%` }}
                  className={`h-full ${eyeScores.left > 0.38 ? 'bg-red-500' : 'bg-indigo-400'}`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-gray-400 font-bold uppercase w-8">R-Eye</span>
              <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: `${eyeScores.right * 100}%` }}
                   className={`h-full ${eyeScores.right > 0.38 ? 'bg-red-500' : 'bg-indigo-400'}`}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center bg-[#0d0f14]">
          {isLoading ? (
            <div className="relative">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <div className="absolute inset-0 blur-lg bg-indigo-500/20" />
            </div>
          ) : (
            <Activity className="w-8 h-8 text-amber-500 opacity-50" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-relaxed">
            {debugStatus}
          </span>
          {hasError && (
            <button 
              onClick={(e) => { e.stopPropagation(); startCamera(); }}
              className="mt-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
            >
              Force Restart
            </button>
          )}
        </div>
      )}

      {/* Status HUD Header */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-full shadow-2xl">
          <motion.div 
            animate={{ 
              opacity: isMonitoring ? [1, 0.4, 1] : 0.3,
              scale: isMonitoring ? [1, 1.2, 1] : 1
            }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-1.5 h-1.5 rounded-full ${isMonitoring ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-amber-500"}`} 
          />
          <span className="text-[9px] font-black tracking-widest text-white uppercase truncate max-w-[140px]">
             {isMonitoring ? "Tracking System Online" : debugStatus}
          </span>
          {hasInteracted && alertAudioRef.current && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/20 pl-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="text-[7px] font-black text-cyan-400 uppercase tracking-tighter">ALARM ARMED</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); startCamera(); }}
          className="p-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
          title="Reset Camera Feed"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Detection Timer & Danger Alerts */}
      <AnimatePresence>
        {currentClosureDuration > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-2 left-2 right-2 flex flex-col items-center gap-1.5 z-30"
          >
            <div className={`backdrop-blur-2xl border rounded-xl px-4 py-3 flex flex-col items-center shadow-2xl w-full transition-all duration-300 ${currentClosureDuration > 4 ? "bg-red-600/40 border-red-500 ring-2 ring-red-500/20" : "bg-black/70 border-white/20"}`}>
              <div className="flex items-center gap-2.5 mb-1 text-center">
                <span className={`w-2 h-2 rounded-full ${currentClosureDuration > 4 ? "bg-red-500 animate-ping" : "bg-amber-500"}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentClosureDuration > 4 ? "text-red-100" : "text-amber-100"}`}>
                  {currentClosureDuration > 4 ? "SENTINEL ALERT ACTIVE" : "EYES CLOSED"}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-white font-mono leading-none tracking-tighter">
                  {currentClosureDuration.toFixed(1)}
                </span>
                <span className="text-[10px] font-black text-gray-400 mb-0.5">SECONDS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.03] to-transparent h-16 w-full animate-scanline z-20" />
    </motion.div>
  );
}
