import React from "react";
import { useParams } from "react-router-dom";
import ChessGame from "../components/ChessGame";

const GameRoom = () => {
  const { gameType, room } = useParams();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Room: {room}</h2>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {gameType === "chess" && <ChessGame room={room} />}
      </div>
    </div>
  );
};

export default GameRoom;
