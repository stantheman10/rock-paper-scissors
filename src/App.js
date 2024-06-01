import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the WebSocket server

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(messages);
    });

    // Clean up on unmount
    return () => {
      socket.off('message');
    };
  }, );

  const sendMessage = (message) => {
    // Send a message to the server
    socket.emit('message', message);
  };

  return (
    <div>
     <h1>Rock Paper Scissors</h1>
     <button onClick={() => sendMessage('rock')}>Rock</button>
     <button onClick={() => sendMessage('paper')}>Paper</button>
     <button onClick={() => sendMessage('scissors')}>Scissors</button>
    </div>
  );
};

export default App;
