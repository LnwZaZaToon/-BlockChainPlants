import partsModel from "../models/partsModel.js";
import fs from 'fs';
// all parts list
const listParts = async (req, res) => {
    try {
        const parts = await partsModel.find({})
        res.json({ success: true, data: parts })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add parts
const addParts = async (req, res) => {

    let image_filename = `${req.file.filename}`

    const parts = new partsModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        amount: req.body.amount,
        category:req.body.category,
        image: image_filename,
    })
    try {
        await parts.save();
        res.json({ success: true, message: "Parts Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete parts
const removeParts = async (req, res) => {
    try {

        const parts = await partsModel.findById(req.body.id);
        fs.unlink(`uploads/${parts.image}`, () => { })

        await partsModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Parts Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

const plusPart = async (req, res) => {
    const { id } = req.query;

    try {
        // Sanitize the id: remove surrounding quotes and any extra whitespace or newline characters
        const sanitizedId = id.replace(/^["']|["']$/g, '').trim();

        // Check if the sanitizedId is a valid ObjectId (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(sanitizedId)) {
            return res.json({ success: false, message: "Invalid ObjectId format" });
        }

        console.log(sanitizedId);
        
        // Find the part by ID
        const part = await partsModel.findById(sanitizedId);
        
        if (!part) {
            return res.json({ success: false, message: "Part not found" });
        }

        // Increment the 'amount' field
        part.amount += 1;

        // Save the updated part
        await part.save();

        // Respond with success message
        res.json({ success: true, message: "Part amount incremented" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const minusPart = async (req, res) => {
    const { id } = req.query;

    try {
        // Sanitize the id: remove surrounding quotes and any extra whitespace or newline characters
        const sanitizedId = id.replace(/^["']|["']$/g, '').trim();

        // Check if the sanitizedId is a valid ObjectId (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(sanitizedId)) {
            return res.json({ success: false, message: "Invalid ObjectId format" });
        }

        console.log(sanitizedId);
        
        // Find the part by ID
        const part = await partsModel.findById(sanitizedId);
        
        if (!part) {
            return res.json({ success: false, message: "Part not found" });
        }

        // Increment the 'amount' field
        part.amount -= 1;

        // Save the updated part
        await part.save();

        // Respond with success message
        res.json({ success: true, message: "Part minus decremented" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { listParts, addParts, removeParts,plusPart ,minusPart}