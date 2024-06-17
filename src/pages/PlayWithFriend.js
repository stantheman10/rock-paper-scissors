import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandBackFist,
  faHand,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";


const PlayWithFriend = () => {
  const { roomId } = useParams();
  const [totalChances,setTotalChances] = useState(0)
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

  const choiceSetter = (ch) => {
    setChoice(ch);
  };

  const decisionMaker = (myChoice,oppChoice) => {
    console.log("My Chocie ",myChoice);
    console.log("Opp Chocie ", oppChoice);
    let ch = myChoice;

    if(ch == null || oppChoice == null) return;

    if( ch === oppChoice){
      setDraw(prevCount => prevCount + 1)
      setTotalChances(prevCount => prevCount + 1);
    }
    else if ( (ch.iconName == "hand-back-fist" && oppChoice == "hand-scissors") || (ch.iconName == "hand-scissors" && oppChoice == "hand") || (ch.iconName == "hand" && oppChoice == "hand-back-fist")){
      setWins(prevCount => prevCount + 1);
      setTotalChances(prevCount => prevCount + 1);
    }
    else {
      setLosses(prevCount => prevCount + 1);
      setTotalChances(prevCount => prevCount + 1);
    }

  }

  useEffect (()=>{
    

    if(totalChances === 3){
        alert("Game Finished")
    }

  },[totalChances])

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the socket.io server");
      setTotalChances(0);
    });

    newSocket.emit("joinRoom", roomId);

    newSocket.on('startGame', () => {
      console.log('Game has started');
      setPlayerConnected(true);
      setTimer(10);
    });

    newSocket.on('userJoined', (roomUsers) => {
      console.log('User joined, current room users:', roomUsers);
      // Update your state or UI to reflect the new list of users
    });

    newSocket.on('playerLeft', () => {
      console.log('A player has left the game');
      setPlayerConnected(false);
      setConfirmedChoice(null);
      
    });


    newSocket.on('opponentChoice', (choice) => {
      console.log(typeof(choice));
      let ch = choice;
      setOpponentChoice(ch);
      console.log(opponentChoice)
      
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
      decisionMaker(confirmedChoice,opponentChoice);
      setConfirmedChoice(null);
      setOpponentChoice("");
      setChoice();
      setTimer(10);
      
    }
  }, [seconds]);

  useEffect(() => {
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
  }, [timer]);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-center">Play With Your Friend</h1>
      <h2>Time to make move - {timer}</h2>
      <div className="flex h-full">
        <div className="w-1/2 bg-blue-500  h-full border-r border-black flex flex-col items-center justify-start ">
          <h2>Your side</h2>
          <div className="flex flex-row space-x-4 justify-start items-start">
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>
            <p>Draws : {draw}</p>
          </div>
          {confirmedChoice ? (
            <div className="flex  items-center justify-center space-x-12 h-64 mt-16 bg-gray-200">
              <FontAwesomeIcon icon={confirmedChoice} className="h-14 p-2" />
            </div>
          ) : (
            <div className="flex  items-center justify-center space-x-12 mt-16 h-64  bg-gray-200">
              <FontAwesomeIcon
                icon={faHandBackFist}
                className="h-14 p-2 hover:h-16"
                onClick={() => choiceSetter(faHandBackFist)}
              />
              <FontAwesomeIcon
                icon={faHand}
                className="h-14 p-2 hover:h-16"
                onClick={() => choiceSetter(faHand)}
              />
              <FontAwesomeIcon
                icon={faHandScissors}
                className="h-14 p-2 hover:h-16"
                onClick={() => choiceSetter(faHandScissors)}
              />
            </div>
          )}

          {playerConnected ? <div className="space-y-2 mt-10">
              <p className="text-xl">
                Your choice is <FontAwesomeIcon icon={choice}  />{" "}
              </p>{" "}
             
            </div> : <div>Waiting for player to join... </div>
          }
        </div>
        {playerConnected ? <div className="w-1/2 bg-green-500 text-center h-full flex flex-col items-center justify-start space-y-12">
          Player connected
        {opponentChoice.length > 0 ? <div> Opponent Choice = {opponentChoice} </div> : <div>Waiting for opponent to make a move </div>}
        
        
        </div> :  <div className="w-1/2 bg-green-500 text-center h-full flex flex-col items-center justify-start space-y-12">
          <h2>opponent side</h2>
          <div className="flex flex-col justify-center items-center h-full">
            <p>Share this link with your friend</p>
            <p className="underline">{window.location.href}</p>
          </div>
        </div> }
        
      </div>
    </div>
  );
};

export default PlayWithFriend;
