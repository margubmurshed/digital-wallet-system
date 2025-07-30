import { envVariables } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
    const payload = {
        userId: user._id,
        role: user.role,
        phone:user.phone
    }

    const accessToken = generateToken(payload, envVariables.JWT_ACCESS_SECRET, envVariables.JWT_ACCESS_EXPIRES);
    const refreshToken = generateToken(payload, envVariables.JWT_REFRESH_SECRET, envVariables.JWT_REFRESH_EXPIRES);

    return {accessToken, refreshToken}
}