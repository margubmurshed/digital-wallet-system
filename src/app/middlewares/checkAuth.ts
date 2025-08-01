import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { UserRole, UserStatus } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import { envVariables } from "../config/env";
import { User } from "../modules/user/user.model";

const checkAuth = (...authRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                throw new AppError("No access token received!", httpStatus.UNAUTHORIZED);
            }

            const tokenPayload = verifyToken(accessToken, envVariables.JWT_ACCESS_SECRET) as JwtPayload;

            const user = await User.findById(tokenPayload.userId);

            if (!user) {
                throw new AppError("User doesn't exist", httpStatus.BAD_REQUEST);
            }

            if (user.status === UserStatus.BLOCKED) {
                throw new AppError(`User is blocked!`, httpStatus.BAD_REQUEST);
            }

            if(!user.isApproved){
                throw new AppError("User is not approved", httpStatus.BAD_REQUEST)
            }
            
            // Checking whether requested client role matches any of allowed roles
            if (!authRoles.includes(tokenPayload.role)) {
                throw new AppError("You are not permitted to access this route!", httpStatus.UNAUTHORIZED)
            }

            req.user = tokenPayload;

            next();
        } catch (error) {
            next(error)
        }
    }
}

export default checkAuth;