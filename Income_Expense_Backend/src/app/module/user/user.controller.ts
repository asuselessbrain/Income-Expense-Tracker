import { Request, Response } from "express"
import { catchAsync } from "../../../utils/catchAsync"
import { UserService } from "./user.service"
import sendResponse from "../../../utils/responser"

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body)

    res.cookie('token', result.accessToken, { secure: false, httpOnly: true })

    sendResponse(res, {
        statusCode: 201,
        message: "User created successfully!",
        data: result
    })
})

export const userController = {
    createUser
}