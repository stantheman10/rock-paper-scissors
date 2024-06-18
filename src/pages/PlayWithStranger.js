import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaHandRock, FaHandPaper, FaHandScissors, FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const PlayWithStranger = () => {
  const [message, setMessage] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [move, setMove] = useState('');
  const [opponentMove, setOpponentMove] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState('');
  const [bothPlayersMoved, setBothPlayersMoved] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showWinnerPage, setShowWinnerPage] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const rock = 'rock';
  const paper = 'paper';
  const scissors = 'scissors';

  useEffect(() => {
    socket.emit('joinGame');

    socket.on('startGame', (msg) => {
      setGameMessage(msg);
      setGameStarted(true);
      startTimer();
    });

    socket.on('message', (msg) => {
      setMessage(msg);
    });

    socket.on('gameResult', (result) => {
      setTimeout(() => {
        setWinner(result);
        updateScores(result);
        setBothPlayersMoved(true);
      }, 2000); // Delay before displaying the winner
    });

    socket.on('opponentMove', (moves) => {
      const opponentId = Object.keys(moves).find((id) => id !== socket.id);
      setOpponentMove(moves[opponentId]);
    });

    socket.on('gameWinner', () => {
      setShowWinnerPage(true);
    });

    return () => {
      socket.off('startGame');
      socket.off('message');
      socket.off('gameResult');
      socket.off('opponentMove');
      socket.off('gameWinner');
    };
  }, []);

  useEffect(() => {
    let timerId;
    if (timerRunning && timer > 0) {
      timerId = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setTimerRunning(false);
      if (!move) {
        sendMove(null); // No move selected within time
      }
    }
    return () => clearTimeout(timerId);
  }, [timer, timerRunning]);

  const startTimer = () => {
    setTimer(10);
    setTimerRunning(true);
  };

  const startNewRound = () => {
    setRoundCount((count) => count + 1);
    setMove('');
    setOpponentMove('');
    setWinner('');
    setBothPlayersMoved(false);
    setTimerRunning(false);
    startTimer(); // Start timer for the new round
  };

  const sendMove = (selectedMove) => {
    console.log(`Sending move: ${selectedMove}`);
    setMove(selectedMove);
    socket.emit('playerMove', selectedMove);
  };

  const updateScores = (result) => {
    switch (result) {
      case 'Player 1 wins':
        setPlayerWins((wins) => {
          const newWins = wins + 1;
          if (newWins === 2) {
            socket.emit('announceWinner', socket.id); // Emit event to announce winner
          }
          return newWins;
        });
        break;
      case 'Player 2 wins':
        setOpponentWins((wins) => {
          const newWins = wins + 1;
          if (newWins === 2) {
            socket.emit('announceWinner', socket.id); // Emit event to announce winner
          }
          return newWins;
        });
        break;
      case 'Draw':
        setDraws((draws) => draws + 1);
        break;
      default:
        break;
    }
  };

  const refresh = () => {
    setGameStarted(false);
    setMove('');
    setOpponentMove('');
    setWinner('');
    setBothPlayersMoved(false);
    setPlayerWins(0);
    setOpponentWins(0);
    setDraws(0);
    setRoundCount(0);
    setTimer(10);
    setTimerRunning(false);
    setShowWinnerPage(false);
    socket.emit('joinGame'); // Re-join the game
  };

  useEffect(() => {
    if (bothPlayersMoved) {
      setTimerRunning(false); // Pause timer
      setTimeout(() => {
        startNewRound(); // Start new round after 2 seconds
      }, 2000);
    }
  }, [bothPlayersMoved]);

  useEffect(() => {
    if (showWinnerPage) {
      console.log('Navigating to /winner page'); // Debugging log
      navigate('/winner'); // Redirect to winner page
    }
  }, [showWinnerPage, navigate]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl">Play with a Stranger</h2>
      {!gameStarted && <p>Waiting for an opponent...</p>}
      {gameStarted && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <button onClick={() => sendMove(rock)} className="bg-gray-200 p-2 rounded flex items-center space-x-2">
              <FaHandRock className="text-xl" /> <span>Rock</span>
            </button>
            <button onClick={() => sendMove(paper)} className="bg-gray-200 p-2 rounded flex items-center space-x-2">
              <FaHandPaper className="text-xl" /> <span>Paper</span>
            </button>
            <button onClick={() => sendMove(scissors)} className="bg-gray-200 p-2 rounded flex items-center space-x-2">
              <FaHandScissors className="text-xl" /> <span>Scissors</span>
            </button>
            <button onClick={refresh} className="bg-gray-200 p-2 rounded flex items-center space-x-2">
              <FaSyncAlt className="text-xl" /> <span>Refresh</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <p>Round: {roundCount}</p>
            <p>Your Wins: {playerWins}</p>
            <p>Opponent Wins: {opponentWins}</p>
            <p>Draws: {draws}</p>
            {timerRunning && <p>Time remaining: {timer} seconds</p>}
          </div>
        </div>
      )}
      {move && <p>Your move: {move}</p>}
      {gameMessage && <p>{gameMessage}</p>}
      {bothPlayersMoved && winner && <p>Winner: {winner}</p>}
    </div>
  );
};

export default PlayWithStranger;
