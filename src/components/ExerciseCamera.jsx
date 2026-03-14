import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, VideoOff, Loader2 } from "lucide-react";
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function ExerciseCamera({ onRepIncrement, currentExercise = "Push-ups" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  
  const poseLandmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const stageRef = useRef("up");

  const [visScore, setVisScore] = useState(0);
  const angleBufferRef = useRef([]);

  // Initialize MediaPipe Pose
  useEffect(() => {
    async function initPose() {
      try {
        setHasError(false);
        setIsLoading(true);
        console.log("⚡ Sentinel: Loading Precision Motion Logic...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "CPU"
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.6, // Higher confidence for initialization
          minPosePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
        console.log("✅ Sentinel: Motion Engine Synchronized.");
        setIsLoading(false);
      } catch (err) {
        console.error("❌ MediaPipe Error:", err);
        setHasError(true);
        setIsLoading(false);
      }
    }
    initPose();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return 0;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    
    // Smooth angle with 5-frame moving average
    angleBufferRef.current.push(angle);
    if (angleBufferRef.current.length > 5) angleBufferRef.current.shift();
    return angleBufferRef.current.reduce((sum, v) => sum + v, 0) / angleBufferRef.current.length;
  };

  const drawTracking = (landmarks) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks || landmarks.length === 0) return;
    const lm = landmarks[0];

    // Mirroring Check: Update global visibility score
    const avgVis = lm.reduce((acc, curr) => acc + curr.visibility, 0) / 33;
    if (Math.abs(avgVis - visScore) > 0.1) setVisScore(avgVis);

    ctx.strokeStyle = "white"; 
    ctx.lineWidth = 2;

    const drawLine = (p1, p2) => {
      // Lowered threshold for better tracking in low light
      if (lm[p1] && lm[p2] && lm[p1].visibility > 0.35 && lm[p2].visibility > 0.35) {
        ctx.beginPath();
        ctx.moveTo((1 - lm[p1].x) * canvas.width, lm[p1].y * canvas.height);
        ctx.lineTo((1 - lm[p2].x) * canvas.width, lm[p2].y * canvas.height);
        ctx.stroke();
      }
    };

    const connections = [
      [11, 12], [11, 23], [12, 24], [23, 24], // Torso
      [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [23, 25], [25, 27], [24, 26], [26, 28]  // Legs
    ];
    connections.forEach(([p1, p2]) => drawLine(p1, p2));

    lm.forEach((point, i) => {
      if (point.visibility > 0.35 && i < 33) {
        ctx.beginPath();
        ctx.arc((1 - point.x) * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#ff0000"; 
        ctx.fill();
      }
    });

    const highlight = (idx) => {
      if (!lm[idx] || lm[idx].visibility < 0.35) return;
      ctx.beginPath();
      ctx.arc((1 - lm[idx].x) * canvas.width, lm[idx].y * canvas.height, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    if (currentExercise === "Push-ups") { highlight(13); highlight(14); }
    else if (currentExercise === "Sit-ups") { 
      highlight(23); highlight(24); // Hips
      highlight(25); highlight(26); // Knees
    }
    else { highlight(25); highlight(26); }
  };

  const predict = () => {
    if (videoRef.current && videoRef.current.readyState >= 2 && poseLandmarkerRef.current) {
      if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = videoRef.current.currentTime;
        try {
          const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
          if (results.landmarks && results.landmarks.length > 0) {
            if (!isTracking) setIsTracking(true);
            drawTracking(results.landmarks);
            
            const lm = results.landmarks[0];
            let angle = 0;
            let downThresh = 0;
            let upThresh = 0;

            if (currentExercise === "Push-ups") {
              const angleL = calculateAngle(lm[11], lm[13], lm[15]);
              const angleR = calculateAngle(lm[12], lm[14], lm[16]);
              angle = (lm[13].visibility > lm[14].visibility) ? angleL : angleR;
              downThresh = 110; 
              upThresh = 150;
            } 
            else if (currentExercise === "Sit-ups") {
              const angleL = calculateAngle(lm[11], lm[23], lm[25]);
              const angleR = calculateAngle(lm[12], lm[24], lm[26]);
              angle = (lm[23].visibility > lm[24].visibility) ? angleL : angleR;
              downThresh = 85;
              upThresh = 135;
            }
            else { // Squats
              const angleL = calculateAngle(lm[23], lm[25], lm[27]);
              const angleR = calculateAngle(lm[24], lm[26], lm[28]);
              angle = (lm[25].visibility > lm[26].visibility) ? angleL : angleR;
              downThresh = 110;
              upThresh = 160;
            }

            if (currentExercise === "Sit-ups") {
              if (angle < downThresh) stageRef.current = "up_action";
              if (angle > upThresh && stageRef.current === "up_action") {
                stageRef.current = "down_action";
                onRepIncrement?.();
              }
            } else {
              if (angle < downThresh) stageRef.current = "down";
              if (angle > upThresh && stageRef.current === "down") {
                stageRef.current = "up";
                onRepIncrement?.();
              }
            }
          } else {
            if (isTracking) setIsTracking(false);
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        } catch (e) { console.error("Predict Error:", e); }
      }
    }
    requestRef.current = requestAnimationFrame(predict);
  };

  const startStream = async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setHasError(false);
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        requestRef.current = requestAnimationFrame(predict);
      }
    } catch (err) {
      console.error("Camera Access Denied:", err);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (!isLoading) startStream();
  }, [isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] bg-[#080a10]"
    >
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Warming up Motion Engine...</p>
          </div>
        </div>
      )}

      {!hasError ? (
        <div className="relative w-full h-full bg-black/40 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain -scale-x-100" />
          <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5 text-gray-400 gap-4 p-6 text-center">
          <VideoOff className="w-12 h-12 text-red-400/50" />
          <div>
            <p className="text-sm font-bold text-white mb-1">Camera Authorization Failed</p>
            <p className="text-xs text-gray-500 max-w-xs">Please ensure no other app is using your camera and that you've granted permission.</p>
          </div>
          <button 
            onClick={startStream}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
          >
            Force Reconnect
          </button>
        </div>
      )}

      {/* Status */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-blue-500/30 px-4 py-2 rounded-full">
          <motion.div
            animate={{ opacity: isTracking ? [1, 0.4, 1] : 0.2 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-2 h-2 rounded-full ${isTracking ? "bg-blue-400" : "bg-gray-500"}`}
          />
          <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">
            {isTracking ? `Tracking ${currentExercise}` : "Searching for person..."}
          </span>
        </div>

        {isTracking && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-indigo-500/80 backdrop-blur-md rounded-xl border border-white/20 shadow-xl text-center"
          >
            <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-tighter opacity-70">Instruction</p>
            <p className="text-sm font-bold text-white">
              {currentExercise === "Push-ups" && (stageRef.current === "up" ? "Lower your chest" : "Push back up!")}
              {currentExercise === "Sit-ups" && (stageRef.current === "down_action" || stageRef.current === "up" ? "Sit forward" : "Lay back slowly")}
              {currentExercise === "Squats" && (stageRef.current === "up" ? "Lower your hips" : "Stand up straight!")}
            </p>
          </motion.div>
        )}
      </div>

      {/* Accuracy Tag */}
      {isTracking && (
        <div className="absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-tighter text-blue-400/60 bg-black/40 px-3 py-1.5 rounded-lg border border-blue-500/20 backdrop-blur-xl">
          Sentinel Motion: Locked
        </div>
      )}
    </motion.div>
  );
}
