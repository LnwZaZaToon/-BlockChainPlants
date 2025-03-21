import dotenv from "dotenv";
import hardhat from "hardhat";

// Destructure ethers from the hardhat package
const { ethers } = hardhat;

dotenv.config();

async function main() {

  console.log("Deploying contract...");

  // Set up provider
  const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

  // Ensure private key starts with "0x"
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Deploy contract
  const QuestReward = await ethers.getContractFactory("QuestReward", wallet);
  const questReward = await QuestReward.deploy();
  await questReward.deployed();

  console.log("✅ QuestReward contract deployed at:", questReward.address);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});

/*

  import dotenv from "dotenv";
dotenv.config();
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env;

  // Log the environment variables for debugging
  console.log("INFURA_PROJECT_ID:", INFURA_PROJECT_ID);
  console.log("PRIVATE_KEY:", PRIVATE_KEY ? "Loaded" : "Not Loaded");

  // Ensure the private key starts with '0x'
  const formattedPrivateKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;

  // Set up the provider for the Sepolia testnet
  const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
  console.log("Provider initialized successfully");

  // Create a wallet instance using the private key and the provider
  const wallet = new ethers.Wallet(formattedPrivateKey, provider);
  console.log("Wallet initialized successfully");

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
*/