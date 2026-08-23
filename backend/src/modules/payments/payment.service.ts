import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { PaymentProvider, PaymentStatus, RentalStatus } from "../../../prisma/generated/prisma/enums";


const createPayment = async (
  tenantId: string,
  payload: { rentalRequestId: string }
) => {
  const rental = await prisma.rentalRequest.findFirst({
    where: {
      id: payload.rentalRequestId,
      tenantId,
      status: RentalStatus.APPROVED,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new Error(
      "Approved rental request not found."
    );
  }

  if (rental.payment?.status === PaymentStatus.COMPLETED) {
    throw new Error("Payment already completed.");
  }

  let payment = rental.payment;

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        rentalRequestId: rental.id,
        amount: rental.property.rent,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          unit_amount: Math.round(Number(rental.property.rent) * 100),

          product_data: {
            name: rental.property.title,
            description: rental.property.address,
          },
        },
      },
    ],

    metadata: {
      paymentId: payment.id,
      rentalRequestId: rental.id,
      tenantId,
    },

    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}/payment/cancel`,
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const confirmPayment = async () => {
  throw new Error(
    "Manual confirmation is disabled. Stripe webhook confirms payments automatically."
  );
};

const getUserPaymentHistory = async (tenantId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId,
      },
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentDetails = async (
  id: string,
  tenantId: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id,

      rentalRequest: {
        tenantId,
      },
    },

    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getUserPaymentHistory,
  getPaymentDetails,
};