import express, { Response } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import "./app/config/passport";
import { envVariables } from "./app/config/env";

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());

app.set("trust proxy", 1);
app.use(cors({
    origin: envVariables.FRONTEND_URL,
    credentials: true
}));

app.use("/api/v1", router)

app.get("/", (_, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet System Backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;