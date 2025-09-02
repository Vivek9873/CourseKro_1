import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.js"

export const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const findUser = await User.findById(userId).select("-password").populate("enrolledCourses");
        if (!findUser) {
            return res.status(404).json({
                message: "User doesn't exist",
            })
        }
        return res.status(200).json({
            message: "User found successfully",
            data: findUser,
        })

    }
    catch (e) {
        res.status(500).json({
            message: `GetCurrentUser Error is ${e}`
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { description, name } = req.body;
        let photoUrl
        if (req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId, { name, description, photoUrl });

        if (!user) {
            return res.status(404).json({
                message: "User doesn't exist",
            })
        }
        await user.save();
        return res.status(200).json({
            message: "Profile Updated successfully",
            data: user,
        })
    }
    catch (e) {
        res.status(500).json({
            message: `UpdateProfile Error is ${e}`
        })

    }
}

