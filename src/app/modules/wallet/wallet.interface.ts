import { Document, Types } from "mongoose";

export enum WalletStatus {
    "ACTIVE"="ACTIVE",
    "BLOCKED"="BLOCKED",
}

export interface IWallet{
    user: Types.ObjectId,
    balance: number,
    status: WalletStatus
}

export interface IWalletDocument extends IWallet, Document{}