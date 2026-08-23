import type  { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await rentalService.createRentalRequest(req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getTenantRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await rentalService.getTenantRentalRequests(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getRentalRequestDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await rentalService.getRentalRequestDetails(id as string, req.user.id, req.user.role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request details retrieved successfully",
    data: result,
  });
});

const getLandlordRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await rentalService.getLandlordRentalRequests(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Landlord rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await rentalService.updateRentalRequestStatus(id as string, req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request status updated successfully",
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getTenantRentalRequests,
  getRentalRequestDetails,
  getLandlordRentalRequests,
  updateRentalRequestStatus
};
