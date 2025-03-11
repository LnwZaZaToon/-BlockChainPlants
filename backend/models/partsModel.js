import mongoose from "mongoose";

const partsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    image: { type: String, required: true },
    category:{ type:String, required: true }
})

const partsModel = mongoose.models.parts || mongoose.model("quests", partsSchema);
export default partsModel;