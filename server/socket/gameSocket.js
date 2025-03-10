import { Server } from "socket.io";
import { Chess } from "chess.js";

const games = {}; // Store game states per room

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Allow frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    socket.on("joinGame", ({ room }) => {
      socket.join(room);
      console.log(`Player joined room: ${room}`);

      if (!games[room]) {
        games[room] = new Chess(); // Initialize game state for room
      }

      // Send the current game state to the joining player
      socket.emit("gameState", games[room].fen());
    });

    socket.on("makeMove", ({ room, move }) => {
      if (games[room]) {
        const game = games[room];

        const result = game.move(move);
        if (result) {
          console.log(`Move made in room ${room}:`, move);

          // Broadcast the updated game state to all players in the room
          io.to(room).emit("gameState", game.fen());
        } else {
          console.warn("Invalid move attempted:", move);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
    });
  });

  return io;
}
