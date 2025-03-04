import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import generateJwtToken from "../utils/generateToken.js";
import envConfig from "../config/env.js";

export class AuthService {
  async registerUserService(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      } = req.body;

      const userExists = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (userExists) {
        res.status(401).json({
          message: "User Already Exists!",
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({
          message: "Passwords do not match!",
        });
        return;
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User Created Successfully!" });
    } catch (error) {
      logger.error("❌ Failed to register new user:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Auth" });
    }
  }

  async loginUserService(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;

      if (!identifier) {
        res.status(400).json({
          message: "Email or Username is required!",
        });
        return;
      }

      const isEmail = identifier.includes("@");

      let user;

      if (isEmail) {
        user = await User.findOne({ email: identifier });
      } else {
        user = await User.findOne({ username: identifier });
      }

      if (!user) {
        res.status(401).json({
          message: "Invalid Credentials!",
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          message: "Invalid Credentials!",
        });
        return;
      }

      const expiresIn = "15d";

      const payload = {
        userId: user._id as string,
      };

      const token = generateJwtToken(expiresIn, payload);

      res.cookie("Authorization", token, {
        httpOnly: true,
        secure: envConfig.NODE_ENV === "production",
        sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json("Logged In Successfully!");
    } catch (error) {
      logger.error("❌ Failed to login user:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Auth" });
    }
  }

  async logoutUserService(_req: Request, res: Response) {
    try {
      res.clearCookie("Authorization", {
        httpOnly: true,
        secure: envConfig.NODE_ENV === "production",
        sameSite: envConfig.NODE_ENV === "production" ? "none" : "strict",
      });

      res.status(200).json({ message: "Logged Out Successfully!" });
    } catch (error) {
      logger.error("❌ Failed to logout:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Auth" });
    }
  }

  async getUserAuthStatusService(req: Request, res: Response) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId)
        .select("-password")
        .populate("friendRequests")
        .populate("friends");

      if (!user) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      logger.error("❌ Failed to get user status:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "Auth" });
    }
  }
}
