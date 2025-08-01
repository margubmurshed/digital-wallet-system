import z from "zod";
import { zodBDPhoneNumber } from "../../validations";

const amountSchema = z.number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number'
    })
    .min(1, {message: 'AMount must be at least 1 Taka'})

export const addMoneyZodSchema = z.object({
    amount: amountSchema
})

export const sendMoneyZodSchema = z.object({
    receiverPhoneNumber: zodBDPhoneNumber,
    amount: amountSchema
})

export const cashOutZodSchema = z.object({
    agentPhoneNumber: zodBDPhoneNumber,
    amount: amountSchema
})