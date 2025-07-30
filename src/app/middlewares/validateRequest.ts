import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const validateRequest = (zodSchema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(!req.body){
                throw new AppError("Request body is empty!", httpStatus.BAD_REQUEST);
            }
            req.body = await zodSchema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error)
        }
    }
}

export default validateRequest;