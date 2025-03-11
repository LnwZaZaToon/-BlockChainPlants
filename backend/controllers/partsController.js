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

export { listParts, addParts, removeParts }