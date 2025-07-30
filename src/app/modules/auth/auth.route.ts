import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { credentialLoginZodSchema } from "./auth.validation";

const router = Router();

router.post(
    "/login",
    validateRequest(credentialLoginZodSchema),
    AuthController.credentialLogin
)

export const AuthRouter = router;