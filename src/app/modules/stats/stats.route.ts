import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { statsController } from "./stats.controller";
const router = Router();

router.get(
    "/", 
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), 
    statsController.getStats
);

export const statsRouter = router;