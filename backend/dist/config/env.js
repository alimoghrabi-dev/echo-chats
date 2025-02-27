import { config } from "dotenv";
config();
const envConfig = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "3000",
    MONGODB_URI: process.env.MONGODB_URI,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ARCJET_KEY: process.env.ARCJET_KEY,
    ARCJET_ENV: process.env.ARCJET_ENV,
    BASE_URL: process.env.BASE_URL,
};
export default envConfig;
