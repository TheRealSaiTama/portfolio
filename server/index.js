const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const httpServer = createServer(app);

// CORS configuration for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "https://keshavkumarjha.com",
      "https://www.keshavkumarjha.com",
    ],
    methods: ["GET", "POST"],
  },
});

// Anonymous username generator
const ADJECTIVES = [
  "Anonymous", "Mysterious", "Shadowy", "Secret", "Hidden",
  "Stealthy", "Phantom", "Ghost", "Silent", "Midnight",
  "Cosmic", "Neon", "Digital", "Cyber", "Binary",
  "Quantum", "Stellar", "Void", "Echo", "Pixel"
];

const NOUNS = [
  "Panda", "Dragon", "Phoenix", "Ninja", "Samurai",
  "Wizard", "Hacker", "Coder", "Dev", "Byte",
  "Wolf", "Fox", "Owl", "Raven", "Tiger",
  "Falcon", "Bear", "Shark", "Lion", "Eagle"
];

const COLORS = [
  "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
  "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a",
  "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"
];

// Avatar styles (dicebear)
const AVATAR_STYLES = [
  "adventurer", "adventurer-neutral", "avataaars", "big-ears",
  "big-smile", "bottts", "croodles", "fun-emoji", "icons",
  "identicon", "lorelei", "micah", "miniavs", "notionists",
  "open-peeps", "personas", "pixel-art", "shapes", "thumbs"
];

function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

function generateColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function generateAvatar() {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  const seed = uuidv4();
  return `${style}:${seed}`;
}

// In-memory storage (resets on server restart)
const sessions = new Map(); // sessionId -> user data
const messages = []; // Store last 100 messages
const MAX_MESSAGES = 100;

// Rate limiting
const rateLimits = new Map(); // sessionId -> { count, lastReset }
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const RATE_LIMIT_MAX = 5; // 5 messages per window

function checkRateLimit(sessionId) {
  const now = Date.now();
  const limit = rateLimits.get(sessionId);
  
  if (!limit || now - limit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimits.set(sessionId, { count: 1, lastReset: now });
    return true;
  }
  
  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Get location from IP (basic implementation)
async function getLocationFromIP(ip) {
  try {
    // For local development
    if (ip === "127.0.0.1" || ip === "::1" || ip.includes("192.168")) {
      return { country: "Local", flag: "🏠" };
    }
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode`);
    const data = await response.json();
    if (data.country) {
      const flag = countryCodeToFlag(data.countryCode);
      return { country: data.country, flag };
    }
  } catch (e) {
    console.error("Failed to get location:", e);
  }
  return { country: "Unknown", flag: "🌍" };
}

function countryCodeToFlag(code) {
  if (!code) return "🌍";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    users: sessions.size,
    messages: messages.length
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Socket.IO connection handling
io.on("connection", async (socket) => {
  const clientIP = socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || 
                   socket.handshake.address;
  
  let sessionId = socket.handshake.auth.sessionId;
  let user;
  
  // Check for existing session
  if (sessionId && sessions.has(sessionId)) {
    user = sessions.get(sessionId);
    user.socketId = socket.id;
    user.isOnline = true;
    user.lastSeen = new Date().toISOString();
  } else {
    // Create new session
    sessionId = uuidv4();
    const { country, flag } = await getLocationFromIP(clientIP);
    
    user = {
      id: sessionId,
      socketId: socket.id,
      name: generateUsername(),
      avatar: generateAvatar(),
      color: generateColor(),
      isOnline: true,
      posX: 0,
      posY: 0,
      location: country,
      flag: flag,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    sessions.set(sessionId, user);
  }
  
  // Send session ID to client
  socket.emit("session", { sessionId });
  
  // Send existing messages
  socket.emit("msgs-receive-init", messages);
  
  // Broadcast user list to all clients
  const broadcastUsers = () => {
    const userList = Array.from(sessions.values()).filter(u => u.isOnline);
    io.emit("users", userList);
  };
  
  broadcastUsers();
  
  // Handle message sending
  socket.on("msg-send", (data) => {
    if (!data.content || data.content.trim() === "") return;
    
    // Rate limiting
    if (!checkRateLimit(sessionId)) {
      socket.emit("warning", { message: "Slow down! You're sending messages too fast." });
      return;
    }
    
    // Sanitize content (basic XSS prevention)
    const content = data.content.slice(0, 500).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    const message = {
      id: uuidv4(),
      sessionId: user.id,
      flag: user.flag,
      country: user.location,
      username: user.name,
      avatar: user.avatar,
      color: user.color,
      content: content,
      createdAt: new Date().toISOString(),
    };
    
    messages.push(message);
    
    // Keep only last MAX_MESSAGES
    while (messages.length > MAX_MESSAGES) {
      messages.shift();
    }
    
    // Broadcast to all clients
    io.emit("msg-receive", message);
  });
  
  // Handle profile updates
  socket.on("update-user", (data) => {
    if (data.username) {
      user.name = data.username.slice(0, 30).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    if (data.avatar) {
      user.avatar = data.avatar;
    }
    if (data.color) {
      user.color = data.color;
    }
    sessions.set(sessionId, user);
    broadcastUsers();
  });
  
  // Handle cursor/mouse position (for remote cursors feature)
  socket.on("cursor-move", (data) => {
    user.posX = data.x || 0;
    user.posY = data.y || 0;
    socket.broadcast.emit("cursor-update", {
      id: sessionId,
      x: user.posX,
      y: user.posY,
      name: user.name,
      color: user.color,
    });
  });
  
  // Handle typing indicator
  socket.on("typing", () => {
    socket.broadcast.emit("user-typing", {
      id: sessionId,
      username: user.name,
    });
  });
  
  socket.on("stop-typing", () => {
    socket.broadcast.emit("user-stop-typing", {
      id: sessionId,
    });
  });
  
  // Handle disconnect
  socket.on("disconnect", () => {
    user.isOnline = false;
    user.lastSeen = new Date().toISOString();
    broadcastUsers();
    
    // Clean up after 30 minutes of inactivity
    setTimeout(() => {
      if (!user.isOnline && sessions.has(sessionId)) {
        const currentUser = sessions.get(sessionId);
        const lastSeen = new Date(currentUser.lastSeen).getTime();
        if (Date.now() - lastSeen > 30 * 60 * 1000) {
          sessions.delete(sessionId);
        }
      }
    }, 30 * 60 * 1000);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
});
