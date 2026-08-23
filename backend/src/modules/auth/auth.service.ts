import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const registerUser = async (payload: any) => {
  const hashedPassword = await hashPassword(payload.password);
  
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    }
  });

  return user;
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    throw new Error("User not found!");
  }

  if (user.status === "BANNED") {
    throw new Error("This user is banned.");
  }

  const isPasswordMatched = await comparePassword(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      status: true,
    }
  });
  return user;
};

export const authService = {
  registerUser,
  loginUser,
  getMe
};
