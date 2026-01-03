const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active users
const activeUsers = new Map();
const messageHistory = [];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/api/messages', (req, res) => {
  res.json(messageHistory);
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle user joining
  socket.on('user-join', (username) => {
    activeUsers.set(socket.id, { username, id: socket.id });
    
    // Notify all clients about new user
    io.emit('user-joined', {
      userId: socket.id,
      username: username,
      users: Array.from(activeUsers.values())
    });

    console.log(`${username} joined the chat`);
  });

  // Handle incoming messages
  socket.on('send-message', (data) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      const message = {
        id: Date.now(),
        userId: socket.id,
        username: user.username,
        text: data.text,
        timestamp: new Date().toISOString()
      };

      messageHistory.push(message);
      // Keep only last 100 messages
      if (messageHistory.length > 100) {
        messageHistory.shift();
      }

      // Broadcast message to all clients
      io.emit('receive-message', message);
      console.log(`Message from ${user.username}: ${data.text}`);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        userId: socket.id,
        username: user.username
      });
    }
  });

  // Handle stop typing
  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing', {
      userId: socket.id
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      io.emit('user-left', {
        userId: socket.id,
        username: user.username,
        users: Array.from(activeUsers.values())
      });
      console.log(`${user.username} left the chat`);
    }
  });

  // Send current active users to new client
  socket.emit('user-list', Array.from(activeUsers.values()));
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
