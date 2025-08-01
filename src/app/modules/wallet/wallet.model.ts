import { model, Schema } from "mongoose";
import { IWalletDocument, WalletStatus } from "./wallet.interface";

const walletSchema = new Schema<IWalletDocument>({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    balance: {type:Number, default: 50},
    status: {type:String, enum: Object.values(WalletStatus), default: WalletStatus.BLOCKED}
}, {
    timestamps: true
})

export const Wallet = model<IWalletDocument>("Wallet", walletSchema);