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
    name: string;
    phone: string;
    email?: string;
    password: string;
    role: UserRole,
    status: UserStatus,
    commissionRate: number;
    isApproved: boolean
}