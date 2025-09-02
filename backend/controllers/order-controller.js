

import Razorpay from "razorpay";
import dotenv from "dotenv"
import Course from "../models/course.js";
import User from "../models/user.js";
dotenv.config();

const RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})


export const RazorpayOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "User doesn't exists!",
            })
        }
        const options = {
            amount: course.price * 100,
            currency: "INR",
            receipt: `${courseId.toString()}`
        }
        const order = await RazorpayInstance.orders.create(options);
        return res.status(200).json(order);
    }
    catch (e) {
        res.status(500).json({ message: `RazorpayOrder error is ${e}` });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { courseId, userId, razorpay_order_id } = req.body;
        const orderInfo = await RazorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === "paid") {
            const user = await User.findById(userId);
            if (!user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                await user.save();
            }
            const course = await Course.findById(courseId).populate("lectures");
            if (!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId)
                await course.save();
            }
            return res.status(200).json({ message: "Payment Verified and Enrollment Successful" });

        }
        return res.status(404).json({ message: "Payment Failed" });
    }
    catch (e) {
        res.status(500).json({ message: `VerifyPayment error is ${e}` });

    }
}

