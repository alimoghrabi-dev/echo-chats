import { NextFunction, Request, Response } from "express";
import { DecodedToken } from "../types/express.js";
import jwt from "jsonwebtoken";

const TokenGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.Authorization;

    if (!token) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as DecodedToken;

    if (!decoded) {
      res.status(403).json({ message: "Session Expired!" });
      return;
    }

    const userId = decoded.userId;

    req.userId = userId;

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", cause: error });
  }
};

export default TokenGuard;
