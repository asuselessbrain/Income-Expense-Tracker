import bcrypt from "bcrypt";
import { config } from "../../../config";
import { Secret } from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import { StringValue } from "ms";
import { jwtGenerator } from "../../../utils/jwt";
import AppError from "../../errors/appError";
import { Status } from "../../../../generated/prisma/enums";

const loginUser = async (payload: { email: string, password: string }) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: Status.active
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found!")
    }

    const isPasswordMarched = await bcrypt.compare(payload.password, isUserExist.password)

    if (!isPasswordMarched) {
        throw new AppError(401, "Email or password does not matched!")
    }

    const accessToken = await jwtGenerator({
        userInfo: { email: isUserExist.email, role: isUserExist.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })


    return {
        accessToken,
    }
}



const logout = async () => {
  return null;
};

export const AuthService = {
  loginUser,
  logout,
};