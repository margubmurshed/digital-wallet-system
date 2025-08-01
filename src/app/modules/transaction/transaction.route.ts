import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";

const router = Router();

router.get(
    "/",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    TransactionController.getAllTransactions
)

router.get(
    "/me",
    checkAuth(UserRole.USER, UserRole.AGENT),
    TransactionController.getMyTransactions
)


export const TransactionRouter = router;