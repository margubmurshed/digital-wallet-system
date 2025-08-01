import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { WalletRouter } from "../modules/wallet/wallet.route";
import { TransactionRouter } from "../modules/transaction/transaction.route";

export const router = Router();

interface IModuleRoute {
    path: string;
    router: Router;
}

const moduleRoutes: IModuleRoute[] = [
    {path: "/user", router: UserRouter},
    {path: "/auth", router: AuthRouter},
    {path: "/wallet", router: WalletRouter},
    {path: "/transaction", router: TransactionRouter},
];

moduleRoutes.forEach(route => {
    router.use(route.path, route.router)
})