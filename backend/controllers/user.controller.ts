import { Request, Response } from "express";
import { UserSerivce } from "../services/user.service.js";

const userService = new UserSerivce();

export const getUserById = async (req: Request, res: Response) => {
  return await userService.getUserByIdService(req, res);
};

export const editUser = async (req: Request, res: Response) => {
  return await userService.editUserService(req, res);
};
