import type  { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import httpStatus from "http-status";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(httpStatus.UNAUTHORIZED).json({
    success: false,
    statusCode: httpStatus.UNAUTHORIZED,
    message: "You are not authorized!",
  });
}

const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

const verified = jwtUtils.verifyToken(token as string, config.jwt_access_secret);

      if (!verified.success || !verified.data) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: "You are not authorized!",
        });
      }

      const role = (verified.data as any).role;
      
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          statusCode: httpStatus.FORBIDDEN,
          message: "You have no access to this route",
        });
      }

      req.user = verified.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
