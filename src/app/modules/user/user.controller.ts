import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserService.createUser(payload)

    sendResponse(res, {
        success: true,
        message: `User has been created Successfully!`,
        statusCode: httpStatus.CREATED,
        data: result
    })
})

const getAllUsers = catchAsync(async(req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await UserService.getAllUsers(query)

    sendResponse(res, {
        success: true,
        message: `Users data retrieved Successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
        meta: result.meta
    })
})

const getUsers = catchAsync(async(req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await UserService.getUsers(query)

    sendResponse(res, {
        success: true,
        message: `USER role users data retrieved Successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
        meta: result.meta
    })
})


const getAgents = catchAsync(async(req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await UserService.getAgents(query)

    sendResponse(res, {
        success: true,
        message: `AGENT role users data retrieved Successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
        meta: result.meta
    })
})


const updateUser = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.params.id;
    const tokenPayload = req.user as JwtPayload;

    const result = await UserService.updateUser(userId, payload, tokenPayload)

    sendResponse(res, {
        success: true,
        message: `User is updated successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})

const getMe = catchAsync(async(req: Request, res: Response) => {
    const tokenPayload = req.user as JwtPayload;
    const userId = tokenPayload.userId;
    const result = await UserService.getMe(userId);

    sendResponse(res, {
        success: true,
        message: `User info retrieved successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
    })
})

const getSingleUser = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await UserService.getSingleUser(userId);

    sendResponse(res, {
        success: true,
        message: `User info retrieved successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
    })
})
const approveUser = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await UserService.approveUser(userId);

    sendResponse(res, {
        success: true,
        message: `User is approved successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})
const disapproveUser = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await UserService.disapproveUser(userId);

    sendResponse(res, {
        success: true,
        message: `User is approved successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})

export const UserControllers = {
    createUser,
    getAllUsers,
    getUsers,
    getAgents,
    updateUser,
    getMe,
    getSingleUser,
    approveUser,
    disapproveUser
}