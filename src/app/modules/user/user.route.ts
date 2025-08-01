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
    "/users",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getUsers,
)

router.get(
    "/agents",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getAgents,
)

router.get(
    "/me",
    checkAuth(...Object.values(UserRole)),
    UserControllers.getMe,
)

router.get(
    "/:id",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getSingleUser,
)

router.patch(
    "/:id/approve",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.approveUser,
)

router.patch(
    "/:id/disapprove",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.disapproveUser,
)

router.patch(
    "/:id",
    checkAuth(...Object.values(UserRole)),
    validateRequest(updateUserZodSchema),
    UserControllers.updateUser
)

export const UserRouter = router;