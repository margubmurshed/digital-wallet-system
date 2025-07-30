export enum UserRole {
    "USER"="USER",
    "AGENT"="AGENT",
    "ADMIN"="ADMIN",
    "SUPER_ADMIN"="SUPER_ADMIN"
}

export enum UserStatus {
    "ACTIVE"="ACTIVE",
    "BLOCKED"="BLOCKED"
}

export interface IUser {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    password: string;
    role: UserRole,
    status: UserStatus,
    commissionRate: number;
    isApproved: boolean
}

export interface IUserDocument extends IUser, Document {
  isPasswordMatched(password: string): Promise<boolean>;
}