import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [room, setRoom] = useState("");
  const [gameType, setGameType] = useState("chess");
  const navigate = useNavigate();

  const joinGame = () => {
    if (room.trim()) {
      navigate(`/game/${gameType}/${room}`);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6">🎮 Welcome to Game Arena</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl text-black w-80">
        <h2 className="text-xl font-semibold mb-4">Choose Your Game</h2>
        
        <select
          className="w-full p-2 mb-4 border rounded-lg"
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          <option value="chess">♟️ Chess</option>
          <option value="ludo">🎲 Ludo (Coming Soon)</option>
        </select>
        
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full p-2 mb-4 border rounded-lg"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          onClick={joinGame}
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Home;
