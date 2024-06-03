const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});

const publicRooms = [];

const determineWinner = (move1, move2) => {
  if (move1 === move2) {
    console.log('Draw');
    return 'Draw';
  } else if (move1 === 'rock' && move2 === 'scissors') {
    console.log('Player 1 wins');
    return 'Player 1 wins';
  } else if (move1 === 'paper' && move2 === 'rock') {
    console.log('Player 1 wins');
    return 'Player 1 wins';
  } else if (move1 === 'scissors' && move2 === 'paper') {
    console.log('Player 1 wins');
    return 'Player 1 wins';
  } else {
    console.log('Player 2 wins');
    return 'Player 2 wins';
  }
};



io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
    leaveRoom(socket);
  });

  socket.on('joinGame', () => {
    console.log(`User ${socket.id} joined the game`);
    let room = publicRooms.find(room => room.players.length < 2);
    if (!room) {
      room = { id: `room-${publicRooms.length + 1}`, players: [] };
      publicRooms.push(room);
    }
    room.players.push(socket.id);
    socket.join(room.id);
    socket.roomId = room.id;

    if (room.players.length === 2) {
      io.to(room.id).emit('startGame', 'Game is starting!');
    }
  });

  socket.on('playerMove', (move) => {
    console.log(`User ${socket.id} made a move: ${move}`);
    const room = publicRooms.find(room => room.id === socket.roomId);
    if (room) {
      socket.move = move;
      if (room.players.every(playerId => io.sockets.sockets.get(playerId).move)) {
        const player1 = io.sockets.sockets.get(room.players[0]);
        const player2 = io.sockets.sockets.get(room.players[1]);
        const result = determineWinner(player1.move, player2.move);

        
        console.log(`Winner: ${result}`);

        io.to(room.id).emit('gameResult', result);
        io.to(room.id).emit('opponentMove', { [room.players[0]]: player1.move, [room.players[1]]: player2.move });

        player1.move = null;
        player2.move = null;
      }
    }
  });

  const leaveRoom = (socket) => {
    const room = publicRooms.find(room => room.id === socket.roomId);
    if (room) {
      room.players = room.players.filter(playerId => playerId !== socket.id);
      if (room.players.length === 0) {
        publicRooms.splice(publicRooms.indexOf(room), 1);
      } else {
        io.to(room.id).emit('message', 'Opponent left the game.');
      }
    }
  };
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
