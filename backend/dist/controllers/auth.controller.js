import { AuthService } from "../services/auth.service.js";
const authService = new AuthService();
export const registerNewUser = async (req, res) => {
    return await authService.registerUserService(req, res);
};
export const loginUser = async (req, res) => {
    return await authService.loginUserService(req, res);
};
export const logoutUser = async (req, res) => {
    return await authService.logoutUserService(req, res);
};
export const getUserAuthStatus = async (req, res) => {
    return await authService.getUserAuthStatusService(req, res);
};
