
import express from "express"
import { googleSignUp, loginUser, logoutUser, resetPassword, sendOTP, signupUser, verifyOTP } from "../controllers/auth-controller.js";
const authRouter = express.Router();

authRouter.post("/signup", signupUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);
authRouter.post("/sendotp", sendOTP);
authRouter.post("/verifyotp", verifyOTP);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/googleauth", googleSignUp);

export default authRouter;
