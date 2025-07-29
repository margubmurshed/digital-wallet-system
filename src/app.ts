import express, { Response } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/", (_, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet System Backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;