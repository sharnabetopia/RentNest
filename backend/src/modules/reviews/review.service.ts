import { prisma } from "../../lib/prisma";

const createReview = async (tenantId: string, payload: { propertyId: string, rating: number, comment?: string }) => {
  // Check if tenant has a completed rental for this property
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: "COMPLETED"
    }
  });

  if (!completedRental) {
    throw new Error("You can only review properties you have completely rented");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
      tenantId
    }
  });

  return review;
};

export const reviewService = {
  createReview
};
