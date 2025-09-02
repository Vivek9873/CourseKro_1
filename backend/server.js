
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user-routes.js";
import courseRouter from "./routes/course-routes.js";
import paymentRouter from "./routes/payment-routes.js";
import reviewRouter from "./routes/review-routes.js";
dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.get("/", (req, res) => {
    res.send("Hello from the server");
})

app.listen(PORT, () => {
    connectDB();
    console.log("Server is now listening at PORT:", PORT);
})