import z from "zod";

const passwordSchema = z
    .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    })

const phoneSchema = z
    .string({ invalid_type_error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|8801\d{9}|01\d{9})$/, {
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
    });

export const credentialLoginZodSchema = z.object({
    phone: phoneSchema,
    password: passwordSchema
})