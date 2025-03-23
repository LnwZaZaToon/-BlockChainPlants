import dotenv from "dotenv";
import hardhat from "hardhat"; // Import hardhat
import path from 'path'; // Import the path module
const { ethers } = hardhat; // Destructure ethers from hardhat

// Load environment variables from the .env file
dotenv.config({ path: path.resolve('C:/Users/Toon/Desktop/autoparts-main/backend/.env') });

async function main() {
  console.log("Deploying contract...");
  console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
  console.log("GANACHE_URL:", process.env.GANACHE_URL); // Ensure GANACHE_URL is set in .env

  // Ensure PRIVATE_KEY and GANACHE_URL are set in .env
  if (!process.env.PRIVATE_KEY || !process.env.GANACHE_URL) {
    console.error("PRIVATE_KEY and GANACHE_URL must be defined in the .env file.");
    process.exit(1);
  }

  // Initialize the provider with Ganache RPC URL
  const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL); // Ganache URL (e.g., http://127.0.0.1:7545)

  // Initialize wallet with private key and provider
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Get the contract factory for QuestReward
  const QuestReward = await ethers.getContractFactory("QuestReward", wallet);
  const questReward = await QuestReward.deploy();
  await questReward.deployed();

  console.log("✅ QuestReward contract deployed at:", questReward.address);
}

main()
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
