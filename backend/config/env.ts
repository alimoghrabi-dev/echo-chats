import { config } from "dotenv";
config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  MONGODB_URI: string;
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  ARCJET_KEY: string;
  ARCJET_ENV: string;
  BASE_URL: string;
  S3_BUCKET_REGION: string;
  S3_ACCESS_KEY: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_BUCKET_NAME: string;
}

const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  MONGODB_URI: process.env.MONGODB_URI!,
  COOKIE_SECRET: process.env.COOKIE_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
  ARCJET_KEY: process.env.ARCJET_KEY!,
  ARCJET_ENV: process.env.ARCJET_ENV!,
  BASE_URL: process.env.BASE_URL!,
  S3_BUCKET_REGION: process.env.S3_BUCKET_REGION!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
};

export default envConfig;
