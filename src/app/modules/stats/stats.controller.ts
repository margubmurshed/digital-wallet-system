import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statsService } from "./stats.service";


const getStats = catchAsync(async (req: Request, res: Response) => {
    const data = await statsService.getStats();

    sendResponse(res, {
        message: "Stats retrieved Successfully",
        success: true,
        statusCode: 200,
        data
    })
})

export const statsController = {
    getStats
}