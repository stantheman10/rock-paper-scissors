import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandBackFist,
  faHand,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';






const PlayWithFriend = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [totalChances, setTotalChances] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draw, setDraw] = useState(0);
  const [choice, setChoice] = useState();
  const [confirmedChoice, setConfirmedChoice] = useState();
  const [socket, setSocket] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(10);
  const [playerConnected, setPlayerConnected] = useState(false);
  const [opponentChoice, setOpponentChoice] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setWins(0);
    setDraw(0);
    setLosses(0);
    setTimer(10);
    setTotalChances(0);
  }

  const handleExit = () => {
      navigate("/");
  }

  const handleShow = () => setShow(true);

  const choiceSetter = (ch) => {
    setChoice(ch);
  };

  const decisionMaker = (myChoice, oppChoice) => {
    console.log("My Chocie ", myChoice);
    console.log("Opp Chocie ", oppChoice);
    let ch = myChoice;

    if (ch == null || oppChoice == null) return;

    if (ch.iconName === oppChoice) {
      setDraw((prevCount) => prevCount + 1);
      setTotalChances((prevCount) => prevCount + 1);
    } else if (
      (ch.iconName === "hand-back-fist" && oppChoice === "hand-scissors") ||
      (ch.iconName === "hand-scissors" && oppChoice === "hand") ||
      (ch.iconName === "hand" && oppChoice === "hand-back-fist")
    ) {
      setWins((prevCount) => prevCount + 1);
      setTotalChances((prevCount) => prevCount + 1);
    } else {
      setLosses((prevCount) => prevCount + 1);
      setTotalChances((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    if (totalChances === 3) {
      handleShow();
    }
  }, [totalChances]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the socket.io server");
      setTotalChances(0);
    });

    newSocket.emit("joinRoom", roomId);

    newSocket.on("startGame", () => {
      console.log("Game has started");
      setPlayerConnected(true);
      setTimer(10);
    });

    newSocket.on("userJoined", (roomUsers) => {
      console.log("User joined, current room users:", roomUsers);
      // Update your state or UI to reflect the new list of users
    });

    newSocket.on("playerLeft", () => {
      console.log("A player has left the game");
      setPlayerConnected(false);
      setConfirmedChoice(null);
    });

    newSocket.on("opponentChoice", (choice) => {
      console.log(typeof choice);
      let ch = choice;
      setOpponentChoice(ch);
      console.log(opponentChoice);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the socket.io server");
    });

    return () => {
      newSocket.close();
    };
  }, [roomId]);

  useEffect(() => {
    if (seconds) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (seconds === 0) {
      decisionMaker(confirmedChoice, opponentChoice);
      setConfirmedChoice(null);
      setOpponentChoice("");
      setChoice();
      setTimer(10);
    }
  }, [seconds]);

  useEffect(() => {
    if(!playerConnected) return;
    if (timer) {
      const interval = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setConfirmedChoice(choice);
      socket.emit("sendChoice", choice);

      setSeconds(8);
    }
  }, [timer,playerConnected]);

  return (
    <div className="flex flex-col h-screen">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Game Over</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {wins >= 2 &&<p>You Win</p>}
          {losses >=2 && <p>You Loose</p>}
          {draw >=2 && <p>It is a draw !</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Play Again
          </Button>
          <Button variant="primary" onClick={handleExit}>Main Menu</Button>
        </Modal.Footer>
      </Modal>
      <h1 className="text-center text-3xl">Play With Your Friend</h1>
      <h2 className="text-xl">Time to make move - {timer}</h2>
      <div className="flex h-full">
        <div className="w-1/2 bg-blue-500  h-full border-r border-black flex flex-col items-center justify-start ">
          <h2 className="text-xl">Your side</h2>
          <div className="flex flex-row space-x-4 justify-start items-start text-2xl">
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>
            <p>Draws : {draw}</p>
          </div>
          {confirmedChoice ? (
            <div className="flex  items-center justify-center space-x-12 h-64 mt-16 ">
              <FontAwesomeIcon icon={confirmedChoice} className="h-28 p-2" />
            </div>
          ) : (
            <div className="flex  items-center justify-center space-x-12 mt-16 h-64  ">
              <FontAwesomeIcon
                icon={faHandBackFist}
                className="h-20 p-2 hover:h-24"
                onClick={() => choiceSetter(faHandBackFist)}
              />
              <FontAwesomeIcon
                icon={faHand}
                className="h-20 p-2 hover:h-24"
                onClick={() => choiceSetter(faHand)}
              />
              <FontAwesomeIcon
                icon={faHandScissors}
                className="h-20 p-2 hover:h-24"
                onClick={() => choiceSetter(faHandScissors)}
              />
            </div>
          )}

          {playerConnected ? (
            <div className="space-y-2 mt-10">
              <p className="text-2xl">
                Your choice is <FontAwesomeIcon className="h-18" icon={choice} />{" "}
              </p>{" "}
            </div>
          ) : (
            <div>Waiting for player to join... </div>
          )}
        </div>
        {playerConnected ? (
          <div className="w-1/2 bg-green-500 text-center h-full flex flex-col items-center justify-start space-y-18 text-xl">
            Player connected
            {opponentChoice.length > 0 ? (
              <div> 
              {opponentChoice === "hand" && (
                <div className="flex flex-col mt-36 h-64 w-64 space-y-32">
                  
                  <FontAwesomeIcon className="h-28" icon={faHand} /> 
                  <p>Opponent choice </p>
                </div>
              )}
              {opponentChoice === "hand-back-fist" && (
                <div className="text-xl flex flex-col mt-36 h-64 w-64 space-y-32">
                  
                  <FontAwesomeIcon className="h-28" icon={faHandBackFist} /> 
                  <p>Opponent choice </p>
                </div>
              )}
              {opponentChoice === "hand-scissors" && (
                <div className="text-xl flex flex-col mt-36 h-64 w-64 space-y-32">
                  
                  <FontAwesomeIcon className="h-28" icon={faHandScissors} /> 
                  <p>Opponent choice </p>
                </div>
              )}
            </div>
            ) : (
              <div>Waiting for opponent to make a move </div>
            )}
          </div>
        ) : (
          <div className="w-1/2 bg-green-500 text-center h-full flex flex-col items-center justify-start space-y-12">
            <h2 className="text-xl">opponent side</h2>
            <div className="flex flex-col justify-center items-center h-full">
              <p>Share this link with your friend</p>
              <p className="underline">{window.location.href}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayWithFriend;
