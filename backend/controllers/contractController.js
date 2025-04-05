import dotenv from "dotenv";
import { ethers } from "ethers"; // Import ethers
import path from 'path';
import contractABI from "../artifacts/Contracts/contract.sol/QuestReward.json" assert { type: 'json' };

// ทำการเรียก path ของ .env มาเพื่อจะได้หาเจอ
dotenv.config({ path: path.resolve('C:/Users/Toon/Desktop/autoparts-main/backend/.env') });

console.log(process.env.PRIVATE_KEY); 

// set provider
const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');  // Ganache RPC URL

// เมื่อทำการ deploy contract แล้วนำ contract address มาใส่ตรงนี้
const contractAddress = "0x6950328f6E8fE491CdEb418F06Fc8A60c4245A0D"; 

//sapolia 0xbA82e4CB199791368a14E67C37a0B94E28d6077c

const abi = contractABI.abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

// Initialize wallet with private key
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);
const signer = wallet; // Directly assign signer here
const contractWithSigner = contract.connect(wallet);


const completeQuest = async (req, res) => {
    const { userAddress } = req.query; 

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        // check ว่าผู้ส่งคือ admin ไหม
        const adminAddress = await contract.owner();
        if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ error: "Only the admin can complete quests" });
        }

        // ตรวจสอบจำนวนเงิน
        const contractBalance = await provider.getBalance(contract.address);
        console.log(`Contract Balance: ${ethers.utils.formatEther(contractBalance)} ETH`);

        // ถ้าเงินไม่พอให้ทำการ send ether ไปที่ contract
        if (contractBalance.lt(ethers.utils.parseEther("1.0"))) {  
            console.log("Contract has insufficient funds, sending 1 Ether to contract...");

            const tx = await signer.sendTransaction({
                to: contract.address,
                value: ethers.utils.parseEther("1.0"),  
            });

            console.log(`Transaction sent! TX Hash: ${tx.hash}`);
            await tx.wait();  
            console.log("Ether sent to the contract!");
        }

       
        const contractWithSigner = contract.connect(signer); 

 
        const tx = await contractWithSigner.completeQuest(userAddress, {
            gasLimit: 1000000, 
            gasPrice: ethers.utils.parseUnits("10", "gwei"),  
        });

        console.log(`Transaction sent! TX Hash: ${tx.hash}`);
        await tx.wait();  
        console.log("Transaction confirmed!");

        res.status(200).json({ message: "Quest completed and reward sent", txHash: tx.hash });
    } catch (error) {
        console.error("Error completing quest:", error);
        res.status(500).json({ error: `Error completing quest: ${error.message}` });
    }
}

//ทำการเรียกจำนวนเงินจาก contract
const getBalance = async (req, res) => {
    const { userAddress } = req.query;

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        console.log("Contract Address:", contract.address);
        console.log("Contract ABI:", contract.interface.fragments);

       
        let resolvedAddress = userAddress;
        if (userAddress.includes('.eth')) {
            resolvedAddress = await provider.resolveName(userAddress);
            if (!resolvedAddress) {
                return res.status(400).json({ error: "Invalid ENS name" });
            }
        }

        await new Promise(res => setTimeout(res, 300));
      
        const balance = await contract.getBalance(resolvedAddress);
        res.status(200).json({ balance: ethers.utils.formatEther(balance) });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Error fetching balance" });
    }
};


//เรียก transaction จาก ganache มาโดยหาจาก userAddress
const getUserTransactions = async (req, res) => {
    const { userAddress } = req.query;

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        const latestBlock = await provider.getBlockNumber();
        const userAddressLower = userAddress.toLowerCase();
        let transactions = [];

        console.log(`Fetching transactions for user: ${userAddress}`);

       
        for (let i = latestBlock; i >= 0; i--) {
            const block = await provider.getBlockWithTransactions(i);

            if (block && block.transactions.length > 0) {
               
                const contractTxns = block.transactions.filter(
                    tx => tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()
                );

                
                for (const tx of contractTxns) {
                    try {
                     
                        const txData = tx.data;
                        const iface = new ethers.utils.Interface(contractABI.abi);
                        const decoded = iface.parseTransaction({ data: txData });

                       
                        if (
                            decoded.name === "completeQuest" &&
                            decoded.args[0].toLowerCase() === userAddressLower
                        ) {
                            transactions.push(tx);
                        }
                    } catch (e) {
                      
                    }
                }
            }

  
            if (transactions.length > 0 && i < latestBlock - 1000) break;
        }

        console.log(`Found ${transactions.length} reward transactions for ${userAddress}`);
        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};


// จ่าย credit product
const postBuyproduct = async (req, res) => {
    const { userAddress, coin } = req.query;

    if (!userAddress) {
        return res.status(400).json({ error: "User address is required" });
    }

    try {
        console.log("Contract Address:", contract.address);
        console.log("Contract ABI:", contract.interface.fragments);


        const contractWithSigner = contract.connect(wallet);


        let resolvedAddress = userAddress;
        if (userAddress.includes('.eth')) {
            resolvedAddress = await provider.resolveName(userAddress);
            if (!resolvedAddress) {
                return res.status(400).json({ error: "Invalid ENS name" });
            }
        }


        const tx = await contractWithSigner.redeemCoins(resolvedAddress, coin);
        await tx.wait(); 

        res.status(200).json({ message: "Transaction successful", txHash: tx.hash });
    } catch (error) {
        console.error("Error Buying product:", error);
        res.status(500).json({ error: error.message || "Error Buying product" });
    }
};

export { completeQuest, getBalance,getUserTransactions,postBuyproduct };
