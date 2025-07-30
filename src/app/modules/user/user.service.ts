import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import hasDisallowedProperties from "../../utils/hasDisallowedProperties";

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

        session.commitTransaction();
        return user;
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
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

const updateUser = async (userId: string, payload: Partial<IUser>, tokenPayload: JwtPayload) => {
    if ((tokenPayload.role === UserRole.USER || tokenPayload.role === UserRole.AGENT) && !(userId === tokenPayload.userId)) {
        throw new AppError("You are not allowed to update other than yourself!", httpStatus.FORBIDDEN);
    }


    const userToBeUpdated = await User.findById(userId);
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

    userToBeUpdated.set(payload);
    const updatedUser = await userToBeUpdated.save();
    return updatedUser;
}

const getMe = async(userId: string) => {
    const user = await User.findById(userId);
    return {data: user};
}

export const UserService = {
    createUser,
    getAllUsers,
    updateUser,
    getMe
}