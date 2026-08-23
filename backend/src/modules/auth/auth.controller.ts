import type  { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.getMe(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const authController = {
  registerUser,
  loginUser,
  getMe
};
