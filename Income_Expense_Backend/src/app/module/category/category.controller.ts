import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { categoryService } from "./category.service";
import sendResponse from "../../../utils/responser";
import { TransactionType } from "../../../../generated/prisma/enums";

const createCategory = catchAsync(async (req:Request & { user?: { email: string } }, res: Response) => {
    const email = req.user?.email as string;
    const result = await categoryService.createCategory(email, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        message: "Category created successfully!",
        data: result
    })
})

const getCategory = catchAsync(async (req: Request, res: Response) => {
    const type = req.query.type as TransactionType;
    const result = await categoryService.getCategory({ where: { type } });
    sendResponse(res, {
        statusCode: 200,
        message: "Category fetched successfully!",
        data: result
    })
})

export const categoryController = {
    createCategory,
    getCategory
}