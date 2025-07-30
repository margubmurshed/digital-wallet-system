import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { WalletController } from "./wallet.controller";
import checkWallet from "../../middlewares/checkWallet";

const router = Router();

router.post(
    "/add-money",
    checkAuth(UserRole.USER),
    checkWallet,
    WalletController.addMoney
)

// router.post("/withdraw")
// router.post("/send-money")
// router.post("/cash-in")
// router.post("/cash-out")

export const WalletRouter = router;
