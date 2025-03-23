let board = Array(9).fill(null);
let currentPlayer = "X";

document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (!board[index]) {
            board[index] = currentPlayer;
            cell.innerText = currentPlayer;
            if (checkWinner()) {
                document.getElementById("status").innerText = `${currentPlayer} Wins!`;
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            }
        }
    });
});

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombos.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

document.getElementById("reset").addEventListener("click", () => {
    board.fill(null);
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
    document.getElementById("status").innerText = "New Game Started!";
    currentPlayer = "X";
});
