import { model, Schema } from "mongoose";
import { IUserDocument, UserRole, UserStatus } from "./user.interface";
import bcryptjs from "bcryptjs";
import { envVariables } from "../../config/env";

const userSchema = new Schema<IUserDocument>({
    name: {type:String, required: true},
    phone: {type: String, required:true, unique: true},
    email: {type: String, sparse: true, required: true},
    password: {type: String, required: true},
    role: {type:String, enum: Object.values(UserRole), required: true},
    status: {type:String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE},

    // Agent only properties
    commissionRate: {type:Number, default: envVariables.DEFAULT_AGENT_COMMISSION_RATE},
    isApproved: {type: Boolean, default: true},
}, {
    timestamps: true,
    toJSON: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transform: (_, doc: Record<string, any>) => {
            delete doc.password;
            delete doc.__v;
            return doc;
        }
    }
})

// Hash password before save
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, envVariables.BCRYPT_SALT_ROUND);
    next();
})

// Password comparison method
userSchema.methods.isPasswordMatched = async function (password: string) {
    return await bcryptjs.compare(password, this.password)
}

export const User = model<IUserDocument>('User',userSchema);