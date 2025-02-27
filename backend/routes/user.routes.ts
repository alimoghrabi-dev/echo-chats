import { Router } from "express";
import { editUser, getUserById } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/get-user-by-id/:userId", getUserById);
userRouter.patch("/edit-user", editUser);

export default userRouter;
