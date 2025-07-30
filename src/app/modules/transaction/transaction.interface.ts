import { Types } from "mongoose";

export enum TransactionTypes {
    "ADD_MONEY"="ADD_MONEY",
    "WITHDRAW"="WITHDRAW",
    "SEND_MONEY"="SEND_MONEY",
    "CASH_IN"="CASH_IN",
    "CASH_OUT"="CASH_OUT"
}

export enum TransactionStatus{
    "PENDING"="PENDING",
    "COMPLETED"="COMPLETED",
    "REVERSED"="REVERSED"
}

export interface ITransaction{
    type: TransactionTypes,
    from: Types.ObjectId,
    to: Types.ObjectId,
    initiatedBy: Types.ObjectId,
    amount: number,
    fee: number,
    commission: number,
    status: TransactionStatus
}