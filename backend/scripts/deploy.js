import dotenv from "dotenv";
import hardhat from "hardhat"; // Import hardhat
import path from 'path'; // Import the path module
const { ethers } = hardhat; // Destructure ethers from hardhat

dotenv.config({ path: path.resolve('C:/Users/Toon/Desktop/autoparts-main/backend/.env') });

async function main() {
  console.log("Deploying contract...");
  console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
  console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY);


  // Correct the provider initialization to use ethers.providers.JsonRpcProvider
  const provider = ethers.getDefaultProvider('sepolia');
//0xbA82e4CB199791368a14E67C37a0B94E28d6077c contract address
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
