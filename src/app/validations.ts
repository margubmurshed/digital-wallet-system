import mongoose from "mongoose";
import z from "zod";

export const zodObjectId = z
    .string()
    .refine(
        val => mongoose.isValidObjectId(val),
        { message: "Invalid ObjectId format" }
    )

export const zodBDPhoneNumber = z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+?8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .transform((val) => {
            // Remove all non-digit characters for safety if needed (optional)
            const digitsOnly = val.replace(/\D/g, "");

            // Normalize to +8801XXXXXXXXX
            if (digitsOnly.startsWith("8801")) {
                return "+" + digitsOnly; // add the plus if missing
            } else if (digitsOnly.startsWith("01")) {
                return "+88" + digitsOnly; // add +88 prefix
            } else if (digitsOnly.startsWith("880")) {
                return "+" + digitsOnly; // already with 880 but no plus, add it
            }
            // Fallback, return original
            return val;
        })