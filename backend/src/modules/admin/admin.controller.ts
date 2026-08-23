import type  { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.updateUserStatus(id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllProperties();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All properties retrieved successfully",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rental requests retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals
};
