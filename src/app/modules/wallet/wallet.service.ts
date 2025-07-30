import mongoose from "mongoose";
import { IWalletDocument } from "./wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { TransactionTypes } from "../transaction/transaction.interface";

const addMoney = async (wallet: IWalletDocument, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [transaction] = await Transaction.create([{
            type: TransactionTypes.ADD_MONEY,
            from: null,
            to: wallet.user,
            initiatedBy: wallet.user,
            amount
        }], { session });

        wallet.balance = wallet.balance + amount;
        const updatedWallet = await wallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction,
            balance: updatedWallet.balance
        }
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

export const WalletService = {
    addMoney
}