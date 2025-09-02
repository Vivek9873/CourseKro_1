
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js"
import { createReview, getReviews } from "../controllers/review-controller.js";

const reviewRouter = express.Router();

reviewRouter.post("/createreview", authMiddleware, createReview);
reviewRouter.get("/getreview", getReviews);

export default reviewRouter;