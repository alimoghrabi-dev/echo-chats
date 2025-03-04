import { S3Client } from "@aws-sdk/client-s3";
import envConfig from "../config/env.js";

const region = envConfig.S3_BUCKET_REGION!;
const accessKey = envConfig.S3_ACCESS_KEY!;
const secretKey = envConfig.S3_SECRET_ACCESS_KEY!;

export const BUCKET_NAME = envConfig.S3_BUCKET_NAME;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: region,
});
