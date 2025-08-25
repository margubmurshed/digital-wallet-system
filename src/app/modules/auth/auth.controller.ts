/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const credentialLogin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (error: any, user: any, info: any) => {
        if (error) return next(new AppError(error, httpStatus.BAD_REQUEST));
        if (!user) return next(new AppError(info.message, httpStatus.BAD_REQUEST));

        const userTokens = createUserTokens(user);
        setAuthCookie(res, userTokens);

        sendResponse(res, {
            success:true,
            message: "User logged in successfully!",
            statusCode: httpStatus.OK,
            data: {
                user,
                ...userTokens
            }
        })

    })(req, res, next)
}

const logOut = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully!",
        data: null
    })
})

export const AuthController = {
    credentialLogin,
    logOut
}