import { prisma } from "../../lib/prisma";

const createRentalRequest = async (tenantId: string, payload: any) => {
  const property = await prisma.property.findUnique({ where: { id: payload.propertyId } });
  if (!property || property.status !== "AVAILABLE") {
    throw new Error("Property is not available for rent");
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId
    }
  });
  return rentalRequest;
};

const getTenantRentalRequests = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: true,
      payment: true
    }
  });
  return requests;
};

const getRentalRequestDetails = async (id: string, userId: string, role: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
      payment: true,
      tenant: { select: { name: true, email: true, phone: true } }
    }
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (role === "TENANT" && request.tenantId !== userId) {
    throw new Error("Unauthorized access to this rental request");
  }

  if (role === "LANDLORD" && request.property.landlordId !== userId) {
    throw new Error("Unauthorized access to this rental request");
  }

  return request;
};

const getLandlordRentalRequests = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId
      }
    },
    include: {
      property: true,
      tenant: { select: { name: true, email: true, phone: true } },
      payment: true
    }
  });
  return requests;
};

const updateRentalRequestStatus = async (id: string, landlordId: string, payload: { status: "APPROVED" | "REJECTED" }) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: { property: true }
  });

  if (!request || request.property.landlordId !== landlordId) {
    throw new Error("Rental request not found or unauthorized");
  }

  if (request.status !== "PENDING") {
    throw new Error(`Cannot update request because it is already ${request.status}`);
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id },
    data: { status: payload.status }
  });

  return updatedRequest;
};

export const rentalService = {
  createRentalRequest,
  getTenantRentalRequests,
  getRentalRequestDetails,
  getLandlordRentalRequests,
  updateRentalRequestStatus
};
