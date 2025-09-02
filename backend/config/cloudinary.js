import { v2 as cloudinary } from 'cloudinary'
import { error } from 'console'
import dotenv from "dotenv"
import fs from "fs"
dotenv.config()


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_APIKEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
    try {
        if (!filePath) return null;
        const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
        fs.unlinkSync(filePath)
        return uploadResult.secure_url;
    }
    catch (e) {
        fs.unlinkSync(filePath)
        console.log(error)

    }
}

export default uploadOnCloudinary;