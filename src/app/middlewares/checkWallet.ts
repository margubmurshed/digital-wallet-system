import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { WalletStatus } from "../modules/wallet/wallet.interface";

const checkWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenPayload = req.user as JwtPayload;
        const userId = tokenPayload.userId;
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) throw new AppError("Wallet not found", httpStatus.BAD_REQUEST);

        if (wallet.status === WalletStatus.BLOCKED) throw new AppError("Your wallet has been blocked. You can't accomplish any transaction.", httpStatus.FORBIDDEN);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).wallet = wallet;
        next();
    } catch (error) {
        next(error);
    }
}

export default checkWallet;