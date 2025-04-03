import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import mongoose from 'mongoose';

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})
        console.log(email , password);
        console.log(user.email , user.password)

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        console.log(isMatch);

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getData = async(req , res) =>{
    try {
        const data = await userModel.find(); 
        res.status(200).json(data); 
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch data', error: err });
      }
}

const getPublicKey = async (req, res) => {
    try {
        const { userId } = req.query;

        // Sanitize userId (remove extra quotes and trim spaces)
        const sanitizedId = userId.replace(/^["']|["']$/g, '').trim();

        // Check if the sanitizedId is a valid ObjectId (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(sanitizedId)) {
            return res.json({ success: false, message: "Invalid ObjectId format" });
        }

        console.log(sanitizedId);

        // Fetch part by ObjectId
        const part = await userModel.findById(sanitizedId);
        
        // Check if part is found
        if (!part) {
            return res.status(404).json({ message: 'Public key not found' });
        }

        // Return the public key (metaMaskAccount)
        res.status(200).json({ publicKey: part.metaMaskAccount });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch data', error: err });
    }
};

const addmetamask = async (req, res) => {
    try {
        const { userId, metaMaskAccount } = req.body;
        console.log(userId)
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing from the token" });
        }
        const user2 = await userModel.findById(userId);
        // Now update the user by their ObjectId
        const user = await userModel.findByIdAndUpdate(
            userId,  // userId is now a string from JWT payload
            { metaMaskAccount },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "MetaMask account saved", user });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export {loginUser, registerUser,getData,addmetamask,getPublicKey}