import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { otpServices } from "./otp.service";

const sendOTP = async(req: Request, res: Response) => {
    const {phone} = req.body;
    await otpServices.sendOTP(phone)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP sent successfully!",
        data: null
    })
}
const verifyOTP = async(req: Request, res: Response) => {
    const {phone, otp} = req.body;
    await otpServices.verifyOTP(phone, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified successfully!",
        data: null
    })
}

export const otpControllers = {
    sendOTP,
    verifyOTP
}