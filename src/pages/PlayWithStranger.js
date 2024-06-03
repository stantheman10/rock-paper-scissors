import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const PlayWithStranger = () => {
  const [message, setMessage] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [move, setMove] = useState('');
  const [opponentMove, setOpponentMove] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState('');

  const rock = 'rock';
  const paper = 'paper';
  const scissors = 'scissors';

  useEffect(() => {
    socket.emit('joinGame');

    socket.on('startGame', (msg) => {
      setGameMessage(msg);
      setGameStarted(true);
    });

    socket.on('message', (msg) => {
      setMessage(msg);
    });

    socket.on('gameResult', (result) => {
      setWinner(result);
    });

    socket.on('opponentMove', (moves) => {
      const opponentId = Object.keys(moves).find(id => id !== socket.id);
      setOpponentMove(moves[opponentId]);
    });

    return () => {
      socket.off('startGame');
      socket.off('message');
      socket.off('gameResult');
      socket.off('opponentMove');
    };
  }, []);

  const sendMove = (selectedMove) => {
    console.log(`Sending move: ${selectedMove}`);
    setMove(selectedMove);
    socket.emit('playerMove', selectedMove);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl">Play with a Stranger</h2>
      {!gameStarted && <p>Waiting for an opponent...</p>}
      {gameStarted && (
        <div className="space-x-4">
          <button onClick={() => sendMove(rock)} className="bg-gray-200 p-2 rounded">Rock</button>
          <button onClick={() => sendMove(paper)} className="bg-gray-200 p-2 rounded">Paper</button>
          <button onClick={() => sendMove(scissors)} className="bg-gray-200 p-2 rounded">Scissors</button>
        </div>
      )}
      {move && <p>Your move: {move}</p>}
      {opponentMove && <p>Opponent's move: {opponentMove}</p>}
      {gameMessage && <p>{gameMessage}</p>}
      {winner && <p>Winner: {winner}</p>}
    </div>
  );
};

export default PlayWithStranger;
