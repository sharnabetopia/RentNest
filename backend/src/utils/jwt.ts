import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn?: SignOptions["expiresIn"]
) => {
  const signOptions: SignOptions = {};

  if (expiresIn !== undefined) {
    signOptions.expiresIn = expiresIn;
  }

  return jwt.sign(payload, secret, signOptions);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,

    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken
};
