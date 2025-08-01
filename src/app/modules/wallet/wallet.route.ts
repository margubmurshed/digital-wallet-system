import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { WalletController } from "./wallet.controller";
import checkWallet from "../../middlewares/checkWallet";
import validateRequest from "../../middlewares/validateRequest";
import { addMoneyZodSchema, cashOutZodSchema, sendMoneyZodSchema } from "./wallet.validation";

const router = Router();

router.post(
    "/add-money",
    checkAuth(UserRole.USER),
    checkWallet,
    validateRequest(addMoneyZodSchema),
    WalletController.addMoney
)

router.post(
    "/withdraw",
    checkAuth(UserRole.USER),
    checkWallet,
    validateRequest(addMoneyZodSchema),
    WalletController.withdrawMoney
)

router.post(
    "/send-money",
    checkAuth(UserRole.USER),
    checkWallet,
    validateRequest(sendMoneyZodSchema),
    WalletController.sendMoney
)

router.post(
    "/cash-in",
    checkAuth(UserRole.AGENT),
    checkWallet,
    validateRequest(sendMoneyZodSchema),
    WalletController.cashIn
)

router.post(
    "/cash-out",
    checkAuth(UserRole.USER),
    checkWallet,
    validateRequest(cashOutZodSchema),
    WalletController.cashOut
)

router.get(
    "/me",
    checkAuth(UserRole.USER, UserRole.AGENT),
    WalletController.getMe
)

router.get(
    "/me/commission",
    checkAuth(UserRole.AGENT),
    WalletController.myCommission
)

router.get(
    "/:id",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    WalletController.getSingleWallet
)

router.patch(
    "/:id/block",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    WalletController.blockWallet
)
router.patch(
    "/:id/unblock",
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    WalletController.unblockWallet
)

export const WalletRouter = router;
