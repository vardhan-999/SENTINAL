import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Loader2, ImagePlus, ScanText } from "lucide-react";
import Tesseract from "tesseract.js";

function formatMessage(text) {
  if (!text) return null;
  return text
    .split("\n")
    .map((line, i) => {
      const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
      return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted || "<br/>" }} />;
    });
}

export function StudyChatbot({ topic = "Operating Systems" }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hi! I'm your AI Study Assistant for **${topic}**. Ask me anything about this topic — or upload an image of your notes so I can help you summarize them!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: "📷 *Sent an image for OCR...*" }]);

    try {
      // 1. Local OCR with Tesseract
      const result = await Tesseract.recognize(file, "eng");
      const extractedText = result.data.text.trim();
      
      if (!extractedText) throw new Error("No text found");

      // 2. Send to Backend for AI Summarization
      const response = await fetch(`/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });
      const data = await response.json();

      setMessages((m) => [...m, { 
        id: Date.now() + 1, 
        role: "assistant", 
        text: data.summary || extractedText 
      }]);
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + 2, role: "assistant", text: "Sorry, I couldn't summarize that image." }]);
    } finally {
      setOcrLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed,
          topic: topic,
          history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: data.text || "I found no results." }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: "Connection to Sentinel Brain failed. Please check if the backend server is running!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Study Assistant</h2>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs space-y-1 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-sm"
                }`}
              >
                {formatMessage(msg.text)}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {(loading || ocrLoading) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              {ocrLoading && <span className="text-[10px] text-indigo-300 font-medium">Scanning notes...</span>}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 flex flex-col gap-2 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0 group"
            title="Upload notes for OCR"
          >
            <ImagePlus className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>

          <button
            onClick={() => {
              setInput("Tell me a story to help me remember " + topic);
              sendMessage();
            }}
            className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 flex items-center justify-center transition-colors flex-shrink-0 group"
            title="Generate Story Maker for this topic"
          >
            <ScanText className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about this topic..."
            className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || ocrLoading}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
