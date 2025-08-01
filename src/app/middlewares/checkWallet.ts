import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import checkUser from "../utils/checkUser";

const checkWallet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenPayload = req.user as JwtPayload;
        const phone = tokenPayload.phone;
        const {wallet} = await checkUser(phone);

        req.wallet = wallet;
        next();
    } catch (error) {
        next(error);
    }
}

export default checkWallet;