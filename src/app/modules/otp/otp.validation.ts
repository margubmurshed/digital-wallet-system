import z from "zod";
import { phoneSchema } from "../auth/auth.validation";

export const sendOTPZodSchema = z.object({
    phone: phoneSchema
})
export const verifyOTPZodSchema = z.object({
    otp: z
        .string({ invalid_type_error: "OTP must be a string" })
        .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
    phone: phoneSchema
})