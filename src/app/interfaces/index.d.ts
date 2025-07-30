import { JwtPayload } from "jsonwebtoken";
import { IWalletDocument } from "../modules/wallet/wallet.interface";

declare global {
    namespace Express{
        interface Request{
            user: JwtPayload,
            wallet: IWalletDocument 
        }
    }
}