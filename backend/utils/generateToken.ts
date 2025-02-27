import jwt, { SignOptions } from "jsonwebtoken";
import envConfig from "../config/env.js";
import type { StringValue } from "ms";

const generateJwtToken = (
  expiresIn: number | StringValue | undefined,
  payload: string | object | Buffer<ArrayBufferLike>
) => {
  const secret = envConfig.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

export default generateJwtToken;
