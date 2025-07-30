import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

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

// const withdrawMoney = catchAsync((req:Request, res:Response) => {

// })

// const sendMoney = catchAsync((req:Request, res:Response) => {

// })

// const cashIn = catchAsync((req:Request, res:Response) => {

// })

// const cashOut = catchAsync((req:Request, res:Response) => {

// })

export const WalletController = {
    addMoney,
    // withdrawMoney,
    // sendMoney,
    // cashIn,
    // cashOut,

}