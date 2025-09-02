
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("MongoDb Connected Successfully")

    }
    catch (e) {
        console.log("Database Connection Failed! ", e);
    }

}

export default connectDB

