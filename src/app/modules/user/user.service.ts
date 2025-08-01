/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import hasDisallowedProperties from "../../utils/hasDisallowedProperties";
import syncWalletStatusWithUser from "../../utils/syncWalletStatusWithUser";
import { WalletStatus } from "../wallet/wallet.interface";

const createUser = async (payload: IUser) => {
    const userExists = await User.findOne({ phone: payload.phone });

    if (userExists) {
        throw new AppError("User already exists with this phone number", httpStatus.BAD_REQUEST);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.create([payload], { session });
        await Wallet.create([{
            user: user[0]._id,
        }], { session })

        await session.commitTransaction();
        return user;
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        await session.endSession();
    }

}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate();

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

const getUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find({role: UserRole.USER}), query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate();

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

const getAgents = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find({role: UserRole.AGENT}), query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate();

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

const updateUser = async (userId: string, payload: Partial<IUser>, tokenPayload: JwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if ((tokenPayload.role === UserRole.USER || tokenPayload.role === UserRole.AGENT) && !(userId === tokenPayload.userId)) {
            throw new AppError("You are not allowed to update other than yourself!", httpStatus.FORBIDDEN);
        }


        const userToBeUpdated = await User.findById(userId).session(session);
        if (!userToBeUpdated) {
            throw new AppError("User not found", httpStatus.NOT_FOUND);
        }

        // user and agent can only update allowed properties
        const allowedUserAndAgentProperties = ["name", "password"];
        if (tokenPayload.role === UserRole.USER || tokenPayload.role === UserRole.AGENT) {
            if (hasDisallowedProperties(payload, allowedUserAndAgentProperties)) {
                throw new AppError("You are not allowed to update specific properties!", httpStatus.FORBIDDEN);
            }
        }

        // Admin can't update super admin
        if (userToBeUpdated.role === UserRole.SUPER_ADMIN && tokenPayload.role === UserRole.ADMIN) {
            throw new AppError("You are not allowed to update Super Admin!", httpStatus.FORBIDDEN);
        }

        // Admin can't update super admin
        if (payload.role === UserRole.SUPER_ADMIN && tokenPayload.role === UserRole.ADMIN) {
            throw new AppError("You are not allowed to update anyone to Super Admin!", httpStatus.FORBIDDEN);
        }

        const isRoleChanging = payload.role === UserRole.ADMIN || payload.role === UserRole.SUPER_ADMIN;
        const isStatusChanging = payload.isApproved !== undefined || payload.status !== undefined;

        if (isRoleChanging) {
            const userWallet = await Wallet.findOne({ user: userId }).session(session);
            if (!userWallet) throw new AppError("User wallet doesn't exist", httpStatus.BAD_REQUEST);
            userWallet.status = WalletStatus.BLOCKED;
            await userWallet.save({ session });

        } else if (isStatusChanging) {
            const status = payload.status ?? userToBeUpdated.status;
            const isApproved = payload.isApproved ?? userToBeUpdated.isApproved;
            await syncWalletStatusWithUser(userId, isApproved, status, session);
        }

        userToBeUpdated.set(payload);
        const updatedUser = await userToBeUpdated.save({ session });

        await session.commitTransaction();
        return updatedUser;
    } catch (error) {
        await session.abortTransaction();
        throw error
    } finally {
        await session.endSession();
    }
}

const getMe = async (userId: string) => {
    const user = await User.findById(userId);
    return { data: user };
}

const getSingleUser = async (userId: string) => {
    const user = await User.findById(userId);
    return { data: user };
}

const approveUser = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (user?.isApproved) throw new AppError("User is already approved!", httpStatus.BAD_REQUEST);
        user!.isApproved = true;
        await user!.save({ session });
        await Wallet.findOneAndUpdate({ user: userId }, { status: WalletStatus.ACTIVE }).session(session);
        await session.commitTransaction();
        return null;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession()
    }
}

const disapproveUser = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (!user?.isApproved) throw new AppError("User is already not approved!", httpStatus.BAD_REQUEST);
        user!.isApproved = false;
        await user!.save({session});
        await Wallet.findOneAndUpdate({ user: userId }, { status: WalletStatus.BLOCKED }).session(session);
        await session.commitTransaction();
        return null;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession()
    }
}

export const UserService = {
    createUser,
    getAllUsers,
    getUsers,
    getAgents,
    updateUser,
    getMe,
    getSingleUser,
    approveUser,
    disapproveUser
}