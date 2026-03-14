const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const youtubesr = require('youtube-search-api');
const db = require('./database');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Log every request for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

app.get('/api/ping', (req, res) => res.json({ status: 'ok', time: new Date() }));

const fetch = require('node-fetch');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIza...dummy');

// --- Wikipedia Helper ---

async function getWikipediaSummary(query) {
  try {
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
    const searchData = await searchRes.json();
    
    if (!searchData || !searchData.query || !searchData.query.search || searchData.query.search.length === 0) {
      console.log(`🔍 No Wikipedia matches for: ${query}`);
      return null;
    }
    
    const bestTitle = searchData.query.search[0].title;
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
    if (!response.ok) return null;
    const data = await response.json();
    
    return {
      extract: data.extract,
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}`,
      title: data.title
    };
  } catch (error) {
    console.error("Wikipedia Search Error:", error.message);
    return null;
  }
}

// --- AI Chat Endpoints ---

app.post('/api/chat', async (req, res) => {
  const { message, topic, history } = req.body;
  try {
    // 1. Wikipedia Search (Primary Source)
    const wikiData = await getWikipediaSummary(message);
    
    if (wikiData) {
      // Return direct Wikipedia answer
      const formattedResponse = `**${wikiData.title}**\n\n${wikiData.extract}\n\n*Source: [Wikipedia](${wikiData.url})*`;
      return res.json({ text: formattedResponse });
    }

    // 2. Gemini Fallback (Secondary Source)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Student is studying ${topic}. They asked: ${message}. (No Wikipedia entry found). Please provide a helpful answer based on your knowledge.`;
      const result = await model.generateContent(prompt);
      return res.json({ text: result.response.text() });
    }

    res.json({ text: "I couldn't find a direct Wikipedia entry for that. Please try searching for a specific topic name or add a Gemini API key to the .env file!" });
  } catch (error) {
    console.error("Chat Error Detailed:", error);
    res.status(500).json({ error: `Sentinel Brain Error: ${error.message}` });
  }
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Please summarize the following extracted notes into key bullet points and explain the core concepts: \n\n${text}`;
    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Summarization failed." });
  }
});

// --- YouTube Search Endpoint ---

app.get('/api/youtube', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });
  
  try {
    console.log(`🎥 YouTube Search: ${q}`);
    const results = await youtubesr.GetListByKeyword(q + " educational study", false, 5);
    
    // Format results for frontend
    const formatted = results.items.map(v => ({
      id: v.id,
      title: v.title,
      channel: v.channelTitle || v.author,
      thumb: v.thumbnail?.thumbnails[0]?.url || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error("YouTube API Error:", error);
    res.status(500).json({ error: "YouTube search failed" });
  }
});

// --- Session & Data Endpoints ---

app.get('/api/tasks/:userId', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.params.userId);
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { user_id, title, topic } = req.body;
    const stmt = db.prepare('INSERT INTO tasks (user_id, title, topic) VALUES (?, ?, ?)');
    const info = stmt.run(user_id, title, topic);
    res.json({ id: info.lastInsertRowid });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sessions/start', (req, res) => {
  try {
    const { user_id, mood } = req.body;
    if (!user_id) throw new Error("Missing user_id in request");
    
    // Ensure user exists before starting session
    db.prepare('INSERT OR IGNORE INTO users (id, username) VALUES (?, ?)').run(user_id, 'Guest User');
    
    const stmt = db.prepare('INSERT INTO sessions (user_id, start_time, mood) VALUES (?, datetime("now"), ?)');
    const info = stmt.run(user_id, mood || 'neutral');
    res.json({ sessionId: info.lastInsertRowid });
  } catch (e) {
    console.error("Session Start Fail:", e.message);
    res.status(500).json({ error: `Database Error: ${e.message}` });
  }
});

app.post('/api/sessions/end', (req, res) => {
  try {
    const { sessionId, focus_score } = req.body;
    const stmt = db.prepare('UPDATE sessions SET end_time = datetime("now"), focus_score = ? WHERE id = ?');
    stmt.run(focus_score, sessionId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/analytics/:userId', (req, res) => {
  try {
    const sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC LIMIT 10').all(req.params.userId);
    res.json(sessions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Serve Static Frontend Files ---
// Point to the built files in the 'dist' folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle React Router - redirect all requests to index.html if not an API
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sentinel Backend running on port ${PORT}`);
});

