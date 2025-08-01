/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";
import { IWalletDocument, WalletStatus } from "./wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { TransactionTypes } from "../transaction/transaction.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { UserRole } from "../user/user.interface";
import checkUser from "../../utils/checkUser";
import { envVariables } from "../../config/env";
import { Wallet } from "./wallet.model";

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
        const updatedUserWallet = await wallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction.toObject(),
            balance: updatedUserWallet.balance
        }
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }
}

const withdrawMoney = async (wallet: IWalletDocument, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if(wallet.balance < amount) {
            throw new AppError("Insufficient Funds!", httpStatus.BAD_REQUEST);
        }

        const [transaction] = await Transaction.create([{
            type: TransactionTypes.WITHDRAW,
            from: null,
            to: wallet.user,
            initiatedBy: wallet.user,
            amount
        }], { session });

        wallet.balance = wallet.balance - amount;
        const updatedUserWallet = await wallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction.toObject(),
            balance: updatedUserWallet.balance
        }
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }
}

const sendMoney = async (senderPhoneNumber: string, senderWallet: IWalletDocument, amount: number, receiverPhoneNumber: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if(senderPhoneNumber === receiverPhoneNumber){
            throw new AppError("You can't send money to your own wallet", httpStatus.BAD_REQUEST);
        }

        const {wallet:receiverWallet} = await checkUser(receiverPhoneNumber, UserRole.USER);
        
        const fee = amount * (envVariables.TRANSACTION_FEE_PERCENTAGE/100);
        const totalAmountWithFee = amount + fee;

        if(senderWallet.balance < totalAmountWithFee) {
            throw new AppError("Insufficient Funds!", httpStatus.BAD_REQUEST);
        }

        const [transaction] = await Transaction.create([{
            type: TransactionTypes.SEND_MONEY,
            from: senderWallet.user,
            to: receiverWallet.user,
            initiatedBy: senderWallet.user,
            fee,
            amount
        }], { session });

        senderWallet.balance = senderWallet.balance - amount;
        receiverWallet.balance = receiverWallet.balance + amount;

        const updatedSenderUserWallet = await senderWallet.save({ session });
        await receiverWallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction.toObject(),
            balance: updatedSenderUserWallet.balance
        }
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }
}

const cashIn = async (agentPhoneNumber: string, agentWallet: IWalletDocument, amount: number, receiverPhoneNumber: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if(agentPhoneNumber === receiverPhoneNumber){
            throw new AppError("You can't cash into your own wallet", httpStatus.BAD_REQUEST);
        }

        const {wallet:receiverWallet} = await checkUser(receiverPhoneNumber, UserRole.USER);

        if(agentWallet.balance < amount) {
            throw new AppError("Insufficient Funds!", httpStatus.BAD_REQUEST);
        }

        const [transaction] = await Transaction.create([{
            type: TransactionTypes.CASH_IN,
            from: agentWallet.user,
            to: receiverWallet.user,
            initiatedBy: agentWallet.user,
            amount
        }], { session });

        agentWallet.balance = agentWallet.balance - amount;
        receiverWallet.balance = receiverWallet.balance + amount;

        const updatedAgentWallet = await agentWallet.save({ session });
        await receiverWallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction.toObject(),
            balance: updatedAgentWallet.balance
        }
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }
}

const cashOut = async (userPhoneNumber: string, userWallet: IWalletDocument, amount: number, agentPhoneNumber: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {  
        if(userPhoneNumber === agentPhoneNumber){
            throw new AppError("Agent number can not be same as user", httpStatus.BAD_REQUEST);
        }

        const {user:agent, wallet:agentWallet} = await checkUser(agentPhoneNumber, UserRole.AGENT);


        const fee = amount * (envVariables.TRANSACTION_FEE_PERCENTAGE/100);
        const commission = agent.commissionRate * fee;
        const totalAmountWithFee = amount + fee;

        if(userWallet.balance < totalAmountWithFee) {
            throw new AppError("Insufficient Funds!", httpStatus.BAD_REQUEST);
        }

        const [transaction] = await Transaction.create([{
            type: TransactionTypes.CASH_OUT,
            from: userWallet.user,
            to: agentWallet.user,
            initiatedBy: userWallet.user,
            fee,
            commission,
            amount
        }], { session });

        userWallet.balance = userWallet.balance - totalAmountWithFee;
        agentWallet.balance = agentWallet.balance + amount + commission;

        const updatedUserWallet = await userWallet.save({ session });
        await agentWallet.save({ session });

        await session.commitTransaction();
        return {
            ...transaction.toObject(),
            balance: updatedUserWallet.balance
        }
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }
}

const getMe = async(userId:string) => {
    const userWallet = await Wallet.findOne({user: userId}).populate("user", "name phone");

    if(!userWallet){
        throw new AppError("User wallet doesn't exist", httpStatus.BAD_REQUEST);
    }

    return {data:userWallet}
}

const getSingleWallet = async(userId: string) => {
    const userWallet = await Wallet.findOne({user: userId});

    if(!userWallet){
        throw new AppError("User wallet doesn't exist", httpStatus.BAD_REQUEST);
    }

    return {data:userWallet}
}

const blockWallet = async(userId: string) => {
    const wallet = await Wallet.findOne({user:userId});
    
    if(wallet?.status === WalletStatus.BLOCKED) throw new AppError("User wallet is already blocked!", httpStatus.BAD_REQUEST);

    wallet!.status = WalletStatus.BLOCKED;
    await wallet!.save();
    
    return null;
}

const unblockWallet = async(userId: string) => {
    const wallet = await Wallet.findOne({user:userId});
    
    if(wallet?.status === WalletStatus.ACTIVE) throw new AppError("User wallet is already active!", httpStatus.BAD_REQUEST);

    wallet!.status = WalletStatus.ACTIVE;
    await wallet!.save();
    
    return null;
}

const myCommission = async(userId: string) => {
    const myCashOutTransactions = await Transaction.find({
        type: TransactionTypes.CASH_OUT,
        to: userId
    }).lean()

    const totalCommissionEarned = myCashOutTransactions.reduce((prev, current) => prev + current.commission,0);

    return{
        totalCommissionEarned,
        totalCashOuts: myCashOutTransactions.length,
        commissionTransactions: myCashOutTransactions
    }
}

export const WalletService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getMe,
    getSingleWallet,
    blockWallet,
    unblockWallet,
    myCommission
}