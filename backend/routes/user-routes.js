
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js"
import { getUser, updateProfile } from "../controllers/user-controller.js";
import upload from "../middleware/multer.js";
const userRouter = express.Router();

userRouter.get("/getCurrentUser", authMiddleware, getUser);
userRouter.post("/profile", authMiddleware, upload.single("photoUrl"), updateProfile);

export default userRouter;