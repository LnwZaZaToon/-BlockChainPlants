import mongoose from "mongoose";

export const  connectDB = async () =>{
    await mongoose.connect('mongodb+srv://admin:1234@cluster0.9y4p74j.mongodb.net/DatabaseBlockchain').then(()=>console.log("DB Connected"))
}

//'process.env.MONGO_URL'

