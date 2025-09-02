import User from "../models/user.js";
import validator from "validator"
import bcrypt from "bcryptjs"
import generateToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

export const signupUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const findUser = await User.findOne({ email });
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid Email",
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must has atleast 8 characters",
            })
        }
        if (findUser) {
            return res.status(400).json({
                message: "User already exists!",
            })
        }
        // hashpassword
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashpassword, role
        })
        const token = await generateToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(201).json({
            message: "New User created",
            data: newUser,
        })


    }
    catch (e) {
        res.status(500).json({
            message: `Sign Up Error is ${e}`
        })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid Credentials",
            })
        }
        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(400).json({
                message: "User doesn't exists!"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid Credentials",
            })
        }
        const token = await generateToken(findUser._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: "Login Successfull",
            data: findUser,
        })
    }
    catch (e) {
        res.status(500).json({
            message: `Login Error is ${e}`
        })

    }
}

export const logoutUser = async (req, res) => {
    try {
        await res.clearCookie("token");
        return res.status(200).json({
            message: "Logout Successfull",
        })
    }
    catch (e) {
        res.status(500).json({
            message: `Logout Error is ${e}`
        })

    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exists!" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (e) {
        res.status(500).json({
            message: `SendOtp Error is ${e}`
        })

    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) return res.status(404).json({ message: "Invalid OTP!" });
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        user.isOtpVerified = true;

        await user.save();

        return res.status(200).json({ message: "OTP Verified Successfully!" });
    }
    catch (e) {
        res.status(500).json({
            message: `Verify OTP Error is ${e}`
        })

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) return res.status(404).json({ message: "OTP verification is required" });
        const hashpassword = await bcrypt.hash(password, 10);
        user.password = hashpassword;
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: "Password Updated Successfully!" });
    }
    catch (e) {
        res.status(500).json({
            message: `Reset Password Error is ${e}`
        })

    }
}

export const googleSignUp = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name, email, role,
            })
        }
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: "Login Successfull",
            data: user,
        })
    }
    catch (e) {
        res.status(500).json({
            message: `Google Auth Error is ${e}`
        })
    }
}
