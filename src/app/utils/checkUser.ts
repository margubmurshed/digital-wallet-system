import { Wallet } from "../modules/wallet/wallet.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { WalletStatus } from "../modules/wallet/wallet.interface";
import { User } from "../modules/user/user.model";
import { UserRole } from "../modules/user/user.interface";

const checkUser = async (phone: string, role?: UserRole) => {
    const user = await User.findOne({ phone });
    if (!user) throw new AppError("User/Agent not found", httpStatus.BAD_REQUEST);
    if (role) {
        if (user.role !== role) throw new AppError(`Receiver user has to be ${role}`, httpStatus.BAD_REQUEST);
    }

    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) throw new AppError("Wallet not found", httpStatus.BAD_REQUEST);

    if (wallet.status === WalletStatus.BLOCKED) {
        throw new AppError("Your wallet has been blocked. You can't accomplish any transaction.", httpStatus.FORBIDDEN);
    }

    return { user, wallet }
}

export default checkUser;