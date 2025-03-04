import { Router } from "express";
import { EditUserCredentialsValidator } from "../utils/validators.js";
import { editUser, getUserById } from "../controllers/user.controller.js";
import { validate } from "../utils/validators.js";
import upload from "../lib/multer.js";

const userRouter = Router();

userRouter.post("/get-user-by-id/:userId", getUserById);
userRouter.patch(
  "/edit-user/:profileId",
  upload.single("profilePicture"),
  validate(EditUserCredentialsValidator),
  editUser
);

export default userRouter;
