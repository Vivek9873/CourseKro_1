
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { RazorpayOrder, verifyPayment } from "../controllers/order-controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/razorpayorder", authMiddleware, RazorpayOrder)
paymentRouter.post("/verifypayment", authMiddleware, verifyPayment)


export default paymentRouter;