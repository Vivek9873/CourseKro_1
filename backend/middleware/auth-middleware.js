import jwt from "jsonwebtoken"

export const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({
                message: "Unauthorized User",
            })
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decodedToken;
        if (!userId) {
            return res.status(400).json({
                message: "Invalid Token",
            })
        }
        req.userId = userId;
        next();
    }
    catch (e) {
        res.status(500).json({
            message: `ERROR MESSAGE: ${e}`
        })
    }
}