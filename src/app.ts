import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(cors())

export default app;