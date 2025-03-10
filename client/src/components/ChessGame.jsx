import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import socket from "../utils/socket";

const ChessGame = ({ room }) => {
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    socket.emit("joinGame", { room });

    socket.on("gameState", (fen) => {
      console.log("Received game state:", fen);
      if (typeof fen === "string") {
        const newGame = new Chess();
        newGame.load(fen);
        setGame(newGame);
      } else {
        console.error("Invalid game state received:", fen);
      }
    });

    return () => {
      socket.off("gameState");
    };
  }, [room]);

  const makeMove = (move) => {
    const updatedGame = new Chess(game.fen());

    if (updatedGame.move(move)) {
      setGame(updatedGame);
      socket.emit("makeMove", { room, move });
    } else {
      console.warn("Invalid Move:", move);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Chess Game</h2>
      <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
        <Chessboard
          position={game.fen()}
          onPieceDrop={(sourceSquare, targetSquare) => {
            makeMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
          }}
          boardWidth={500} // ✅ Increase the board size (default is ~400px)
        />
      </div>
    </div>
  );
};

export default ChessGame;
 