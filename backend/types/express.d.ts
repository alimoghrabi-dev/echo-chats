import { Request } from "express";

interface DecodedToken {
  userId?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
