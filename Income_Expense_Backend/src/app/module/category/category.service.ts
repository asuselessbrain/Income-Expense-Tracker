import { Category, Prisma } from "../../../../generated/prisma/client"
import { prisma } from "../../../lib/prisma"
import AppError from "../../errors/appError"

const createCategory = async (email: string, payload: Prisma.CategoryCreateInput) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    const result = await prisma.category.create({
        data: {
            ...payload,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    return result
}

const getCategory = async (payload: Prisma.CategoryFindManyArgs) => {
    const result = await prisma.category.findMany(payload)
    return result
}

export const categoryService = {
    createCategory,
    getCategory
}