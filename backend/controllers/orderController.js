import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount } = req.body;

        
        const existingOrder = await orderModel.findOne({ userId, status: "Pending" });

        if (existingOrder) {
            return res.json({ success: false, message: "You already have an active quest. Complete it before starting a new one." });
        }

        
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            status: "Pending" 
        });

        await newOrder.save();
        res.json({ success: true, message: "Quest started successfully!" });
    } catch (error) {
        console.error("Order Error:", error);
        res.json({ success: false, message: "Error starting quest" });
    }
};


const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const {orderId , success} = req.body;
    try {
        if (success==="true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

const uploadImages = async (req, res) => {
    try {
        console.log("Received body:", req.body);  // Log the body to check orderId and other params
        console.log("Received file:", req.file); 
        const { orderId } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded." });
        }

        const imageUrl =  req.file.filename;

        await orderModel.findByIdAndUpdate(orderId, { image: imageUrl });

        res.json({ success: true, message: "Image uploaded successfully!" });
    } catch (error) {
        console.error("Image Upload Error:", error);
        res.status(500).json({ success: false, message: "Error uploading image." });
    }
};





export { placeOrder, listOrders, userOrders, updateStatus ,verifyOrder,uploadImages }