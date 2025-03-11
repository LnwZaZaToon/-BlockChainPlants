require('dotenv').config(); // Import environment variables from .env file
const { ethers } = require("ethers");

async function main() {
  const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env;

  // Set up the provider for the Sepolia testnet
  const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);

  // Create a wallet instance using the private key and the provider
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Get the contract factory for the QuestReward contract
  const QuestReward = await ethers.getContractFactory("QuestReward", wallet);

  // Deploy the contract to Sepolia
  const questReward = await QuestReward.deploy();
  await questReward.deployed(); // Wait until the contract is deployed

  // Log the contract address
  console.log("QuestReward contract deployed to:", questReward.address);
}

// Execute the main function
main()
  .then(() => process.exit(0)) // Exit cleanly if successful
  .catch((error) => {
    console.error(error);  // Log errors if deployment fails
    process.exit(1);       // Exit with error code 1
  });
