import dotenv from "dotenv";
import { ethers } from "ethers"; // Import ethers
import path from 'path';
import contractABI from "../artifacts/Contracts/contract.sol/QuestReward.json" assert { type: 'json' };

// Log the ABI to ensure it's loaded correctly
dotenv.config({ path: path.resolve('C:/Users/Toon/Desktop/autoparts-main/backend/.env') });

console.log(process.env.PRIVATE_KEY);  // Ensure your private key is loaded from .env

// Correct provider initialization for Ganache
const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');  // Ganache RPC URL

// Your contract address (ensure it's deployed to Ganache)
const contractAddress = "0x9C5DBF4a8fD78846DA0177Cb988316F5D123a80B"; 

//sapolia 0xbA82e4CB199791368a14E67C37a0B94E28d6077c

const abi = contractABI.abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

// Initialize wallet with private key
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet; // Directly assign signer here

const completeQuest = async (req, res) => {
    const { userAddress } = req.query; // Using req.body to get userAddress

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        // Check if the sender is the admin (the owner of the contract)
        const adminAddress = await contract.owner();
        if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ error: "Only the admin can complete quests" });
        }

        // Check the contract balance
        const contractBalance = await provider.getBalance(contract.address);
        console.log(`Contract Balance: ${ethers.utils.formatEther(contractBalance)} ETH`);

        // If the contract balance is insufficient, send Ether to the contract
        if (contractBalance.lt(ethers.utils.parseEther("1.0"))) {  // Check if the contract balance is less than 1 ETH
            console.log("Contract has insufficient funds, sending 1 Ether to contract...");

            const tx = await signer.sendTransaction({
                to: contract.address,
                value: ethers.utils.parseEther("1.0"),  // Send 1 Ether to the contract
            });

            console.log(`Transaction sent! TX Hash: ${tx.hash}`);
            await tx.wait();  // Wait for the transaction to be mined
            console.log("Ether sent to the contract!");
        }

        // Attach the signer to the contract to send a transaction
        const contractWithSigner = contract.connect(signer); // Connect signer to contract

        // Proceed with the quest completion
        const tx = await contractWithSigner.completeQuest(userAddress, {
            gasLimit: 1000000, // Manually set gas limit to a larger value
            gasPrice: ethers.utils.parseUnits("10", "gwei"),  // Use a low gas price for testnet
        });

        console.log(`Transaction sent! TX Hash: ${tx.hash}`);
        await tx.wait();  // Wait for the transaction to be mined
        console.log("Transaction confirmed!");

        res.status(200).json({ message: "Quest completed and reward sent", txHash: tx.hash });
    } catch (error) {
        console.error("Error completing quest:", error);
        res.status(500).json({ error: `Error completing quest: ${error.message}` });
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

export { completeQuest, getBalance };
