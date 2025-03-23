const { ethers } = require("hardhat");

async function main() {
    const GameContract = await ethers.getContractFactory("GameContract");
    const game = await GameContract.deploy();  // No "deployed()" in ethers v6

    await game.waitForDeployment(); // Instead of game.deployed()
    console.log("GameContract deployed to:", await game.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
