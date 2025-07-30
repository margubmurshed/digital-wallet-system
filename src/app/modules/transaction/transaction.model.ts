import { model, Schema } from "mongoose";
import { ITransaction, TransactionStatus, TransactionTypes } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    type: {
        type: String,
        enum: Object.values(TransactionTypes),
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    initiatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number, 
        default: 0
    },
    commission: {
        type: Number, 
        default: 0
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.COMPLETED
    }
}, {
    timestamps: true
})

export const Transaction = model<ITransaction>("Transaction", transactionSchema)