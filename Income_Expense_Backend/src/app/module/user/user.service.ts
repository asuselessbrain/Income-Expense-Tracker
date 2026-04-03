import { Role } from "../../../../generated/prisma/client"
import bcrypt from "bcrypt";
import { config } from "../../../config";
import { prisma } from "../../../lib/prisma";
import { jwtGenerator } from "../../../utils/jwt";
import { Secret } from "jsonwebtoken";
import { StringValue } from "ms";
import { IUser } from "../../../types";

const createUser = async (payload: IUser) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.salt_rounds))

    const userData = {
        ...payload,
        password: hashedPassword,
        role: Role.USER
    }

    const result = await prisma.user.create({
        data: userData
    })

    const accessToken = await jwtGenerator({
        userInfo: { email: result.email, role: result.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })
    return { result, accessToken };
}

export const UserService = {
    createUser
}