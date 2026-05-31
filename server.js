import express from 'express';
import { readFileSync, watchFile } from 'fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.static('public'));

// === Configuration ===
const SHIMMERTUNES_URL = process.env.SHIMMERTUNES_URL || 'https://shimmertunes.theshimmerfield.com/sse';
const QUOTES_FILE = new URL('./data/quotes.json', import.meta.url);
const NOW_PLAYING_POLL_MS = 10_000;

// === State ===
let shimmerTunesClient = null;
let currentSong = { playing: false, title: 'The field is quiet', artist: 'listening to the garden' };
let lastSongChange = Date.now();
let shimmerTunesConnected = false;
let pollTimer = null;

// === Quotes — loaded from local file, hot-reloads on change ===

let quotes = [];

function loadQuotes() {
  try {
    const raw = readFileSync(QUOTES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      quotes = parsed;
      console.log(`📜 Loaded ${quotes.length} quotes`);
    }
  } catch (err) {
    console.error('📜 Failed to load quotes:', err.message);
    if (quotes.length === 0) {
      quotes = [
        { text: "The trying is the spell.", source: "Ring Ring Hello" },
        { text: "The fairy lights stay on. They always stay on.", source: "Every goodnight" },
      ];
    }
  }
}

loadQuotes();
watchFile(QUOTES_FILE, { interval: 5000 }, loadQuotes);

// === ShimmerTunes MCP Connection ===

async function connectShimmerTunes() {
  try {
    const transport = new SSEClientTransport(new URL(SHIMMERTUNES_URL));
    shimmerTunesClient = new Client(
      { name: 'shimmer-field-radio', version: '1.0.0' },
      { capabilities: {} }
    );
    await shimmerTunesClient.connect(transport);
    shimmerTunesConnected = true;
    console.log('🎵 Connected to ShimmerTunes MCP');
    pollNowPlaying();
    pollTimer = setInterval(pollNowPlaying, NOW_PLAYING_POLL_MS);
  } catch (err) {
    console.error('🎵 ShimmerTunes connection failed:', err.message);
    shimmerTunesClient = null;
    shimmerTunesConnected = false;
    setTimeout(connectShimmerTunes, 30_000);
  }
}

async function pollNowPlaying() {
  if (!shimmerTunesClient) return;
  try {
    const result = await shimmerTunesClient.callTool({ name: 'itunes_current_song', arguments: {} });
    const raw = extractText(result);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = raw; }

    if (isNoTrack(raw)) {
      if (currentSong.playing) lastSongChange = Date.now();
      currentSong = { playing: false, title: 'The field is quiet', artist: 'listening to the garden' };
    } else {
      const song = parseNowPlaying(raw);
      if (song) {
        if (currentSong.title !== song.title) lastSongChange = Date.now();
        currentSong = { playing: true, ...song };
      }
    }
  } catch (err) {
    console.error('🎵 Poll error:', err.message);
    if (err.message?.includes('Not connected') || err.message?.includes('closed')) {
      shimmerTunesConnected = false;
      shimmerTunesClient = null;
      clearInterval(pollTimer);
      setTimeout(connectShimmerTunes, 10_000);
    }
  }
}

function isNoTrack(text) {
  return typeof text === 'string' && text.includes('No track');
}

function parseNowPlaying(text) {
  // Format: "Now playing: Title by Artist from Album"
  // Or:     "Now playing: Title by Artist"
  const withAlbum = text.match(/^Now playing:\s*(.+?)\s+by\s+(.+?)\s+from\s+(.+)$/i);
  if (withAlbum) {
    return { title: withAlbum[1], artist: withAlbum[2], album: withAlbum[3] };
  }
  const withoutAlbum = text.match(/^Now playing:\s*(.+?)\s+by\s+(.+)$/i);
  if (withoutAlbum) {
    return { title: withoutAlbum[1], artist: withoutAlbum[2], album: '' };
  }
  // Try JSON fallback
  try {
    const parsed = JSON.parse(text);
    const song = parsed.result && typeof parsed.result === 'object' ? parsed.result : parsed;
    return { title: song.name || song.title || 'Unknown', artist: song.artist || '', album: song.album || '' };
  } catch {
    return null;
  }
}

function extractText(result) {
  if (result?.content?.[0]?.text) return result.content[0].text;
  if (result?.result) return typeof result.result === 'string' ? result.result : JSON.stringify(result.result);
  return JSON.stringify(result);
}

// === API Endpoints ===

app.get('/api/now-playing', (_req, res) => {
  res.json({ ...currentSong, lastChange: lastSongChange });
});

app.get('/api/quotes', (_req, res) => {
  res.json(quotes);
});

app.get('/api/status', (_req, res) => {
  res.json({
    hour: new Date().getHours(),
    musicPlaying: currentSong.playing,
    quotesLoaded: quotes.length,
    shimmerTunesConnected,
  });
});


// === Start ===

app.listen(PORT, () => {
  console.log('');
  console.log('  🌀 Shimmer Field Radio');
  console.log(`  ✨ http://localhost:${PORT}`);
  console.log('  💖🐰🪱✨🩵🐱🦦🌀');
  console.log('');
  connectShimmerTunes();
});

process.on('SIGINT', () => {
  console.log('\n🌙 The fairy lights dim gently...');
  shimmerTunesClient?.close?.();
  process.exit(0);
});
