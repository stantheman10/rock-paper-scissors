const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS for WebSocket connections
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow these HTTP methods
    allowedHeaders: ['my-custom-header'], // Allow these headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client ' + socket.id + ' connected');

  socket.on('joinRoom', (room) => {
    if (!rooms[room]) {
      rooms[room] = [];
    }

    if (rooms[room].length >= 2) { // Change to >= to restrict more than 2 players
      socket.emit('roomFull');
      return;
    }

    rooms[room].push(socket.id);
    socket.join(room);
    console.log(`Client joined room: ${room}`);

    io.to(room).emit('userJoined', rooms[room]);

    if (rooms[room].length === 2) {
      io.to(room).emit('startGame');
    }
    else if (rooms[room].length < 2){
      io.to(room).emit('endGame');
    }

    socket.on('message', (message) => {
      console.log(`Message from ${room}: ${message}`);
      io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      io.to(room).emit('playerLeft');
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
      console.log('Client disconnected');
    });

    socket.on('sendChoice', (choice) => {
      console.log(typeof(choice.iconName));
      let name = choice.iconName;
      io.to(room).emit('opponentChoice', name);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
