const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let contractABI = null;

// ✅ Load Contract ABI & Connect to MetaMask
async function loadContract() {
    if (!contractABI) {
        const response = await fetch("./contract.json");
        contractABI = await response.json();
    }

    if (!window.ethereum) {
        alert("🦊 MetaMask is not installed! Please install it.");
        return null;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" }); // Request account access
    const signer = await provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
}

// ✅ Create Game & Stake ETH
async function createGame() {
    try {
        const contract = await loadContract();
        if (!contract) return alert("Contract not loaded.");

        const stakeAmount = prompt("Enter stake amount in ETH:");
        if (!stakeAmount) return;

        const tx = await contract.createGame({ value: ethers.parseEther(stakeAmount) });
        await tx.wait();
        alert("✅ Game Created!");
    } catch (error) {
        console.error("❌ Error creating game:", error);
        alert("Error: Check console for details.");
    }
}

// ✅ Fetch Game Details Before Joining
async function getGameDetails(gameId) {
    try {
        const contract = await loadContract();
        if (!contract) return null;

        const game = await contract.games(gameId);
        console.log("Game Details:", game); // Debugging log

        return {
            player1: game.player1,
            player2: game.player2,
            stake: ethers.formatEther(game.stakeAmount), // Fix here
        };
    } catch (error) {
        console.error("❌ Error fetching game details:", error);
        return null;
    }
}

// ✅ Join Game Function (Checks if Game is Full)
async function joinGame(gameId) {
    try {
        const contract = await loadContract();
        if (!contract) return alert("Contract not loaded.");

        // 🔍 Check game details first
        const gameDetails = await getGameDetails(gameId);
        if (!gameDetails) return alert("Game not found.");

        // 🚫 Prevent joining if the game is full
        if (gameDetails.player2 !== "0x0000000000000000000000000000000000000000") {
            return alert("⚠️ This game is already full! Choose another one.");
        }

        const stakeAmount = prompt(`Enter the same stake amount as Player 1 (${gameDetails.stake} ETH):`);
        if (!stakeAmount) return;

        // ✅ Proceed to join the game
        const tx = await contract.joinGame(gameId, { value: ethers.parseEther(stakeAmount) });
        await tx.wait();
        alert("✅ You joined the game!");

        // Refresh game list (if applicable)
        if (typeof showGames === "function") showGames();
    } catch (error) {
        console.error("❌ Error joining game:", error);
        alert(error.reason || "Error joining game! Check console for details.");
    }
}

// ✅ Declare Winner
async function declareWinner(gameId) {
    try {
        const contract = await loadContract();
        if (!contract) return alert("Contract not loaded.");

        const tx = await contract.declareWinner(gameId);
        await tx.wait();

        alert("🏆 Winner declared successfully! Refreshing balance...");

        // ✅ Show new balance after winning
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(signer.address);
        alert(`💰 New Balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
        console.error("❌ Error declaring winner:", error);
        alert(error.reason || "Error declaring winner! Check console for details.");
    }
}

