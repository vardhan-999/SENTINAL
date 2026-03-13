import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Youtube, Play, X } from "lucide-react";

// Mock results keyed to topic keywords
const MOCK_RESULTS = {
  default: [
    { id: "dQw4w9WgXcQ", title: "Understanding TCP Congestion Control", channel: "CS Fundamentals", thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
    { id: "LKCVKw9CzOo", title: "TCP vs UDP Explained", channel: "NetworkChuck", thumb: "https://img.youtube.com/vi/LKCVKw9CzOo/mqdefault.jpg" },
  ],
  "operating systems": [
    { id: "26QPDBe-NB8", title: "Operating Systems: Process Scheduling", channel: "MIT OpenCourseWare", thumb: "https://img.youtube.com/vi/26QPDBe-NB8/mqdefault.jpg" },
    { id: "UT0hM4K5TiI", title: "Deadlock Detection & Prevention", channel: "Neso Academy", thumb: "https://img.youtube.com/vi/UT0hM4K5TiI/mqdefault.jpg" },
  ],
  "database": [
    { id: "ztHopE5Wnpc", title: "Database Normalization Explained", channel: "Caleb Curry", thumb: "https://img.youtube.com/vi/ztHopE5Wnpc/mqdefault.jpg" },
    { id: "kBdlM6hNDAE", title: "B+ Trees in Database Indexing", channel: "CS Dojo", thumb: "https://img.youtube.com/vi/kBdlM6hNDAE/mqdefault.jpg" },
  ],
};

function getResults(query) {
  const q = query.toLowerCase();
  for (const key of Object.keys(MOCK_RESULTS)) {
    if (key !== "default" && q.includes(key)) return MOCK_RESULTS[key];
  }
  return MOCK_RESULTS.default;
}

export function YouTubeConceptSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setPlayingId(null);
    setTimeout(() => {
      setResults(getResults(query));
      setLoading(false);
      setSearched(true);
    }, 800);
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/5 bg-white/[0.02] flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <Youtube className="w-5 h-5 text-red-400" />
        <h2 className="text-sm font-bold text-white">Concept Video Finder</h2>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. TCP Congestion Control"
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>

      {/* Results / Loading / Embed */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Video Player */}
        <AnimatePresence>
          {playingId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mb-3 rounded-2xl overflow-hidden bg-black aspect-video"
            >
              <iframe
                src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
                title="YouTube player"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                onClick={() => setPlayingId(null)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Cards */}
        {!loading && searched && (
          <div className="space-y-2.5">
            {results.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] group cursor-pointer transition-all"
                onClick={() => setPlayingId(video.id)}
              >
                <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{video.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{video.channel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center h-28 gap-2 text-gray-600">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-xs">Search for a concept to find video explanations</p>
          </div>
        )}
      </div>
    </div>
  );
}
