import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { ZodError } from "zod";
import httpStatus from "http-status-codes";
import { envVariables } from "../config/env";
import { handleMongooseDuplicateError } from "../helpers/handleMongooseDuplicateError";
import { TErrorSource } from "../interfaces/error.types";
import { handleMongooseValidationError } from "../helpers/handleMongooseValidationError";
import { handleMongooseCastError } from "../helpers/handleMongooseCastError";
import { handleZodError } from "../helpers/handleZodError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let errorSources: TErrorSource[] = [];

    if (error.code === 11000) {
        const errorObject = handleMongooseDuplicateError(error);
        statusCode = errorObject.statusCode;
        message = errorObject.message;
    } else if (error.name === "ValidationError") {
        const errorObject = handleMongooseValidationError(error);
        statusCode = errorObject.statusCode;
        message = errorObject.message;
        errorSources = errorObject.errorSources as TErrorSource[];
    } else if (error.name === "CastError") {
        const errorObject = handleMongooseCastError(error);
        statusCode = errorObject.statusCode;
        message = errorObject.message;
    } else if (error instanceof ZodError) {
        const errorObject = handleZodError(error);
        statusCode = errorObject.statusCode;
        message = errorObject.message;
        errorSources = errorObject.errorSources as TErrorSource[];
    } else if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVariables.NODE_ENV === "development" ? error : null,
        stack: envVariables.NODE_ENV === "development" ? error?.stack : null
    })
}