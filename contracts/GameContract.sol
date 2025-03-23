// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma solidity ^0.8.0;

contract GameContract {
    address public owner; // Contract owner
    uint256 public gameCounter; // Game ID counter

    struct Game {
        address payable player1;
        address payable player2;
        uint256 stakeAmount;
        bool isCompleted;
        address winner;
    }

    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, address player1, uint256 stakeAmount);
    event GameJoined(uint256 gameId, address player2);
    event WinnerDeclared(uint256 gameId, address winner, uint256 reward);
    event GameReset(uint256 gameId);

    constructor() {
        owner = msg.sender;
        gameCounter = 0;
    }

    // ✅ Create a new game and stake ETH
    function createGame() public payable {
        require(msg.value > 0, "Stake must be greater than zero");

        gameCounter++; // 🔥 Ensure a fresh game ID
        games[gameCounter] = Game({
            player1: payable(msg.sender),
            player2: payable(address(0)),
            stakeAmount: msg.value,
            isCompleted: false,
            winner: address(0)
        });

        emit GameCreated(gameCounter, msg.sender, msg.value);
    }

    // ✅ Join an existing game
    function joinGame(uint gameId) public payable {
        require(gameId <= gameCounter, "Invalid game ID");
        require(games[gameId].player2 == address(0), "Game already full");
        require(msg.sender != games[gameId].player1, "You cannot join your own game!");
        require(msg.value == games[gameId].stakeAmount, "Stake amount must match Player 1");

        games[gameId].player2 = payable(msg.sender);
        emit GameJoined(gameId, msg.sender);
    }

    // ✅ Declare winner
    function declareWinner(uint256 gameId) external {
        Game storage game = games[gameId];

        require(game.player1 != address(0) && game.player2 != address(0), "Invalid game");
        require(!game.isCompleted, "Game already completed");
        require(msg.sender == game.player1 || msg.sender == game.player2, "You are not a player in this game");

        uint256 reward = game.stakeAmount * 2;
        require(address(this).balance >= reward, "Not enough ETH in contract");

        game.winner = msg.sender;
        game.isCompleted = true;

        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "ETH Transfer failed");

        emit WinnerDeclared(gameId, msg.sender, reward);
    }

    // ✅ Reset game and use a fresh game ID
    function resetGame(uint256 gameId) external {
        Game storage game = games[gameId];

        require(game.isCompleted, "Game must be completed before resetting");
        require(msg.sender == game.player1 || msg.sender == game.player2, "Only players can reset the game");

        // ❌ Instead of deleting, create a fresh game ID
        gameCounter++; // 🔥 Ensure next game has a fresh ID
        delete games[gameId]; // Remove old game

        emit GameReset(gameId);
    }
}
