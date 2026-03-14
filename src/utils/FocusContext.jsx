import React, { createContext, useContext, useState, useCallback } from "react";

const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [mood, setMood] = useState("neutral"); // focused, neutral, tired, drowsy
  const [drowsyAlert, setDrowsyAlert] = useState(false);
  const [stats, setStats] = useState({
    focusScore: 85,
    sessionDuration: 0,
    blinkCount: 0
  });
  const [sessionId, setSessionId] = useState(null);

  const startSession = useCallback(async (userId = 1) => { // Mock user
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, mood: mood }),
      });
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const data = await resp.json();
      setSessionId(data.sessionId);
      console.log("🚀 Session Started:", data.sessionId);
    } catch (e) {
      console.error("Failed to start session on backend", e);
    }
  }, [mood]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/sessions/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, focus_score: stats.focusScore }),
      });
      setSessionId(null);
      console.log("🏁 Session Ended:", sessionId);
    } catch (e) {
      console.error("Failed to end session on backend", e);
    }
  }, [sessionId, stats.focusScore]);

  const updateMood = useCallback((newMood) => {
    setMood(newMood);
  }, []);

  const triggerDrowsyAlert = useCallback(() => {
    setDrowsyAlert(true);
  }, []);

  const dismissDrowsyAlert = useCallback(() => {
    setDrowsyAlert(false);
  }, []);

  return (
    <FocusContext.Provider value={{ 
      mood, 
      updateMood, 
      drowsyAlert, 
      triggerDrowsyAlert, 
      dismissDrowsyAlert,
      stats,
      setStats,
      startSession,
      endSession
    }}>
      {children}
    </FocusContext.Provider>
  );
}

export const useFocus = () => useContext(FocusContext);
