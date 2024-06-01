const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);

// Enable CORS for WebSocket connections very very important
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow these HTTP methods
    allowedHeaders: ['my-custom-header'], // Allow these headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }
});

// WebSocket server logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('message', (message) => {
    console.log(message);
  });

  // Add more event listeners here
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
