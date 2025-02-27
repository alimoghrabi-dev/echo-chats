import jwt from "jsonwebtoken";
const TokenGuard = (req, res, next) => {
    try {
        const token = req.cookies?.Authorization;
        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            res.status(403).json({ message: "Session Expired!" });
            return;
        }
        const userId = decoded.userId;
        req.userId = userId;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", cause: error });
    }
};
export default TokenGuard;
