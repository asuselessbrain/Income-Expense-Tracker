import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/responser";


const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    res.cookie('token', result.accessToken, { secure: false, httpOnly: true })
    sendResponse(res, {
        statusCode: 200,
        message: "User logged in successfully!",
        data: result.accessToken,

    })
});

const logout = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.logout();

    res.clearCookie("token", { secure: false, httpOnly: true });

    sendResponse(res, {
        statusCode: 200,
        message: "Logout successfully!",
        data: result,

    })
});

export const AuthController = {
    login,
    logout,
};