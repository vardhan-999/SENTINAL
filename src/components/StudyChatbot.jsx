import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Loader2 } from "lucide-react";

const TOPIC_RESPONSES = {
  deadlock: "A **deadlock** occurs when processes are stuck waiting for each other's resources. The four necessary conditions are: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Prevention involves negating one of these.\n\n*Example:* Process A holds Resource 1 and waits for Resource 2, while Process B holds Resource 2 and waits for Resource 1.",
  scheduling: "**Process Scheduling** decides which process runs on the CPU. Common algorithms:\n- **FCFS** – First Come First Serve (simple, but convoy effect)\n- **SJF** – Shortest Job First (optimal avg wait time)\n- **Round Robin** – Each process gets a fixed time quantum\n- **Priority** – Higher priority processes run first",
  "round robin": "**Round Robin Scheduling** assigns a fixed time quantum (e.g., 4ms) to each process in cyclic order. It's preemptive and fair.\n\n*Advantage:* Good response time for interactive systems.\n*Disadvantage:* High context-switch overhead if quantum is too small.",
  "b+ tree": "A **B+ Tree** is a balanced tree where all data lives in leaf nodes, which are linked together for efficient range queries. Internal nodes only store keys for navigation.\n\n*Search:* O(log n) · *Range query:* O(log n + k) where k is results",
  normalization: "**Database Normalization** reduces redundancy. Key normal forms:\n- **1NF** – Atomic columns\n- **2NF** – Remove partial dependencies\n- **3NF** – Remove transitive dependencies\n- **BCNF** – Every determinant is a candidate key",
  default: "That's a great question! Based on your current topic, I'd suggest breaking it down into smaller concepts, mapping each to an example, and testing yourself with a quick quiz. Would you like me to elaborate on any specific subtopic?",
};

function getResponse(query) {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(TOPIC_RESPONSES)) {
    if (key !== "default" && q.includes(key)) return answer;
  }
  return TOPIC_RESPONSES.default;
}

function formatMessage(text) {
  // Very basic markdown-like rendering
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
      text: `Hi! I'm your AI Study Assistant for **${topic}**. Ask me anything about this topic — definitions, examples, or quiz questions!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = getResponse(trimmed);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", text: reply }]);
      setLoading(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div className="glass-card rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 flex-shrink-0">
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

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 flex gap-2 flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about this topic..."
          className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
