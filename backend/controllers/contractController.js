import dotenv from "dotenv";
import { ethers } from "ethers"; // Import ethers
import path from 'path';
import contractABI from "../artifacts/Contracts/contract.sol/QuestReward.json" assert { type: 'json' };

// Log the ABI to ensure it's loaded correctly


dotenv.config({ path: path.resolve('C:/Users/Toon/Desktop/autoparts-main/backend/.env') });

console.log(process.env.ALCHEMY_API_KEY);
console.log(process.env.PRIVATE_KEY);

// Correct provider initialization using ethers.providers.JsonRpcProvider
//const provider = ethers.getDefaultProvider('sepolia');
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);

// Your contract address
const contractAddress = "0xbA82e4CB199791368a14E67C37a0B94E28d6077c"; 
const abi = contractABI.abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

// Initialize wallet with private key
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet; // Directly assign signer here

const completeQuest = async () => {
    const { userAddress } = req.body; // Assume the frontend sends the user's address to this API

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        // Check if the sender is the admin (the owner of the contract)
        const adminAddress = await contract.owner();
        if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ error: "Only the admin can complete quests" });
        }

        // Call the completeQuest function
        const tx = await contract.completeQuest(userAddress);
        await tx.wait(); // Wait for the transaction to be mined

        res.status(200).json({ message: "Quest completed and reward sent", txHash: tx.hash });
    } catch (error) {
        console.error("Error completing quest:", error);
        res.status(500).json({ error: "Error completing quest" });
    }
}

const getBalance = async (req, res) => {
    const { userAddress } = req.query;

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        console.log("Contract Address:", contract.address);
        console.log("Contract ABI:", contract.interface.fragments);

        // Check if userAddress is an ENS name and resolve it
        let resolvedAddress = userAddress;
        if (userAddress.includes('.eth')) {
            resolvedAddress = await provider.resolveName(userAddress);
            if (!resolvedAddress) {
                return res.status(400).json({ error: "Invalid ENS name" });
            }
        }
        await new Promise(res => setTimeout(res, 300));
        // Now call getBalance with the resolved or original address
        const balance = await contract.getBalance(resolvedAddress);
        res.status(200).json({ balance: ethers.utils.formatEther(balance) });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Error fetching balance" });
    }
};


export {completeQuest,getBalance};