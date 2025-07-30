import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";

const router = Router();

router.post(
    "/register", 
    validateRequest(createUserZodSchema),
    UserControllers.createUser
)

router.get(
    "/",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getAllUsers,
)

router.get(
    "/me",
    checkAuth(...Object.values(UserRole)),
    UserControllers.getMe,
)

router.patch(
    "/:id",
    checkAuth(...Object.values(UserRole)),
    validateRequest(updateUserZodSchema),
    UserControllers.updateUser
)

// router.delete(
//     "/:id",
//     UserControllers.deleteUser
// )

export const UserRouter = router;