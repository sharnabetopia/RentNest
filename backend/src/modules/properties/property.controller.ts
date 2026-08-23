import type  { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getLandlordProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await propertyService.getLandlordProperties(req.user.id);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Landlord properties retrieved successfully", data: result });
});

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await propertyService.createProperty(req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await propertyService.updateProperty(id as string, req.user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await propertyService.deleteProperty(id as string, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await propertyService.getAllProperties(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await propertyService.getPropertyById(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});

export const propertyController = {
  getLandlordProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById
};
