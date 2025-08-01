import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const addMoney = catchAsync(async(req:Request, res:Response) => {
    const amount = Number(req.body.amount);
    const wallet = req.wallet;

    const result = await WalletService.addMoney(wallet, amount);

    sendResponse(res, {
        success: true,
        message: `${amount} BDT has been added into your wallet successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })
})

const withdrawMoney = catchAsync(async(req:Request, res:Response) => {
    const amount = Number(req.body.amount);
    const wallet = req.wallet;

    const result = await WalletService.withdrawMoney(wallet, amount);

    sendResponse(res, {
        success: true,
        message: `${amount} BDT has been withdrawn from your wallet successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })
})

const sendMoney = catchAsync(async(req:Request, res:Response) => {
    const amount = req.body.amount;
    const receiverPhoneNumber = req.body.receiverPhoneNumber;
    const senderWallet = req.wallet;
    const tokenPayload = req.user as JwtPayload;
    const senderPhoneNumber = tokenPayload.phone;

    const result = await WalletService.sendMoney(senderPhoneNumber, senderWallet, amount, receiverPhoneNumber);

    sendResponse(res, {
        success: true,
        message: `${amount} BDT has been sent to receiver user wallet successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })

})

const cashIn = catchAsync(async(req:Request, res:Response) => {
    const amount = req.body.amount;
    const receiverPhoneNumber = req.body.receiverPhoneNumber;
    const agentWallet = req.wallet;
    const tokenPayload = req.user as JwtPayload;
    const agentPhoneNumber = tokenPayload.phone;

    const result = await WalletService.cashIn(agentPhoneNumber, agentWallet, amount, receiverPhoneNumber);

    sendResponse(res, {
        success: true,
        message: `${amount} BDT has been cashed into receiver user wallet successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })
})

const cashOut = catchAsync(async(req:Request, res:Response) => {
    const amount = req.body.amount;
    const agentPhoneNumber = req.body.agentPhoneNumber;
    const userWallet = req.wallet;
    const tokenPayload = req.user as JwtPayload;
    const userPhoneNumber = tokenPayload.phone;

    const result = await WalletService.cashOut(userPhoneNumber, userWallet, amount, agentPhoneNumber);

    sendResponse(res, {
        success: true,
        message: `${amount} BDT has been cashed out from user wallet successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })
})

const getMe = catchAsync(async(req:Request, res:Response) =>{
    const tokenPayload = req.user as JwtPayload;
    const userId = tokenPayload.userId;
    const result = await WalletService.getMe(userId);

    sendResponse(res, {
        success: true,
        message: `User wallet retrieved successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })

})
const getSingleWallet = catchAsync(async(req:Request, res:Response) =>{
    const userId = req.params.id;
    const result = await WalletService.getSingleWallet(userId);

    sendResponse(res, {
        success: true,
        message: `User wallet retrieved successfully!`,
        statusCode: httpStatus.OK,
        data: result
    })
})

const blockWallet = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await WalletService.blockWallet(userId);

    sendResponse(res, {
        success: true,
        message: `User wallet is blocked successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})

const unblockWallet = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await WalletService.unblockWallet(userId);

    sendResponse(res, {
        success: true,
        message: `User wallet is activated successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})

const myCommission = catchAsync(async(req: Request, res: Response) => {
    const tokenPayload = req.user as JwtPayload;
    const userId = tokenPayload.userId;
    const result = await WalletService.myCommission(userId);

    sendResponse(res, {
        success: true,
        message: `Agent commission retrieved successfully!`,
        statusCode: httpStatus.OK,
        data: result,
    })
})

export const WalletController = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getMe,
    getSingleWallet,
    blockWallet,
    unblockWallet,
    myCommission
}