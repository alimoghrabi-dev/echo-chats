import jwt from "jsonwebtoken";
import envConfig from "../config/env.js";
const generateJwtToken = (expiresIn, payload) => {
    const secret = envConfig.JWT_SECRET;
    const options = {
        expiresIn,
        algorithm: "HS256",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};
export default generateJwtToken;
