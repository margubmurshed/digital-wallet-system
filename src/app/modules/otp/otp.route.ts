import { Router } from "express";
import {  sendOTPZodSchema, verifyOTPZodSchema } from "./otp.validation";
import validateRequest from "../../middlewares/validateRequest";
import { otpControllers } from "./otp.controller";
const router = Router();

router.post("/send", validateRequest(sendOTPZodSchema), otpControllers.sendOTP);
router.post("/verify", validateRequest(verifyOTPZodSchema), otpControllers.verifyOTP);

export const otpRoutes = router;