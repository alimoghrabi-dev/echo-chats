import { connect } from "mongoose";
import envConfig from "./env.js";
import logger from "../utils/logger.js";

const ConnectToDatabase = async () => {
  try {
    const connetion = await connect(envConfig.MONGODB_URI, {
      minPoolSize: 5,
      maxPoolSize: 10,
    });
    logger.success(`✅ MongoDB Connected: ${connetion.connection.host}`);
  } catch (error) {
    logger.error("❌ Database Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

export default ConnectToDatabase;
