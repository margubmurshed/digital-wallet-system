import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const getMyTransactions = catchAsync(async(req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const tokenPayload = req.user as JwtPayload;
    const userId = tokenPayload.userId;
    const result = await TransactionService.getMyTransactions(userId, query);

    sendResponse(res, {
        success: true,
        message: `Users data retrieved Successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
        meta: result.meta
    })
});

const getAllTransactions = catchAsync(async(req: Request, res: Response) => {
    const query = req.query as Record<string, string>;
    const result = await TransactionService.getAllTransactions(query);

    sendResponse(res, {
        success: true,
        message: `Users data retrieved Successfully!`,
        statusCode: httpStatus.OK,
        data: result.data,
        meta: result.meta
    })
});

export const TransactionController={
    getMyTransactions,
    getAllTransactions
};