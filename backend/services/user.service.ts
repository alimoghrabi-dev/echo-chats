import { Request, Response } from "express";
import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomName } from "../utils/validators.js";
import { BUCKET_NAME } from "../lib/s3-bucket.js";
import envConfig from "../config/env.js";
import sharp from "sharp";
import { s3 } from "../lib/s3-bucket.js";

export class UserSerivce {
  async getUserByIdService(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select("-password");

      if (!user) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      logger.error("❌ Failed to get user:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "User" });
    }
  }

  async editUserService(req: Request, res: Response) {
    try {
      const { firstName, lastName, username, description } = req.body;
      const { profileId } = req.params;
      const userId = req.userId;

      if (userId !== profileId) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      const profile = await User.findById(userId).select("profilePicture");

      if (!profile) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      let imageUrl = null;
      const existingImageUrl = profile.profilePicture || null;

      if (req.file) {
        if (existingImageUrl) {
          const urlParts = existingImageUrl.split("/");
          const imageKey = urlParts[urlParts.length - 1];

          const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: imageKey,
          };

          const deleteCommand = new DeleteObjectCommand(deleteParams);

          await s3.send(deleteCommand);
        }

        const buffer = await sharp(req.file?.buffer)
          .resize({
            width: 215,
            height: 215,
            fit: "cover",
            position: "center",
          })
          .toFormat("webp")
          .webp({ quality: 85 })
          .toBuffer();

        const randomGeneratedName = randomName();

        const params = {
          Bucket: BUCKET_NAME,
          Key: randomGeneratedName,
          Body: buffer,
          ContentType: req.file?.mimetype,
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);

        imageUrl = `https://${BUCKET_NAME}.s3.${envConfig.S3_BUCKET_REGION}.amazonaws.com/${randomGeneratedName}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            profilePicture: imageUrl,
            firstName,
            lastName,
            username,
            description,
          },
        },
        { new: true, select: "-password" }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      res.status(201).json("User Updated Successfully!");
    } catch (error) {
      logger.error("❌ Failed to edit user:" + error);
      res.status(500).json({ error: "Internal Server Error!", path: "User" });
    }
  }
}
