const { Chess } = require("chess.js");

const games = {}; // Store games by room

const createGame = (room) => {
  games[room] = new Chess();
};

const getGame = (room) => {
  if (!games[room]) createGame(room);
  return games[room];
};

const makeMove = (room, move) => {
  const game = getGame(room);
  const result = game.move(move);

  if (result) {
    return game.fen(); // Return updated board state
  }
  return null; // Invalid move
};

module.exports = { getGame, makeMove };
