/* eslint-disable no-console */
import { envVariables } from "../config/env";
import { User } from "../modules/user/user.model";
import { UserRole } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Wallet } from "../modules/wallet/wallet.model";

const seedSuperAdmin = async () => {
    const superAdminPhone = envVariables.SUPER_ADMIN_PHONE;
    const superAdminPassword = envVariables.SUPER_ADMIN_PASS;

    try {
        // Checking if superAdmin already exists or not
        const superAdmin = await User.findOne({ phone: superAdminPhone });

        if (superAdmin) {
            const superAdminWallet = await Wallet.findOne({ user: superAdmin._id });

            if (superAdminWallet) {
                await Wallet.findByIdAndDelete(superAdmin._id);
                throw new AppError(`Super Admin can't have a wallet! The wallet has been deleted.`, httpStatus.BAD_REQUEST);
            }
            // Stops here if any user with super admin email is already created
            if (superAdmin?.role !== UserRole.SUPER_ADMIN) {
                throw new AppError(`Already an ${superAdmin?.role} is created with super admin email`, httpStatus.BAD_REQUEST);
            }

            // Stops here if super admin is already exists
            if (superAdmin?.role === UserRole.SUPER_ADMIN) {
                console.log("Super Admin already exists!");
                return;
            }
        }

        const data = await User.create({
            name: "Super Admin",
            phone: superAdminPhone,
            password: superAdminPassword,
            role: UserRole.SUPER_ADMIN,
            isApproved: true
        });

        console.log("Super Admin created successfully!");
        console.log(data);

    } catch (error) {
        console.log(error)
    }
}

export default seedSuperAdmin;