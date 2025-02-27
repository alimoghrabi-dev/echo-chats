import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const registerNewUser = async (req: Request, res: Response) => {
  return await authService.registerUserService(req, res);
};

export const loginUser = async (req: Request, res: Response) => {
  return await authService.loginUserService(req, res);
};

export const logoutUser = async (req: Request, res: Response) => {
  return await authService.logoutUserService(req, res);
};

export const getUserAuthStatus = async (req: Request, res: Response) => {
  return await authService.getUserAuthStatusService(req, res);
};
