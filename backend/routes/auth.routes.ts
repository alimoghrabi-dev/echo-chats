import { Router } from "express";
import {
  getUserAuthStatus,
  loginUser,
  logoutUser,
  registerNewUser,
} from "../controllers/auth.controller.js";
import {
  LoginValidator,
  RegisterValidator,
  validate,
} from "../utils/validators.js";
import TokenGuard from "../middlewares/tokenGuard.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(RegisterValidator), registerNewUser);
authRouter.post("/login", validate(LoginValidator), loginUser);
authRouter.post("/logout", TokenGuard, logoutUser);
authRouter.post("/status", TokenGuard, getUserAuthStatus);

export default authRouter;
