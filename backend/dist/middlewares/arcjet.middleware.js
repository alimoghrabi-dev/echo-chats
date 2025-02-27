import { aj } from "../lib/arcjet.js";
import logger from "../utils/logger.js";
const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({
                    error: "Too Many  Requests, please try again later",
                    path: "Arcjet Middleware",
                });
            }
            else if (decision.reason.isBot()) {
                res.status(403).json({
                    error: "Bot Access Denied!",
                    path: "Arcjet Middleware",
                });
            }
            else {
                res.status(403).json({
                    error: "Forbidden Access!",
                    path: "Arcjet Middleware",
                });
            }
            return;
        }
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({
                error: "Spoofed Bot Detected!",
                path: "Arcjet Middleware",
            });
            return;
        }
        next();
    }
    catch (error) {
        logger.error("❌ Arcjet Middleware Error:" + error);
        res.status(500).json({
            error: "Internal Server Error!",
            path: "Arcjet Middleware",
            cause: error,
        });
    }
};
export default arcjetMiddleware;
