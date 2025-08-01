import { ClientSession } from "mongoose";
import { UserStatus } from "../modules/user/user.interface";
import { WalletStatus } from "../modules/wallet/wallet.interface";
import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const syncWalletStatusWithUser = async(
    userId: string,
    isApproved: boolean,
    status: UserStatus,
    session: ClientSession
) => {
    const wallet = await Wallet.findOne({user: userId}).session(session);

    if(!wallet){
        throw new AppError("User wallet doesn't exist!", httpStatus.BAD_REQUEST);
    }
    wallet.status =
        isApproved && status === UserStatus.ACTIVE
            ? WalletStatus.ACTIVE
            : WalletStatus.BLOCKED

    await wallet.save({session})
}

export default syncWalletStatusWithUser;