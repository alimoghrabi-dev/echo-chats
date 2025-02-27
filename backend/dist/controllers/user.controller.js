import { UserSerivce } from "../services/user.service.js";
const userService = new UserSerivce();
export const getUserById = async (req, res) => {
    return await userService.getUserByIdService(req, res);
};
export const editUser = async (req, res) => {
    return await userService.editUserService(req, res);
};
