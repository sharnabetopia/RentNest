import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    }
  });
  return users;
};

const updateUserStatus = async (id: string, payload: { status: "ACTIVE" | "BANNED" }) => {
  const user = await prisma.user.update({
    where: { id },
    data: { status: payload.status },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    }
  });
  return user;
};

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: { name: true, email: true }
      }
    }
  });
  return properties;
};

const getAllRentals = async () => {
  const rentals = await prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: { select: { name: true, email: true } },
      payment: true
    }
  });
  return rentals;
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals
};
